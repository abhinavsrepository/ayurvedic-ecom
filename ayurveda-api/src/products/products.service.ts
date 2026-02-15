/**
 * Products Service
 *
 * Business logic for product operations with Redis caching and Prisma ORM.
 */

import {
  Injectable,
  NotFoundException,
  Logger,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { CACHE_KEYS, CACHE_TTL } from '../cache/cache.constants';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
  ) {}

  /**
   * Create a new product
   */
  async create(createProductDto: CreateProductDto) {
    // Check if slug already exists
    const existing = await this.prisma.product.findUnique({
      where: { slug: createProductDto.slug },
    });

    if (existing) {
      throw new ConflictException(
        `Product with slug '${createProductDto.slug}' already exists`,
      );
    }

    const product = await this.prisma.product.create({
      data: {
        sku: createProductDto.sku,
        name: createProductDto.name,
        slug: createProductDto.slug,
        description: createProductDto.description,
        short_description: createProductDto.shortDescription,
        price: createProductDto.price,
        compare_at_price: createProductDto.compareAtPrice,
        cost_price: createProductDto.costPerItem,
        status: createProductDto.status?.toUpperCase() || 'DRAFT',
        category: createProductDto.category,
        subcategory: createProductDto.subcategory,
        brand: createProductDto.brand,
        weight_grams: createProductDto.weightGrams,
        is_featured: createProductDto.isFeatured || false,
        ingredients: createProductDto.ingredients,
        benefits: createProductDto.benefits,
        dosha_vata: createProductDto.doshaVata,
        dosha_pitta: createProductDto.doshaPitta,
        dosha_kapha: createProductDto.doshaKapha,
        usage_instructions: createProductDto.usageInstructions,
        seo_title: createProductDto.seoTitle,
        seo_description: createProductDto.seoDescription,
        seo_keywords: createProductDto.seoKeywords?.join(','),
        product_images: {
          create: createProductDto.images?.map((img, index) => ({
            url: img.url,
            alt_text: img.altText,
            image_order: img.order || index,
            is_primary: index === 0,
          })),
        },
        stock: {
          create: {
            sku: createProductDto.sku,
            quantity: createProductDto.stockQuantity,
          },
        },
      },
    });

    // Invalidate relevant caches
    await this.invalidateProductCaches();

    this.logger.log(`Product created: ${product.id} - ${product.name}`);
    return product;
  }

  /**
   * Find all products with pagination and filters
   */
  async findAll(query: QueryProductDto) {
    const cacheKey = CACHE_KEYS.PRODUCTS_LIST(
      query.page || 0,
      query.size || 20,
      JSON.stringify(query),
    );

    return this.cacheService.wrap(
      cacheKey,
      async () => {
        const {
          page = 0,
          size = 20,
          sortBy = 'createdAt',
          sortOrder = 'desc',
          ...filters
        } = query;

        const where: any = {};

        if (filters.query) {
          where.OR = [
            { name: { contains: filters.query, mode: 'insensitive' } },
            { description: { contains: filters.query, mode: 'insensitive' } },
            { tags: { has: filters.query } },
          ];
        }

        if (filters.category) {
          where.category = filters.category;
        }

        if (filters.brand) {
          where.brand = filters.brand;
        }

        if (filters.status) {
          where.status = filters.status;
        }

        if (filters.isFeatured !== undefined) {
          where.isFeatured = filters.isFeatured;
        }

        if (filters.inStock) {
          where.stockQuantity = { gt: 0 };
        }

        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
          where.price = {};
          if (filters.minPrice !== undefined) {
            where.price.gte = filters.minPrice;
          }
          if (filters.maxPrice !== undefined) {
            where.price.lte = filters.maxPrice;
          }
        }

        const [products, total] = await Promise.all([
          this.prisma.product.findMany({
            where,
            skip: page * size,
            take: size,
            orderBy: {
              [sortBy === 'createdAt' ? 'created_at' : sortBy]: sortOrder,
            },
          }),
          this.prisma.product.count({ where }),
        ]);

        return {
          content: products,
          total,
          page,
          size,
          totalPages: Math.ceil(total / size),
        };
      },
      CACHE_TTL.MEDIUM,
    );
  }

  /**
   * Find one product by ID
   */
  async findOne(id: string) {
    const cacheKey = CACHE_KEYS.PRODUCT_BY_ID(id);

    return this.cacheService.wrap(
      cacheKey,
      async () => {
        const product = await this.prisma.product.findUnique({
          where: { id },
        });

        if (!product) {
          throw new NotFoundException(`Product with ID '${id}' not found`);
        }

        return product;
      },
      CACHE_TTL.LONG,
    );
  }

  /**
   * Find one product by slug
   */
  async findBySlug(slug: string) {
    const cacheKey = CACHE_KEYS.PRODUCT_BY_SLUG(slug);

    return this.cacheService.wrap(
      cacheKey,
      async () => {
        const product = await this.prisma.product.findUnique({
          where: { slug },
        });

        if (!product) {
          throw new NotFoundException(`Product with slug '${slug}' not found`);
        }

        return product;
      },
      CACHE_TTL.LONG,
    );
  }

  /**
   * Update product
   */
  async update(id: string, updateProductDto: UpdateProductDto) {
    // Check if product exists
    await this.findOne(id);

    // Check slug uniqueness if updating slug
    if (updateProductDto.slug) {
      const existing = await this.prisma.product.findFirst({
        where: {
          slug: updateProductDto.slug,
          NOT: { id },
        },
      });

      if (existing) {
        throw new ConflictException(
          `Product with slug '${updateProductDto.slug}' already exists`,
        );
      }
    }

    const product = await this.prisma.product.update({
      where: { id },
      data: {
        name: updateProductDto.name,
        slug: updateProductDto.slug,
        description: updateProductDto.description,
        short_description: updateProductDto.shortDescription,
        price: updateProductDto.price,
        compare_at_price: updateProductDto.compareAtPrice,
        cost_price: updateProductDto.costPerItem,
        status: updateProductDto.status?.toUpperCase(),
        category: updateProductDto.category,
        subcategory: updateProductDto.subcategory,
        brand: updateProductDto.brand,
        weight_grams: updateProductDto.weightGrams,
        is_featured: updateProductDto.isFeatured,
        ingredients: updateProductDto.ingredients,
        benefits: updateProductDto.benefits,
        dosha_vata: updateProductDto.doshaVata,
        dosha_pitta: updateProductDto.doshaPitta,
        dosha_kapha: updateProductDto.doshaKapha,
        usage_instructions: updateProductDto.usageInstructions,
        seo_title: updateProductDto.seoTitle,
        seo_description: updateProductDto.seoDescription,
        seo_keywords: updateProductDto.seoKeywords?.join(','),
      },
    });

    // Invalidate caches
    await this.invalidateProductCaches(id, product.slug);

    this.logger.log(`Product updated: ${product.id} - ${product.name}`);
    return product;
  }

  /**
   * Delete product (soft delete)
   */
  async remove(id: string) {
    const product = await this.findOne(id);

    await this.prisma.product.update({
      where: { id },
      data: { deleted_at: new Date() },
    });

    // Invalidate caches
    await this.invalidateProductCaches(id, product.slug);

    this.logger.log(`Product deleted: ${id}`);
    return { message: 'Product deleted successfully' };
  }

  /**
   * Search products by query
   */
  async search(query: string, queryDto: QueryProductDto) {
    const {
      page = 0,
      size = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = queryDto;

    const where: any = {};

    // Search in name, description, and tags
    where.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
      { tags: { has: query } },
    ];

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip: page * size,
        take: size,
        orderBy: {
          [sortBy === 'createdAt' ? 'created_at' : sortBy]: sortOrder,
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      content: products,
      total,
      page,
      size,
      totalPages: Math.ceil(total / size),
    };
  }

  /**
   * Update product stock
   */
  async updateStock(id: string, quantity: number) {
    // Check if product exists
    const product = await this.findOne(id);

    await this.prisma.stock.updateMany({
      where: { product_id: id },
      data: { quantity },
    });

    // Invalidate cache
    await this.invalidateProductCaches(id, product.slug);

    this.logger.log(`Product stock updated: ${product.name} - ${quantity}`);
    return product;
  }

  /**
   * Invalidate product-related caches
   */
  private async invalidateProductCaches(id?: string, slug?: string) {
    const promises: Promise<void>[] = [];

    if (id) {
      promises.push(this.cacheService.del(CACHE_KEYS.PRODUCT_BY_ID(id)));
    }

    if (slug) {
      promises.push(this.cacheService.del(CACHE_KEYS.PRODUCT_BY_SLUG(slug)));
    }

    // Invalidate list caches (simplified - in production, use cache tags)
    promises.push(
      this.cacheService.del(CACHE_KEYS.PRODUCTS_FEATURED),
      this.cacheService.del(CACHE_KEYS.PRODUCTS_BESTSELLERS),
      this.cacheService.del(CACHE_KEYS.PRODUCTS_NEW),
    );

    await Promise.all(promises);
  }
}
