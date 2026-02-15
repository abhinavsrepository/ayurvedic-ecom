/**
 * Reviews Service
 *
 * Business logic for product reviews and ratings.
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { CACHE_KEYS, CACHE_TTL } from '../cache/cache.constants';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { QueryReviewDto, ReviewSortBy } from './dto/query-review.dto';

@Injectable()
export class ReviewsService {
  private readonly logger = new Logger(ReviewsService.name);

  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
  ) {}

  /**
   * Get reviews for a product
   */
  async getProductReviews(productId: string, query: QueryReviewDto) {
    const { page = 0, size = 10, rating, sortBy = ReviewSortBy.RECENT } = query;

    const cacheKey = CACHE_KEYS.REVIEWS_BY_PRODUCT(productId, page, size);

    return this.cacheService.wrap(
      cacheKey,
      async () => {
        // Verify product exists
        const product = await this.prisma.product.findUnique({
          where: { id: productId },
        });
        if (!product) {
          throw new NotFoundException('Product not found');
        }

        const where: any = {
          product_id: productId,
          status: 'APPROVED',
        };

        if (rating) {
          where.rating = rating;
        }

        // Determine sort order
        let orderBy: any = { created_at: 'desc' };
        switch (sortBy) {
          case ReviewSortBy.HELPFUL:
            orderBy = { helpful_count: 'desc' };
            break;
          case ReviewSortBy.RATING_HIGH:
            orderBy = { rating: 'desc' };
            break;
          case ReviewSortBy.RATING_LOW:
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

        // Get rating statistics
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
      },
      CACHE_TTL.MEDIUM,
    );
  }

  /**
   * Get rating statistics for a product
   */
  async getProductRatingStats(productId: string) {
    const cacheKey = CACHE_KEYS.REVIEW_STATS_BY_PRODUCT(productId);

    return this.cacheService.wrap(
      cacheKey,
      async () => {
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
          distribution[review.rating as keyof typeof distribution]++;
        }

        return {
          averageRating: Math.round((sum / reviews.length) * 10) / 10,
          totalReviews: reviews.length,
          distribution,
        };
      },
      CACHE_TTL.MEDIUM,
    );
  }

  /**
   * Create a new review
   */
  async create(dto: CreateReviewDto, customerId: string) {
    // Verify product exists
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });
    if (!product || product.deleted_at) {
      throw new NotFoundException('Product not found');
    }

    // Check if customer already reviewed this product
    const existingReview = await this.prisma.review.findUnique({
      where: {
        product_id_customer_id: {
          product_id: dto.productId,
          customer_id: customerId,
        },
      },
    });

    if (existingReview) {
      throw new ConflictException('You have already reviewed this product');
    }

    // Check if customer purchased this product (for verified badge)
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
        status: 'APPROVED', // Auto-approve for now, can add moderation later
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

    // Invalidate caches
    await this.invalidateProductReviewCaches(dto.productId);

    this.logger.log(
      `Review created: ${review.id} for product ${dto.productId}`,
    );
    return this.formatReview(review);
  }

  /**
   * Update a review
   */
  async update(reviewId: string, dto: UpdateReviewDto, customerId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.customer_id !== customerId) {
      throw new ForbiddenException('You can only edit your own reviews');
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

    // Invalidate caches
    await this.invalidateProductReviewCaches(review.product_id);

    this.logger.log(`Review updated: ${reviewId}`);
    return this.formatReview(updated);
  }

  /**
   * Delete a review
   */
  async delete(reviewId: string, customerId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.customer_id !== customerId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    await this.prisma.review.delete({
      where: { id: reviewId },
    });

    // Invalidate caches
    await this.invalidateProductReviewCaches(review.product_id);

    this.logger.log(`Review deleted: ${reviewId}`);
    return { message: 'Review deleted successfully' };
  }

  /**
   * Mark a review as helpful
   */
  async markHelpful(reviewId: string, userId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    // Check if already marked
    const existing = await this.prisma.reviewHelpful.findUnique({
      where: {
        review_id_user_id: {
          review_id: reviewId,
          user_id: userId,
        },
      },
    });

    if (existing) {
      // Remove helpful vote
      await this.prisma.reviewHelpful.delete({
        where: { id: existing.id },
      });

      await this.prisma.review.update({
        where: { id: reviewId },
        data: { helpful_count: { decrement: 1 } },
      });

      return { helpful: false, helpfulCount: review.helpful_count - 1 };
    } else {
      // Add helpful vote
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

  /**
   * Get user's reviews
   */
  async getUserReviews(customerId: string) {
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

  /**
   * Format review for response
   */
  private formatReview(review: any) {
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

  /**
   * Invalidate product review caches
   */
  private async invalidateProductReviewCaches(productId: string) {
    await Promise.all([
      this.cacheService.del(CACHE_KEYS.REVIEW_STATS_BY_PRODUCT(productId)),
      // Invalidate first few pages
      this.cacheService.del(CACHE_KEYS.REVIEWS_BY_PRODUCT(productId, 0, 10)),
      this.cacheService.del(CACHE_KEYS.REVIEWS_BY_PRODUCT(productId, 1, 10)),
    ]);
  }
}
