/**
 * Upload Service
 *
 * Handles file uploads with image optimization and database tracking.
 */

import {
  Injectable,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { S3Service } from './services/s3.service';
import { ImageProcessorService } from './services/image-processor.service';
import { UploadResponseDto } from './dto/upload-response.dto';

// Allowed MIME types
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
];

// Max file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  constructor(
    private prisma: PrismaService,
    private s3Service: S3Service,
    private imageProcessor: ImageProcessorService,
  ) {}

  /**
   * Upload a single image
   */
  async uploadImage(
    file: Express.Multer.File,
    uploadedBy?: string,
  ): Promise<UploadResponseDto> {
    try {
      // Validate file
      this.validateImage(file);

      // Check if S3 is configured
      if (!this.s3Service.isConfigured()) {
        throw new InternalServerErrorException(
          'S3 is not properly configured. Please set AWS credentials.',
        );
      }

      // Process image (optimize)
      const optimized = await this.imageProcessor.optimize(file.buffer);

      // Generate thumbnail
      const thumbnail = await this.imageProcessor.generateThumbnail(file.buffer);

      // Upload optimized image to S3
      const uploadResult = await this.s3Service.upload(
        optimized.buffer,
        file.originalname,
        'image/webp',
        'products',
      );

      // Upload thumbnail to S3
      const thumbnailResult = await this.s3Service.upload(
        thumbnail.buffer,
        `thumb-${file.originalname}`,
        'image/webp',
        'products/thumbnails',
      );

      // Save upload metadata to database
      const upload = await this.prisma.imageUpload.create({
        data: {
          filename: uploadResult.key,
          originalName: file.originalname,
          mimeType: 'image/webp',
          sizeBytes: optimized.metadata.size,
          s3Key: uploadResult.key,
          s3Bucket: uploadResult.bucket,
          url: uploadResult.url,
          thumbnailUrl: thumbnailResult.url,
          width: optimized.metadata.width,
          height: optimized.metadata.height,
          uploadedBy: uploadedBy || null,
        },
      });

      this.logger.log(`Image uploaded: ${upload.id} - ${file.originalname}`);

      return {
        id: upload.id,
        url: upload.url,
        thumbnailUrl: upload.thumbnailUrl || undefined,
        s3Key: upload.s3Key,
        originalName: upload.originalName,
        sizeBytes: upload.sizeBytes,
        mimeType: upload.mimeType,
        width: upload.width || undefined,
        height: upload.height || undefined,
      };
    } catch (error) {
      this.logger.error(`Upload failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Upload multiple images
   */
  async uploadMultipleImages(
    files: Express.Multer.File[],
    uploadedBy?: string,
  ): Promise<UploadResponseDto[]> {
    try {
      const uploads = await Promise.all(
        files.map((file) => this.uploadImage(file, uploadedBy)),
      );

      this.logger.log(`Uploaded ${uploads.length} images`);
      return uploads;
    } catch (error) {
      this.logger.error(`Multiple upload failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Delete uploaded image
   */
  async deleteImage(id: string): Promise<void> {
    try {
      const upload = await this.prisma.imageUpload.findUnique({
        where: { id },
      });

      if (!upload) {
        throw new BadRequestException(`Image upload with ID '${id}' not found`);
      }

      // Delete from S3
      await this.s3Service.delete(upload.s3Key);

      // Delete thumbnail if exists
      if (upload.thumbnailUrl) {
        const thumbKey = upload.thumbnailUrl.split('/').pop();
        if (thumbKey) {
          await this.s3Service.delete(`products/thumbnails/${thumbKey}`);
        }
      }

      // Delete from database
      await this.prisma.imageUpload.delete({
        where: { id },
      });

      this.logger.log(`Image deleted: ${id}`);
    } catch (error) {
      this.logger.error(`Delete failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Validate image file
   */
  private validateImage(file: Express.Multer.File): void {
    // Check if file exists
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Check MIME type
    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
      );
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException(
        `File too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
      );
    }
  }
}
