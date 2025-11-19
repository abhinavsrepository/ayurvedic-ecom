import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
    logout(userId: string): Promise<{
        success: boolean;
    }>;
    getCurrentUser(userId: string): Promise<{
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
}
