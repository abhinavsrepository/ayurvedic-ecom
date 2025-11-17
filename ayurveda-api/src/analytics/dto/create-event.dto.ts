/**
 * Create Analytics Event DTO
 *
 * Data Transfer Object for creating an analytics event.
 */

import {
  IsString,
  IsOptional,
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateLocationDto } from './create-location.dto';
import { CreateDeviceDto } from './create-device.dto';

export class CreateEventDto {
  @ApiPropertyOptional({ description: 'User ID (optional)' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ description: 'Session ID' })
  @IsOptional()
  @IsString()
  sessionId?: string;

  @ApiProperty({
    description: 'Event type',
    example: 'session_start',
  })
  @IsString()
  eventType: string;

  @ApiPropertyOptional({
    description: 'Event data (JSON object)',
    example: { productId: '123', action: 'view' },
  })
  @IsOptional()
  @IsObject()
  eventData?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Location data' })
  @IsOptional()
  @IsObject()
  location?: CreateLocationDto;

  @ApiPropertyOptional({ description: 'Device data' })
  @IsOptional()
  @IsObject()
  device?: CreateDeviceDto;

  @ApiPropertyOptional({ description: 'Page URL' })
  @IsOptional()
  @IsString()
  pageUrl?: string;

  @ApiPropertyOptional({ description: 'Referrer URL' })
  @IsOptional()
  @IsString()
  referrer?: string;
}
