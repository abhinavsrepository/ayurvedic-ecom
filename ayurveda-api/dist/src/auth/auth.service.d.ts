import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, LoginResponseDto, RegisterDto, UserInfoDto } from './dto/login.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    validateUser(username: string, password: string): Promise<any>;
    login(loginDto: LoginDto): Promise<LoginResponseDto>;
    register(registerDto: RegisterDto): Promise<LoginResponseDto>;
    refreshToken(refreshToken: string): Promise<LoginResponseDto>;
    getCurrentUser(userId: string): Promise<UserInfoDto>;
    enable2FA(userId: string): Promise<{
        qrCode: string;
        secret: string;
    }>;
    verify2FA(userId: string, code: string): Promise<boolean>;
    disable2FA(userId: string): Promise<void>;
    hashPassword(password: string): Promise<string>;
}
