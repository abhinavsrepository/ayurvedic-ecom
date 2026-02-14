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
var AddressesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const cache_service_1 = require("../cache/cache.service");
const cache_constants_1 = require("../cache/cache.constants");
let AddressesService = AddressesService_1 = class AddressesService {
    prisma;
    cacheService;
    logger = new common_1.Logger(AddressesService_1.name);
    constructor(prisma, cacheService) {
        this.prisma = prisma;
        this.cacheService = cacheService;
    }
    async findAll(customerId) {
        const cacheKey = cache_constants_1.CACHE_KEYS.ADDRESSES_BY_CUSTOMER(customerId);
        return this.cacheService.wrap(cacheKey, async () => {
            const addresses = await this.prisma.address.findMany({
                where: { customer_id: customerId },
                orderBy: [{ is_default: 'desc' }, { created_at: 'desc' }],
            });
            return addresses.map((a) => this.formatAddress(a));
        }, cache_constants_1.CACHE_TTL.MEDIUM);
    }
    async findOne(id, customerId) {
        const address = await this.prisma.address.findUnique({
            where: { id },
        });
        if (!address) {
            throw new common_1.NotFoundException('Address not found');
        }
        if (address.customer_id !== customerId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.formatAddress(address);
    }
    async getDefault(customerId) {
        const cacheKey = cache_constants_1.CACHE_KEYS.ADDRESS_DEFAULT(customerId);
        return this.cacheService.wrap(cacheKey, async () => {
            const address = await this.prisma.address.findFirst({
                where: {
                    customer_id: customerId,
                    is_default: true,
                },
            });
            if (!address) {
                const firstAddress = await this.prisma.address.findFirst({
                    where: { customer_id: customerId },
                    orderBy: { created_at: 'desc' },
                });
                return firstAddress ? this.formatAddress(firstAddress) : null;
            }
            return this.formatAddress(address);
        }, cache_constants_1.CACHE_TTL.MEDIUM);
    }
    async create(dto, customerId) {
        if (dto.isDefault) {
            await this.prisma.address.updateMany({
                where: { customer_id: customerId, is_default: true },
                data: { is_default: false },
            });
        }
        const addressCount = await this.prisma.address.count({
            where: { customer_id: customerId },
        });
        const address = await this.prisma.address.create({
            data: {
                customer_id: customerId,
                label: dto.label,
                first_name: dto.firstName,
                last_name: dto.lastName,
                phone: dto.phone,
                address_line1: dto.addressLine1,
                address_line2: dto.addressLine2,
                city: dto.city,
                state: dto.state,
                postal_code: dto.postalCode,
                country: dto.country || 'India',
                is_default: dto.isDefault || addressCount === 0,
                address_type: dto.addressType || 'SHIPPING',
            },
        });
        await this.invalidateAddressCaches(customerId);
        this.logger.log(`Address created: ${address.id} for customer ${customerId}`);
        return this.formatAddress(address);
    }
    async update(id, dto, customerId) {
        const existing = await this.prisma.address.findUnique({
            where: { id },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Address not found');
        }
        if (existing.customer_id !== customerId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        if (dto.isDefault && !existing.is_default) {
            await this.prisma.address.updateMany({
                where: { customer_id: customerId, is_default: true },
                data: { is_default: false },
            });
        }
        const address = await this.prisma.address.update({
            where: { id },
            data: {
                label: dto.label,
                first_name: dto.firstName,
                last_name: dto.lastName,
                phone: dto.phone,
                address_line1: dto.addressLine1,
                address_line2: dto.addressLine2,
                city: dto.city,
                state: dto.state,
                postal_code: dto.postalCode,
                country: dto.country,
                is_default: dto.isDefault,
                address_type: dto.addressType,
                updated_at: new Date(),
            },
        });
        await this.invalidateAddressCaches(customerId);
        this.logger.log(`Address updated: ${address.id}`);
        return this.formatAddress(address);
    }
    async delete(id, customerId) {
        const address = await this.prisma.address.findUnique({
            where: { id },
        });
        if (!address) {
            throw new common_1.NotFoundException('Address not found');
        }
        if (address.customer_id !== customerId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        await this.prisma.address.delete({
            where: { id },
        });
        if (address.is_default) {
            const firstAddress = await this.prisma.address.findFirst({
                where: { customer_id: customerId },
                orderBy: { created_at: 'desc' },
            });
            if (firstAddress) {
                await this.prisma.address.update({
                    where: { id: firstAddress.id },
                    data: { is_default: true },
                });
            }
        }
        await this.invalidateAddressCaches(customerId);
        this.logger.log(`Address deleted: ${id}`);
        return { message: 'Address deleted successfully' };
    }
    async setDefault(id, customerId) {
        const address = await this.prisma.address.findUnique({
            where: { id },
        });
        if (!address) {
            throw new common_1.NotFoundException('Address not found');
        }
        if (address.customer_id !== customerId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        await this.prisma.address.updateMany({
            where: { customer_id: customerId, is_default: true },
            data: { is_default: false },
        });
        const updated = await this.prisma.address.update({
            where: { id },
            data: { is_default: true },
        });
        await this.invalidateAddressCaches(customerId);
        this.logger.log(`Address ${id} set as default for customer ${customerId}`);
        return this.formatAddress(updated);
    }
    formatAddress(address) {
        return {
            id: address.id,
            label: address.label,
            firstName: address.first_name,
            lastName: address.last_name,
            phone: address.phone,
            addressLine1: address.address_line1,
            addressLine2: address.address_line2,
            city: address.city,
            state: address.state,
            postalCode: address.postal_code,
            country: address.country,
            isDefault: address.is_default,
            addressType: address.address_type,
            fullAddress: this.getFullAddress(address),
            createdAt: address.created_at,
            updatedAt: address.updated_at,
        };
    }
    getFullAddress(address) {
        const parts = [
            address.address_line1,
            address.address_line2,
            address.city,
            address.state,
            address.postal_code,
            address.country,
        ].filter(Boolean);
        return parts.join(', ');
    }
    async invalidateAddressCaches(customerId) {
        await Promise.all([
            this.cacheService.del(cache_constants_1.CACHE_KEYS.ADDRESSES_BY_CUSTOMER(customerId)),
            this.cacheService.del(cache_constants_1.CACHE_KEYS.ADDRESS_DEFAULT(customerId)),
        ]);
    }
};
exports.AddressesService = AddressesService;
exports.AddressesService = AddressesService = AddressesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cache_service_1.CacheService])
], AddressesService);
//# sourceMappingURL=addresses.service.js.map