/**
 * Addresses Service
 *
 * Business logic for customer address management.
 */

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { CACHE_KEYS, CACHE_TTL } from '../cache/cache.constants';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressesService {
  private readonly logger = new Logger(AddressesService.name);

  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
  ) {}

  /**
   * Get all addresses for a customer
   */
  async findAll(customerId: string) {
    const cacheKey = CACHE_KEYS.ADDRESSES_BY_CUSTOMER(customerId);

    return this.cacheService.wrap(
      cacheKey,
      async () => {
        const addresses = await this.prisma.address.findMany({
          where: { customer_id: customerId },
          orderBy: [{ is_default: 'desc' }, { created_at: 'desc' }],
        });

        return addresses.map((a) => this.formatAddress(a));
      },
      CACHE_TTL.MEDIUM,
    );
  }

  /**
   * Get single address by ID
   */
  async findOne(id: string, customerId: string) {
    const address = await this.prisma.address.findUnique({
      where: { id },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    if (address.customer_id !== customerId) {
      throw new ForbiddenException('Access denied');
    }

    return this.formatAddress(address);
  }

  /**
   * Get default address
   */
  async getDefault(customerId: string) {
    const cacheKey = CACHE_KEYS.ADDRESS_DEFAULT(customerId);

    return this.cacheService.wrap(
      cacheKey,
      async () => {
        const address = await this.prisma.address.findFirst({
          where: {
            customer_id: customerId,
            is_default: true,
          },
        });

        if (!address) {
          // Return first address if no default set
          const firstAddress = await this.prisma.address.findFirst({
            where: { customer_id: customerId },
            orderBy: { created_at: 'desc' },
          });

          return firstAddress ? this.formatAddress(firstAddress) : null;
        }

        return this.formatAddress(address);
      },
      CACHE_TTL.MEDIUM,
    );
  }

  /**
   * Create a new address
   */
  async create(dto: CreateAddressDto, customerId: string) {
    // If setting as default, unset other defaults first
    if (dto.isDefault) {
      await this.prisma.address.updateMany({
        where: { customer_id: customerId, is_default: true },
        data: { is_default: false },
      });
    }

    // Check if this is the first address - make it default
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

    // Invalidate cache
    await this.invalidateAddressCaches(customerId);

    this.logger.log(
      `Address created: ${address.id} for customer ${customerId}`,
    );
    return this.formatAddress(address);
  }

  /**
   * Update an address
   */
  async update(id: string, dto: UpdateAddressDto, customerId: string) {
    const existing = await this.prisma.address.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Address not found');
    }

    if (existing.customer_id !== customerId) {
      throw new ForbiddenException('Access denied');
    }

    // If setting as default, unset other defaults first
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

    // Invalidate cache
    await this.invalidateAddressCaches(customerId);

    this.logger.log(`Address updated: ${address.id}`);
    return this.formatAddress(address);
  }

  /**
   * Delete an address
   */
  async delete(id: string, customerId: string) {
    const address = await this.prisma.address.findUnique({
      where: { id },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    if (address.customer_id !== customerId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.address.delete({
      where: { id },
    });

    // If deleted address was default, set another one as default
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

    // Invalidate cache
    await this.invalidateAddressCaches(customerId);

    this.logger.log(`Address deleted: ${id}`);
    return { message: 'Address deleted successfully' };
  }

  /**
   * Set an address as default
   */
  async setDefault(id: string, customerId: string) {
    const address = await this.prisma.address.findUnique({
      where: { id },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    if (address.customer_id !== customerId) {
      throw new ForbiddenException('Access denied');
    }

    // Unset all defaults for this customer
    await this.prisma.address.updateMany({
      where: { customer_id: customerId, is_default: true },
      data: { is_default: false },
    });

    // Set this address as default
    const updated = await this.prisma.address.update({
      where: { id },
      data: { is_default: true },
    });

    // Invalidate cache
    await this.invalidateAddressCaches(customerId);

    this.logger.log(`Address ${id} set as default for customer ${customerId}`);
    return this.formatAddress(updated);
  }

  /**
   * Format address for response
   */
  private formatAddress(address: any) {
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

  /**
   * Get formatted full address string
   */
  private getFullAddress(address: any) {
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

  /**
   * Invalidate address caches
   */
  private async invalidateAddressCaches(customerId: string) {
    await Promise.all([
      this.cacheService.del(CACHE_KEYS.ADDRESSES_BY_CUSTOMER(customerId)),
      this.cacheService.del(CACHE_KEYS.ADDRESS_DEFAULT(customerId)),
    ]);
  }
}
