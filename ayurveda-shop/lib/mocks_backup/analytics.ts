// Mock analytics data
export interface KPIData {
  gmv: number;
  gmvChange: number;
  aov: number;
  aovChange: number;
  conversionRate: number;
  conversionChange: number;
  activeUsers: number;
  activeUsersChange: number;
  ordersToday: number;
  revenueToday: number;
}

export interface FunnelData {
  stage: string;
  users: number;
  conversionRate: number;
}

export interface CohortData {
  cohort: string;
  month0: number;
  month1: number;
  month2: number;
  month3: number;
  month4: number;
  month5: number;
}

export interface UTMData {
  source: string;
  medium: string;
  campaign: string;
  sessions: number;
  conversions: number;
  revenue: number;
  roas: number;
}

export interface TimeSeriesData {
  date: string;
  revenue: number;
  orders: number;
  users: number;
}

export interface ProductPerformance {
  productId: string;
  productName: string;
  revenue: number;
  units: number;
  views: number;
  conversionRate: number;
}

export interface CustomerSegment {
  id: string;
  name: string;
  criteria: string[];
  customerCount: number;
  avgLTV: number;
  avgOrderValue: number;
}

export function generateKPIData(): KPIData {
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
  };
}

export function generateFunnelData(): FunnelData[] {
  return [
    { stage: 'Visited Site', users: 10000, conversionRate: 100 },
    { stage: 'Viewed Product', users: 6500, conversionRate: 65 },
    { stage: 'Added to Cart', users: 3250, conversionRate: 32.5 },
    { stage: 'Initiated Checkout', users: 2275, conversionRate: 22.75 },
    { stage: 'Completed Purchase', users: 1820, conversionRate: 18.2 },
  ];
}

export function generateCohortData(): CohortData[] {
  const cohorts: CohortData[] = [];
  const months = [
    'Jan 2025', 'Dec 2024', 'Nov 2024', 'Oct 2024', 'Sep 2024', 'Aug 2024',
    'Jul 2024', 'Jun 2024', 'May 2024', 'Apr 2024', 'Mar 2024', 'Feb 2024'
  ];

  months.forEach((month, idx) => {
    const baseRetention = 100;
    // Better retention for recent cohorts
    const qualityFactor = 1 - (idx * 0.03);
    cohorts.push({
      cohort: month,
      month0: baseRetention,
      month1: baseRetention * (0.35 + Math.random() * 0.15) * qualityFactor,
      month2: baseRetention * (0.28 + Math.random() * 0.12) * qualityFactor,
      month3: baseRetention * (0.22 + Math.random() * 0.08) * qualityFactor,
      month4: baseRetention * (0.18 + Math.random() * 0.06) * qualityFactor,
      month5: baseRetention * (0.15 + Math.random() * 0.05) * qualityFactor,
    });
  });

  return cohorts;
}

export function generateUTMData(): UTMData[] {
  const sources = ['google', 'facebook', 'instagram', 'email', 'whatsapp', 'youtube', 'twitter', 'linkedin', 'pinterest'];
  const mediums = ['cpc', 'social', 'email', 'organic', 'display', 'video', 'affiliate'];
  const campaigns = [
    'diwali_sale_2024',
    'summer_wellness',
    'immunity_boost',
    'new_launch',
    'ayurveda_awareness',
    'black_friday',
    'festival_offers',
    'winter_care',
    'stress_relief',
    'weight_management',
    'skin_care_special',
    'hair_care_bundle',
    'detox_program',
    'immunity_combo',
    'wellness_subscription',
  ];

  const data: UTMData[] = [];

  // Generate 50 campaigns with varying performance
  for (let i = 0; i < 50; i++) {
    const source = sources[Math.floor(Math.random() * sources.length)];
    const medium = mediums[Math.floor(Math.random() * mediums.length)];
    const campaign = campaigns[Math.floor(Math.random() * campaigns.length)];

    // Organic and email perform better
    const isHighPerformer = medium === 'organic' || medium === 'email' || source === 'google';

    const sessions = Math.floor(Math.random() * (isHighPerformer ? 10000 : 5000)) + 500;
    const conversionRate = isHighPerformer ? (Math.random() * 0.06 + 0.03) : (Math.random() * 0.04 + 0.01);
    const conversions = Math.floor(sessions * conversionRate);
    const avgOrderValue = Math.floor(Math.random() * 2000) + 800;
    const revenue = conversions * avgOrderValue;

    // Calculate ad spend (organic has no spend)
    const adSpend = medium === 'organic' ? 1 : Math.floor(Math.random() * 80000) + 20000;
    const roas = revenue / adSpend;

    data.push({
      source,
      medium,
      campaign: `${campaign}_${source}`,
      sessions,
      conversions,
      revenue,
      roas,
    });
  }

  return data.sort((a, b) => b.revenue - a.revenue);
}

export function generateTimeSeriesData(days: number = 30): TimeSeriesData[] {
  const data: TimeSeriesData[] = [];
  const now = Date.now();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now - i * 24 * 60 * 60 * 1000);
    data.push({
      date: date.toISOString().split('T')[0],
      revenue: Math.floor(Math.random() * 50000) + 20000,
      orders: Math.floor(Math.random() * 100) + 30,
      users: Math.floor(Math.random() * 500) + 100,
    });
  }

  return data;
}

export function generateProductPerformance(): ProductPerformance[] {
  const products = [
    { name: 'Ashwagandha Capsules', price: 599, popularity: 0.9 },
    { name: 'Triphala Churna', price: 399, popularity: 0.85 },
    { name: 'Brahmi Oil', price: 449, popularity: 0.75 },
    { name: 'Chyawanprash', price: 549, popularity: 0.95 },
    { name: 'Amla Juice', price: 299, popularity: 0.8 },
    { name: 'Tulsi Drops', price: 199, popularity: 0.7 },
    { name: 'Neem Capsules', price: 499, popularity: 0.65 },
    { name: 'Giloy Tablets', price: 599, popularity: 0.88 },
    { name: 'Shatavari Powder', price: 699, popularity: 0.72 },
    { name: 'Arjuna Capsules', price: 649, popularity: 0.68 },
    { name: 'Haritaki Powder', price: 349, popularity: 0.6 },
    { name: 'Kumkumadi Oil', price: 899, popularity: 0.78 },
    { name: 'Bhringraj Hair Oil', price: 499, popularity: 0.82 },
    { name: 'Moringa Powder', price: 449, popularity: 0.76 },
    { name: 'Turmeric Capsules', price: 399, popularity: 0.84 },
    { name: 'Gokshura Tablets', price: 549, popularity: 0.64 },
    { name: 'Ashoka Syrup', price: 399, popularity: 0.71 },
    { name: 'Punarnava Tablets', price: 599, popularity: 0.66 },
    { name: 'Shankhpushpi Syrup', price: 449, popularity: 0.73 },
    { name: 'Manjistha Powder', price: 499, popularity: 0.69 },
  ];

  return products.map((product, idx) => {
    // More views for popular products
    const baseViews = Math.floor(Math.random() * 8000) + 2000;
    const views = Math.floor(baseViews * product.popularity);

    // Higher conversion for popular products
    const baseConversion = 0.02 + (Math.random() * 0.08);
    const conversionRate = baseConversion * product.popularity;
    const units = Math.floor(views * conversionRate);

    return {
      productId: `PROD-${String(idx + 1).padStart(4, '0')}`,
      productName: product.name,
      revenue: units * product.price,
      units,
      views,
      conversionRate: conversionRate * 100,
    };
  }).sort((a, b) => b.revenue - a.revenue);
}

export function generateCustomerSegments(): CustomerSegment[] {
  return [
    {
      id: 'SEG-001',
      name: 'VIP Platinum',
      criteria: ['Total Spent > ₹50,000', 'Orders > 20', 'Member > 12 months'],
      customerCount: 127,
      avgLTV: 78420,
      avgOrderValue: 3210,
    },
    {
      id: 'SEG-002',
      name: 'VIP Gold',
      criteria: ['Total Spent > ₹20,000', 'Orders > 10'],
      customerCount: 348,
      avgLTV: 35420,
      avgOrderValue: 2840,
    },
    {
      id: 'SEG-003',
      name: 'Loyal Repeat Buyers',
      criteria: ['Orders >= 5', 'Last Order < 60 days', 'Member > 6 months'],
      customerCount: 876,
      avgLTV: 12560,
      avgOrderValue: 2120,
    },
    {
      id: 'SEG-004',
      name: 'Regular Customers',
      criteria: ['Orders >= 3', 'Last Order < 90 days'],
      customerCount: 1243,
      avgLTV: 6340,
      avgOrderValue: 1820,
    },
    {
      id: 'SEG-005',
      name: 'New & Promising',
      criteria: ['Orders = 1-2', 'First Order < 30 days', 'AOV > ₹1,500'],
      customerCount: 892,
      avgLTV: 2840,
      avgOrderValue: 1920,
    },
    {
      id: 'SEG-006',
      name: 'One-Time Buyers',
      criteria: ['Orders = 1', 'First Order > 30 days'],
      customerCount: 2156,
      avgLTV: 1240,
      avgOrderValue: 1240,
    },
    {
      id: 'SEG-007',
      name: 'At-Risk',
      criteria: ['Last Order > 90 days', 'Previous Orders >= 2'],
      customerCount: 543,
      avgLTV: 4320,
      avgOrderValue: 1620,
    },
    {
      id: 'SEG-008',
      name: 'Churned',
      criteria: ['Last Order > 180 days', 'Previous Orders >= 3'],
      customerCount: 312,
      avgLTV: 5890,
      avgOrderValue: 1540,
    },
    {
      id: 'SEG-009',
      name: 'High AOV Enthusiasts',
      criteria: ['AOV > ₹3,000', 'Orders >= 2'],
      customerCount: 421,
      avgLTV: 18600,
      avgOrderValue: 3840,
    },
    {
      id: 'SEG-010',
      name: 'Wellness Subscribers',
      criteria: ['Active Subscription', 'Orders > 5'],
      customerCount: 234,
      avgLTV: 22340,
      avgOrderValue: 2450,
    },
    {
      id: 'SEG-011',
      name: 'Immunity Focused',
      criteria: ['Category = Immunity', 'Orders >= 3'],
      customerCount: 567,
      avgLTV: 7890,
      avgOrderValue: 1650,
    },
    {
      id: 'SEG-012',
      name: 'Skin & Hair Care',
      criteria: ['Category = Skin/Hair', 'Orders >= 2'],
      customerCount: 789,
      avgLTV: 5670,
      avgOrderValue: 1890,
    },
  ];
}

// TODO: replace with Spring-Boot call /api/analytics/kpi
export function getMockKPIData(): KPIData {
  return generateKPIData();
}

// TODO: replace with Spring-Boot call /api/analytics/funnel
export function getMockFunnelData(): FunnelData[] {
  return generateFunnelData();
}

// TODO: replace with Spring-Boot call /api/analytics/cohort
export function getMockCohortData(): CohortData[] {
  return generateCohortData();
}

// TODO: replace with Spring-Boot call /api/analytics/utm
export function getMockUTMData(): UTMData[] {
  return generateUTMData();
}

// Additional analytics interfaces
export interface TrafficSource {
  source: string;
  sessions: number;
  percentage: number;
  bounceRate: number;
  avgSessionDuration: number;
}

export interface DeviceBreakdown {
  device: string;
  sessions: number;
  percentage: number;
  conversionRate: number;
  revenue: number;
}

export interface GeographicData {
  country: string;
  state: string;
  city: string;
  sessions: number;
  orders: number;
  revenue: number;
}

// Generate traffic source data
export function generateTrafficSources(): TrafficSource[] {
  const sources = [
    { name: 'Organic Search', sessions: 45000, bounce: 42, duration: 245 },
    { name: 'Direct', sessions: 28000, bounce: 38, duration: 320 },
    { name: 'Social Media', sessions: 18000, bounce: 58, duration: 180 },
    { name: 'Paid Search', sessions: 15000, bounce: 45, duration: 210 },
    { name: 'Email', sessions: 12000, bounce: 28, duration: 380 },
    { name: 'Referral', sessions: 8000, bounce: 48, duration: 195 },
    { name: 'Display Ads', sessions: 5000, bounce: 62, duration: 145 },
  ];

  const totalSessions = sources.reduce((sum, s) => sum + s.sessions, 0);

  return sources.map(s => ({
    source: s.name,
    sessions: s.sessions,
    percentage: (s.sessions / totalSessions) * 100,
    bounceRate: s.bounce,
    avgSessionDuration: s.duration,
  }));
}

// Generate device breakdown
export function generateDeviceBreakdown(): DeviceBreakdown[] {
  const devices = [
    { name: 'Mobile', sessions: 68000, conversion: 2.8, revenue: 5200000 },
    { name: 'Desktop', sessions: 42000, conversion: 3.5, revenue: 4100000 },
    { name: 'Tablet', sessions: 21000, conversion: 2.2, revenue: 1500000 },
  ];

  const totalSessions = devices.reduce((sum, d) => sum + d.sessions, 0);

  return devices.map(d => ({
    device: d.name,
    sessions: d.sessions,
    percentage: (d.sessions / totalSessions) * 100,
    conversionRate: d.conversion,
    revenue: d.revenue,
  }));
}

// Generate geographic data
export function generateGeographicData(): GeographicData[] {
  const indiaData = [
    { country: 'India', state: 'Maharashtra', city: 'Mumbai', sessions: 15000, orders: 820 },
    { country: 'India', state: 'Karnataka', city: 'Bangalore', sessions: 12000, orders: 690 },
    { country: 'India', state: 'Delhi', city: 'New Delhi', sessions: 11000, orders: 650 },
    { country: 'India', state: 'Tamil Nadu', city: 'Chennai', sessions: 8500, orders: 480 },
    { country: 'India', state: 'Telangana', city: 'Hyderabad', sessions: 8000, orders: 460 },
    { country: 'India', state: 'West Bengal', city: 'Kolkata', sessions: 7000, orders: 390 },
    { country: 'India', state: 'Gujarat', city: 'Ahmedabad', sessions: 6500, orders: 370 },
    { country: 'India', state: 'Rajasthan', city: 'Jaipur', sessions: 5500, orders: 310 },
    { country: 'India', state: 'Uttar Pradesh', city: 'Lucknow', sessions: 5000, orders: 280 },
    { country: 'India', state: 'Madhya Pradesh', city: 'Indore', sessions: 4500, orders: 250 },
    { country: 'India', state: 'Punjab', city: 'Chandigarh', sessions: 4000, orders: 230 },
    { country: 'India', state: 'Kerala', city: 'Kochi', sessions: 3800, orders: 220 },
  ];

  return indiaData.map(d => ({
    ...d,
    revenue: d.orders * (Math.floor(Math.random() * 1000) + 1200),
  }));
}

// Export all
export function getMockTrafficSources(): TrafficSource[] {
  return generateTrafficSources();
}

export function getMockDeviceBreakdown(): DeviceBreakdown[] {
  return generateDeviceBreakdown();
}

export function getMockGeographicData(): GeographicData[] {
  return generateGeographicData();
}
