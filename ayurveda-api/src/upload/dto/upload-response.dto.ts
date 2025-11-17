/**
 * Upload Response DTO
 *
 * Response structure for successful uploads.
 */

import { ApiProperty } from '@nestjs/swagger';

export class UploadResponseDto {
  @ApiProperty({ description: 'Upload ID' })
  id: string;

  @ApiProperty({ description: 'File URL' })
  url: string;

  @ApiProperty({ description: 'Thumbnail URL (if generated)' })
  thumbnailUrl?: string;

  @ApiProperty({ description: 'S3 key' })
  s3Key: string;

  @ApiProperty({ description: 'Original filename' })
  originalName: string;

  @ApiProperty({ description: 'File size in bytes' })
  sizeBytes: number;

  @ApiProperty({ description: 'MIME type' })
  mimeType: string;

  @ApiProperty({ description: 'Image width (if image)' })
  width?: number;

  @ApiProperty({ description: 'Image height (if image)' })
  height?: number;
}
