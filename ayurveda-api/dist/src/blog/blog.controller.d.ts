import { BlogService } from './blog.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { QueryPostDto } from './dto/query-post.dto';
export declare class BlogController {
    private readonly blogService;
    constructor(blogService: BlogService);
    findAll(query: QueryPostDto): Promise<{
        content: any[];
        pagination: {
            page: number;
            size: number;
            total: number;
            totalPages: number;
        };
    }>;
    findBySlug(slug: string): Promise<any>;
    getCategories(): Promise<{
        name: string | null;
        count: number;
    }[]>;
    getTags(): Promise<{
        name: string;
        count: number;
    }[]>;
    findAllAdmin(query: QueryPostDto): Promise<{
        content: any[];
        pagination: {
            page: number;
            size: number;
            total: number;
            totalPages: number;
        };
    }>;
    findById(id: string): Promise<any>;
    create(dto: CreatePostDto, authorId: string): Promise<any>;
    update(id: string, dto: UpdatePostDto): Promise<any>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
