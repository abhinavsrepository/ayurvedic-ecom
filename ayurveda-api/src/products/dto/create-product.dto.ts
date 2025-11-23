/**
 * Create Product DTO
 *
 * Data Transfer Object for creating a new product.
 */

import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  Min,
  MaxLength,
  IsEnum,
  ValidateNested,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ProductStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ARCHIVED = 'archived',
}

export class ProductImageDto {
  @ApiProperty({ description: 'Image URL' })
  @IsUrl()
  url: string;

  @ApiProperty({ description: 'Alt text for the image' })
  @IsString()
  altText: string;

  @ApiPropertyOptional({ description: 'Image display order' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  order?: number;
}

export class CreateProductDto {
  @ApiProperty({ description: 'Product name', maxLength: 200 })
  @IsString()
  @MaxLength(200)
  name: string;

  @ApiProperty({ description: 'URL-friendly slug', maxLength: 200 })
  @IsString()
  @MaxLength(200)
  slug: string;

  @ApiProperty({ description: 'Product description' })
  @IsString()
  description: string;

  @ApiPropertyOptional({ description: 'Short description', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  shortDescription?: string;

  @ApiProperty({ description: 'Product price', minimum: 0 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ description: 'Compare at price', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  compareAtPrice?: number;

  @ApiPropertyOptional({ description: 'Cost per item', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  costPerItem?: number;

  @ApiProperty({ description: 'Stock quantity', minimum: 0 })
  @IsNumber()
  @Min(0)
  stockQuantity: number;

  @ApiProperty({ description: 'Product SKU', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  sku: string;

  @ApiPropertyOptional({ description: 'Product barcode', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  barcode?: string;

  @ApiPropertyOptional({ description: 'Product category', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @ApiPropertyOptional({ description: 'Product subcategory', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  subcategory?: string;

  @ApiPropertyOptional({ description: 'Product brand', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  brand?: string;

  // Ayurveda-specific fields
  @ApiPropertyOptional({ description: 'Product ingredients' })
  @IsOptional()
  @IsString()
  ingredients?: string;

  @ApiPropertyOptional({ description: 'Product benefits' })
  @IsOptional()
  @IsString()
  benefits?: string;

  @ApiPropertyOptional({ description: 'Suitable for Vata dosha' })
  @IsOptional()
  @IsBoolean()
  doshaVata?: boolean;

  @ApiPropertyOptional({ description: 'Suitable for Pitta dosha' })
  @IsOptional()
  @IsBoolean()
  doshaPitta?: boolean;

  @ApiPropertyOptional({ description: 'Suitable for Kapha dosha' })
  @IsOptional()
  @IsBoolean()
  doshaKapha?: boolean;

  @ApiPropertyOptional({ description: 'Usage instructions' })
  @IsOptional()
  @IsString()
  usageInstructions?: string;

  @ApiPropertyOptional({ description: 'Product tags' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Product images' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  images?: ProductImageDto[];

  @ApiPropertyOptional({ description: 'Weight in grams', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  weightGrams?: number;

  @ApiPropertyOptional({ description: 'Product status', enum: ProductStatus })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiPropertyOptional({ description: 'Is product featured?' })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({ description: 'SEO title', maxLength: 70 })
  @IsOptional()
  @IsString()
  @MaxLength(70)
  seoTitle?: string;

  @ApiPropertyOptional({ description: 'SEO description', maxLength: 160 })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  seoDescription?: string;

  @ApiPropertyOptional({ description: 'SEO keywords' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  seoKeywords?: string[];

  @ApiPropertyOptional({ description: 'Product rating', minimum: 0, maximum: 5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  rating?: number;

  @ApiPropertyOptional({ description: 'Review count', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  reviewCount?: number;
}
