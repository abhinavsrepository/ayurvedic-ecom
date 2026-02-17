import { apiClient } from './client';

export interface TrafficSource {
  name: string;
  visits: number;
  conversions: number;
  revenue: number;
  conversionRate: string;
}

export interface TrafficSourcesResponse {
  sources: TrafficSource[];
  summary: {
    totalVisits: number;
    totalConversions: number;
    totalRevenue: number;
    avgConversionRate: string;
  };
}

export interface EventSummaryItem {
  eventType: string;
  count: number;
}

export interface DeviceSummary {
  deviceTypes: { type: string; count: number }[];
  browsers: { browser: string; count: number }[];
  operatingSystems: { os: string; count: number }[];
}

export interface LocationSummary {
  topCountries: { country: string; count: number }[];
  topCities: { city: string; count: number }[];
}

export const analyticsApi = {
  // Traffic Sources
  getTrafficSources: async (startDate?: string, endDate?: string): Promise<TrafficSourcesResponse> => {
    return apiClient.get<TrafficSourcesResponse>('/api/analytics/traffic-sources', {
      params: { startDate, endDate },
    });
  },

  // Event Summary
  getEventSummary: async (startDate?: string, endDate?: string): Promise<EventSummaryItem[]> => {
    return apiClient.get<EventSummaryItem[]>('/api/analytics/summary/events', {
      params: { startDate, endDate },
    });
  },

  // Device Summary
  getDeviceSummary: async (startDate?: string, endDate?: string): Promise<DeviceSummary> => {
    return apiClient.get<DeviceSummary>('/api/analytics/summary/devices', {
      params: { startDate, endDate },
    });
  },

  // Location Summary
  getLocationSummary: async (startDate?: string, endDate?: string): Promise<LocationSummary> => {
    return apiClient.get<LocationSummary>('/api/analytics/summary/locations', {
      params: { startDate, endDate },
    });
  },

  // Log events (for frontend tracking)
  logEvent: async (data: {
    eventType: string;
    eventData?: Record<string, any>;
    pageUrl?: string;
    referrer?: string;
    sessionId?: string;
    userId?: string;
    device?: {
      deviceType?: string;
      os?: string;
      browser?: string;
      browserVersion?: string;
      screenWidth?: number;
      screenHeight?: number;
      userAgent?: string;
    };
    location?: {
      country?: string;
      region?: string;
      city?: string;
    };
  }) => {
    return apiClient.post('/api/analytics/event', data);
  },
};
