export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderTimelineEvent {
  status: string;
  timestamp: Date;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  items: any[];
  timeline: OrderTimelineEvent[];
  shippingAddress: {
    name: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  createdAt: Date;
}

export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-001',
    customerId: '1',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '+1234567890',
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'credit_card',
    total: 100,
    subtotal: 90,
    tax: 10,
    shipping: 0,
    discount: 0,
    items: [],
    timeline: [
      { status: 'pending', timestamp: new Date('2024-01-01'), note: 'Order placed' },
      { status: 'confirmed', timestamp: new Date('2024-01-01'), note: 'Order confirmed' },
      { status: 'processing', timestamp: new Date('2024-01-02'), note: 'Order processed' },
      { status: 'shipped', timestamp: new Date('2024-01-03'), note: 'Order shipped' },
      { status: 'delivered', timestamp: new Date('2024-01-05'), note: 'Order delivered' },
    ],
    shippingAddress: {
      name: 'John Doe',
      addressLine1: '123 Main Street',
      addressLine2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      pincode: '10001',
      phone: '+1234567890',
    },
    createdAt: new Date('2024-01-01'),
  },
];

export const getMockOrders = () => mockOrders;

export const getOrdersByCustomerId = (customerId: string) => {
  return mockOrders.filter(o => o.customerId === customerId);
};

