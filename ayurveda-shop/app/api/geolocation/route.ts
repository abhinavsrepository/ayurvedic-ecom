/**
 * Geolocation API Route
 *
 * Provides IP-based geolocation using ipapi.co (free tier).
 * Falls back to basic timezone information if API fails.
 */

import { NextRequest, NextResponse } from 'next/server';

// Cache geolocation results for 1 hour per IP
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

/**
 * Extract client IP from request
 */
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnecting = request.headers.get('cf-connecting-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  if (cfConnecting) {
    return cfConnecting;
  }

  return '127.0.0.1';
}

/**
 * Fetch geolocation from ip-api.com (free, no key required)
 */
async function fetchGeolocation(ip: string): Promise<any> {
  try {
    // Skip for localhost
    if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.')) {
      return {
        country: 'Local',
        region: 'Local',
        city: 'Local',
        latitude: 0,
        longitude: 0,
      };
    }

    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city,lat,lon`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Geolocation API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'success') {
      throw new Error('Geolocation lookup failed');
    }

    return {
      country: data.country,
      region: data.regionName,
      city: data.city,
      latitude: data.lat,
      longitude: data.lon,
    };
  } catch (error) {
    console.error('Geolocation fetch failed:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);

    // Check cache
    const cached = cache.get(clientIp);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json(cached.data);
    }

    // Fetch geolocation
    const geolocation = await fetchGeolocation(clientIp);

    if (!geolocation) {
      // Fallback response
      return NextResponse.json({
        country: 'Unknown',
        region: 'Unknown',
        city: 'Unknown',
        latitude: null,
        longitude: null,
      });
    }

    // Cache result
    cache.set(clientIp, {
      data: geolocation,
      timestamp: Date.now(),
    });

    // Clean old cache entries
    if (cache.size > 1000) {
      const entries = Array.from(cache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      for (let i = 0; i < 500; i++) {
        cache.delete(entries[i][0]);
      }
    }

    return NextResponse.json(geolocation);
  } catch (error) {
    console.error('Geolocation API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to get geolocation',
        country: 'Unknown',
        region: 'Unknown',
        city: 'Unknown',
      },
      { status: 500 },
    );
  }
}
