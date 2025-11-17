import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, Max, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Page number (0-indexed)',
    minimum: 0,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page?: number = 0;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    minimum: 1,
    maximum: 100,
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  size?: number = 20;

  @ApiPropertyOptional({
    description: 'Sort field and direction (e.g., "createdAt,DESC")',
    example: 'createdAt,DESC',
  })
  @IsOptional()
  @IsString()
  sort?: string;
}

export class PageMetaDto {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;

  constructor(
    page: number,
    size: number,
    totalElements: number,
    numberOfElements: number,
  ) {
    this.page = page;
    this.size = size;
    this.totalElements = totalElements;
    this.totalPages = Math.ceil(totalElements / size);
    this.first = page === 0;
    this.last = page >= this.totalPages - 1;
    this.numberOfElements = numberOfElements;
    this.empty = totalElements === 0;
  }
}

export class PageDto<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;

  constructor(content: T[], page: number, size: number, totalElements: number) {
    this.content = content;
    this.totalElements = totalElements;
    this.totalPages = Math.ceil(totalElements / size);
    this.size = size;
    this.number = page;
    this.first = page === 0;
    this.last = page >= this.totalPages - 1;
    this.numberOfElements = content.length;
    this.empty = totalElements === 0;
  }
}
