import { PrismaService } from '../prisma/prisma.service';
export declare class AdminService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(): Promise<{
        totalRevenue: number;
        totalOrders: number;
        totalCustomers: number;
        averageOrderValue: number;
        revenueGrowth: number;
        ordersGrowth: number;
        customersGrowth: number;
        aovGrowth: number;
    }>;
    private calculateGrowth;
}
