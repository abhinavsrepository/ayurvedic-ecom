/**
 * Create Device DTO
 *
 * Data Transfer Object for creating a device log entry.
 */

import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDeviceDto {
  @ApiPropertyOptional({ description: 'User ID (optional)' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ description: 'Session ID' })
  @IsOptional()
  @IsString()
  sessionId?: string;

  @ApiPropertyOptional({ description: 'Device type (mobile/tablet/desktop)' })
  @IsOptional()
  @IsString()
  deviceType?: string;

  @ApiPropertyOptional({ description: 'Operating System' })
  @IsOptional()
  @IsString()
  os?: string;

  @ApiPropertyOptional({ description: 'Browser name' })
  @IsOptional()
  @IsString()
  browser?: string;

  @ApiPropertyOptional({ description: 'Browser version' })
  @IsOptional()
  @IsString()
  browserVersion?: string;

  @ApiPropertyOptional({ description: 'Device RAM (e.g., "4GB")' })
  @IsOptional()
  @IsString()
  deviceRam?: string;

  @ApiPropertyOptional({ description: 'CPU cores' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  cpuCores?: number;

  @ApiPropertyOptional({ description: 'Network type (4g/5g/wifi/etc)' })
  @IsOptional()
  @IsString()
  networkType?: string;

  @ApiPropertyOptional({ description: 'Online status' })
  @IsOptional()
  @IsBoolean()
  isOnline?: boolean;

  @ApiPropertyOptional({ description: 'Screen width in pixels' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  screenWidth?: number;

  @ApiPropertyOptional({ description: 'Screen height in pixels' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  screenHeight?: number;

  @ApiPropertyOptional({ description: 'Color scheme (dark/light)' })
  @IsOptional()
  @IsString()
  colorScheme?: string;

  @ApiPropertyOptional({ description: 'Touch capability' })
  @IsOptional()
  @IsBoolean()
  hasTouch?: boolean;

  @ApiPropertyOptional({ description: 'User agent string' })
  @IsOptional()
  @IsString()
  userAgent?: string;
}
