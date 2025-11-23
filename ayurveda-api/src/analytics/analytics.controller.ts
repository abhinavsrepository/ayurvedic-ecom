/**
 * Analytics Controller
 *
 * REST API endpoints for analytics tracking.
 */

import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AnalyticsService } from './analytics.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { CreateDeviceDto } from './dto/create-device.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { IpHasher } from './utils/ip-hasher.util';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Public()
  @Post('location')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Log user location data' })
  @ApiResponse({ status: 201, description: 'Location logged successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async logLocation(
    @Body() createLocationDto: CreateLocationDto,
    @Req() request: Request,
  ) {
    const ip = IpHasher.extractIp(request.headers);
    return this.analyticsService.logLocation(createLocationDto, ip);
  }

  @Public()
  @Post('device')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Log user device data' })
  @ApiResponse({ status: 201, description: 'Device logged successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async logDevice(@Body() createDeviceDto: CreateDeviceDto) {
    return this.analyticsService.logDevice(createDeviceDto);
  }

  @Public()
  @Post('event')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Log analytics event (combines location + device + event)' })
  @ApiResponse({ status: 201, description: 'Event logged successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async logEvent(
    @Body() createEventDto: CreateEventDto,
    @Req() request: Request,
  ) {
    const ip = IpHasher.extractIp(request.headers);
    return this.analyticsService.logEvent(createEventDto, ip);
  }

  @Get('summary/events')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get event summary statistics (Admin only)' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Event summary retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getEventSummary(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.analyticsService.getEventSummary(start, end);
  }

  @Get('summary/devices')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get device summary statistics (Admin only)' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Device summary retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getDeviceSummary(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.analyticsService.getDeviceSummary(start, end);
  }

  @Get('summary/locations')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get location summary statistics (Admin only)' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Location summary retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getLocationSummary(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.analyticsService.getLocationSummary(start, end);
  }
}
