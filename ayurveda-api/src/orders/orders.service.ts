/**
 * Orders Service
 *
 * Business logic for order operations with Prisma ORM and Redis caching.
 */

import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { CACHE_KEYS, CACHE_TTL } from '../cache/cache.constants';
import { CreateOrderDto } from './dto/create-order.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
  ) {}

  /**
   * Create a new order
   * @param userId - User ID creating the order
   * @param createOrderDto - Order creation data
   */
  async createOrder(userId: string, createOrderDto: CreateOrderDto) {
    // Validate products exist and have sufficient stock
    const productIds = createOrderDto.items.map((item) => item.productId);
    const products = await this.prisma.product.findMany({
      where: {
        id: { in: productIds },
        deleted_at: null,
        status: 'ACTIVE',
      },
      include: {
        stock: true,
      },
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException('One or more products not found or not available');
    }

    // Validate stock availability
    for (const item of createOrderDto.items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        throw new BadRequestException(`Product ${item.productId} not found`);
      }

      const stock = product.stock[0];
      if (!stock || stock.quantity < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ${product.name}. Available: ${stock?.quantity || 0}`,
        );
      }
    }

    // Calculate order totals
    let subtotal = new Decimal(0);
    const orderItems = createOrderDto.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      const lineTotal = new Decimal(product.price).mul(item.quantity);
      subtotal = subtotal.add(lineTotal);

      return {
        product_id: product.id,
        sku: product.sku,
        product_name: product.name,
        quantity: item.quantity,
        unit_price: product.price,
        line_total: lineTotal,
        discount_amount: new Decimal(0),
      };
    });

    // Calculate tax and shipping (simplified - would be more complex in production)
    const taxAmount = subtotal.mul(0.1); // 10% tax
    const shippingAmount = new Decimal(10); // Flat $10 shipping
    const discountAmount = new Decimal(0); // Apply coupon logic here
    const total = subtotal.add(taxAmount).add(shippingAmount).sub(discountAmount);

    // Get or create customer
    let customer = await this.prisma.customer.findUnique({
      where: { email: userId }, // Assuming userId is email for now
    });

    if (!customer) {
      // Extract name from userId or use placeholder
      customer = await this.prisma.customer.create({
        data: {
          email: userId,
          first_name: 'Customer',
          last_name: 'User',
        },
      });
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order with items in a transaction
    const order = await this.prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          order_number: orderNumber,
          customer_id: customer.id,
          status: 'PENDING',
          payment_status: 'PENDING',
          fulfillment_status: 'UNFULFILLED',
          subtotal,
          tax_amount: taxAmount,
          shipping_amount: shippingAmount,
          discount_amount: discountAmount,
          total,
          coupon_code: createOrderDto.couponCode,
          shipping_address_line1: createOrderDto.shippingAddressLine1,
          shipping_address_line2: createOrderDto.shippingAddressLine2,
          shipping_city: createOrderDto.shippingCity,
          shipping_state: createOrderDto.shippingState,
          shipping_postal_code: createOrderDto.shippingPostalCode,
          shipping_country: createOrderDto.shippingCountry,
          utm_source: createOrderDto.utmSource,
          utm_medium: createOrderDto.utmMedium,
          utm_campaign: createOrderDto.utmCampaign,
          notes: createOrderDto.notes,
        },
        include: {
          order_items: true,
        },
      });

      // Create order items
      await tx.orderItem.createMany({
        data: orderItems.map((item) => ({
          ...item,
          order_id: newOrder.id,
        })),
      });

      // Update stock quantities
      for (const item of createOrderDto.items) {
        const product = products.find((p) => p.id === item.productId);
        await tx.stock.updateMany({
          where: { product_id: product.id },
          data: {
            quantity: { decrement: item.quantity },
            reserved_quantity: { increment: item.quantity },
          },
        });
      }

      // Update customer stats
      await tx.customer.update({
        where: { id: customer.id },
        data: {
          total_orders: { increment: 1 },
          total_spent: { increment: total },
          last_order_at: new Date(),
        },
      });

      return newOrder;
    });

    // Invalidate caches
    await this.invalidateOrderCaches(customer.id);

    this.logger.log(`Order created: ${order.id} - ${order.order_number}`);

    // Return order with items
    return this.findOne(order.id, userId);
  }

  /**
   * Find all orders for a user
   * @param userId - User ID
   * @param query - Query parameters
   */
  async findUserOrders(userId: string, query: QueryOrderDto) {
    // Get customer by email (userId)
    const customer = await this.prisma.customer.findUnique({
      where: { email: userId },
    });

    if (!customer) {
      return {
        content: [],
        total: 0,
        page: query.page,
        size: query.size,
        totalPages: 0,
      };
    }

    const cacheKey = CACHE_KEYS.ORDER_LIST(
      customer.id,
      query.page || 0,
      query.size || 20,
      JSON.stringify(query),
    );

    return this.cacheService.wrap(
      cacheKey,
      async () => {
        const { page = 0, size = 20, sortBy = 'created_at', sortOrder = 'desc', ...filters } = query;

        const where: any = {
          customer_id: customer.id,
        };

        if (filters.status) {
          where.status = filters.status;
        }

        if (filters.paymentStatus) {
          where.payment_status = filters.paymentStatus;
        }

        const [orders, total] = await Promise.all([
          this.prisma.order.findMany({
            where,
            skip: page * size,
            take: size,
            orderBy: { [sortBy]: sortOrder },
            include: {
              order_items: {
                select: {
                  id: true,
                  product_id: true,
                  sku: true,
                  product_name: true,
                  quantity: true,
                  unit_price: true,
                  line_total: true,
                },
              },
            },
          }),
          this.prisma.order.count({ where }),
        ]);

        return {
          content: orders,
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
   * Find one order by ID
   * @param id - Order ID
   * @param userId - User ID requesting the order
   */
  async findOne(id: string, userId: string) {
    const cacheKey = CACHE_KEYS.ORDER_BY_ID(id);

    return this.cacheService.wrap(
      cacheKey,
      async () => {
        const order = await this.prisma.order.findUnique({
          where: { id },
          include: {
            order_items: {
              select: {
                id: true,
                product_id: true,
                sku: true,
                product_name: true,
                quantity: true,
                unit_price: true,
                line_total: true,
                discount_amount: true,
              },
            },
            customers: {
              select: {
                id: true,
                email: true,
                first_name: true,
                last_name: true,
                phone_number: true,
              },
            },
          },
        });

        if (!order) {
          throw new NotFoundException(`Order with ID '${id}' not found`);
        }

        // Verify user has access to this order
        if (order.customers.email !== userId) {
          throw new ForbiddenException('You do not have access to this order');
        }

        return order;
      },
      CACHE_TTL.SHORT,
    );
  }

  /**
   * Cancel an order
   * @param id - Order ID
   * @param userId - User ID requesting cancellation
   */
  async cancelOrder(id: string, userId: string, reason?: string) {
    const order = await this.findOne(id, userId);

    // Only allow cancellation if order is pending or confirmed
    if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
      throw new BadRequestException(
        `Cannot cancel order with status ${order.status}. Only PENDING or CONFIRMED orders can be cancelled.`,
      );
    }

    // Update order status
    const updatedOrder = await this.prisma.$transaction(async (tx) => {
      // Cancel the order
      const cancelled = await tx.order.update({
        where: { id },
        data: {
          status: 'CANCELLED',
          cancelled_at: new Date(),
          cancelled_reason: reason || 'Cancelled by customer',
        },
        include: {
          order_items: true,
        },
      });

      // Restore stock quantities
      for (const item of cancelled.order_items) {
        await tx.stock.updateMany({
          where: { product_id: item.product_id },
          data: {
            quantity: { increment: item.quantity },
            reserved_quantity: { decrement: item.quantity },
          },
        });
      }

      return cancelled;
    });

    // Invalidate caches
    await this.invalidateOrderCaches(order.customer_id, id);

    this.logger.log(`Order cancelled: ${id} - ${order.order_number}`);
    return updatedOrder;
  }

  /**
   * Track an order
   * @param id - Order ID
   * @param userId - User ID requesting tracking info (optional for admin)
   */
  async trackOrder(id: string, userId?: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        order_number: true,
        status: true,
        payment_status: true,
        fulfillment_status: true,
        tracking_number: true,
        carrier: true,
        created_at: true,
        updated_at: true,
        shipping_address_line1: true,
        shipping_address_line2: true,
        shipping_city: true,
        shipping_state: true,
        shipping_postal_code: true,
        shipping_country: true,
        customers: {
          select: {
            email: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID '${id}' not found`);
    }

    // If userId provided, verify access
    if (userId && order.customers.email !== userId) {
      throw new ForbiddenException('You do not have access to this order');
    }

    return {
      orderNumber: order.order_number,
      status: order.status,
      paymentStatus: order.payment_status,
      fulfillmentStatus: order.fulfillment_status,
      trackingNumber: order.tracking_number,
      carrier: order.carrier,
      shippingAddress: {
        line1: order.shipping_address_line1,
        line2: order.shipping_address_line2,
        city: order.shipping_city,
        state: order.shipping_state,
        postalCode: order.shipping_postal_code,
        country: order.shipping_country,
      },
      createdAt: order.created_at,
      updatedAt: order.updated_at,
    };
  }

  /**
   * Invalidate order-related caches
   */
  private async invalidateOrderCaches(customerId?: string, orderId?: string) {
    const promises: Promise<void>[] = [];

    if (orderId) {
      promises.push(this.cacheService.del(CACHE_KEYS.ORDER_BY_ID(orderId)));
    }

    if (customerId) {
      // In production, use cache tags or patterns to invalidate all customer order lists
      promises.push(this.cacheService.del(CACHE_KEYS.CUSTOMER_BY_ID(customerId)));
    }

    await Promise.all(promises);
  }
}
