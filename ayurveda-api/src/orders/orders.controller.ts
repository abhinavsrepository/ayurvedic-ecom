/**
 * Orders Controller
 *
 * REST API endpoints for order management.
 */

import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * Get all orders for the current user
   */
  @Get()
  @ApiOperation({ summary: 'Get all orders for current user' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@CurrentUser('email') userId: string, @Query() query: QueryOrderDto) {
    return this.ordersService.findUserOrders(userId, query);
  }

  /**
   * Get a specific order by ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your order' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  findOne(@Param('id') id: string, @CurrentUser('email') userId: string) {
    return this.ordersService.findOne(id, userId);
  }

  /**
   * Create a new order
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid order data or insufficient stock' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@CurrentUser('email') userId: string, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(userId, createOrderDto);
  }

  /**
   * Cancel an order
   */
  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel an order' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order cancelled successfully' })
  @ApiResponse({ status: 400, description: 'Cannot cancel order in current status' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your order' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  cancelOrder(
    @Param('id') id: string,
    @CurrentUser('email') userId: string,
    @Body('reason') reason?: string,
  ) {
    return this.ordersService.cancelOrder(id, userId, reason);
  }

  /**
   * Track an order
   */
  @Get(':id/track')
  @ApiOperation({ summary: 'Get order tracking information' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Tracking info retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your order' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  trackOrder(@Param('id') id: string, @CurrentUser('email') userId: string) {
    return this.ordersService.trackOrder(id, userId);
  }
}
