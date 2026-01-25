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
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CustomersService = class CustomersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { page = 0, size = 20, query: search, sortBy = 'created_at', sortOrder = 'desc' } = query;
        const skip = page * size;
        const where = search
            ? {
                OR: [
                    { full_name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                ],
            }
            : {};
        const [customers, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take: size,
                orderBy: { [sortBy]: sortOrder },
                select: {
                    id: true,
                    email: true,
                    full_name: true,
                    created_at: true,
                    updated_at: true,
                },
            }),
            this.prisma.user.count({ where }),
        ]);
        return {
            customers,
            total,
            page,
            totalPages: Math.ceil(total / size),
        };
    }
    async findOne(id) {
        const customer = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                full_name: true,
                created_at: true,
                updated_at: true,
            },
        });
        if (!customer) {
            throw new common_1.NotFoundException(`Customer with ID ${id} not found`);
        }
        return customer;
    }
    async update(id, updateCustomerDto) {
        await this.findOne(id);
        const customer = await this.prisma.user.update({
            where: { id },
            data: updateCustomerDto,
            select: {
                id: true,
                email: true,
                full_name: true,
                created_at: true,
                updated_at: true,
            },
        });
        return customer;
    }
    async getCustomerStats(id) {
        await this.findOne(id);
        return {
            customerId: id,
            totalOrders: 0,
            totalSpent: 0,
            lastOrderDate: null,
        };
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CustomersService);
//# sourceMappingURL=customers.service.js.map