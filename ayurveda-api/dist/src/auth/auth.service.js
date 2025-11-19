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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcrypt"));
const speakeasy = __importStar(require("speakeasy"));
const QRCode = __importStar(require("qrcode"));
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = class AuthService {
    prisma;
    jwtService;
    config;
    constructor(prisma, jwtService, config) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.config = config;
    }
    async register(dto) {
        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [{ username: dto.username }, { email: dto.email }],
            },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Username or email already exists');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 12);
        const user = await this.prisma.user.create({
            data: {
                username: dto.username,
                email: dto.email,
                password: hashedPassword,
                full_name: dto.fullName,
                phone_number: dto.phoneNumber,
            },
            select: {
                id: true,
                username: true,
                email: true,
                full_name: true,
                created_at: true,
            },
        });
        await this.createAuditLog(user.id, 'USER_REGISTERED', 'User', user.id);
        return user;
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { username: dto.username },
            include: {
                user_roles: {
                    include: {
                        roles: true,
                    },
                },
            },
        });
        if (!user || !user.enabled) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.account_locked) {
            throw new common_1.UnauthorizedException('Account is locked');
        }
        const passwordValid = await bcrypt.compare(dto.password, user.password);
        if (!passwordValid) {
            await this.incrementFailedAttempts(user.id);
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.two_fa_enabled && dto.twoFaCode) {
            const valid = speakeasy.totp.verify({
                secret: user.two_fa_secret,
                encoding: 'base32',
                token: dto.twoFaCode,
            });
            if (!valid) {
                throw new common_1.UnauthorizedException('Invalid 2FA code');
            }
        }
        else if (user.two_fa_enabled && !dto.twoFaCode) {
            return {
                requires2FA: true,
                userId: user.id,
            };
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                failed_login_attempts: 0,
                last_login_at: new Date(),
            },
        });
        const tokens = await this.generateTokens(user);
        await this.createAuditLog(user.id, 'USER_LOGIN', 'User', user.id);
        return {
            ...tokens,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.full_name,
                roles: user.user_roles.map((ur) => ur.roles.name),
            },
        };
    }
    async refreshToken(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.config.get('JWT_REFRESH_SECRET') ||
                    this.config.get('JWT_SECRET'),
            });
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
                include: {
                    user_roles: {
                        include: {
                            roles: true,
                        },
                    },
                },
            });
            if (!user || !user.enabled) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            return this.generateTokens(user);
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async enableTwoFa(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        if (user.two_fa_enabled) {
            throw new common_1.BadRequestException('2FA is already enabled');
        }
        const secret = speakeasy.generateSecret({
            name: `Ayurveda E-Commerce (${user.username})`,
            length: 32,
        });
        const qrCode = await QRCode.toDataURL(secret.otpauth_url);
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                two_fa_secret: secret.base32,
            },
        });
        return {
            secret: secret.base32,
            qrCode,
        };
    }
    async verifyTwoFa(userId, code) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user || !user.two_fa_secret) {
            throw new common_1.BadRequestException('2FA not initialized');
        }
        const valid = speakeasy.totp.verify({
            secret: user.two_fa_secret,
            encoding: 'base32',
            token: code,
        });
        if (!valid) {
            throw new common_1.BadRequestException('Invalid 2FA code');
        }
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                two_fa_enabled: true,
            },
        });
        await this.createAuditLog(userId, '2FA_ENABLED', 'User', userId);
        return { success: true };
    }
    async disableTwoFa(userId) {
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                two_fa_enabled: false,
                two_fa_secret: null,
            },
        });
        await this.createAuditLog(userId, '2FA_DISABLED', 'User', userId);
        return { success: true };
    }
    async logout(userId) {
        await this.createAuditLog(userId, 'USER_LOGOUT', 'User', userId);
        return { success: true };
    }
    async getCurrentUserProfile(userId) {
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
            throw new common_1.UnauthorizedException('User not found');
        }
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            fullName: user.full_name,
            phoneNumber: user.phone_number,
            twoFaEnabled: user.two_fa_enabled,
            lastLoginAt: user.last_login_at,
            createdAt: user.created_at,
            roles: user.user_roles.map((ur) => ur.roles.name),
        };
    }
    async generateTokens(user) {
        const payload = {
            sub: user.id,
            username: user.username,
            roles: user.user_roles.map((ur) => ur.roles.name),
        };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                expiresIn: '15m',
                secret: this.config.get('JWT_SECRET'),
            }),
            this.jwtService.signAsync(payload, {
                expiresIn: '7d',
                secret: this.config.get('JWT_REFRESH_SECRET') ||
                    this.config.get('JWT_SECRET'),
            }),
        ]);
        return {
            accessToken,
            refreshToken,
            expiresIn: 900,
        };
    }
    async incrementFailedAttempts(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user)
            return;
        const failedAttempts = (user.failed_login_attempts || 0) + 1;
        const shouldLock = failedAttempts >= 5;
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                failed_login_attempts: failedAttempts,
                account_locked: shouldLock,
            },
        });
    }
    async createAuditLog(userId, action, entityType, entityId) {
        await this.prisma.auditEvent.create({
            data: {
                user_id: userId,
                action,
                entity_type: entityType,
                entity_id: entityId,
                created_at: new Date(),
            },
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map