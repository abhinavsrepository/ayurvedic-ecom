/**
 * Users Service
 *
 * Business logic for user profile management.
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { CACHE_KEYS, CACHE_TTL } from '../cache/cache.constants';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private readonly SALT_ROUNDS = 12;

  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
  ) {}

  /**
   * Get current user profile
   */
  async getProfile(userId: string) {
    const cacheKey = CACHE_KEYS.USER_PROFILE(userId);

    return this.cacheService.wrap(
      cacheKey,
      async () => {
        const user = await this.prisma.user.findUnique({
          where: { id: userId },
          include: {
            user_roles: {
              include: {
                roles: true,
              },
            },
          },
        });

        if (!user) {
          throw new NotFoundException('User not found');
        }

        return this.formatUserProfile(user);
      },
      CACHE_TTL.MEDIUM,
    );
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check email uniqueness if updating email
    if (dto.email && dto.email !== user.email) {
      const existingEmail = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (existingEmail) {
        throw new ConflictException('Email already in use');
      }
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        full_name: dto.fullName,
        email: dto.email,
        phone_number: dto.phoneNumber,
        avatar_url: dto.avatarUrl,
        updated_at: new Date(),
      },
      include: {
        user_roles: {
          include: {
            roles: true,
          },
        },
      },
    });

    // Invalidate cache
    await this.cacheService.del(CACHE_KEYS.USER_PROFILE(userId));

    this.logger.log(`Profile updated for user ${userId}`);
    return this.formatUserProfile(updated);
  }

  /**
   * Change user password
   */
  async changePassword(userId: string, dto: ChangePasswordDto) {
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('New passwords do not match');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      dto.currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(dto.newPassword, this.SALT_ROUNDS);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        updated_at: new Date(),
      },
    });

    this.logger.log(`Password changed for user ${userId}`);
    return { message: 'Password changed successfully' };
  }

  /**
   * Update avatar URL
   */
  async updateAvatar(userId: string, avatarUrl: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        avatar_url: avatarUrl,
        updated_at: new Date(),
      },
    });

    // Invalidate cache
    await this.cacheService.del(CACHE_KEYS.USER_PROFILE(userId));

    this.logger.log(`Avatar updated for user ${userId}`);
    return { message: 'Avatar updated successfully', avatarUrl };
  }

  /**
   * Delete user account (soft delete)
   */
  async deleteAccount(userId: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify password before deletion
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Password is incorrect');
    }

    // Soft delete - disable account
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        enabled: false,
        email: `deleted_${Date.now()}_${user.email}`, // Prevent email reuse issues
        updated_at: new Date(),
      },
    });

    // Invalidate cache
    await this.cacheService.del(CACHE_KEYS.USER_PROFILE(userId));

    this.logger.log(`Account deleted for user ${userId}`);
    return { message: 'Account deleted successfully' };
  }

  /**
   * Format user profile for response
   */
  private formatUserProfile(user: any) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.full_name,
      phoneNumber: user.phone_number,
      avatarUrl: user.avatar_url,
      enabled: user.enabled,
      twoFaEnabled: user.two_fa_enabled,
      lastLoginAt: user.last_login_at,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      roles: user.user_roles?.map((ur: any) => ur.roles.name) || [],
    };
  }
}
