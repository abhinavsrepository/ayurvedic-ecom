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
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * Get all orders (admin: all orders, user: own orders)
   */
  @Get()
  @ApiOperation({ summary: 'Get orders (admin: all, user: own)' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(
    @CurrentUser('email') userEmail: string,
    @CurrentUser('roles') roles: string[] = [],
    @Query() query: QueryOrderDto,
  ) {
    if (this.hasAdminRole(roles)) {
      return this.ordersService.findAllOrders(query);
    }
    return this.ordersService.findUserOrders(userEmail, query);
  }

  /**
   * Search orders (Admin only)
   */
  @Get('search')
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Search orders (Admin only)' })
  @ApiResponse({ status: 200, description: 'Orders found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  searchOrders(@Query('q') query: string, @Query() queryDto: QueryOrderDto) {
    return this.ordersService.searchOrders(query, queryDto);
  }

  /**
   * Export orders to CSV (Admin only)
   */
  @Get('export')
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Export orders to CSV (Admin only)' })
  @ApiResponse({ status: 200, description: 'Export initiated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  export(@Query() queryDto: QueryOrderDto) {
    return this.ordersService.export(queryDto);
  }

  /**
   * Create a new order
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({
    status: 400,
    description: 'Invalid order data or insufficient stock',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(
    @CurrentUser('email') userEmail: string,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.createOrder(userEmail, createOrderDto);
  }

  /**
   * Track an order
   */
  @Get(':id/track')
  @ApiOperation({ summary: 'Get order tracking information' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({
    status: 200,
    description: 'Tracking info retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  trackOrder(
    @Param('id') id: string,
    @CurrentUser('email') userEmail: string,
    @CurrentUser('roles') roles: string[] = [],
  ) {
    if (this.hasAdminRole(roles)) {
      return this.ordersService.trackOrder(id);
    }
    return this.ordersService.trackOrder(id, userEmail);
  }

  /**
   * Cancel an order
   */
  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel an order' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order cancelled successfully' })
  @ApiResponse({
    status: 400,
    description: 'Cannot cancel order in current status',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  cancelOrder(
    @Param('id') id: string,
    @CurrentUser('email') userEmail: string,
    @CurrentUser('roles') roles: string[] = [],
    @Body('reason') reason?: string,
  ) {
    if (this.hasAdminRole(roles)) {
      return this.ordersService.cancelOrderAdmin(id, reason);
    }
    return this.ordersService.cancelOrder(id, userEmail, reason);
  }

  /**
   * Update order status (Admin only)
   */
  @Patch(':id/status')
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Update order status (Admin only)' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order status updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  updateStatus(
    @Param('id') id: string,
    @Body()
    body: {
      status: string;
      paymentStatus?: string;
      trackingNumber?: string;
      carrier?: string;
      notes?: string;
    },
  ) {
    return this.ordersService.updateOrderStatus(id, body);
  }

  /**
   * Refund an order (Admin only)
   */
  @Post(':id/refund')
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Refund an order (Admin only)' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order refunded' })
  @ApiResponse({ status: 400, description: 'Invalid refund request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  refundOrder(
    @Param('id') id: string,
    @CurrentUser('sub') adminUserId: string,
    @Body() body: { amount: number; reason: string },
  ) {
    return this.ordersService.processRefund(
      id,
      body.amount,
      body.reason,
      adminUserId,
    );
  }

  /**
   * Get a specific order by ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  findOne(
    @Param('id') id: string,
    @CurrentUser('email') userEmail: string,
    @CurrentUser('roles') roles: string[] = [],
  ) {
    if (this.hasAdminRole(roles)) {
      return this.ordersService.findOneAdmin(id);
    }
    return this.ordersService.findOne(id, userEmail);
  }

  private hasAdminRole(roles: string[]): boolean {
    return roles?.includes('admin') || roles?.includes('manager');
  }
}
