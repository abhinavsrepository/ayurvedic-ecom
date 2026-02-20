import { PrismaService } from '../prisma/prisma.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { CreateDeviceDto } from './dto/create-device.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { ConfigService } from '@nestjs/config';
export declare class AnalyticsService {
    private prisma;
    private configService;
    private readonly logger;
    private readonly ipSalt;
    constructor(prisma: PrismaService, configService: ConfigService);
    logLocation(createLocationDto: CreateLocationDto, requestIp?: string): Promise<{
        id: string;
        created_at: Date;
        user_id: string | null;
        city: string | null;
        country: string | null;
        session_id: string | null;
        region: string | null;
        latitude: import("@prisma/client-runtime-utils").Decimal | null;
        longitude: import("@prisma/client-runtime-utils").Decimal | null;
        timezone: string | null;
        accuracy: string | null;
        ip_hash: string | null;
    }>;
    logDevice(createDeviceDto: CreateDeviceDto): Promise<{
        id: string;
        created_at: Date;
        user_id: string | null;
        session_id: string | null;
        os: string | null;
        browser: string | null;
        device_type: string | null;
        browser_version: string | null;
        device_ram: string | null;
        cpu_cores: number | null;
        network_type: string | null;
        is_online: boolean | null;
        screen_width: number | null;
        screen_height: number | null;
        color_scheme: string | null;
        has_touch: boolean | null;
        user_agent: string | null;
    }>;
    logEvent(createEventDto: CreateEventDto, requestIp?: string): Promise<{
        event: {
            id: string;
            created_at: Date;
            user_id: string | null;
            session_id: string | null;
            referrer: string | null;
            event_type: string;
            event_data: string | null;
            location_id: string | null;
            device_id: string | null;
            page_url: string | null;
        };
        locationId: string | null;
        deviceId: string | null;
    }>;
    getEventSummary(startDate?: Date, endDate?: Date): Promise<{
        eventType: string;
        count: number;
    }[]>;
    getDeviceSummary(startDate?: Date, endDate?: Date): Promise<{
        deviceTypes: {
            type: string | null;
            count: number;
        }[];
        browsers: {
            browser: string | null;
            count: number;
        }[];
        operatingSystems: {
            os: string | null;
            count: number;
        }[];
    }>;
    getLocationSummary(startDate?: Date, endDate?: Date): Promise<{
        topCountries: {
            country: string | null;
            count: number;
        }[];
        topCities: {
            city: string | null;
            count: number;
        }[];
    }>;
    getTrafficSources(startDate?: Date, endDate?: Date): Promise<{
        sources: {
            name: string;
            visits: number;
            conversions: number;
            revenue: number;
            conversionRate: string;
        }[];
        summary: {
            totalVisits: number;
            totalConversions: number;
            totalRevenue: number;
            avgConversionRate: string;
        };
    }>;
}
