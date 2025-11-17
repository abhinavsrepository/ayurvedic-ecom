/**
 * IP Hasher Utility
 *
 * GDPR-compliant IP address hashing for privacy protection.
 */

import { createHash, createHmac } from 'crypto';

export class IpHasher {
  /**
   * Hash an IP address using SHA-256 with optional salt
   * @param ip IP address to hash
   * @param salt Optional salt for additional security
   * @returns Hashed IP address
   */
  static hash(ip: string, salt?: string): string {
    if (!ip) {
      return '';
    }

    if (salt) {
      return createHmac('sha256', salt).update(ip).digest('hex');
    }

    return createHash('sha256').update(ip).digest('hex');
  }

  /**
   * Anonymize IP address by removing last octet (IPv4) or last 80 bits (IPv6)
   * This is useful for GDPR compliance while maintaining some geographic information
   * @param ip IP address to anonymize
   * @returns Anonymized IP address
   */
  static anonymize(ip: string): string {
    if (!ip) {
      return '';
    }

    // IPv4
    if (ip.includes('.')) {
      const parts = ip.split('.');
      if (parts.length === 4) {
        return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
      }
    }

    // IPv6
    if (ip.includes(':')) {
      const parts = ip.split(':');
      if (parts.length >= 4) {
        return parts.slice(0, 4).join(':') + '::';
      }
    }

    return ip;
  }

  /**
   * Extract IP address from request headers (handles proxies)
   * @param headers Request headers
   * @returns IP address
   */
  static extractIp(headers: any): string {
    return (
      headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      headers['x-real-ip'] ||
      headers['cf-connecting-ip'] || // Cloudflare
      headers['x-client-ip'] ||
      ''
    );
  }
}
