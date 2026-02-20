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
var OrdersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const cache_service_1 = require("../cache/cache.service");
const cache_constants_1 = require("../cache/cache.constants");
const client_1 = require("@prisma/client");
let OrdersService = OrdersService_1 = class OrdersService {
    prisma;
    cacheService;
    logger = new common_1.Logger(OrdersService_1.name);
    constructor(prisma, cacheService) {
        this.prisma = prisma;
        this.cacheService = cacheService;
    }
    async createOrder(userId, createOrderDto) {
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
            throw new common_1.BadRequestException('One or more products not found or not available');
        }
        for (const item of createOrderDto.items) {
            const product = products.find((p) => p.id === item.productId);
            if (!product) {
                throw new common_1.BadRequestException(`Product ${item.productId} not found`);
            }
            const stock = product.stock[0];
            if (!stock || stock.quantity < item.quantity) {
                throw new common_1.BadRequestException(`Insufficient stock for product ${product.name}. Available: ${stock?.quantity || 0}`);
            }
        }
        let subtotal = new client_1.Prisma.Decimal(0);
        const orderItems = createOrderDto.items.map((item) => {
            const product = products.find((p) => p.id === item.productId);
            const lineTotal = new client_1.Prisma.Decimal(product.price.toString()).mul(item.quantity);
            subtotal = subtotal.add(lineTotal);
            return {
                product_id: product.id,
                sku: product.sku,
                product_name: product.name,
                quantity: item.quantity,
                unit_price: product.price,
                line_total: lineTotal,
                discount_amount: new client_1.Prisma.Decimal(0),
            };
        });
        const taxAmount = subtotal.mul(0.1);
        const shippingAmount = new client_1.Prisma.Decimal(10);
        const discountAmount = new client_1.Prisma.Decimal(0);
        const total = subtotal
            .add(taxAmount)
            .add(shippingAmount)
            .sub(discountAmount);
        let customer = await this.prisma.customer.findUnique({
            where: { email: userId },
        });
        if (!customer) {
            customer = await this.prisma.customer.create({
                data: {
                    email: userId,
                    first_name: 'Customer',
                    last_name: 'User',
                },
            });
        }
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        const order = await this.prisma.$transaction(async (tx) => {
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
            await tx.orderItem.createMany({
                data: orderItems.map((item) => ({
                    ...item,
                    order_id: newOrder.id,
                })),
            });
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
        await this.invalidateOrderCaches(customer.id);
        this.logger.log(`Order created: ${order.id} - ${order.order_number}`);
        return this.findOne(order.id, userId);
    }
    async findUserOrders(userId, query) {
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
        const cacheKey = cache_constants_1.CACHE_KEYS.ORDER_LIST(customer.id, query.page || 0, query.size || 20, JSON.stringify(query));
        return this.cacheService.wrap(cacheKey, async () => {
            const { page = 0, size = 20, sortBy = 'created_at', sortOrder = 'desc', ...filters } = query;
            const where = {
                customer_id: customer.id,
            };
            if (filters.status) {
                where.status = filters.status;
            }
            if (filters.paymentStatus) {
                where.payment_status = filters.paymentStatus;
            }
            if (filters.fulfillmentStatus) {
                where.fulfillment_status = filters.fulfillmentStatus;
            }
            if (filters.fromDate || filters.toDate) {
                where.created_at = {};
                if (filters.fromDate) {
                    where.created_at.gte = new Date(filters.fromDate);
                }
                if (filters.toDate) {
                    where.created_at.lte = new Date(filters.toDate);
                }
            }
            if (filters.q) {
                where.OR = [
                    { order_number: { contains: filters.q, mode: 'insensitive' } },
                    {
                        order_items: {
                            some: {
                                product_name: { contains: filters.q, mode: 'insensitive' },
                            },
                        },
                    },
                ];
            }
            const [orders, total] = await Promise.all([
                this.prisma.order.findMany({
                    where,
                    skip: page * size,
                    take: size,
                    orderBy: {
                        [sortBy === 'createdAt' ? 'created_at' : sortBy]: sortOrder,
                    },
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
            const totalPages = Math.ceil(total / size);
            return {
                content: orders,
                total,
                totalElements: total,
                page,
                number: page,
                size,
                totalPages,
                first: page === 0,
                last: page >= Math.max(totalPages - 1, 0),
                numberOfElements: orders.length,
                empty: orders.length === 0,
            };
        }, cache_constants_1.CACHE_TTL.SHORT);
    }
    async findAllOrders(query) {
        const { page = 0, size = 20, sortBy = 'created_at', sortOrder = 'desc', ...filters } = query;
        const where = {};
        if (filters.status) {
            where.status = filters.status;
        }
        if (filters.paymentStatus) {
            where.payment_status = filters.paymentStatus;
        }
        if (filters.fulfillmentStatus) {
            where.fulfillment_status = filters.fulfillmentStatus;
        }
        if (filters.customerEmail) {
            where.customers = {
                is: {
                    email: {
                        contains: filters.customerEmail,
                        mode: 'insensitive',
                    },
                },
            };
        }
        if (filters.fromDate || filters.toDate) {
            where.created_at = {};
            if (filters.fromDate) {
                where.created_at.gte = new Date(filters.fromDate);
            }
            if (filters.toDate) {
                where.created_at.lte = new Date(filters.toDate);
            }
        }
        if (filters.q) {
            where.OR = [
                { order_number: { contains: filters.q, mode: 'insensitive' } },
                {
                    customers: {
                        is: {
                            email: { contains: filters.q, mode: 'insensitive' },
                        },
                    },
                },
            ];
        }
        const [orders, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                skip: page * size,
                take: size,
                orderBy: {
                    [sortBy === 'createdAt' ? 'created_at' : sortBy]: sortOrder,
                },
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
                    customers: {
                        select: {
                            id: true,
                            email: true,
                            first_name: true,
                            last_name: true,
                        },
                    },
                },
            }),
            this.prisma.order.count({ where }),
        ]);
        const totalPages = Math.ceil(total / size);
        return {
            content: orders,
            total,
            totalElements: total,
            page,
            number: page,
            size,
            totalPages,
            first: page === 0,
            last: page >= Math.max(totalPages - 1, 0),
            numberOfElements: orders.length,
            empty: orders.length === 0,
        };
    }
    async findOne(id, userId) {
        const cacheKey = cache_constants_1.CACHE_KEYS.ORDER_BY_ID(id);
        return this.cacheService.wrap(cacheKey, async () => {
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
                throw new common_1.NotFoundException(`Order with ID '${id}' not found`);
            }
            if (order.customers.email !== userId) {
                throw new common_1.ForbiddenException('You do not have access to this order');
            }
            return order;
        }, cache_constants_1.CACHE_TTL.SHORT);
    }
    async findOneAdmin(id) {
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
            throw new common_1.NotFoundException(`Order with ID '${id}' not found`);
        }
        return order;
    }
    async cancelOrder(id, userId, reason) {
        const order = await this.findOne(id, userId);
        if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
            throw new common_1.BadRequestException(`Cannot cancel order with status ${order.status}. Only PENDING or CONFIRMED orders can be cancelled.`);
        }
        const updatedOrder = await this.prisma.$transaction(async (tx) => {
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
        await this.invalidateOrderCaches(order.customer_id, id);
        this.logger.log(`Order cancelled: ${id} - ${order.order_number}`);
        return updatedOrder;
    }
    async cancelOrderAdmin(id, reason) {
        const order = await this.findOneAdmin(id);
        if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
            throw new common_1.BadRequestException(`Cannot cancel order with status ${order.status}. Only PENDING or CONFIRMED orders can be cancelled.`);
        }
        const updatedOrder = await this.prisma.$transaction(async (tx) => {
            const cancelled = await tx.order.update({
                where: { id },
                data: {
                    status: 'CANCELLED',
                    cancelled_at: new Date(),
                    cancelled_reason: reason || 'Cancelled by admin',
                },
                include: {
                    order_items: true,
                },
            });
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
        await this.invalidateOrderCaches(order.customer_id, id);
        this.logger.log(`Order cancelled by admin: ${id} - ${order.order_number}`);
        return updatedOrder;
    }
    async trackOrder(id, userId) {
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
            throw new common_1.NotFoundException(`Order with ID '${id}' not found`);
        }
        if (userId && order.customers.email !== userId) {
            throw new common_1.ForbiddenException('You do not have access to this order');
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
    async updateOrderStatus(id, updates) {
        await this.findOneAdmin(id);
        const order = await this.prisma.order.update({
            where: { id },
            data: {
                status: updates.status?.toUpperCase(),
                payment_status: updates.paymentStatus?.toUpperCase(),
                tracking_number: updates.trackingNumber,
                carrier: updates.carrier,
                notes: updates.notes,
                updated_at: new Date(),
            },
            include: {
                order_items: true,
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
        await this.invalidateOrderCaches(order.customer_id, id);
        return order;
    }
    async processRefund(id, amount, reason, adminUserId) {
        const order = await this.findOneAdmin(id);
        const orderTotal = Number(order.total);
        if (!['PAID', 'REFUNDED', 'PARTIALLY_REFUNDED'].includes(order.payment_status)) {
            throw new common_1.BadRequestException('Order is not in a refundable payment state');
        }
        if (amount <= 0 || amount > orderTotal) {
            throw new common_1.BadRequestException('Refund amount is invalid');
        }
        const updatedOrder = await this.prisma.order.update({
            where: { id },
            data: {
                payment_status: amount >= orderTotal ? 'REFUNDED' : 'PARTIALLY_REFUNDED',
                status: amount >= orderTotal ? 'REFUNDED' : order.status,
                cancelled_reason: reason || 'Refund processed by admin',
                notes: `Refund of ${amount} processed by ${adminUserId}`,
                updated_at: new Date(),
            },
            include: {
                order_items: true,
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
        await this.invalidateOrderCaches(order.customer_id, id);
        return updatedOrder;
    }
    async searchOrders(query, queryDto) {
        return this.findAllOrders({
            ...queryDto,
            q: query,
        });
    }
    async export(queryDto) {
        const { page = 0, size = 20, sortBy = 'created_at', sortOrder = 'desc', ...filters } = queryDto;
        const where = {};
        if (filters.status) {
            where.status = filters.status;
        }
        if (filters.paymentStatus) {
            where.payment_status = filters.paymentStatus;
        }
        if (filters.fulfillmentStatus) {
            where.fulfillment_status = filters.fulfillmentStatus;
        }
        if (filters.fromDate || filters.toDate) {
            where.created_at = {};
            if (filters.fromDate) {
                where.created_at.gte = new Date(filters.fromDate);
            }
            if (filters.toDate) {
                where.created_at.lte = new Date(filters.toDate);
            }
        }
        if (filters.customerEmail) {
            where.customers = {
                is: {
                    email: {
                        contains: filters.customerEmail,
                        mode: 'insensitive',
                    },
                },
            };
        }
        if (filters.q) {
            where.OR = [
                { order_number: { contains: filters.q, mode: 'insensitive' } },
                {
                    customers: {
                        is: {
                            email: { contains: filters.q, mode: 'insensitive' },
                        },
                    },
                },
            ];
        }
        const orders = await this.prisma.order.findMany({
            where,
            skip: page * size,
            take: size,
            orderBy: { [sortBy]: sortOrder },
            select: {
                id: true,
                order_number: true,
                status: true,
                payment_status: true,
                total: true,
                subtotal: true,
                tax_amount: true,
                shipping_amount: true,
                discount_amount: true,
                order_items: {
                    select: {
                        product_name: true,
                        quantity: true,
                        unit_price: true,
                        line_total: true,
                    },
                },
                customer_id: true,
                created_at: true,
                updated_at: true,
                tracking_number: true,
                carrier: true,
                shipping_address_line1: true,
                shipping_address_line2: true,
                shipping_city: true,
                shipping_state: true,
                shipping_postal_code: true,
                shipping_country: true,
            },
        });
        return orders;
    }
    async invalidateOrderCaches(customerId, orderId) {
        const promises = [];
        if (orderId) {
            promises.push(this.cacheService.del(cache_constants_1.CACHE_KEYS.ORDER_BY_ID(orderId)));
        }
        if (customerId) {
            promises.push(this.cacheService.del(cache_constants_1.CACHE_KEYS.CUSTOMER_BY_ID(customerId)));
        }
        await Promise.all(promises);
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = OrdersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cache_service_1.CacheService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map