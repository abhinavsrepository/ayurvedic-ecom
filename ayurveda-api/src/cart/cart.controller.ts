/**
 * Cart Controller
 *
 * REST API endpoints for cart management.
 * Supports both guest (session-based) and authenticated users.
 */

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Headers,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiHeader,
  ApiParam,
} from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { MergeCartDto } from './dto/merge-cart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get current cart' })
  @ApiHeader({
    name: 'x-session-id',
    required: false,
    description: 'Session ID for guest cart',
  })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully' })
  async getCart(
    @CurrentUser('sub') userId: string | undefined,
    @Headers('x-session-id') sessionId: string | undefined,
  ) {
    return this.cartService.getCart(userId, sessionId);
  }

  @Public()
  @Post('items')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiHeader({
    name: 'x-session-id',
    required: false,
    description: 'Session ID for guest cart',
  })
  @ApiResponse({ status: 201, description: 'Item added successfully' })
  @ApiResponse({
    status: 400,
    description: 'Invalid request or insufficient stock',
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async addItem(
    @Body() dto: AddCartItemDto,
    @CurrentUser('sub') userId: string | undefined,
    @Headers('x-session-id') sessionId: string | undefined,
  ) {
    return this.cartService.addItem(dto, userId, sessionId);
  }

  @Public()
  @Patch('items/:itemId')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiParam({ name: 'itemId', description: 'Cart item ID' })
  @ApiHeader({
    name: 'x-session-id',
    required: false,
    description: 'Session ID for guest cart',
  })
  @ApiResponse({ status: 200, description: 'Item updated successfully' })
  @ApiResponse({ status: 400, description: 'Insufficient stock' })
  @ApiResponse({ status: 404, description: 'Cart or item not found' })
  async updateItem(
    @Param('itemId') itemId: string,
    @Body() dto: UpdateCartItemDto,
    @CurrentUser('sub') userId: string | undefined,
    @Headers('x-session-id') sessionId: string | undefined,
  ) {
    return this.cartService.updateItem(itemId, dto, userId, sessionId);
  }

  @Public()
  @Delete('items/:itemId')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiParam({ name: 'itemId', description: 'Cart item ID' })
  @ApiHeader({
    name: 'x-session-id',
    required: false,
    description: 'Session ID for guest cart',
  })
  @ApiResponse({ status: 200, description: 'Item removed successfully' })
  @ApiResponse({ status: 404, description: 'Cart or item not found' })
  async removeItem(
    @Param('itemId') itemId: string,
    @CurrentUser('sub') userId: string | undefined,
    @Headers('x-session-id') sessionId: string | undefined,
  ) {
    return this.cartService.removeItem(itemId, userId, sessionId);
  }

  @Public()
  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Clear entire cart' })
  @ApiHeader({
    name: 'x-session-id',
    required: false,
    description: 'Session ID for guest cart',
  })
  @ApiResponse({ status: 200, description: 'Cart cleared successfully' })
  async clearCart(
    @CurrentUser('sub') userId: string | undefined,
    @Headers('x-session-id') sessionId: string | undefined,
  ) {
    return this.cartService.clearCart(userId, sessionId);
  }

  @Post('merge')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Merge guest cart into user cart after login' })
  @ApiResponse({ status: 200, description: 'Carts merged successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async mergeCart(
    @Body() dto: MergeCartDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.cartService.mergeCart(dto, userId);
  }

  @Public()
  @Get('summary')
  @ApiOperation({ summary: 'Get cart summary with totals' })
  @ApiHeader({
    name: 'x-session-id',
    required: false,
    description: 'Session ID for guest cart',
  })
  @ApiResponse({ status: 200, description: 'Cart summary retrieved' })
  async getCartSummary(
    @CurrentUser('sub') userId: string | undefined,
    @Headers('x-session-id') sessionId: string | undefined,
  ) {
    return this.cartService.getCartSummary(userId, sessionId);
  }
}
