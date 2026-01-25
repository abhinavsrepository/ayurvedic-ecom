import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, LoginResponseDto, UserInfoDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    register(dto: RegisterDto): Promise<{
        id: string;
        created_at: Date;
        username: string;
        email: string;
        full_name: string | null;
    }>;
    validateUser(username: string, password: string): Promise<any>;
    login(loginDto: LoginDto): Promise<LoginResponseDto>;
    refreshToken(refreshToken: string): Promise<LoginResponseDto>;
    enable2FA(userId: string): Promise<{
        qrCode: string;
        secret: string;
    }>;
    verify2FA(userId: string, code: string): Promise<boolean>;
    disable2FA(userId: string): Promise<void>;
    logout(userId: string): Promise<{
        success: boolean;
    }>;
    getCurrentUser(userId: string): Promise<UserInfoDto>;
    private createAuditLog;
    hashPassword(password: string): Promise<string>;
}
