"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const cache_service_1 = require("../cache/cache.service");
const cache_constants_1 = require("../cache/cache.constants");
const bcrypt = __importStar(require("bcrypt"));
let UsersService = UsersService_1 = class UsersService {
    prisma;
    cacheService;
    logger = new common_1.Logger(UsersService_1.name);
    SALT_ROUNDS = 12;
    constructor(prisma, cacheService) {
        this.prisma = prisma;
        this.cacheService = cacheService;
    }
    async getProfile(userId) {
        const cacheKey = cache_constants_1.CACHE_KEYS.USER_PROFILE(userId);
        return this.cacheService.wrap(cacheKey, async () => {
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
                throw new common_1.NotFoundException('User not found');
            }
            return this.formatUserProfile(user);
        }, cache_constants_1.CACHE_TTL.MEDIUM);
    }
    async updateProfile(userId, dto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (dto.email && dto.email !== user.email) {
            const existingEmail = await this.prisma.user.findUnique({
                where: { email: dto.email },
            });
            if (existingEmail) {
                throw new common_1.ConflictException('Email already in use');
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
        await this.cacheService.del(cache_constants_1.CACHE_KEYS.USER_PROFILE(userId));
        this.logger.log(`Profile updated for user ${userId}`);
        return this.formatUserProfile(updated);
    }
    async changePassword(userId, dto) {
        if (dto.newPassword !== dto.confirmPassword) {
            throw new common_1.BadRequestException('New passwords do not match');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const isPasswordValid = await bcrypt.compare(dto.currentPassword, user.password);
        if (!isPasswordValid) {
            throw new common_1.BadRequestException('Current password is incorrect');
        }
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
    async updateAvatar(userId, avatarUrl) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                avatar_url: avatarUrl,
                updated_at: new Date(),
            },
        });
        await this.cacheService.del(cache_constants_1.CACHE_KEYS.USER_PROFILE(userId));
        this.logger.log(`Avatar updated for user ${userId}`);
        return { message: 'Avatar updated successfully', avatarUrl };
    }
    async deleteAccount(userId, password) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.BadRequestException('Password is incorrect');
        }
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                enabled: false,
                email: `deleted_${Date.now()}_${user.email}`,
                updated_at: new Date(),
            },
        });
        await this.cacheService.del(cache_constants_1.CACHE_KEYS.USER_PROFILE(userId));
        this.logger.log(`Account deleted for user ${userId}`);
        return { message: 'Account deleted successfully' };
    }
    formatUserProfile(user) {
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
            roles: user.user_roles?.map((ur) => ur.roles.name) || [],
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cache_service_1.CacheService])
], UsersService);
//# sourceMappingURL=users.service.js.map