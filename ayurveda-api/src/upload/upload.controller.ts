/**
 * Upload Controller
 *
 * REST API endpoints for file uploads.
 */

import {
  Controller,
  Post,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { Request } from 'express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UploadResponseDto } from './dto/upload-response.dto';

@ApiTags('Upload')
@Controller('upload')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @Roles('admin', 'manager')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a single image (Admin only)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Image uploaded successfully', type: UploadResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() request: Request,
  ): Promise<UploadResponseDto> {
    const userId = (request.user as any)?.userId;
    return this.uploadService.uploadImage(file, userId);
  }

  @Post('images')
  @Roles('admin', 'manager')
  @UseInterceptors(FilesInterceptor('files', 10)) // Max 10 files at once
  @ApiOperation({ summary: 'Upload multiple images (Admin only)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Images uploaded successfully', type: [UploadResponseDto] })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async uploadMultipleImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Req() request: Request,
  ): Promise<UploadResponseDto[]> {
    const userId = (request.user as any)?.userId;
    return this.uploadService.uploadMultipleImages(files, userId);
  }

  @Delete('image/:id')
  @Roles('admin', 'manager')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete uploaded image (Admin only)' })
  @ApiResponse({ status: 204, description: 'Image deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  async deleteImage(@Param('id') id: string): Promise<void> {
    return this.uploadService.deleteImage(id);
  }
}
