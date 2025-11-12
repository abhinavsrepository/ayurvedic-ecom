// Mock Socket.io client for real-time updates
export type SocketEvent = 'order:new' | 'kpi:update' | 'alert:lowstock' | 'user:online';

export interface MockSocketClient {
  on: (event: SocketEvent, callback: (data: any) => void) => void;
  off: (event: SocketEvent, callback: (data: any) => void) => void;
  emit: (event: string, data: any) => void;
  disconnect: () => void;
}

class MockSocket implements MockSocketClient {
  private listeners: Map<SocketEvent, Set<(data: any) => void>> = new Map();
  private intervals: NodeJS.Timeout[] = [];

  constructor() {
    this.startMockEvents();
  }

  on(event: SocketEvent, callback: (data: any) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  }

  off(event: SocketEvent, callback: (data: any) => void): void {
    this.listeners.get(event)?.delete(callback);
  }

  emit(event: string, data: any): void {
    // Mock emit - doesn't actually send anything
    console.log('[Mock Socket] Emitted:', event, data);
  }

  disconnect(): void {
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals = [];
    this.listeners.clear();
  }

  private startMockEvents(): void {
    // Emit new order every 10-30 seconds
    const orderInterval = setInterval(() => {
      this.trigger('order:new', this.generateMockOrder());
    }, Math.random() * 20000 + 10000);

    // Update KPIs every 5 seconds
    const kpiInterval = setInterval(() => {
      this.trigger('kpi:update', this.generateKPIUpdate());
    }, 5000);

    // Random low stock alerts
    const alertInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        this.trigger('alert:lowstock', this.generateLowStockAlert());
      }
    }, 30000);

    // Update active users count
    const userInterval = setInterval(() => {
      this.trigger('user:online', {
        count: Math.floor(Math.random() * 100) + 150,
      });
    }, 10000);

    this.intervals.push(orderInterval, kpiInterval, alertInterval, userInterval);
  }

  private trigger(event: SocketEvent, data: any): void {
    this.listeners.get(event)?.forEach(callback => callback(data));
  }

  private generateMockOrder() {
    const names = ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Gupta'];
    const products = ['Ashwagandha', 'Triphala', 'Brahmi Oil', 'Chyawanprash'];

    return {
      id: `ORD-${String(Math.floor(Math.random() * 100000)).padStart(6, '0')}`,
      orderNumber: `AYU${Date.now()}`,
      customerName: names[Math.floor(Math.random() * names.length)],
      total: Math.floor(Math.random() * 5000) + 500,
      items: Math.floor(Math.random() * 3) + 1,
      product: products[Math.floor(Math.random() * products.length)],
      timestamp: new Date(),
    };
  }

  private generateKPIUpdate() {
    return {
      gmv: Math.floor(Math.random() * 500000) + 1000000,
      gmvChange: (Math.random() * 40) - 10,
      aov: Math.floor(Math.random() * 2000) + 800,
      aovChange: (Math.random() * 20) - 5,
      conversionRate: Math.random() * 3 + 2,
      conversionChange: (Math.random() * 2) - 0.5,
      activeUsers: Math.floor(Math.random() * 500) + 200,
      activeUsersChange: (Math.random() * 30) - 10,
      ordersToday: Math.floor(Math.random() * 100) + 50,
      revenueToday: Math.floor(Math.random() * 100000) + 50000,
      timestamp: new Date(),
    };
  }

  private generateLowStockAlert() {
    const products = ['Ashwagandha Capsules', 'Triphala Churna', 'Brahmi Oil'];
    return {
      productId: `PROD-${String(Math.floor(Math.random() * 50) + 1).padStart(4, '0')}`,
      productName: products[Math.floor(Math.random() * products.length)],
      currentStock: Math.floor(Math.random() * 10) + 1,
      threshold: 20,
      timestamp: new Date(),
    };
  }
}

let mockSocketInstance: MockSocket | null = null;

// TODO: replace with real Socket.io connection to Spring-Boot websocket endpoint
export function getMockSocket(): MockSocketClient {
  if (typeof window === 'undefined') {
    // Return a no-op socket for SSR
    return {
      on: () => {},
      off: () => {},
      emit: () => {},
      disconnect: () => {},
    };
  }

  if (!mockSocketInstance) {
    mockSocketInstance = new MockSocket();
  }

  return mockSocketInstance;
}
