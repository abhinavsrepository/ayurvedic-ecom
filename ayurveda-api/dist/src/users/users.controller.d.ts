import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(userId: string): Promise<{
        id: any;
        username: any;
        email: any;
        fullName: any;
        phoneNumber: any;
        avatarUrl: any;
        enabled: any;
        twoFaEnabled: any;
        lastLoginAt: any;
        createdAt: any;
        updatedAt: any;
        roles: any;
    }>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
        id: any;
        username: any;
        email: any;
        fullName: any;
        phoneNumber: any;
        avatarUrl: any;
        enabled: any;
        twoFaEnabled: any;
        lastLoginAt: any;
        createdAt: any;
        updatedAt: any;
        roles: any;
    }>;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    updateAvatar(userId: string, avatarUrl: string): Promise<{
        message: string;
        avatarUrl: string;
    }>;
    deleteAccount(userId: string, password: string): Promise<{
        message: string;
    }>;
}
