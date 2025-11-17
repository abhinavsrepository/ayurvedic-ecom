// Mock ML/AI data and predictions
export interface RecommendationModel {
  productId: string;
  productName: string;
  confidence: number;
  reason: string;
  expectedRevenue: number;
}

export interface DemandForecast {
  productId: string;
  productName: string;
  forecasts: ForecastPoint[];
  accuracy: number;
  model: string;
}

export interface ForecastPoint {
  date: string;
  predicted: number;
  lower: number;
  upper: number;
}

export interface AnomalyDetection {
  timestamp: Date;
  metric: string;
  value: number;
  expected: number;
  deviation: number;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export interface CustomerPrediction {
  customerId: string;
  customerName: string;
  churnProbability: number;
  nextPurchaseProbability: number;
  predictedLTV: number;
  recommendedActions: string[];
}

export interface ABTest {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'running' | 'completed';
  variants: ABTestVariant[];
  startDate: Date;
  endDate?: Date;
  metric: string;
  winner?: string;
}

export interface ABTestVariant {
  id: string;
  name: string;
  traffic: number;
  conversions: number;
  revenue: number;
  conversionRate: number;
}

export function generateRecommendations(count: number = 10): RecommendationModel[] {
  const products = [
    'Ashwagandha Capsules',
    'Triphala Churna',
    'Brahmi Oil',
    'Chyawanprash',
    'Amla Juice',
    'Tulsi Drops',
    'Neem Capsules',
    'Giloy Tablets',
    'Shatavari Powder',
    'Arjuna Capsules',
  ];

  const reasons = [
    'Frequently bought together',
    'High seasonal demand',
    'Trending in similar demographics',
    'Complements recent purchases',
    'Popular in customer segment',
    'Low stock, high demand',
  ];

  return products.slice(0, count).map((name, idx) => ({
    productId: `PROD-${String(idx + 1).padStart(4, '0')}`,
    productName: name,
    confidence: Math.random() * 0.3 + 0.7,
    reason: reasons[Math.floor(Math.random() * reasons.length)],
    expectedRevenue: Math.floor(Math.random() * 50000) + 10000,
  })).sort((a, b) => b.confidence - a.confidence);
}

export function generateDemandForecasts(): DemandForecast[] {
  const products = [
    'Ashwagandha Capsules',
    'Triphala Churna',
    'Chyawanprash',
    'Giloy Tablets',
  ];

  return products.map((name, idx) => {
    const forecasts: ForecastPoint[] = [];
    const now = Date.now();
    let baseValue = Math.floor(Math.random() * 200) + 100;

    for (let i = 0; i < 30; i++) {
      const date = new Date(now + i * 24 * 60 * 60 * 1000);
      const trend = i * 2;
      const seasonal = Math.sin(i / 7) * 20;
      const predicted = baseValue + trend + seasonal + (Math.random() * 20 - 10);
      const variance = predicted * 0.15;

      forecasts.push({
        date: date.toISOString().split('T')[0],
        predicted: Math.floor(predicted),
        lower: Math.floor(predicted - variance),
        upper: Math.floor(predicted + variance),
      });
    }

    return {
      productId: `PROD-${String(idx + 1).padStart(4, '0')}`,
      productName: name,
      forecasts,
      accuracy: Math.random() * 0.15 + 0.8,
      model: ['ARIMA', 'Prophet', 'LSTM', 'XGBoost'][Math.floor(Math.random() * 4)],
    };
  });
}

export function generateAnomalies(): AnomalyDetection[] {
  const metrics = ['revenue', 'orders', 'traffic', 'conversion_rate', 'cart_abandonment'];
  const descriptions = [
    'Unusual spike in traffic without corresponding orders',
    'Revenue drop during peak hours',
    'Higher than expected cart abandonment',
    'Conversion rate significantly lower than baseline',
    'Traffic surge from unknown source',
  ];

  const severities: ('low' | 'medium' | 'high')[] = ['low', 'low', 'medium', 'medium', 'high'];

  return Array.from({ length: 5 }, (_, idx) => {
    const expected = Math.floor(Math.random() * 1000) + 500;
    const value = expected * (Math.random() > 0.5 ? 1.5 : 0.6);
    const deviation = Math.abs((value - expected) / expected);

    return {
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
      metric: metrics[idx],
      value,
      expected,
      deviation,
      severity: severities[idx],
      description: descriptions[idx],
    };
  }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export function generateCustomerPredictions(count: number = 20): CustomerPrediction[] {
  const names = [
    'Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Gupta', 'Vikram Singh',
    'Anjali Reddy', 'Rahul Verma', 'Pooja Desai', 'Arjun Nair', 'Kavya Iyer',
    'Sanjay Mehta', 'Divya Pillai', 'Rohan Joshi', 'Meera Menon', 'Karan Chopra',
  ];

  const actions = [
    'Send personalized discount offer',
    'Recommend complementary products',
    'Re-engagement email campaign',
    'VIP program invitation',
    'Loyalty points reminder',
    'New product announcement',
    'Seasonal offer',
    'Free shipping promotion',
  ];

  return Array.from({ length: count }, (_, idx) => {
    const churnProb = Math.random();
    const nextPurchaseProb = 1 - churnProb + (Math.random() * 0.3);

    return {
      customerId: `CUST-${String(idx + 1).padStart(4, '0')}`,
      customerName: names[idx % names.length],
      churnProbability: churnProb,
      nextPurchaseProbability: Math.min(nextPurchaseProb, 1),
      predictedLTV: Math.floor(Math.random() * 50000) + 5000,
      recommendedActions: [
        actions[Math.floor(Math.random() * actions.length)],
        actions[Math.floor(Math.random() * actions.length)],
      ].filter((v, i, a) => a.indexOf(v) === i),
    };
  }).sort((a, b) => b.churnProbability - a.churnProbability);
}

export function generateABTests(): ABTest[] {
  return [
    {
      id: 'TEST-001',
      name: 'Checkout Button Color',
      description: 'Testing green vs orange checkout button',
      status: 'running',
      variants: [
        {
          id: 'VAR-A',
          name: 'Control (Green)',
          traffic: 5234,
          conversions: 872,
          revenue: 1240560,
          conversionRate: 16.65,
        },
        {
          id: 'VAR-B',
          name: 'Variant (Orange)',
          traffic: 5198,
          conversions: 924,
          revenue: 1356780,
          conversionRate: 17.78,
        },
      ],
      startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      metric: 'conversion_rate',
      winner: 'VAR-B',
    },
    {
      id: 'TEST-002',
      name: 'Product Page Layout',
      description: 'Testing single column vs two column layout',
      status: 'running',
      variants: [
        {
          id: 'VAR-A',
          name: 'Single Column',
          traffic: 3456,
          conversions: 421,
          revenue: 623450,
          conversionRate: 12.18,
        },
        {
          id: 'VAR-B',
          name: 'Two Column',
          traffic: 3512,
          conversions: 398,
          revenue: 589630,
          conversionRate: 11.33,
        },
      ],
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      metric: 'conversion_rate',
    },
    {
      id: 'TEST-003',
      name: 'Free Shipping Threshold',
      description: 'Testing ₹500 vs ₹750 threshold',
      status: 'completed',
      variants: [
        {
          id: 'VAR-A',
          name: '₹500 Threshold',
          traffic: 8934,
          conversions: 1456,
          revenue: 1923450,
          conversionRate: 16.3,
        },
        {
          id: 'VAR-B',
          name: '₹750 Threshold',
          traffic: 8876,
          conversions: 1389,
          revenue: 2134560,
          conversionRate: 15.65,
        },
      ],
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      metric: 'revenue',
      winner: 'VAR-B',
    },
  ];
}

// Model playground - predict based on customer input
export interface PlaygroundInput {
  customerId?: string;
  orderHistory: number;
  totalSpent: number;
  daysSinceLastOrder: number;
  avgOrderValue: number;
  categoryPreference: string;
}

export interface PlaygroundOutput {
  churnProbability: number;
  nextPurchaseDays: number;
  recommendedProducts: string[];
  predictedOrderValue: number;
  confidence: number;
}

export function runPlaygroundPrediction(input: PlaygroundInput): PlaygroundOutput {
  // Fake ML model calculation
  const churnScore = Math.min(
    1,
    (input.daysSinceLastOrder / 180) * 0.7 + (1 / (input.orderHistory + 1)) * 0.3
  );

  const nextPurchaseDays = Math.floor(
    input.daysSinceLastOrder * 0.8 + (30 - input.orderHistory * 2)
  );

  const products = [
    'Ashwagandha Capsules',
    'Triphala Churna',
    'Brahmi Oil',
    'Chyawanprash',
    'Amla Juice',
  ];

  return {
    churnProbability: churnScore,
    nextPurchaseDays: Math.max(7, nextPurchaseDays),
    recommendedProducts: products.slice(0, 3),
    predictedOrderValue: input.avgOrderValue * (1 + Math.random() * 0.3),
    confidence: Math.random() * 0.2 + 0.75,
  };
}

// TODO: replace with Spring-Boot call /api/ml/recommendations
export function getMockRecommendations(): RecommendationModel[] {
  return generateRecommendations();
}

// TODO: replace with Spring-Boot call /api/ml/forecast
export function getMockForecasts(): DemandForecast[] {
  return generateDemandForecasts();
}

// TODO: replace with Spring-Boot call /api/ml/anomalies
export function getMockAnomalies(): AnomalyDetection[] {
  return generateAnomalies();
}
