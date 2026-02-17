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
    this.ipSalt =
      this.configService.get('IP_HASH_SALT') || 'default-salt-change-me';
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
          user_id: createLocationDto.userId || null,
          session_id: createLocationDto.sessionId || null,
          ip_hash: ipHash,
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
      this.logger.error(
        `Failed to log location: ${error.message}`,
        error.stack,
      );
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
          user_id: createDeviceDto.userId || null,
          session_id: createDeviceDto.sessionId || null,
          device_type: createDeviceDto.deviceType || null,
          os: createDeviceDto.os || null,
          browser: createDeviceDto.browser || null,
          browser_version: createDeviceDto.browserVersion || null,
          device_ram: createDeviceDto.deviceRam || null,
          cpu_cores: createDeviceDto.cpuCores || null,
          network_type: createDeviceDto.networkType || null,
          is_online: createDeviceDto.isOnline ?? true,
          screen_width: createDeviceDto.screenWidth || null,
          screen_height: createDeviceDto.screenHeight || null,
          color_scheme: createDeviceDto.colorScheme || null,
          has_touch: createDeviceDto.hasTouch ?? false,
          user_agent: createDeviceDto.userAgent || null,
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
        const location = await this.logLocation(
          createEventDto.location,
          requestIp,
        );
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
          user_id: createEventDto.userId || null,
          session_id: createEventDto.sessionId || null,
          event_type: createEventDto.eventType,
          event_data: createEventDto.eventData
            ? JSON.stringify(createEventDto.eventData)
            : null,
          location_id: locationId,
          device_id: deviceId,
          page_url: createEventDto.pageUrl || null,
          referrer: createEventDto.referrer || null,
        },
      });

      this.logger.log(`Event logged: ${event.event_type} - ${event.id}`);
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
        by: ['event_type'],
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
        eventType: item.event_type,
        count: item._count.id,
      }));
    } catch (error) {
      this.logger.error(
        `Failed to get event summary: ${error.message}`,
        error.stack,
      );
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
        by: ['device_type'],
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
          type: item.device_type,
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
      this.logger.error(
        `Failed to get device summary: ${error.message}`,
        error.stack,
      );
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
      this.logger.error(
        `Failed to get location summary: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Get traffic sources summary from referrers and UTM data
   */
  async getTrafficSources(startDate?: Date, endDate?: Date) {
    try {
      const eventWhere: any = {};
      const orderWhere: any = {};

      if (startDate || endDate) {
        eventWhere.createdAt = {};
        orderWhere.createdAt = {};
        if (startDate) {
          eventWhere.createdAt.gte = startDate;
          orderWhere.createdAt.gte = startDate;
        }
        if (endDate) {
          eventWhere.createdAt.lte = endDate;
          orderWhere.createdAt.lte = endDate;
        }
      }

      // Get events with referrers
      const eventsWithReferrer = await this.prisma.analyticsEvent.findMany({
        where: {
          ...eventWhere,
          referrer: { not: null },
        },
        select: {
          referrer: true,
          event_type: true,
        },
      });

      // Get orders with UTM data
      const ordersWithUtm = await this.prisma.order.findMany({
        where: {
          ...orderWhere,
          OR: [
            { utm_source: { not: null } },
            { utm_medium: { not: null } },
            { utm_campaign: { not: null } },
          ],
        },
        select: {
          utm_source: true,
          utm_medium: true,
          utm_campaign: true,
          total: true,
        },
      });

      // Categorize traffic sources
      const sources: Record<string, { visits: number; conversions: number; revenue: number }> = {
        'Organic Search': { visits: 0, conversions: 0, revenue: 0 },
        'Direct': { visits: 0, conversions: 0, revenue: 0 },
        'Social Media': { visits: 0, conversions: 0, revenue: 0 },
        'Referral': { visits: 0, conversions: 0, revenue: 0 },
        'Email': { visits: 0, conversions: 0, revenue: 0 },
        'Paid Ads': { visits: 0, conversions: 0, revenue: 0 },
        'Other': { visits: 0, conversions: 0, revenue: 0 },
      };

      // Process referrer data
      eventsWithReferrer.forEach((event) => {
        if (!event.referrer) return;
        
        const referrer = event.referrer.toLowerCase();
        let source = 'Other';

        if (referrer.includes('google') || referrer.includes('bing') || referrer.includes('yahoo') || referrer.includes('duckduckgo')) {
          source = 'Organic Search';
        } else if (referrer.includes('facebook') || referrer.includes('instagram') || referrer.includes('twitter') || referrer.includes('x.com') || referrer.includes('linkedin') || referrer.includes('pinterest') || referrer.includes('tiktok')) {
          source = 'Social Media';
        } else if (referrer.includes('mail') || referrer.includes('newsletter')) {
          source = 'Email';
        } else if (referrer === '' || referrer === 'direct' || !referrer.startsWith('http')) {
          source = 'Direct';
        } else if (referrer.includes('localhost') || referrer.includes('127.0.0.1')) {
          source = 'Direct';
        } else {
          source = 'Referral';
        }

        sources[source].visits++;
      });

      // Process UTM data from orders
      ordersWithUtm.forEach((order) => {
        const utmSource = order.utm_source?.toLowerCase() || '';
        let source = 'Other';

        if (utmSource.includes('google') || utmSource.includes('organic') || utmSource.includes('seo')) {
          source = 'Organic Search';
        } else if (utmSource.includes('direct')) {
          source = 'Direct';
        } else if (utmSource.includes('facebook') || utmSource.includes('instagram') || utmSource.includes('social') || utmSource.includes('twitter') || utmSource.includes('linkedin')) {
          source = 'Social Media';
        } else if (utmSource.includes('email') || utmSource.includes('newsletter') || utmSource.includes('mail')) {
          source = 'Email';
        } else if (utmSource.includes('referral') || utmSource.includes('affiliate') || utmSource.includes('partner')) {
          source = 'Referral';
        } else if (utmSource.includes('paid') || utmSource.includes('ads') || utmSource.includes('ppc') || utmSource.includes('cpc')) {
          source = 'Paid Ads';
        }

        sources[source].conversions++;
        sources[source].revenue += Number(order.total) || 0;
      });

      // Convert to array format
      const trafficSources = Object.entries(sources)
        .map(([name, data]) => ({
          name,
          visits: data.visits,
          conversions: data.conversions,
          revenue: data.revenue,
          conversionRate: data.visits > 0 ? ((data.conversions / data.visits) * 100).toFixed(2) : '0.00',
        }))
        .filter((s) => s.visits > 0 || s.conversions > 0)
        .sort((a, b) => b.visits - a.visits);

      // Calculate totals
      const totalVisits = trafficSources.reduce((sum, s) => sum + s.visits, 0);
      const totalConversions = trafficSources.reduce((sum, s) => sum + s.conversions, 0);
      const totalRevenue = trafficSources.reduce((sum, s) => sum + s.revenue, 0);

      return {
        sources: trafficSources,
        summary: {
          totalVisits,
          totalConversions,
          totalRevenue,
          avgConversionRate: totalVisits > 0 ? ((totalConversions / totalVisits) * 100).toFixed(2) : '0.00',
        },
      };
    } catch (error) {
      this.logger.error(
        `Failed to get traffic sources: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
