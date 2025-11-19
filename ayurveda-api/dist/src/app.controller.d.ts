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
            sku: string;
            name: string;
            slug: string;
            description: string | null;
            short_description: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            compare_at_price: import("@prisma/client/runtime/library").Decimal | null;
            cost_price: import("@prisma/client/runtime/library").Decimal | null;
            status: string;
            category: string | null;
            brand: string | null;
            weight_grams: number | null;
            is_featured: boolean | null;
            seo_title: string | null;
            seo_description: string | null;
            deleted_at: Date | null;
            created_at: Date;
            updated_at: Date;
            version: bigint | null;
        }[];
        totalElements: number;
        message: string;
    }>;
}
