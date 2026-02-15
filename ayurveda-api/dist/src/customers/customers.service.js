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
var CustomersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const cache_service_1 = require("../cache/cache.service");
const cache_constants_1 = require("../cache/cache.constants");
let CustomersService = CustomersService_1 = class CustomersService {
    prisma;
    cacheService;
    logger = new common_1.Logger(CustomersService_1.name);
    constructor(prisma, cacheService) {
        this.prisma = prisma;
        this.cacheService = cacheService;
    }
    async findAll(query) {
        const cacheKey = cache_constants_1.CACHE_KEYS.CUSTOMER_LIST(query.page || 0, query.size || 20, JSON.stringify(query));
        return this.cacheService.wrap(cacheKey, async () => {
            const { page = 0, size = 20, sortBy = 'created_at', sortOrder = 'desc', ...filters } = query;
            const where = {
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
        }, cache_constants_1.CACHE_TTL.SHORT);
    }
    async findOne(id) {
        const cacheKey = cache_constants_1.CACHE_KEYS.CUSTOMER_BY_ID(id);
        return this.cacheService.wrap(cacheKey, async () => {
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
                        take: 10,
                    },
                },
            });
            if (!customer) {
                throw new common_1.NotFoundException(`Customer with ID '${id}' not found`);
            }
            return customer;
        }, cache_constants_1.CACHE_TTL.MEDIUM);
    }
    async update(id, updateCustomerDto) {
        await this.findOne(id);
        if (updateCustomerDto.email) {
            const existing = await this.prisma.customer.findFirst({
                where: {
                    email: updateCustomerDto.email,
                    NOT: { id },
                    deleted_at: null,
                },
            });
            if (existing) {
                throw new common_1.ConflictException(`Customer with email '${updateCustomerDto.email}' already exists`);
            }
        }
        const customer = await this.prisma.customer.update({
            where: { id },
            data: updateCustomerDto,
        });
        await this.invalidateCustomerCaches(id);
        this.logger.log(`Customer updated: ${customer.id} - ${customer.email}`);
        return customer;
    }
    async getCustomerStats(id) {
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
    async search(query, queryDto) {
        const { page = 0, size = 20, sortBy = 'created_at', sortOrder = 'desc', } = queryDto;
        const where = {
            deleted_at: null,
            OR: [
                { email: { contains: query, mode: 'insensitive' } },
                { first_name: { contains: query, mode: 'insensitive' } },
                { last_name: { contains: query, mode: 'insensitive' } },
            ],
        };
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
                    created_at: true,
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
    }
    async export(queryDto) {
        const { page = 0, size = 20, sortBy = 'created_at', sortOrder = 'desc', ...filters } = queryDto;
        const where = {
            deleted_at: null,
        };
        if (filters.query) {
            where.OR = [
                { email: { contains: filters.query, mode: 'insensitive' } },
                { first_name: { contains: filters.query, mode: 'insensitive' } },
                { last_name: { contains: filters.query, mode: 'insensitive' } },
            ];
        }
        const customers = await this.prisma.customer.findMany({
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
                created_at: true,
            },
        });
        return customers;
    }
    async invalidateCustomerCaches(id) {
        const promises = [];
        if (id) {
            promises.push(this.cacheService.del(cache_constants_1.CACHE_KEYS.CUSTOMER_BY_ID(id)));
        }
        await Promise.all(promises);
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = CustomersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cache_service_1.CacheService])
], CustomersService);
//# sourceMappingURL=customers.service.js.map