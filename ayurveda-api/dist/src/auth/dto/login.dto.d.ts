export declare class LoginDto {
    username: string;
    password: string;
    twoFaCode?: string;
}
export declare class RegisterDto {
    username: string;
    email: string;
    password: string;
    fullName?: string;
}
export declare class UserInfoDto {
    username: string;
    email: string;
    fullName: string;
    roles: string[];
    twoFaEnabled: boolean;
}
export declare class LoginResponseDto {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    user: UserInfoDto;
}
export declare class RefreshTokenDto {
    refreshToken: string;
}
export declare class VerifyTwoFaDto {
    code: string;
}
