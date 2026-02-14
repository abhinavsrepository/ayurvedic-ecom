import { AuthService } from './auth.service';
import { LoginDto, LoginResponseDto, RegisterDto, VerifyTwoFaDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<LoginResponseDto>;
    register(registerDto: RegisterDto): Promise<LoginResponseDto>;
    refreshToken(refreshToken: string): Promise<LoginResponseDto>;
    getCurrentUser(userId: string): Promise<import("./dto/login.dto").UserInfoDto>;
    enable2FA(userId: string): Promise<{
        qrCode: string;
        secret: string;
    }>;
    verify2FA(userId: string, verifyDto: VerifyTwoFaDto): Promise<{
        success: boolean;
        message: string;
    }>;
    disable2FA(userId: string): Promise<void>;
    logout(): Promise<void>;
}
