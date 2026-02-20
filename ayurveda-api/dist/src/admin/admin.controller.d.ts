import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
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
}
