/**
 * Create Address DTO
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  MaxLength,
  Matches,
} from 'class-validator';

export enum AddressType {
  SHIPPING = 'SHIPPING',
  BILLING = 'BILLING',
}

export class CreateAddressDto {
  @ApiPropertyOptional({
    description: 'Address label (e.g., Home, Office)',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  label?: string;

  @ApiProperty({ description: 'First name', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  firstName: string;

  @ApiProperty({ description: 'Last name', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  lastName: string;

  @ApiPropertyOptional({ description: 'Phone number' })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{10}$/, { message: 'Phone must be 10 digits' })
  phone?: string;

  @ApiProperty({ description: 'Address line 1', maxLength: 255 })
  @IsString()
  @MaxLength(255)
  addressLine1: string;

  @ApiPropertyOptional({ description: 'Address line 2', maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  addressLine2?: string;

  @ApiProperty({ description: 'City', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  city: string;

  @ApiProperty({ description: 'State', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  state: string;

  @ApiProperty({ description: 'Postal code (PIN)', maxLength: 20 })
  @IsString()
  @Matches(/^[0-9]{6}$/, { message: 'PIN code must be 6 digits' })
  postalCode: string;

  @ApiPropertyOptional({ description: 'Country', default: 'India' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string = 'India';

  @ApiPropertyOptional({
    description: 'Set as default address',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean = false;

  @ApiPropertyOptional({
    description: 'Address type',
    enum: AddressType,
    default: AddressType.SHIPPING,
  })
  @IsOptional()
  @IsEnum(AddressType)
  addressType?: AddressType = AddressType.SHIPPING;
}
