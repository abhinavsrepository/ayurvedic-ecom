/**
 * Query Review DTO
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, IsEnum, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export enum ReviewSortBy {
  RECENT = 'recent',
  HELPFUL = 'helpful',
  RATING_HIGH = 'rating_high',
  RATING_LOW = 'rating_low',
}

export class QueryReviewDto {
  @ApiPropertyOptional({ description: 'Page number (0-indexed)', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page?: number = 0;

  @ApiPropertyOptional({ description: 'Page size', default: 10, maximum: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  size?: number = 10;

  @ApiPropertyOptional({ description: 'Filter by rating (1-5)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({
    description: 'Sort by',
    enum: ReviewSortBy,
    default: ReviewSortBy.RECENT,
  })
  @IsOptional()
  @IsEnum(ReviewSortBy)
  sortBy?: ReviewSortBy = ReviewSortBy.RECENT;
}
