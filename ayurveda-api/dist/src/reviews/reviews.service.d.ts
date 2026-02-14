import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { QueryReviewDto } from './dto/query-review.dto';
export declare class ReviewsService {
    private prisma;
    private cacheService;
    private readonly logger;
    constructor(prisma: PrismaService, cacheService: CacheService);
    getProductReviews(productId: string, query: QueryReviewDto): Promise<{
        reviews: {
            id: any;
            rating: any;
            title: any;
            comment: any;
            isVerified: any;
            helpfulCount: any;
            createdAt: any;
            author: {
                id: any;
                name: string;
            };
        }[];
        stats: {
            averageRating: number;
            totalReviews: number;
            distribution: {
                1: number;
                2: number;
                3: number;
                4: number;
                5: number;
            };
        };
        pagination: {
            page: number;
            size: number;
            total: number;
            totalPages: number;
        };
    }>;
    getProductRatingStats(productId: string): Promise<{
        averageRating: number;
        totalReviews: number;
        distribution: {
            1: number;
            2: number;
            3: number;
            4: number;
            5: number;
        };
    }>;
    create(dto: CreateReviewDto, customerId: string): Promise<{
        id: any;
        rating: any;
        title: any;
        comment: any;
        isVerified: any;
        helpfulCount: any;
        createdAt: any;
        author: {
            id: any;
            name: string;
        };
    }>;
    update(reviewId: string, dto: UpdateReviewDto, customerId: string): Promise<{
        id: any;
        rating: any;
        title: any;
        comment: any;
        isVerified: any;
        helpfulCount: any;
        createdAt: any;
        author: {
            id: any;
            name: string;
        };
    }>;
    delete(reviewId: string, customerId: string): Promise<{
        message: string;
    }>;
    markHelpful(reviewId: string, userId: string): Promise<{
        helpful: boolean;
        helpfulCount: number;
    }>;
    getUserReviews(customerId: string): Promise<{
        id: string;
        rating: number;
        title: string | null;
        comment: string | null;
        isVerified: boolean;
        helpfulCount: number;
        status: string;
        createdAt: Date;
        product: {
            id: string;
            name: string;
            slug: string;
            image: string;
        };
    }[]>;
    private formatReview;
    private invalidateProductReviewCaches;
}
