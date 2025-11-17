import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray,
  Min,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum ProductStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export class CreateProductDto {
  @ApiProperty({ example: 'Ashwagandha Capsules' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  name: string;

  @ApiProperty({ example: 'ashwagandha-capsules' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  slug: string;

  @ApiProperty({ example: 'ASH-001' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  sku: string;

  @ApiPropertyOptional({ example: 'Premium Ashwagandha extract capsules for stress relief' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Stress relief and vitality booster' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  short_description?: string;

  @ApiProperty({ example: 499.99 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiPropertyOptional({ example: 699.99 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  compare_at_price?: number;

  @ApiPropertyOptional({ example: 250.00 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  cost_price?: number;

  @ApiProperty({ enum: ProductStatus, example: ProductStatus.ACTIVE })
  @IsEnum(ProductStatus)
  status: ProductStatus;

  @ApiPropertyOptional({ example: 'Immunity' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  category?: string;

  @ApiPropertyOptional({ example: 'Himalaya' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  brand?: string;

  @ApiPropertyOptional({ example: 250 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  weight_grams?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  is_featured?: boolean;

  @ApiPropertyOptional({ example: 'Best Ashwagandha Capsules for Stress Relief' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  seo_title?: string;

  @ApiPropertyOptional({ example: 'Shop premium Ashwagandha capsules...' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  seo_description?: string;

  @ApiPropertyOptional({ type: [String], example: ['Ashwagandha', 'Neem', 'Turmeric'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ingredients?: string[];

  @ApiPropertyOptional({ type: [String], example: ['Stress relief', 'Immunity boost'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  benefits?: string[];

  @ApiPropertyOptional({ example: 'Take 1-2 capsules daily with water' })
  @IsOptional()
  @IsString()
  usage?: string;

  @ApiPropertyOptional({ type: [String], example: ['https://example.com/image.jpg'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class ProductQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: ProductStatus })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  is_featured?: boolean;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 0;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  size?: number = 20;

  @ApiPropertyOptional({ default: 'created_at,DESC' })
  @IsOptional()
  @IsString()
  sort?: string = 'created_at,DESC';
}

export class ProductResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  sku: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  short_description?: string;

  @ApiProperty()
  price: number;

  @ApiPropertyOptional()
  compare_at_price?: number;

  @ApiPropertyOptional()
  cost_price?: number;

  @ApiProperty()
  status: string;

  @ApiPropertyOptional()
  category?: string;

  @ApiPropertyOptional()
  brand?: string;

  @ApiPropertyOptional()
  weight_grams?: number;

  @ApiProperty()
  is_featured: boolean;

  @ApiPropertyOptional()
  seo_title?: string;

  @ApiPropertyOptional()
  seo_description?: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiPropertyOptional()
  stock?: {
    quantity: number;
    reserved_quantity: number;
    available: number;
  };
}
