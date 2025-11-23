/**
 * Update Customer DTO
 *
 * Data Transfer Object for updating customer information.
 */

import {
  IsString,
  IsOptional,
  IsBoolean,
  MaxLength,
  IsEmail,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCustomerDto {
  @ApiPropertyOptional({ description: 'Customer email' })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @ApiPropertyOptional({ description: 'First name' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  first_name?: string;

  @ApiPropertyOptional({ description: 'Last name' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  last_name?: string;

  @ApiPropertyOptional({ description: 'Phone number' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone_number?: string;

  @ApiPropertyOptional({ description: 'Address line 1' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  address_line1?: string;

  @ApiPropertyOptional({ description: 'Address line 2' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  address_line2?: string;

  @ApiPropertyOptional({ description: 'City' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @ApiPropertyOptional({ description: 'State' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  state?: string;

  @ApiPropertyOptional({ description: 'Postal code' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  postal_code?: string;

  @ApiPropertyOptional({ description: 'Country' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @ApiPropertyOptional({ description: 'Billing address line 1' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  billing_address_line1?: string;

  @ApiPropertyOptional({ description: 'Billing address line 2' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  billing_address_line2?: string;

  @ApiPropertyOptional({ description: 'Billing city' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  billing_city?: string;

  @ApiPropertyOptional({ description: 'Billing state' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  billing_state?: string;

  @ApiPropertyOptional({ description: 'Billing postal code' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  billing_postal_code?: string;

  @ApiPropertyOptional({ description: 'Billing country' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  billing_country?: string;

  @ApiPropertyOptional({ description: 'Accepts marketing' })
  @IsOptional()
  @IsBoolean()
  accepts_marketing?: boolean;

  @ApiPropertyOptional({ description: 'Customer notes' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
