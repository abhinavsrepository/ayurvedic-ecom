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
    login(dto: LoginDto): Promise<import("./dto/login.dto").LoginResponseDto>;
    refreshToken(refreshToken: string): Promise<import("./dto/login.dto").LoginResponseDto>;
    logout(userId: string): Promise<{
        success: boolean;
    }>;
    getCurrentUser(userId: string): Promise<import("./dto/login.dto").UserInfoDto>;
    enableTwoFa(userId: string): Promise<{
        qrCode: string;
        secret: string;
    }>;
    verifyTwoFa(userId: string, code: string): Promise<boolean>;
    disableTwoFa(userId: string): Promise<void>;
}
