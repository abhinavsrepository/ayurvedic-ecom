export declare enum ProductStatus {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    ARCHIVED = "ARCHIVED"
}
export declare class ProductImageDto {
    url: string;
    altText: string;
    order?: number;
}
export declare class CreateProductDto {
    name: string;
    slug: string;
    description: string;
    shortDescription?: string;
    price: number;
    compareAtPrice?: number;
    costPerItem?: number;
    stockQuantity: number;
    sku: string;
    barcode?: string;
    category?: string;
    subcategory?: string;
    brand?: string;
    ingredients?: string;
    benefits?: string;
    doshaVata?: boolean;
    doshaPitta?: boolean;
    doshaKapha?: boolean;
    usageInstructions?: string;
    tags?: string[];
    images?: ProductImageDto[];
    weightGrams?: number;
    status?: ProductStatus;
    isFeatured?: boolean;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    rating?: number;
    reviewCount?: number;
}
