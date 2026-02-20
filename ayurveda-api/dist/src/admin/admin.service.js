"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats() {
        const now = new Date();
        const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const [currentMonthOrders, previousMonthOrders, currentMonthCustomers, previousMonthCustomers, totals,] = await Promise.all([
            this.prisma.order.aggregate({
                where: { created_at: { gte: startOfCurrentMonth } },
                _count: true,
                _sum: { total: true },
                _avg: { total: true },
            }),
            this.prisma.order.aggregate({
                where: {
                    created_at: {
                        gte: startOfPreviousMonth,
                        lt: startOfCurrentMonth,
                    },
                },
                _count: true,
                _sum: { total: true },
                _avg: { total: true },
            }),
            this.prisma.customer.count({
                where: { created_at: { gte: startOfCurrentMonth }, deleted_at: null },
            }),
            this.prisma.customer.count({
                where: {
                    created_at: {
                        gte: startOfPreviousMonth,
                        lt: startOfCurrentMonth,
                    },
                    deleted_at: null,
                },
            }),
            Promise.all([
                this.prisma.order.aggregate({
                    _count: true,
                    _sum: { total: true },
                    _avg: { total: true },
                }),
                this.prisma.customer.count({ where: { deleted_at: null } }),
            ]),
        ]);
        const [allOrders, allCustomers] = totals;
        const revenueGrowth = this.calculateGrowth(Number(currentMonthOrders._sum.total || 0), Number(previousMonthOrders._sum.total || 0));
        const ordersGrowth = this.calculateGrowth(currentMonthOrders._count, previousMonthOrders._count);
        const customersGrowth = this.calculateGrowth(currentMonthCustomers, previousMonthCustomers);
        const aovGrowth = this.calculateGrowth(Number(currentMonthOrders._avg.total || 0), Number(previousMonthOrders._avg.total || 0));
        return {
            totalRevenue: Number(allOrders._sum.total || 0),
            totalOrders: allOrders._count,
            totalCustomers: allCustomers,
            averageOrderValue: Number(allOrders._avg.total || 0),
            revenueGrowth,
            ordersGrowth,
            customersGrowth,
            aovGrowth,
        };
    }
    calculateGrowth(current, previous) {
        if (previous === 0) {
            return current > 0 ? 100 : 0;
        }
        return Number((((current - previous) / previous) * 100).toFixed(2));
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map