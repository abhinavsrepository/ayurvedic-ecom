/**
 * Location Detector
 *
 * Detects user location using timezone, IP geolocation, and GPS (with permission).
 */

export interface LocationInfo {
  country?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  timezone: string;
  accuracy: 'high' | 'medium' | 'low';
}

export class LocationDetector {
  /**
   * Get timezone information
   */
  static getTimezone(): string {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return 'UTC';
    }
  }

  /**
   * Get location from IP geolocation API
   */
  static async getLocationFromIP(): Promise<Partial<LocationInfo>> {
    try {
      const response = await fetch('/api/geolocation');
      if (!response.ok) {
        throw new Error('Geolocation API failed');
      }

      const data = await response.json();

      return {
        country: data.country,
        region: data.region,
        city: data.city,
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: this.getTimezone(),
        accuracy: 'medium',
      };
    } catch (error) {
      console.error('Failed to get location from IP:', error);
      return {
        timezone: this.getTimezone(),
        accuracy: 'low',
      };
    }
  }

  /**
   * Get precise location using browser Geolocation API (requires user permission)
   */
  static async getPreciseLocation(): Promise<GeolocationPosition | null> {
    return new Promise((resolve) => {
      if (!('geolocation' in navigator)) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => {
          console.warn('Geolocation permission denied or failed:', error);
          resolve(null);
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        },
      );
    });
  }

  /**
   * Get complete location information
   */
  static async detect(requestPreciseLocation: boolean = false): Promise<LocationInfo> {
    // Start with IP-based location
    const ipLocation = await this.getLocationFromIP();

    // If precise location is requested and permission is granted
    if (requestPreciseLocation) {
      const gpsLocation = await this.getPreciseLocation();

      if (gpsLocation) {
        return {
          ...ipLocation,
          latitude: gpsLocation.coords.latitude,
          longitude: gpsLocation.coords.longitude,
          accuracy: 'high',
        };
      }
    }

    return {
      timezone: this.getTimezone(),
      ...ipLocation,
    };
  }
}
