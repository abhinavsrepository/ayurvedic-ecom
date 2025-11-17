/**
 * Create Order DTO
 *
 * Data Transfer Object for creating a new order.
 */

import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  ValidateNested,
  Min,
  MaxLength,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderItemDto {
  @ApiProperty({ description: 'Product ID' })
  @IsUUID()
  productId: string;

  @ApiProperty({ description: 'Quantity', minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ description: 'Order items', type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiPropertyOptional({ description: 'Coupon code' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  couponCode?: string;

  @ApiProperty({ description: 'Shipping address line 1' })
  @IsString()
  @MaxLength(255)
  shippingAddressLine1: string;

  @ApiPropertyOptional({ description: 'Shipping address line 2' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  shippingAddressLine2?: string;

  @ApiProperty({ description: 'Shipping city' })
  @IsString()
  @MaxLength(100)
  shippingCity: string;

  @ApiProperty({ description: 'Shipping state' })
  @IsString()
  @MaxLength(100)
  shippingState: string;

  @ApiProperty({ description: 'Shipping postal code' })
  @IsString()
  @MaxLength(20)
  shippingPostalCode: string;

  @ApiProperty({ description: 'Shipping country' })
  @IsString()
  @MaxLength(100)
  shippingCountry: string;

  @ApiPropertyOptional({ description: 'Order notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'UTM source for tracking' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  utmSource?: string;

  @ApiPropertyOptional({ description: 'UTM medium for tracking' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  utmMedium?: string;

  @ApiPropertyOptional({ description: 'UTM campaign for tracking' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  utmCampaign?: string;
}
