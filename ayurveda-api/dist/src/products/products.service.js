"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ProductsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const cache_service_1 = require("../cache/cache.service");
const cache_constants_1 = require("../cache/cache.constants");
let ProductsService = ProductsService_1 = class ProductsService {
    prisma;
    cacheService;
    logger = new common_1.Logger(ProductsService_1.name);
    constructor(prisma, cacheService) {
        this.prisma = prisma;
        this.cacheService = cacheService;
    }
    async create(createProductDto) {
        const existing = await this.prisma.product.findUnique({
            where: { slug: createProductDto.slug },
        });
        if (existing) {
            throw new common_1.ConflictException(`Product with slug '${createProductDto.slug}' already exists`);
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
        await this.invalidateProductCaches();
        this.logger.log(`Product created: ${product.id} - ${product.name}`);
        return product;
    }
    async findAll(query) {
        const cacheKey = cache_constants_1.CACHE_KEYS.PRODUCTS_LIST(query.page || 0, query.size || 20, JSON.stringify(query));
        return this.cacheService.wrap(cacheKey, async () => {
            const { page = 0, size = 20, sortBy = 'createdAt', sortOrder = 'desc', ...filters } = query;
            const where = {};
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
        }, cache_constants_1.CACHE_TTL.MEDIUM);
    }
    async findOne(id) {
        const cacheKey = cache_constants_1.CACHE_KEYS.PRODUCT_BY_ID(id);
        return this.cacheService.wrap(cacheKey, async () => {
            const product = await this.prisma.product.findUnique({
                where: { id },
            });
            if (!product) {
                throw new common_1.NotFoundException(`Product with ID '${id}' not found`);
            }
            return product;
        }, cache_constants_1.CACHE_TTL.LONG);
    }
    async findBySlug(slug) {
        const cacheKey = cache_constants_1.CACHE_KEYS.PRODUCT_BY_SLUG(slug);
        return this.cacheService.wrap(cacheKey, async () => {
            const product = await this.prisma.product.findUnique({
                where: { slug },
            });
            if (!product) {
                throw new common_1.NotFoundException(`Product with slug '${slug}' not found`);
            }
            return product;
        }, cache_constants_1.CACHE_TTL.LONG);
    }
    async update(id, updateProductDto) {
        await this.findOne(id);
        if (updateProductDto.slug) {
            const existing = await this.prisma.product.findFirst({
                where: {
                    slug: updateProductDto.slug,
                    NOT: { id },
                },
            });
            if (existing) {
                throw new common_1.ConflictException(`Product with slug '${updateProductDto.slug}' already exists`);
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
        await this.invalidateProductCaches(id, product.slug);
        this.logger.log(`Product updated: ${product.id} - ${product.name}`);
        return product;
    }
    async remove(id) {
        const product = await this.findOne(id);
        await this.prisma.product.update({
            where: { id },
            data: { deleted_at: new Date() },
        });
        await this.invalidateProductCaches(id, product.slug);
        this.logger.log(`Product deleted: ${id}`);
        return { message: 'Product deleted successfully' };
    }
    async search(query, queryDto) {
        const { page = 0, size = 20, sortBy = 'createdAt', sortOrder = 'desc', } = queryDto;
        const where = {};
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
    async updateStock(id, quantity) {
        const product = await this.findOne(id);
        await this.prisma.stock.updateMany({
            where: { product_id: id },
            data: { quantity },
        });
        await this.invalidateProductCaches(id, product.slug);
        this.logger.log(`Product stock updated: ${product.name} - ${quantity}`);
        return product;
    }
    async invalidateProductCaches(id, slug) {
        const promises = [];
        if (id) {
            promises.push(this.cacheService.del(cache_constants_1.CACHE_KEYS.PRODUCT_BY_ID(id)));
        }
        if (slug) {
            promises.push(this.cacheService.del(cache_constants_1.CACHE_KEYS.PRODUCT_BY_SLUG(slug)));
        }
        promises.push(this.cacheService.del(cache_constants_1.CACHE_KEYS.PRODUCTS_FEATURED), this.cacheService.del(cache_constants_1.CACHE_KEYS.PRODUCTS_BESTSELLERS), this.cacheService.del(cache_constants_1.CACHE_KEYS.PRODUCTS_NEW));
        await Promise.all(promises);
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = ProductsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cache_service_1.CacheService])
], ProductsService);
//# sourceMappingURL=products.service.js.map