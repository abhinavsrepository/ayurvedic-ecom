import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { QueryPostDto } from './dto/query-post.dto';
export declare class BlogService {
    private prisma;
    private cacheService;
    private readonly logger;
    constructor(prisma: PrismaService, cacheService: CacheService);
    findAll(query: QueryPostDto, isAdmin?: boolean): Promise<{
        content: any[];
        pagination: {
            page: number;
            size: number;
            total: number;
            totalPages: number;
        };
    }>;
    private fetchPosts;
    findBySlug(slug: string): Promise<any>;
    findById(id: string): Promise<any>;
    getCategories(): Promise<{
        name: string | null;
        count: number;
    }[]>;
    getTags(): Promise<{
        name: string;
        count: number;
    }[]>;
    create(dto: CreatePostDto, authorId: string): Promise<any>;
    update(id: string, dto: UpdatePostDto): Promise<any>;
    delete(id: string): Promise<{
        message: string;
    }>;
    private formatPost;
    private invalidateBlogCaches;
}
