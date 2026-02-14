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
var ReviewsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const cache_service_1 = require("../cache/cache.service");
const cache_constants_1 = require("../cache/cache.constants");
const query_review_dto_1 = require("./dto/query-review.dto");
let ReviewsService = ReviewsService_1 = class ReviewsService {
    prisma;
    cacheService;
    logger = new common_1.Logger(ReviewsService_1.name);
    constructor(prisma, cacheService) {
        this.prisma = prisma;
        this.cacheService = cacheService;
    }
    async getProductReviews(productId, query) {
        const { page = 0, size = 10, rating, sortBy = query_review_dto_1.ReviewSortBy.RECENT } = query;
        const cacheKey = cache_constants_1.CACHE_KEYS.REVIEWS_BY_PRODUCT(productId, page, size);
        return this.cacheService.wrap(cacheKey, async () => {
            const product = await this.prisma.product.findUnique({
                where: { id: productId },
            });
            if (!product) {
                throw new common_1.NotFoundException('Product not found');
            }
            const where = {
                product_id: productId,
                status: 'APPROVED',
            };
            if (rating) {
                where.rating = rating;
            }
            let orderBy = { created_at: 'desc' };
            switch (sortBy) {
                case query_review_dto_1.ReviewSortBy.HELPFUL:
                    orderBy = { helpful_count: 'desc' };
                    break;
                case query_review_dto_1.ReviewSortBy.RATING_HIGH:
                    orderBy = { rating: 'desc' };
                    break;
                case query_review_dto_1.ReviewSortBy.RATING_LOW:
                    orderBy = { rating: 'asc' };
                    break;
            }
            const [reviews, total] = await Promise.all([
                this.prisma.review.findMany({
                    where,
                    skip: page * size,
                    take: size,
                    orderBy,
                    include: {
                        customer: {
                            select: {
                                id: true,
                                first_name: true,
                                last_name: true,
                            },
                        },
                    },
                }),
                this.prisma.review.count({ where }),
            ]);
            const stats = await this.getProductRatingStats(productId);
            return {
                reviews: reviews.map((r) => this.formatReview(r)),
                stats,
                pagination: {
                    page,
                    size,
                    total,
                    totalPages: Math.ceil(total / size),
                },
            };
        }, cache_constants_1.CACHE_TTL.MEDIUM);
    }
    async getProductRatingStats(productId) {
        const cacheKey = cache_constants_1.CACHE_KEYS.REVIEW_STATS_BY_PRODUCT(productId);
        return this.cacheService.wrap(cacheKey, async () => {
            const reviews = await this.prisma.review.findMany({
                where: {
                    product_id: productId,
                    status: 'APPROVED',
                },
                select: { rating: true },
            });
            if (reviews.length === 0) {
                return {
                    averageRating: 0,
                    totalReviews: 0,
                    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
                };
            }
            const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
            let sum = 0;
            for (const review of reviews) {
                sum += review.rating;
                distribution[review.rating]++;
            }
            return {
                averageRating: Math.round((sum / reviews.length) * 10) / 10,
                totalReviews: reviews.length,
                distribution,
            };
        }, cache_constants_1.CACHE_TTL.MEDIUM);
    }
    async create(dto, customerId) {
        const product = await this.prisma.product.findUnique({
            where: { id: dto.productId },
        });
        if (!product || product.deleted_at) {
            throw new common_1.NotFoundException('Product not found');
        }
        const existingReview = await this.prisma.review.findUnique({
            where: {
                product_id_customer_id: {
                    product_id: dto.productId,
                    customer_id: customerId,
                },
            },
        });
        if (existingReview) {
            throw new common_1.ConflictException('You have already reviewed this product');
        }
        const hasPurchased = await this.prisma.orderItem.findFirst({
            where: {
                product_id: dto.productId,
                orders: {
                    customer_id: customerId,
                    status: { in: ['DELIVERED', 'COMPLETED'] },
                },
            },
        });
        const review = await this.prisma.review.create({
            data: {
                product_id: dto.productId,
                customer_id: customerId,
                rating: dto.rating,
                title: dto.title,
                comment: dto.comment,
                is_verified: !!hasPurchased,
                status: 'APPROVED',
            },
            include: {
                customer: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                    },
                },
            },
        });
        await this.invalidateProductReviewCaches(dto.productId);
        this.logger.log(`Review created: ${review.id} for product ${dto.productId}`);
        return this.formatReview(review);
    }
    async update(reviewId, dto, customerId) {
        const review = await this.prisma.review.findUnique({
            where: { id: reviewId },
        });
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        if (review.customer_id !== customerId) {
            throw new common_1.ForbiddenException('You can only edit your own reviews');
        }
        const updated = await this.prisma.review.update({
            where: { id: reviewId },
            data: {
                rating: dto.rating,
                title: dto.title,
                comment: dto.comment,
                updated_at: new Date(),
            },
            include: {
                customer: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                    },
                },
            },
        });
        await this.invalidateProductReviewCaches(review.product_id);
        this.logger.log(`Review updated: ${reviewId}`);
        return this.formatReview(updated);
    }
    async delete(reviewId, customerId) {
        const review = await this.prisma.review.findUnique({
            where: { id: reviewId },
        });
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        if (review.customer_id !== customerId) {
            throw new common_1.ForbiddenException('You can only delete your own reviews');
        }
        await this.prisma.review.delete({
            where: { id: reviewId },
        });
        await this.invalidateProductReviewCaches(review.product_id);
        this.logger.log(`Review deleted: ${reviewId}`);
        return { message: 'Review deleted successfully' };
    }
    async markHelpful(reviewId, userId) {
        const review = await this.prisma.review.findUnique({
            where: { id: reviewId },
        });
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        const existing = await this.prisma.reviewHelpful.findUnique({
            where: {
                review_id_user_id: {
                    review_id: reviewId,
                    user_id: userId,
                },
            },
        });
        if (existing) {
            await this.prisma.reviewHelpful.delete({
                where: { id: existing.id },
            });
            await this.prisma.review.update({
                where: { id: reviewId },
                data: { helpful_count: { decrement: 1 } },
            });
            return { helpful: false, helpfulCount: review.helpful_count - 1 };
        }
        else {
            await this.prisma.reviewHelpful.create({
                data: {
                    review_id: reviewId,
                    user_id: userId,
                },
            });
            await this.prisma.review.update({
                where: { id: reviewId },
                data: { helpful_count: { increment: 1 } },
            });
            return { helpful: true, helpfulCount: review.helpful_count + 1 };
        }
    }
    async getUserReviews(customerId) {
        const reviews = await this.prisma.review.findMany({
            where: { customer_id: customerId },
            orderBy: { created_at: 'desc' },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        product_images: {
                            where: { is_primary: true },
                            take: 1,
                        },
                    },
                },
            },
        });
        return reviews.map((r) => ({
            id: r.id,
            rating: r.rating,
            title: r.title,
            comment: r.comment,
            isVerified: r.is_verified,
            helpfulCount: r.helpful_count,
            status: r.status,
            createdAt: r.created_at,
            product: {
                id: r.product.id,
                name: r.product.name,
                slug: r.product.slug,
                image: r.product.product_images[0]?.url || '',
            },
        }));
    }
    formatReview(review) {
        return {
            id: review.id,
            rating: review.rating,
            title: review.title,
            comment: review.comment,
            isVerified: review.is_verified,
            helpfulCount: review.helpful_count,
            createdAt: review.created_at,
            author: {
                id: review.customer.id,
                name: `${review.customer.first_name} ${review.customer.last_name?.charAt(0) || ''}.`,
            },
        };
    }
    async invalidateProductReviewCaches(productId) {
        await Promise.all([
            this.cacheService.del(cache_constants_1.CACHE_KEYS.REVIEW_STATS_BY_PRODUCT(productId)),
            this.cacheService.del(cache_constants_1.CACHE_KEYS.REVIEWS_BY_PRODUCT(productId, 0, 10)),
            this.cacheService.del(cache_constants_1.CACHE_KEYS.REVIEWS_BY_PRODUCT(productId, 1, 10)),
        ]);
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = ReviewsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cache_service_1.CacheService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map