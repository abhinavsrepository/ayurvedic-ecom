export declare enum PostStatus {
    DRAFT = "DRAFT",
    PUBLISHED = "PUBLISHED",
    ARCHIVED = "ARCHIVED"
}
export declare class CreatePostDto {
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    featuredImage?: string;
    category?: string;
    status?: PostStatus;
    tags?: string[];
    seoTitle?: string;
    seoDescription?: string;
}
