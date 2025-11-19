import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'AYUR-001' })
  @IsString()
  sku: string;

  @ApiProperty({ example: 'Ashwagandha Powder' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'ashwagandha-powder' })
  @IsString()
  slug: string;

  @ApiPropertyOptional({ example: 'Premium organic ashwagandha powder' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Natural stress relief supplement' })
  @IsOptional()
  @IsString()
  short_description?: string;

  @ApiProperty({ example: 29.99 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 39.99 })
  @IsOptional()
  @IsNumber()
  compare_at_price?: number;

  @ApiPropertyOptional({ example: 15.00 })
  @IsOptional()
  @IsNumber()
  cost_price?: number;

  @ApiPropertyOptional({ example: 'ACTIVE' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: 'Supplements' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 'Himalaya' })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({ example: 250 })
  @IsOptional()
  @IsNumber()
  weight_grams?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  is_featured?: boolean;

  @ApiPropertyOptional({ example: 'Buy Ashwagandha Powder Online' })
  @IsOptional()
  @IsString()
  seo_title?: string;

  @ApiPropertyOptional({ example: 'Premium ashwagandha for stress relief' })
  @IsOptional()
  @IsString()
  seo_description?: string;
}
