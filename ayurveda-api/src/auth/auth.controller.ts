import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  UseGuards,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, LoginResponseDto, VerifyTwoFaDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login with optional 2FA' })
  @ApiResponse({ status: 200, description: 'Login successful', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refreshToken(
    @Headers('x-refresh-token') refreshToken: string,
  ): Promise<LoginResponseDto> {
    return this.authService.refreshToken(refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getCurrentUser(@CurrentUser('id') userId: string) {
    return this.authService.getCurrentUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/enable')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enable 2FA and get QR code' })
  @ApiResponse({ status: 200, description: '2FA setup initiated' })
  async enable2FA(@CurrentUser('id') userId: string) {
    return this.authService.enable2FA(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/verify')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify 2FA code to complete setup' })
  @ApiResponse({ status: 200, description: '2FA enabled successfully' })
  @ApiResponse({ status: 400, description: 'Invalid 2FA code' })
  async verify2FA(
    @CurrentUser('id') userId: string,
    @Body() verifyDto: VerifyTwoFaDto,
  ) {
    const isValid = await this.authService.verify2FA(userId, verifyDto.code);
    return { success: isValid, message: isValid ? '2FA enabled' : 'Invalid code' };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('2fa/disable')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Disable 2FA' })
  @ApiResponse({ status: 204, description: '2FA disabled successfully' })
  async disable2FA(@CurrentUser('id') userId: string) {
    await this.authService.disable2FA(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Logout (client-side token removal)' })
  @ApiResponse({ status: 204, description: 'Logged out successfully' })
  async logout() {
    // In a stateless JWT system, logout is handled client-side
    // For token blacklisting, implement Redis-based token revocation
    return;
  }
}
