import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: dto.username }, { email: dto.email }],
      },
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        password: hashedPassword,
        full_name: dto.fullName,
        phone_number: dto.phoneNumber,
      },
      select: {
        id: true,
        username: true,
        email: true,
        full_name: true,
        created_at: true,
      },
    });

    await this.createAuditLog(user.id, 'USER_REGISTERED', 'User', user.id);

    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username },
      include: {
        user_roles: {
          include: {
            roles: true,
          },
        },
      },
    });

    if (!user || !user.enabled) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.account_locked) {
      throw new UnauthorizedException('Account is locked');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.password);
    if (!passwordValid) {
      await this.incrementFailedAttempts(user.id);
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.two_fa_enabled && dto.twoFaCode) {
      const valid = speakeasy.totp.verify({
        secret: user.two_fa_secret,
        encoding: 'base32',
        token: dto.twoFaCode,
      });

      if (!valid) {
        throw new UnauthorizedException('Invalid 2FA code');
      }
    } else if (user.two_fa_enabled && !dto.twoFaCode) {
      return {
        requires2FA: true,
        userId: user.id,
      };
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        failed_login_attempts: 0,
        last_login_at: new Date(),
      },
    });

    const tokens = await this.generateTokens(user);

    await this.createAuditLog(user.id, 'USER_LOGIN', 'User', user.id);

    return {
      ...tokens,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        roles: user.user_roles.map((ur) => ur.roles.name),
      },
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret:
          this.config.get('JWT_REFRESH_SECRET') ||
          this.config.get('JWT_SECRET'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: {
          user_roles: {
            include: {
              roles: true,
            },
          },
        },
      });

      if (!user || !user.enabled) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async enableTwoFa(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.two_fa_enabled) {
      throw new BadRequestException('2FA is already enabled');
    }

    const secret = speakeasy.generateSecret({
      name: `Ayurveda E-Commerce (${user.username})`,
      length: 32,
    });

    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        two_fa_secret: secret.base32,
      },
    });

    return {
      secret: secret.base32,
      qrCode,
    };
  }

  async verifyTwoFa(userId: string, code: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.two_fa_secret) {
      throw new BadRequestException('2FA not initialized');
    }

    const valid = speakeasy.totp.verify({
      secret: user.two_fa_secret,
      encoding: 'base32',
      token: code,
    });

    if (!valid) {
      throw new BadRequestException('Invalid 2FA code');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        two_fa_enabled: true,
      },
    });

    await this.createAuditLog(userId, '2FA_ENABLED', 'User', userId);

    return { success: true };
  }

  async disableTwoFa(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        two_fa_enabled: false,
        two_fa_secret: null,
      },
    });

    await this.createAuditLog(userId, '2FA_DISABLED', 'User', userId);

    return { success: true };
  }

  async logout(userId: string) {
    await this.createAuditLog(userId, 'USER_LOGOUT', 'User', userId);
    return { success: true };
  }

  async getCurrentUserProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        user_roles: {
          include: {
            roles: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.full_name,
      phoneNumber: user.phone_number,
      twoFaEnabled: user.two_fa_enabled,
      lastLoginAt: user.last_login_at,
      createdAt: user.created_at,
      roles: user.user_roles.map((ur) => ur.roles.name),
    };
  }

  private async generateTokens(user: any) {
    const payload = {
      sub: user.id,
      username: user.username,
      roles: user.user_roles.map((ur) => ur.roles.name),
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '15m',
        secret: this.config.get('JWT_SECRET'),
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret:
          this.config.get('JWT_REFRESH_SECRET') ||
          this.config.get('JWT_SECRET'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: 900,
    };
  }

  private async incrementFailedAttempts(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) return;

    const failedAttempts = (user.failed_login_attempts || 0) + 1;
    const shouldLock = failedAttempts >= 5;

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        failed_login_attempts: failedAttempts,
        account_locked: shouldLock,
      },
    });
  }

  private async createAuditLog(
    userId: string,
    action: string,
    entityType: string,
    entityId: string,
  ) {
    await this.prisma.auditEvent.create({
      data: {
        user_id: userId,
        action,
        entity_type: entityType,
        entity_id: entityId,
        created_at: new Date(),
      },
    });
  }
}
