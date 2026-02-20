import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
export declare class AppController {
    private readonly appService;
    private readonly prisma;
    constructor(appService: AppService, prisma: PrismaService);
    getHello(): string;
    getHealth(): Promise<{
        status: string;
        database: string;
    }>;
    getProducts(): Promise<{
        success: boolean;
        content: {
            id: string;
            created_at: Date;
            updated_at: Date;
            version: bigint | null;
            name: string;
            description: string | null;
            sku: string;
            slug: string;
            short_description: string | null;
            price: import("@prisma/client-runtime-utils").Decimal;
            compare_at_price: import("@prisma/client-runtime-utils").Decimal | null;
            cost_price: import("@prisma/client-runtime-utils").Decimal | null;
            status: string;
            category: string | null;
            subcategory: string | null;
            brand: string | null;
            weight_grams: number | null;
            is_featured: boolean | null;
            ingredients: string | null;
            benefits: string | null;
            dosha_vata: boolean | null;
            dosha_pitta: boolean | null;
            dosha_kapha: boolean | null;
            usage_instructions: string | null;
            seo_title: string | null;
            seo_description: string | null;
            seo_keywords: string | null;
            deleted_at: Date | null;
        }[];
        totalElements: number;
        message: string;
    }>;
}
