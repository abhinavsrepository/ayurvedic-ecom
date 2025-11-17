/**
 * Image Processor Service
 *
 * Handles image optimization and thumbnail generation using Sharp.
 */

import { Injectable, Logger } from '@nestjs/common';
import * as sharp from 'sharp';

export interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  size: number;
}

export interface ProcessedImage {
  buffer: Buffer;
  metadata: ImageMetadata;
}

@Injectable()
export class ImageProcessorService {
  private readonly logger = new Logger(ImageProcessorService.name);

  // Max dimensions for product images
  private readonly MAX_WIDTH = 2000;
  private readonly MAX_HEIGHT = 2000;

  // Thumbnail dimensions
  private readonly THUMB_WIDTH = 400;
  private readonly THUMB_HEIGHT = 400;

  /**
   * Optimize image - resize if necessary and convert to WebP
   */
  async optimize(imageBuffer: Buffer): Promise<ProcessedImage> {
    try {
      const processed = await sharp(imageBuffer)
        .resize(this.MAX_WIDTH, this.MAX_HEIGHT, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: 85 })
        .toBuffer({ resolveWithObject: true });

      return {
        buffer: processed.data,
        metadata: {
          width: processed.info.width,
          height: processed.info.height,
          format: processed.info.format,
          size: processed.info.size,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to optimize image: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Generate thumbnail
   */
  async generateThumbnail(imageBuffer: Buffer): Promise<ProcessedImage> {
    try {
      const processed = await sharp(imageBuffer)
        .resize(this.THUMB_WIDTH, this.THUMB_HEIGHT, {
          fit: 'cover',
          position: 'center',
        })
        .webp({ quality: 80 })
        .toBuffer({ resolveWithObject: true });

      return {
        buffer: processed.data,
        metadata: {
          width: processed.info.width,
          height: processed.info.height,
          format: processed.info.format,
          size: processed.info.size,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to generate thumbnail: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get image metadata without processing
   */
  async getMetadata(imageBuffer: Buffer): Promise<ImageMetadata> {
    try {
      const metadata = await sharp(imageBuffer).metadata();

      return {
        width: metadata.width || 0,
        height: metadata.height || 0,
        format: metadata.format || 'unknown',
        size: imageBuffer.length,
      };
    } catch (error) {
      this.logger.error(`Failed to get image metadata: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Check if file is a valid image
   */
  async isValidImage(buffer: Buffer): Promise<boolean> {
    try {
      await sharp(buffer).metadata();
      return true;
    } catch {
      return false;
    }
  }
}
