import { ProductStatus } from './create-product.dto';
export declare class QueryProductDto {
    page?: number;
    size?: number;
    query?: string;
    category?: string;
    brand?: string;
    status?: ProductStatus;
    isFeatured?: boolean;
    inStock?: boolean;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
