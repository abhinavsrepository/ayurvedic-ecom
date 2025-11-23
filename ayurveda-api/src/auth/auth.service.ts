import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, LoginResponseDto, UserInfoDto } from './dto/login.dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: { user_roles: { include: { roles: true } } },
    });

    if (!user) {
      return null;
    }

    if (!user.enabled) {
      throw new UnauthorizedException('Account is disabled');
    }

    if (user.account_locked) {
      throw new UnauthorizedException('Account is locked');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // Increment failed login attempts
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          failed_login_attempts: (user.failed_login_attempts || 0) + 1,
          account_locked:
            (user.failed_login_attempts || 0) + 1 >= 5 ? true : false,
        },
      });
      return null;
    }

    // Reset failed login attempts on successful login
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        failed_login_attempts: 0,
        last_login_at: new Date(),
      },
    });

    const { password: _, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.validateUser(loginDto.username, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check 2FA if enabled
    if (user.two_fa_enabled) {
      if (!loginDto.twoFaCode) {
        throw new UnauthorizedException('2FA code required');
      }

      const isValid = speakeasy.totp.verify({
        secret: user.two_fa_secret,
        encoding: 'base32',
        token: loginDto.twoFaCode,
        window: 2,
      });

      if (!isValid) {
        throw new UnauthorizedException('Invalid 2FA code');
      }
    }

    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      roles: user.user_roles.map((ur) => ur.roles.name),
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: 900, // 15 minutes
      user: {
        username: user.username,
        email: user.email,
        fullName: user.full_name || '',
        roles: payload.roles,
        twoFaEnabled: user.two_fa_enabled || false,
      },
    };
  }

  async refreshToken(refreshToken: string): Promise<LoginResponseDto> {
    try {
      const payload = this.jwtService.verify(refreshToken);

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: { user_roles: { include: { roles: true } } },
      });

      if (!user || !user.enabled) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newPayload: JwtPayload = {
        sub: user.id,
        username: user.username,
        email: user.email,
        roles: user.user_roles.map((ur) => ur.roles.name),
      };

      const newAccessToken = this.jwtService.sign(newPayload, {
        expiresIn: '15m',
      });

      const newRefreshToken = this.jwtService.sign(newPayload, {
        expiresIn: '7d',
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        tokenType: 'Bearer',
        expiresIn: 900,
        user: {
          username: user.username,
          email: user.email,
          fullName: user.full_name || '',
          roles: newPayload.roles,
          twoFaEnabled: user.two_fa_enabled || false,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async getCurrentUser(userId: string): Promise<UserInfoDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { user_roles: { include: { roles: true } } },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      username: user.username,
      email: user.email,
      fullName: user.full_name || '',
      roles: user.user_roles.map((ur) => ur.roles.name),
      twoFaEnabled: user.two_fa_enabled || false,
    };
  }

  async enable2FA(userId: string): Promise<{ qrCode: string; secret: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const secret = speakeasy.generateSecret({
      name: `Ayurveda Shop (${user.email})`,
      length: 32,
    });

    // Store the secret temporarily (not yet enabled)
    await this.prisma.user.update({
      where: { id: userId },
      data: { two_fa_secret: secret.base32 },
    });

    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    return {
      qrCode: qrCodeUrl,
      secret: secret.base32,
    };
  }

  async verify2FA(userId: string, code: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.two_fa_secret) {
      throw new UnauthorizedException('2FA not set up');
    }

    const isValid = speakeasy.totp.verify({
      secret: user.two_fa_secret,
      encoding: 'base32',
      token: code,
      window: 2,
    });

    if (isValid) {
      // Enable 2FA
      await this.prisma.user.update({
        where: { id: userId },
        data: { two_fa_enabled: true },
      });
    }

    return isValid;
  }

  async disable2FA(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        two_fa_enabled: false,
        two_fa_secret: null,
      },
    });
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
