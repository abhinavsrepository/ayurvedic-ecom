export declare class CreateProductDto {
    sku: string;
    name: string;
    slug: string;
    description?: string;
    short_description?: string;
    price: number;
    compare_at_price?: number;
    cost_price?: number;
    status?: string;
    category?: string;
    brand?: string;
    weight_grams?: number;
    is_featured?: boolean;
    seo_title?: string;
    seo_description?: string;
}
