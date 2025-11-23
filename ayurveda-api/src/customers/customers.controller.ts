/**
 * Customers Controller
 *
 * REST API endpoints for customer management (Admin only).
 */

import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { QueryCustomerDto } from './dto/query-customer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Customers')
@Controller('customers')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  /**
   * Get all customers (Admin only)
   */
  @Get()
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Get all customers (Admin only)' })
  @ApiResponse({ status: 200, description: 'Customers retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  findAll(@Query() query: QueryCustomerDto) {
    return this.customersService.findAll(query);
  }

  /**
   * Get customer by ID (Admin only)
   */
  @Get(':id')
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Get customer by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({ status: 200, description: 'Customer found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  /**
   * Update customer (Admin only)
   */
  @Patch(':id')
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Update customer (Admin only)' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({ status: 200, description: 'Customer updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customersService.update(id, updateCustomerDto);
  }

  /**
   * Get customer statistics (Admin only)
   */
  @Get(':id/stats')
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Get customer statistics (Admin only)' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({ status: 200, description: 'Customer stats retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  getStats(@Param('id') id: string) {
    return this.customersService.getCustomerStats(id);
  }
}
