import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    const refreshSecret =
      config.get<string>('JWT_REFRESH_SECRET') ||
      config.get<string>('JWT_SECRET');
    if (!refreshSecret) {
      throw new Error('JWT_REFRESH_SECRET or JWT_SECRET is required');
    }

    super({
      jwtFromRequest: ExtractJwt.fromHeader('x-refresh-token'),
      secretOrKey: refreshSecret,
    });
  }

  async validate(payload: { sub: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || !user.enabled) {
      throw new UnauthorizedException();
    }

    return { id: user.id, username: user.username };
  }
}
