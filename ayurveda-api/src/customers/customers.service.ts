/**
 * Customers Service
 *
 * Business logic for customer operations with Prisma ORM and Redis caching.
 */

import {
  Injectable,
  NotFoundException,
  Logger,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { CACHE_KEYS, CACHE_TTL } from '../cache/cache.constants';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { QueryCustomerDto } from './dto/query-customer.dto';

@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name);

  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
  ) {}

  /**
   * Find all customers with pagination and filters
   * @param query - Query parameters
   */
  async findAll(query: QueryCustomerDto) {
    const cacheKey = CACHE_KEYS.CUSTOMER_LIST(
      query.page || 0,
      query.size || 20,
      JSON.stringify(query),
    );

    return this.cacheService.wrap(
      cacheKey,
      async () => {
        const { page = 0, size = 20, sortBy = 'created_at', sortOrder = 'desc', ...filters } = query;

        const where: any = {
          deleted_at: null,
        };

        if (filters.query) {
          where.OR = [
            { email: { contains: filters.query, mode: 'insensitive' } },
            { first_name: { contains: filters.query, mode: 'insensitive' } },
            { last_name: { contains: filters.query, mode: 'insensitive' } },
          ];
        }

        const [customers, total] = await Promise.all([
          this.prisma.customer.findMany({
            where,
            skip: page * size,
            take: size,
            orderBy: { [sortBy]: sortOrder },
            select: {
              id: true,
              email: true,
              first_name: true,
              last_name: true,
              phone_number: true,
              total_orders: true,
              total_spent: true,
              lifetime_value: true,
              average_order_value: true,
              last_order_at: true,
              accepts_marketing: true,
              created_at: true,
              updated_at: true,
            },
          }),
          this.prisma.customer.count({ where }),
        ]);

        return {
          content: customers,
          total,
          page,
          size,
          totalPages: Math.ceil(total / size),
        };
      },
      CACHE_TTL.SHORT,
    );
  }

  /**
   * Find one customer by ID
   * @param id - Customer ID
   */
  async findOne(id: string) {
    const cacheKey = CACHE_KEYS.CUSTOMER_BY_ID(id);

    return this.cacheService.wrap(
      cacheKey,
      async () => {
        const customer = await this.prisma.customer.findUnique({
          where: { id, deleted_at: null },
          include: {
            orders: {
              select: {
                id: true,
                order_number: true,
                status: true,
                payment_status: true,
                total: true,
                created_at: true,
              },
              orderBy: {
                created_at: 'desc',
              },
              take: 10, // Last 10 orders
            },
          },
        });

        if (!customer) {
          throw new NotFoundException(`Customer with ID '${id}' not found`);
        }

        return customer;
      },
      CACHE_TTL.MEDIUM,
    );
  }

  /**
   * Update customer
   * @param id - Customer ID
   * @param updateCustomerDto - Update data
   */
  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    // Check if customer exists
    await this.findOne(id);

    // Check email uniqueness if updating email
    if (updateCustomerDto.email) {
      const existing = await this.prisma.customer.findFirst({
        where: {
          email: updateCustomerDto.email,
          NOT: { id },
          deleted_at: null,
        },
      });

      if (existing) {
        throw new ConflictException(`Customer with email '${updateCustomerDto.email}' already exists`);
      }
    }

    const customer = await this.prisma.customer.update({
      where: { id },
      data: updateCustomerDto,
    });

    // Invalidate caches
    await this.invalidateCustomerCaches(id);

    this.logger.log(`Customer updated: ${customer.id} - ${customer.email}`);
    return customer;
  }

  /**
   * Get customer statistics
   * @param id - Customer ID
   */
  async getCustomerStats(id: string) {
    const customer = await this.findOne(id);

    const [orderStats, recentOrders] = await Promise.all([
      this.prisma.order.aggregate({
        where: {
          customer_id: id,
          status: { not: 'CANCELLED' },
        },
        _count: true,
        _sum: {
          total: true,
        },
        _avg: {
          total: true,
        },
      }),
      this.prisma.order.findMany({
        where: { customer_id: id },
        orderBy: { created_at: 'desc' },
        take: 5,
        select: {
          id: true,
          order_number: true,
          status: true,
          total: true,
          created_at: true,
        },
      }),
    ]);

    return {
      customer: {
        id: customer.id,
        email: customer.email,
        firstName: customer.first_name,
        lastName: customer.last_name,
        phoneNumber: customer.phone_number,
      },
      stats: {
        totalOrders: orderStats._count,
        totalSpent: orderStats._sum.total || 0,
        averageOrderValue: orderStats._avg.total || 0,
        lifetimeValue: customer.lifetime_value || 0,
        lastOrderAt: customer.last_order_at,
      },
      recentOrders,
    };
  }

  /**
   * Invalidate customer-related caches
   */
  private async invalidateCustomerCaches(id?: string) {
    const promises: Promise<void>[] = [];

    if (id) {
      promises.push(this.cacheService.del(CACHE_KEYS.CUSTOMER_BY_ID(id)));
    }

    // Invalidate list caches (simplified - in production, use cache tags)
    // Add list cache pattern invalidation here if needed

    await Promise.all(promises);
  }
}
