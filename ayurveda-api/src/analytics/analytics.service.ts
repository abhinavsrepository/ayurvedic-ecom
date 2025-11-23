/**
 * Analytics Service
 *
 * Business logic for analytics tracking with privacy-first approach.
 */

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { CreateDeviceDto } from './dto/create-device.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { IpHasher } from './utils/ip-hasher.util';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);
  private readonly ipSalt: string;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.ipSalt = this.configService.get('IP_HASH_SALT') || 'default-salt-change-me';
  }

  /**
   * Log user location data
   */
  async logLocation(createLocationDto: CreateLocationDto, requestIp?: string) {
    try {
      const ipToHash = createLocationDto.ip || requestIp || '';
      const ipHash = ipToHash ? IpHasher.hash(ipToHash, this.ipSalt) : null;

      const location = await this.prisma.userLocationLog.create({
        data: {
          userId: createLocationDto.userId || null,
          sessionId: createLocationDto.sessionId || null,
          ipHash,
          country: createLocationDto.country || null,
          region: createLocationDto.region || null,
          city: createLocationDto.city || null,
          latitude: createLocationDto.latitude || null,
          longitude: createLocationDto.longitude || null,
          timezone: createLocationDto.timezone || null,
          accuracy: createLocationDto.accuracy || null,
        },
      });

      this.logger.log(`Location logged: ${location.id}`);
      return location;
    } catch (error) {
      this.logger.error(`Failed to log location: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Log user device data
   */
  async logDevice(createDeviceDto: CreateDeviceDto) {
    try {
      const device = await this.prisma.userDeviceLog.create({
        data: {
          userId: createDeviceDto.userId || null,
          sessionId: createDeviceDto.sessionId || null,
          deviceType: createDeviceDto.deviceType || null,
          os: createDeviceDto.os || null,
          browser: createDeviceDto.browser || null,
          browserVersion: createDeviceDto.browserVersion || null,
          deviceRam: createDeviceDto.deviceRam || null,
          cpuCores: createDeviceDto.cpuCores || null,
          networkType: createDeviceDto.networkType || null,
          isOnline: createDeviceDto.isOnline ?? true,
          screenWidth: createDeviceDto.screenWidth || null,
          screenHeight: createDeviceDto.screenHeight || null,
          colorScheme: createDeviceDto.colorScheme || null,
          hasTouch: createDeviceDto.hasTouch ?? false,
          userAgent: createDeviceDto.userAgent || null,
        },
      });

      this.logger.log(`Device logged: ${device.id}`);
      return device;
    } catch (error) {
      this.logger.error(`Failed to log device: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Log analytics event (combines location + device + event data)
   */
  async logEvent(createEventDto: CreateEventDto, requestIp?: string) {
    try {
      let locationId: string | null = null;
      let deviceId: string | null = null;

      // Log location if provided
      if (createEventDto.location) {
        const location = await this.logLocation(createEventDto.location, requestIp);
        locationId = location.id;
      }

      // Log device if provided
      if (createEventDto.device) {
        const device = await this.logDevice(createEventDto.device);
        deviceId = device.id;
      }

      // Log the event
      const event = await this.prisma.analyticsEvent.create({
        data: {
          userId: createEventDto.userId || null,
          sessionId: createEventDto.sessionId || null,
          eventType: createEventDto.eventType,
          eventData: createEventDto.eventData ? JSON.stringify(createEventDto.eventData) : null,
          locationId,
          deviceId,
          pageUrl: createEventDto.pageUrl || null,
          referrer: createEventDto.referrer || null,
        },
      });

      this.logger.log(`Event logged: ${event.eventType} - ${event.id}`);
      return {
        event,
        locationId,
        deviceId,
      };
    } catch (error) {
      this.logger.error(`Failed to log event: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get analytics summary by event type
   */
  async getEventSummary(startDate?: Date, endDate?: Date) {
    try {
      const where: any = {};

      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = startDate;
        if (endDate) where.createdAt.lte = endDate;
      }

      const summary = await this.prisma.analyticsEvent.groupBy({
        by: ['eventType'],
        _count: {
          id: true,
        },
        where,
        orderBy: {
          _count: {
            id: 'desc',
          },
        },
      });

      return summary.map((item) => ({
        eventType: item.eventType,
        count: item._count.id,
      }));
    } catch (error) {
      this.logger.error(`Failed to get event summary: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get device analytics summary
   */
  async getDeviceSummary(startDate?: Date, endDate?: Date) {
    try {
      const where: any = {};

      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = startDate;
        if (endDate) where.createdAt.lte = endDate;
      }

      const deviceTypes = await this.prisma.userDeviceLog.groupBy({
        by: ['deviceType'],
        _count: {
          id: true,
        },
        where,
      });

      const browsers = await this.prisma.userDeviceLog.groupBy({
        by: ['browser'],
        _count: {
          id: true,
        },
        where,
      });

      const os = await this.prisma.userDeviceLog.groupBy({
        by: ['os'],
        _count: {
          id: true,
        },
        where,
      });

      return {
        deviceTypes: deviceTypes.map((item) => ({
          type: item.deviceType,
          count: item._count.id,
        })),
        browsers: browsers.map((item) => ({
          browser: item.browser,
          count: item._count.id,
        })),
        operatingSystems: os.map((item) => ({
          os: item.os,
          count: item._count.id,
        })),
      };
    } catch (error) {
      this.logger.error(`Failed to get device summary: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get location analytics summary
   */
  async getLocationSummary(startDate?: Date, endDate?: Date) {
    try {
      const where: any = {};

      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = startDate;
        if (endDate) where.createdAt.lte = endDate;
      }

      const countries = await this.prisma.userLocationLog.groupBy({
        by: ['country'],
        _count: {
          id: true,
        },
        where,
        orderBy: {
          _count: {
            id: 'desc',
          },
        },
        take: 10,
      });

      const cities = await this.prisma.userLocationLog.groupBy({
        by: ['city'],
        _count: {
          id: true,
        },
        where,
        orderBy: {
          _count: {
            id: 'desc',
          },
        },
        take: 10,
      });

      return {
        topCountries: countries.map((item) => ({
          country: item.country,
          count: item._count.id,
        })),
        topCities: cities.map((item) => ({
          city: item.city,
          count: item._count.id,
        })),
      };
    } catch (error) {
      this.logger.error(`Failed to get location summary: ${error.message}`, error.stack);
      throw error;
    }
  }
}
