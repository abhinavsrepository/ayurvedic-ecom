import { PostStatus } from './create-post.dto';
export declare class UpdatePostDto {
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    featuredImage?: string;
    category?: string;
    status?: PostStatus;
    tags?: string[];
    seoTitle?: string;
    seoDescription?: string;
}
