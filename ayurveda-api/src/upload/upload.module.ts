/**
 * Upload Module
 *
 * Module for file upload functionality with S3 integration.
 */

import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { S3Service } from './services/s3.service';
import { ImageProcessorService } from './services/image-processor.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UploadController],
  providers: [UploadService, S3Service, ImageProcessorService],
  exports: [UploadService, S3Service, ImageProcessorService],
})
export class UploadModule {}
