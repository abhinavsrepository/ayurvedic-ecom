"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AnalyticsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const ip_hasher_util_1 = require("./utils/ip-hasher.util");
const config_1 = require("@nestjs/config");
let AnalyticsService = AnalyticsService_1 = class AnalyticsService {
    prisma;
    configService;
    logger = new common_1.Logger(AnalyticsService_1.name);
    ipSalt;
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        this.ipSalt =
            this.configService.get('IP_HASH_SALT') || 'default-salt-change-me';
    }
    async logLocation(createLocationDto, requestIp) {
        try {
            const ipToHash = createLocationDto.ip || requestIp || '';
            const ipHash = ipToHash ? ip_hasher_util_1.IpHasher.hash(ipToHash, this.ipSalt) : null;
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
        }
        catch (error) {
            this.logger.error(`Failed to log location: ${error.message}`, error.stack);
            throw error;
        }
    }
    async logDevice(createDeviceDto) {
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
        }
        catch (error) {
            this.logger.error(`Failed to log device: ${error.message}`, error.stack);
            throw error;
        }
    }
    async logEvent(createEventDto, requestIp) {
        try {
            let locationId = null;
            let deviceId = null;
            if (createEventDto.location) {
                const location = await this.logLocation(createEventDto.location, requestIp);
                locationId = location.id;
            }
            if (createEventDto.device) {
                const device = await this.logDevice(createEventDto.device);
                deviceId = device.id;
            }
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
        }
        catch (error) {
            this.logger.error(`Failed to log event: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getEventSummary(startDate, endDate) {
        try {
            const where = {};
            if (startDate || endDate) {
                where.createdAt = {};
                if (startDate)
                    where.createdAt.gte = startDate;
                if (endDate)
                    where.createdAt.lte = endDate;
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
        }
        catch (error) {
            this.logger.error(`Failed to get event summary: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getDeviceSummary(startDate, endDate) {
        try {
            const where = {};
            if (startDate || endDate) {
                where.createdAt = {};
                if (startDate)
                    where.createdAt.gte = startDate;
                if (endDate)
                    where.createdAt.lte = endDate;
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
        }
        catch (error) {
            this.logger.error(`Failed to get device summary: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getLocationSummary(startDate, endDate) {
        try {
            const where = {};
            if (startDate || endDate) {
                where.createdAt = {};
                if (startDate)
                    where.createdAt.gte = startDate;
                if (endDate)
                    where.createdAt.lte = endDate;
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
        }
        catch (error) {
            this.logger.error(`Failed to get location summary: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getTrafficSources(startDate, endDate) {
        try {
            const eventWhere = {};
            const orderWhere = {};
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
            const sources = {
                'Organic Search': { visits: 0, conversions: 0, revenue: 0 },
                'Direct': { visits: 0, conversions: 0, revenue: 0 },
                'Social Media': { visits: 0, conversions: 0, revenue: 0 },
                'Referral': { visits: 0, conversions: 0, revenue: 0 },
                'Email': { visits: 0, conversions: 0, revenue: 0 },
                'Paid Ads': { visits: 0, conversions: 0, revenue: 0 },
                'Other': { visits: 0, conversions: 0, revenue: 0 },
            };
            eventsWithReferrer.forEach((event) => {
                if (!event.referrer)
                    return;
                const referrer = event.referrer.toLowerCase();
                let source = 'Other';
                if (referrer.includes('google') || referrer.includes('bing') || referrer.includes('yahoo') || referrer.includes('duckduckgo')) {
                    source = 'Organic Search';
                }
                else if (referrer.includes('facebook') || referrer.includes('instagram') || referrer.includes('twitter') || referrer.includes('x.com') || referrer.includes('linkedin') || referrer.includes('pinterest') || referrer.includes('tiktok')) {
                    source = 'Social Media';
                }
                else if (referrer.includes('mail') || referrer.includes('newsletter')) {
                    source = 'Email';
                }
                else if (referrer === '' || referrer === 'direct' || !referrer.startsWith('http')) {
                    source = 'Direct';
                }
                else if (referrer.includes('localhost') || referrer.includes('127.0.0.1')) {
                    source = 'Direct';
                }
                else {
                    source = 'Referral';
                }
                sources[source].visits++;
            });
            ordersWithUtm.forEach((order) => {
                const utmSource = order.utm_source?.toLowerCase() || '';
                let source = 'Other';
                if (utmSource.includes('google') || utmSource.includes('organic') || utmSource.includes('seo')) {
                    source = 'Organic Search';
                }
                else if (utmSource.includes('direct')) {
                    source = 'Direct';
                }
                else if (utmSource.includes('facebook') || utmSource.includes('instagram') || utmSource.includes('social') || utmSource.includes('twitter') || utmSource.includes('linkedin')) {
                    source = 'Social Media';
                }
                else if (utmSource.includes('email') || utmSource.includes('newsletter') || utmSource.includes('mail')) {
                    source = 'Email';
                }
                else if (utmSource.includes('referral') || utmSource.includes('affiliate') || utmSource.includes('partner')) {
                    source = 'Referral';
                }
                else if (utmSource.includes('paid') || utmSource.includes('ads') || utmSource.includes('ppc') || utmSource.includes('cpc')) {
                    source = 'Paid Ads';
                }
                sources[source].conversions++;
                sources[source].revenue += Number(order.total) || 0;
            });
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
        }
        catch (error) {
            this.logger.error(`Failed to get traffic sources: ${error.message}`, error.stack);
            throw error;
        }
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = AnalyticsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map