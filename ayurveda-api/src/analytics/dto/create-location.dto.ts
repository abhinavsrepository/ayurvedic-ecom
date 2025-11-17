/**
 * Create Location DTO
 *
 * Data Transfer Object for creating a location log entry.
 */

import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum LocationAccuracy {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export class CreateLocationDto {
  @ApiPropertyOptional({ description: 'User ID (optional)' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ description: 'Session ID' })
  @IsOptional()
  @IsString()
  sessionId?: string;

  @ApiPropertyOptional({ description: 'User IP address (will be hashed)' })
  @IsOptional()
  @IsString()
  ip?: string;

  @ApiPropertyOptional({ description: 'Country code or name' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ description: 'Region/State' })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiPropertyOptional({ description: 'City' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'Latitude', minimum: -90, maximum: 90 })
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @ApiPropertyOptional({ description: 'Longitude', minimum: -180, maximum: 180 })
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @ApiPropertyOptional({ description: 'Timezone (e.g., Asia/Kolkata)' })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({
    description: 'Location accuracy',
    enum: LocationAccuracy,
  })
  @IsOptional()
  @IsEnum(LocationAccuracy)
  accuracy?: LocationAccuracy;
}
