export declare enum ProductStatus {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    ARCHIVED = "ARCHIVED"
}
export declare class CreateProductDto {
    name: string;
    slug: string;
    sku: string;
    description?: string;
    short_description?: string;
    price: number;
    compare_at_price?: number;
    cost_price?: number;
    status: ProductStatus;
    category?: string;
    brand?: string;
    weight_grams?: number;
    is_featured?: boolean;
    seo_title?: string;
    seo_description?: string;
    ingredients?: string[];
    benefits?: string[];
    usage?: string;
    images?: string[];
}
declare const UpdateProductDto_base: import("@nestjs/common").Type<Partial<CreateProductDto>>;
export declare class UpdateProductDto extends UpdateProductDto_base {
}
export declare class ProductQueryDto {
    search?: string;
    status?: ProductStatus;
    category?: string;
    is_featured?: boolean;
    page?: number;
    size?: number;
    sort?: string;
}
export declare class ProductResponseDto {
    id: string;
    sku: string;
    name: string;
    slug: string;
    description?: string;
    short_description?: string;
    price: number;
    compare_at_price?: number;
    cost_price?: number;
    status: string;
    category?: string;
    brand?: string;
    weight_grams?: number;
    is_featured: boolean;
    seo_title?: string;
    seo_description?: string;
    created_at: Date;
    updated_at: Date;
    stock?: {
        quantity: number;
        reserved_quantity: number;
        available: number;
    };
}
export {};
