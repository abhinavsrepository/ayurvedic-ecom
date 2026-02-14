import { PostStatus } from './create-post.dto';
export declare class QueryPostDto {
    page?: number;
    size?: number;
    category?: string;
    tag?: string;
    status?: PostStatus;
    search?: string;
}
