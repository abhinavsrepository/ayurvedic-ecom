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
    configService;
    constructor(prisma, jwtService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async validateUser(username, password) {
        console.log('[DEBUG] validateUser called with username:', username);
        let user = await this.prisma.user.findUnique({
            where: { username },
            include: { user_roles: { include: { roles: true } } },
        });
        if (!user) {
            user = await this.prisma.user.findUnique({
                where: { email: username },
                include: { user_roles: { include: { roles: true } } },
            });
            console.log('[DEBUG] Tried email lookup:', user ? 'found' : 'not found');
        }
        console.log('[DEBUG] User found:', user ? 'YES' : 'NO');
        if (!user) {
            console.log('[DEBUG] User not found, returning null');
            return null;
        }
        console.log('[DEBUG] User details:', {
            id: user.id,
            username: user.username,
            enabled: user.enabled,
            locked: user.account_locked,
            failedAttempts: user.failed_login_attempts,
            hasPassword: !!user.password,
            passwordLength: user.password?.length
        });
        if (!user.enabled) {
            console.log('[DEBUG] Account is disabled');
            throw new common_1.UnauthorizedException('Account is disabled');
        }
        if (user.account_locked) {
            console.log('[DEBUG] Account is locked');
            throw new common_1.UnauthorizedException('Account is locked');
        }
        console.log('[DEBUG] Comparing password...');
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('[DEBUG] Password valid:', isPasswordValid);
        if (!isPasswordValid) {
            console.log('[DEBUG] Password invalid, incrementing failed attempts');
            await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    failed_login_attempts: (user.failed_login_attempts || 0) + 1,
                    account_locked: (user.failed_login_attempts || 0) + 1 >= 5 ? true : false,
                },
            });
            return null;
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                failed_login_attempts: 0,
                last_login_at: new Date(),
            },
        });
        const { password: _, ...result } = user;
        return result;
    }
    async login(loginDto) {
        const user = await this.validateUser(loginDto.username, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.two_fa_enabled) {
            if (!loginDto.twoFaCode) {
                throw new common_1.UnauthorizedException('2FA code required');
            }
            const isValid = speakeasy.totp.verify({
                secret: user.two_fa_secret,
                encoding: 'base32',
                token: loginDto.twoFaCode,
                window: 2,
            });
            if (!isValid) {
                throw new common_1.UnauthorizedException('Invalid 2FA code');
            }
        }
        const payload = {
            sub: user.id,
            username: user.username,
            email: user.email,
            roles: user.user_roles.map((ur) => ur.roles.name),
        };
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: '15m',
        });
        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: '7d',
        });
        return {
            accessToken,
            refreshToken,
            tokenType: 'Bearer',
            expiresIn: 900,
            user: {
                username: user.username,
                email: user.email,
                fullName: user.full_name || '',
                roles: payload.roles,
                twoFaEnabled: user.two_fa_enabled || false,
            },
        };
    }
    async register(registerDto) {
        const existing = await this.prisma.user.findFirst({
            where: {
                OR: [{ username: registerDto.username }, { email: registerDto.email }],
            },
        });
        if (existing) {
            throw new common_1.ConflictException('Username or email already exists');
        }
        const hashedPassword = await this.hashPassword(registerDto.password);
        const user = await this.prisma.user.create({
            data: {
                username: registerDto.username,
                email: registerDto.email,
                password: hashedPassword,
                full_name: registerDto.fullName || registerDto.username,
                enabled: true,
            },
            include: { user_roles: { include: { roles: true } } },
        });
        const payload = {
            sub: user.id,
            username: user.username,
            email: user.email,
            roles: user.user_roles.map((ur) => ur.roles.name),
        };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
        return {
            accessToken,
            refreshToken,
            tokenType: 'Bearer',
            expiresIn: 900,
            user: {
                username: user.username,
                email: user.email,
                fullName: user.full_name || '',
                roles: payload.roles,
                twoFaEnabled: user.two_fa_enabled || false,
            },
        };
    }
    async refreshToken(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken);
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
                include: { user_roles: { include: { roles: true } } },
            });
            if (!user || !user.enabled) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            const newPayload = {
                sub: user.id,
                username: user.username,
                email: user.email,
                roles: user.user_roles.map((ur) => ur.roles.name),
            };
            const newAccessToken = this.jwtService.sign(newPayload, {
                expiresIn: '15m',
            });
            const newRefreshToken = this.jwtService.sign(newPayload, {
                expiresIn: '7d',
            });
            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
                tokenType: 'Bearer',
                expiresIn: 900,
                user: {
                    username: user.username,
                    email: user.email,
                    fullName: user.full_name || '',
                    roles: newPayload.roles,
                    twoFaEnabled: user.two_fa_enabled || false,
                },
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async getCurrentUser(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { user_roles: { include: { roles: true } } },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return {
            username: user.username,
            email: user.email,
            fullName: user.full_name || '',
            roles: user.user_roles.map((ur) => ur.roles.name),
            twoFaEnabled: user.two_fa_enabled || false,
        };
    }
    async enable2FA(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const secret = speakeasy.generateSecret({
            name: `Ayurveda Shop (${user.email})`,
            length: 32,
        });
        await this.prisma.user.update({
            where: { id: userId },
            data: { two_fa_secret: secret.base32 },
        });
        const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);
        return {
            qrCode: qrCodeUrl,
            secret: secret.base32,
        };
    }
    async verify2FA(userId, code) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user || !user.two_fa_secret) {
            throw new common_1.UnauthorizedException('2FA not set up');
        }
        const isValid = speakeasy.totp.verify({
            secret: user.two_fa_secret,
            encoding: 'base32',
            token: code,
            window: 2,
        });
        if (isValid) {
            await this.prisma.user.update({
                where: { id: userId },
                data: { two_fa_enabled: true },
            });
        }
        return isValid;
    }
    async disable2FA(userId) {
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                two_fa_enabled: false,
                two_fa_secret: null,
            },
        });
    }
    async hashPassword(password) {
        return bcrypt.hash(password, 10);
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