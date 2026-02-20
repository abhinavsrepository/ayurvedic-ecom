import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats() {
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPreviousMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1,
    );

    const [
      currentMonthOrders,
      previousMonthOrders,
      currentMonthCustomers,
      previousMonthCustomers,
      totals,
    ] = await Promise.all([
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

    const revenueGrowth = this.calculateGrowth(
      Number(currentMonthOrders._sum.total || 0),
      Number(previousMonthOrders._sum.total || 0),
    );
    const ordersGrowth = this.calculateGrowth(
      currentMonthOrders._count,
      previousMonthOrders._count,
    );
    const customersGrowth = this.calculateGrowth(
      currentMonthCustomers,
      previousMonthCustomers,
    );
    const aovGrowth = this.calculateGrowth(
      Number(currentMonthOrders._avg.total || 0),
      Number(previousMonthOrders._avg.total || 0),
    );

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

  private calculateGrowth(current: number, previous: number): number {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }
    return Number((((current - previous) / previous) * 100).toFixed(2));
  }
}
