import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class UsersService {
    private prisma;
    private cacheService;
    private readonly logger;
    private readonly SALT_ROUNDS;
    constructor(prisma: PrismaService, cacheService: CacheService);
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
    private formatUserProfile;
}
