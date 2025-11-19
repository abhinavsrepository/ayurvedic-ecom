#!/bin/bash

# This script generates all the complete implementation files for the NestJS backend
# Run this from the ayurveda-api directory

echo "🚀 Generating complete enterprise NestJS backend..."

# Create all DTOs for Products
cat > src/products/dto/create-product.dto.ts << 'EOF'
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
EOF

cat > src/products/dto/update-product.dto.ts << 'EOF'
import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
EOF

cat > src/products/dto/product-query.dto.ts << 'EOF'
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 20;
}
EOF

echo "✅ Products DTOs created"

# Generate complete Products service (this is a large file, creating in parts due to heredoc limits)
echo "Creating Products service..."

cat > src/products/products.service.ts << 'EOF'
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: {
        sku: dto.sku,
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        short_description: dto.short_description,
        price: dto.price,
        compare_at_price: dto.compare_at_price,
        cost_price: dto.cost_price,
        status: dto.status || 'DRAFT',
        category: dto.category,
        brand: dto.brand,
        weight_grams: dto.weight_grams,
        is_featured: dto.is_featured || false,
        seo_title: dto.seo_title,
        seo_description: dto.seo_description,
      },
    });

    return product;
  }

  async findAll(query: ProductQueryDto) {
    const { page = 1, limit = 20, search, status, category, brand } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) where.status = status;
    if (category) where.category = category;
    if (brand) where.brand = brand;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);

    const product = await this.prisma.product.update({
      where: { id },
      data: dto,
    });

    return product;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.product.update({
      where: { id },
      data: { deleted_at: new Date() },
    });

    return { success: true, message: 'Product deleted successfully' };
  }
}
EOF

echo "✅ Products service created"

echo "🎉 All implementations generated!"
echo "📝 Next steps:"
echo "1. Review the generated files"
echo "2. Add controller implementations"
echo "3. Update main.ts and app.module.ts"
echo "4. Test endpoints"
