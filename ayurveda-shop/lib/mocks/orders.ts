// Mock orders data
export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  shippingAddress: Address;
  billingAddress: Address;
  timeline: OrderTimeline[];
  createdAt: Date;
  updatedAt: Date;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  variantId?: string;
  variantName?: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Address {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderTimeline {
  status: string;
  timestamp: Date;
  note?: string;
  updatedBy?: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'refunded';

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

const indianNames = [
  'Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Gupta', 'Vikram Singh',
  'Anjali Reddy', 'Rahul Verma', 'Pooja Desai', 'Arjun Nair', 'Kavya Iyer',
  'Sanjay Mehta', 'Divya Pillai', 'Rohan Joshi', 'Meera Menon', 'Karan Chopra',
  'Ritu Agarwal', 'Nikhil Rao', 'Shreya Kapoor', 'Aditya Mishra', 'Neha Pandey',
];

const indianCities = [
  { city: 'Mumbai', state: 'Maharashtra' },
  { city: 'Delhi', state: 'Delhi' },
  { city: 'Bangalore', state: 'Karnataka' },
  { city: 'Hyderabad', state: 'Telangana' },
  { city: 'Chennai', state: 'Tamil Nadu' },
  { city: 'Kolkata', state: 'West Bengal' },
  { city: 'Pune', state: 'Maharashtra' },
  { city: 'Ahmedabad', state: 'Gujarat' },
  { city: 'Jaipur', state: 'Rajasthan' },
  { city: 'Lucknow', state: 'Uttar Pradesh' },
];

const utmSources = ['google', 'facebook', 'instagram', 'email', 'direct', 'whatsapp'];
const utmMediums = ['cpc', 'social', 'email', 'organic', 'referral'];
const utmCampaigns = ['diwali_sale', 'summer_wellness', 'immunity_boost', 'new_launch'];

const paymentMethods = ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'COD', 'Wallet'];

export function generateMockOrders(count: number = 200): Order[] {
  const orders: Order[] = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const customerName = indianNames[Math.floor(Math.random() * indianNames.length)];
    const location = indianCities[Math.floor(Math.random() * indianCities.length)];
    const createdAt = new Date(now - Math.random() * 90 * 24 * 60 * 60 * 1000);

    const items = generateOrderItems();
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.18;
    const shipping = subtotal > 500 ? 0 : 50;
    const discount = Math.random() > 0.7 ? subtotal * 0.1 : 0;
    const total = subtotal + tax + shipping - discount;

    const statuses: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const statusWeights = [0.05, 0.1, 0.15, 0.2, 0.5];
    const status = weightedRandom(statuses, statusWeights);

    orders.push({
      id: `ORD-${String(i + 1).padStart(6, '0')}`,
      orderNumber: `AYU${createdAt.getFullYear()}${String(i + 10000)}`,
      customerId: `CUST-${String(Math.floor(Math.random() * 1000)).padStart(4, '0')}`,
      customerName,
      customerEmail: `${customerName.toLowerCase().replace(' ', '.')}@example.com`,
      customerPhone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      items,
      subtotal,
      tax,
      shipping,
      discount,
      total,
      status,
      paymentStatus: status === 'cancelled' ? 'refunded' : status === 'returned' ? 'refunded' : 'paid',
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      shippingAddress: {
        name: customerName,
        phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        addressLine1: `${Math.floor(Math.random() * 500) + 1}, ${['MG Road', 'Brigade Road', 'Residency Road', 'Commercial Street'][Math.floor(Math.random() * 4)]}`,
        addressLine2: Math.random() > 0.5 ? `Near ${['Metro Station', 'Bus Stop', 'Mall'][Math.floor(Math.random() * 3)]}` : undefined,
        city: location.city,
        state: location.state,
        pincode: String(Math.floor(Math.random() * 900000) + 100000),
      },
      billingAddress: {
        name: customerName,
        phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        addressLine1: `${Math.floor(Math.random() * 500) + 1}, ${['MG Road', 'Brigade Road', 'Residency Road', 'Commercial Street'][Math.floor(Math.random() * 4)]}`,
        city: location.city,
        state: location.state,
        pincode: String(Math.floor(Math.random() * 900000) + 100000),
      },
      timeline: generateTimeline(status, createdAt),
      createdAt,
      updatedAt: new Date(createdAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000),
      utmSource: Math.random() > 0.3 ? utmSources[Math.floor(Math.random() * utmSources.length)] : undefined,
      utmMedium: Math.random() > 0.3 ? utmMediums[Math.floor(Math.random() * utmMediums.length)] : undefined,
      utmCampaign: Math.random() > 0.5 ? utmCampaigns[Math.floor(Math.random() * utmCampaigns.length)] : undefined,
    });
  }

  return orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

function generateOrderItems(): OrderItem[] {
  const itemCount = Math.floor(Math.random() * 3) + 1;
  const items: OrderItem[] = [];

  const productNames = [
    'Ashwagandha Capsules',
    'Triphala Churna',
    'Brahmi Oil',
    'Chyawanprash',
    'Amla Juice',
    'Tulsi Drops',
  ];

  for (let i = 0; i < itemCount; i++) {
    const price = Math.floor(Math.random() * 1000) + 200;
    const quantity = Math.floor(Math.random() * 3) + 1;

    items.push({
      id: `ITEM-${String(Math.floor(Math.random() * 100000))}`,
      productId: `PROD-${String(Math.floor(Math.random() * 50) + 1).padStart(4, '0')}`,
      productName: productNames[Math.floor(Math.random() * productNames.length)],
      variantId: Math.random() > 0.5 ? `VAR-${Math.floor(Math.random() * 100)}` : undefined,
      variantName: Math.random() > 0.5 ? `${[30, 60, 90][Math.floor(Math.random() * 3)]} Capsules` : undefined,
      quantity,
      price,
      total: price * quantity,
    });
  }

  return items;
}

function generateTimeline(finalStatus: OrderStatus, startDate: Date): OrderTimeline[] {
  const timeline: OrderTimeline[] = [];
  const statusFlow: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
  const finalIndex = statusFlow.indexOf(finalStatus);

  let currentTime = startDate.getTime();

  for (let i = 0; i <= finalIndex; i++) {
    timeline.push({
      status: statusFlow[i],
      timestamp: new Date(currentTime),
      note: `Order ${statusFlow[i]}`,
      updatedBy: 'System',
    });
    currentTime += Math.random() * 24 * 60 * 60 * 1000;
  }

  return timeline;
}

function weightedRandom<T>(items: T[], weights: number[]): T {
  const total = weights.reduce((sum, w) => sum + w, 0);
  let random = Math.random() * total;

  for (let i = 0; i < items.length; i++) {
    random -= weights[i];
    if (random <= 0) return items[i];
  }

  return items[items.length - 1];
}

// TODO: replace with Spring-Boot call /api/orders
export function getMockOrders(): Order[] {
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem('ayurveda_orders');
    if (cached) {
      return JSON.parse(cached, (key, value) => {
        if (key === 'createdAt' || key === 'updatedAt' || key === 'timestamp') {
          return new Date(value);
        }
        return value;
      });
    }
  }

  const orders = generateMockOrders(200);
  if (typeof window !== 'undefined') {
    localStorage.setItem('ayurveda_orders', JSON.stringify(orders));
  }
  return orders;
}

export function saveMockOrders(orders: Order[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('ayurveda_orders', JSON.stringify(orders));
  }
}
