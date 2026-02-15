/**
 * Add Cart Item DTO
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID, IsInt, IsOptional, Min, Max } from 'class-validator';

export class AddCartItemDto {
  @ApiProperty({ description: 'Product ID to add to cart' })
  @IsUUID()
  productId: string;

  @ApiProperty({
    description: 'Quantity to add',
    minimum: 1,
    maximum: 99,
    default: 1,
  })
  @IsInt()
  @Min(1)
  @Max(99)
  quantity: number = 1;

  @ApiPropertyOptional({ description: 'Variant ID if product has variants' })
  @IsOptional()
  @IsString()
  variantId?: string;
}
