import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ example: '123456' })
  @IsOptional()
  @IsString()
  twoFaCode?: string;
}

export class LoginResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty({ example: 'Bearer' })
  tokenType: string;

  @ApiProperty({ example: 900 })
  expiresIn: number;

  @ApiProperty()
  user: UserInfoDto;
}

export class UserInfoDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty({ type: [String] })
  roles: string[];

  @ApiProperty()
  twoFaEnabled: boolean;
}

export class RefreshTokenDto {
  @ApiProperty()
  refreshToken: string;
}

export class VerifyTwoFaDto {
  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  code: string;
}
