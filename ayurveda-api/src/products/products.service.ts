/**
 * Products Service
 *
 * Business logic for product operations with Redis caching and Prisma ORM.
 */

import { Injectable, NotFoundException, Logger, ConflictException } from '@nestjs/common';
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
      throw new ConflictException(`Product with slug '${createProductDto.slug}' already exists`);
    }

    const product = await this.prisma.product.create({
      data: {
        ...createProductDto,
        images: createProductDto.images || [],
        tags: createProductDto.tags || [],
        seoKeywords: createProductDto.seoKeywords || [],
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
        const { page = 0, size = 20, sortBy = 'createdAt', sortOrder = 'desc', ...filters } = query;

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
            orderBy: { [sortBy]: sortOrder },
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
        throw new ConflictException(`Product with slug '${updateProductDto.slug}' already exists`);
      }
    }

    const product = await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
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
      data: { deletedAt: new Date() },
    });

    // Invalidate caches
    await this.invalidateProductCaches(id, product.slug);

    this.logger.log(`Product deleted: ${id}`);
    return { message: 'Product deleted successfully' };
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
