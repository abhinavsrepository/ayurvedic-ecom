/**
 * Query Customer DTO
 *
 * Data Transfer Object for querying/filtering customers.
 */

import { IsOptional, IsString, IsNumber, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryCustomerDto {
  @ApiPropertyOptional({ description: 'Page number', minimum: 0, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  page?: number = 0;

  @ApiPropertyOptional({ description: 'Page size', minimum: 1, maximum: 100, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  size?: number = 20;

  @ApiPropertyOptional({ description: 'Search query (name or email)' })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiPropertyOptional({ description: 'Sort field', default: 'created_at' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'created_at';

  @ApiPropertyOptional({ description: 'Sort order (asc or desc)', default: 'desc' })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}
