import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private config;
    constructor(prisma: PrismaService, jwtService: JwtService, config: ConfigService);
    register(dto: RegisterDto): Promise<{
        id: string;
        created_at: Date;
        username: string;
        email: string;
        full_name: string | null;
    }>;
    login(dto: LoginDto): Promise<{
        requires2FA: boolean;
        userId: string;
    } | {
        user: {
            id: string;
            username: string;
            email: string;
            fullName: string | null;
            roles: string[];
        };
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        requires2FA?: undefined;
        userId?: undefined;
    }>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    }>;
    enableTwoFa(userId: string): Promise<{
        secret: any;
        qrCode: any;
    }>;
    verifyTwoFa(userId: string, code: string): Promise<{
        success: boolean;
    }>;
    disableTwoFa(userId: string): Promise<{
        success: boolean;
    }>;
    logout(userId: string): Promise<{
        success: boolean;
    }>;
    getCurrentUserProfile(userId: string): Promise<{
        id: string;
        username: string;
        email: string;
        fullName: string | null;
        phoneNumber: string | null;
        twoFaEnabled: boolean | null;
        lastLoginAt: Date | null;
        createdAt: Date;
        roles: string[];
    }>;
    private generateTokens;
    private incrementFailedAttempts;
    private createAuditLog;
}
