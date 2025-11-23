/**
 * S3 Service
 *
 * Handles file uploads to AWS S3 with signed URLs.
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as crypto from 'crypto';
import * as path from 'path';

export interface S3UploadResult {
  key: string;
  url: string;
  bucket: string;
}

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly region: string;
  private readonly cdnUrl?: string;

  constructor(private configService: ConfigService) {
    this.region = this.configService.get('AWS_REGION') || 'us-east-1';
    this.bucket = this.configService.get('AWS_S3_BUCKET') || 'ayurveda-uploads';
    this.cdnUrl = this.configService.get('AWS_CLOUDFRONT_URL');

    // Initialize S3 Client
    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID') || '',
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY') || '',
      },
    });
  }

  /**
   * Generate a unique filename with hash
   */
  private generateFileName(originalName: string, prefix?: string): string {
    const ext = path.extname(originalName);
    const hash = crypto.randomBytes(16).toString('hex');
    const timestamp = Date.now();
    const baseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9]/g, '-');

    if (prefix) {
      return `${prefix}/${timestamp}-${hash}-${baseName}${ext}`;
    }

    return `${timestamp}-${hash}-${baseName}${ext}`;
  }

  /**
   * Upload file to S3
   */
  async upload(
    file: Buffer,
    originalName: string,
    mimeType: string,
    prefix?: string,
  ): Promise<S3UploadResult> {
    try {
      const key = this.generateFileName(originalName, prefix);

      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file,
        ContentType: mimeType,
        ACL: 'public-read',
        CacheControl: 'max-age=31536000', // 1 year
      });

      await this.s3Client.send(command);

      // Generate URL (use CDN if available, otherwise S3 URL)
      const url = this.cdnUrl
        ? `${this.cdnUrl}/${key}`
        : `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;

      this.logger.log(`File uploaded to S3: ${key}`);

      return {
        key,
        url,
        bucket: this.bucket,
      };
    } catch (error) {
      this.logger.error(`Failed to upload to S3: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Delete file from S3
   */
  async delete(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.s3Client.send(command);
      this.logger.log(`File deleted from S3: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to delete from S3: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Generate signed URL for secure access
   */
  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      const url = await getSignedUrl(this.s3Client, command, { expiresIn });
      return url;
    } catch (error) {
      this.logger.error(`Failed to generate signed URL: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Check if S3 is properly configured
   */
  isConfigured(): boolean {
    return !!(
      this.configService.get('AWS_ACCESS_KEY_ID') &&
      this.configService.get('AWS_SECRET_ACCESS_KEY') &&
      this.configService.get('AWS_S3_BUCKET')
    );
  }
}
