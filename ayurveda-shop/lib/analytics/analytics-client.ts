/**
 * Analytics Client
 *
 * Main client for tracking analytics with batching, offline support, and retry logic.
 */

import { DeviceDetector, DeviceInfo } from './device-detector';
import { LocationDetector, LocationInfo } from './location-detector';
import { SessionTracker } from './session-tracker';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const BATCH_SIZE = 10;
const BATCH_INTERVAL = 30000; // 30 seconds
const STORAGE_KEY = 'ayurveda_analytics_queue';

export interface AnalyticsEvent {
  eventType: string;
  eventData?: Record<string, any>;
  pageUrl?: string;
  referrer?: string;
}

interface QueuedEvent {
  event: AnalyticsEvent;
  timestamp: number;
}

export class AnalyticsClient {
  private static instance: AnalyticsClient;
  private queue: QueuedEvent[] = [];
  private sessionId: string;
  private deviceInfo: DeviceInfo | null = null;
  private locationInfo: LocationInfo | null = null;
  private batchTimer: NodeJS.Timeout | null = null;
  private isInitialized = false;

  private constructor() {
    this.sessionId = SessionTracker.getSessionId();
    this.loadQueueFromStorage();
    this.startBatchTimer();
    this.setupOnlineListener();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): AnalyticsClient {
    if (!AnalyticsClient.instance) {
      AnalyticsClient.instance = new AnalyticsClient();
    }
    return AnalyticsClient.instance;
  }

  /**
   * Initialize analytics (collect device and location info)
   */
  async initialize(requestPreciseLocation: boolean = false): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Detect device info
      this.deviceInfo = DeviceDetector.detect();

      // Detect location info
      this.locationInfo = await LocationDetector.detect(requestPreciseLocation);

      this.isInitialized = true;

      // Track session start
      await this.track('session_start', {
        deviceType: this.deviceInfo.deviceType,
        os: this.deviceInfo.os,
        browser: this.deviceInfo.browser,
      });
    } catch (error) {
      console.error('Failed to initialize analytics:', error);
    }
  }

  /**
   * Track an event
   */
  async track(
    eventType: string,
    eventData?: Record<string, any>,
    options?: { immediate?: boolean },
  ): Promise<void> {
    const event: AnalyticsEvent = {
      eventType,
      eventData,
      pageUrl: typeof window !== 'undefined' ? window.location.href : undefined,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
    };

    // Add to queue
    this.queue.push({
      event,
      timestamp: Date.now(),
    });

    this.saveQueueToStorage();

    // Send immediately if requested or queue is full
    if (options?.immediate || this.queue.length >= BATCH_SIZE) {
      await this.flush();
    }
  }

  /**
   * Track page view
   */
  async trackPageView(pageName?: string): Promise<void> {
    await this.track('page_view', {
      pageName,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    });
  }

  /**
   * Track product view
   */
  async trackProductView(productId: string, productName: string): Promise<void> {
    await this.track('product_view', {
      productId,
      productName,
    });
  }

  /**
   * Track add to cart
   */
  async trackAddToCart(productId: string, quantity: number): Promise<void> {
    await this.track('add_to_cart', {
      productId,
      quantity,
    });
  }

  /**
   * Track purchase
   */
  async trackPurchase(orderId: string, total: number, items: any[]): Promise<void> {
    await this.track(
      'purchase',
      {
        orderId,
        total,
        items,
      },
      { immediate: true },
    );
  }

  /**
   * Flush queue (send all events to server)
   */
  async flush(): Promise<void> {
    if (this.queue.length === 0) {
      return;
    }

    const eventsToSend = [...this.queue];
    this.queue = [];
    this.saveQueueToStorage();

    try {
      await Promise.all(
        eventsToSend.map((queuedEvent) => this.sendEvent(queuedEvent.event)),
      );
    } catch (error) {
      console.error('Failed to flush analytics queue:', error);
      // Re-add failed events to queue
      this.queue.push(...eventsToSend);
      this.saveQueueToStorage();
    }
  }

  /**
   * Send single event to server
   */
  private async sendEvent(event: AnalyticsEvent): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: this.sessionId,
          ...event,
          location: this.locationInfo,
          device: this.deviceInfo,
        }),
      });

      if (!response.ok) {
        throw new Error(`Analytics API error: ${response.status}`);
      }
    } catch (error) {
      // Silently fail - will retry with offline queue
      console.error('Failed to send analytics event:', error);
      throw error;
    }
  }

  /**
   * Load queue from localStorage
   */
  private loadQueueFromStorage(): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load analytics queue:', error);
    }
  }

  /**
   * Save queue to localStorage
   */
  private saveQueueToStorage(): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      console.error('Failed to save analytics queue:', error);
    }
  }

  /**
   * Start batch timer
   */
  private startBatchTimer(): void {
    if (typeof window === 'undefined') {
      return;
    }

    this.batchTimer = setInterval(() => {
      this.flush();
    }, BATCH_INTERVAL);
  }

  /**
   * Setup online listener to flush queue when connection is restored
   */
  private setupOnlineListener(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.addEventListener('online', () => {
      console.log('Connection restored, flushing analytics queue');
      this.flush();
    });
  }

  /**
   * Cleanup (call on unmount)
   */
  destroy(): void {
    if (this.batchTimer) {
      clearInterval(this.batchTimer);
    }
    this.flush();
  }
}

// Export convenience function
export const analytics = AnalyticsClient.getInstance();
