import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
const ML_HEALTH_URL = process.env.NEXT_PUBLIC_ML_URL || 'http://localhost:5000';

const mlClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

const mlHealthClient = axios.create({
  baseURL: ML_HEALTH_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add response interceptor to handle errors gracefully
mlClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Silently handle network errors (ML service not running)
    // Don't log to console - this is expected behavior when ML service is not running
    return Promise.reject(error);
  }
);

export const mlApi = {
  // Health check
  healthCheck: async () => {
    const response = await mlHealthClient.get('/health');
    return response.data;
  },

  // Product Recommendations
  getRecommendations: async (customerId: string, numRecommendations: number = 5) => {
    const response = await mlClient.post('/api/ml/recommendations', {
      customerId,
      numRecommendations,
    });
    return response.data;
  },

  // Demand Forecast
  getDemandForecast: async (productId: string, days: number = 30) => {
    const response = await mlClient.post('/api/ml/forecast', {
      productId,
      days,
    });
    return response.data;
  },

  // Anomaly Detection
  getAnomalies: async (metric: string = 'revenue') => {
    const response = await mlClient.get('/api/ml/anomalies', {
      params: { metric },
    });
    return response.data;
  },

  // Churn Prediction
  predictChurn: async (customerData: {
    orderHistory: number;
    totalSpent: number;
    daysSinceLastOrder: number;
    avgOrderValue: number;
    categoryPreference?: string;
  }) => {
    const response = await mlClient.post('/api/ml/predict/churn', customerData);
    return response.data;
  },

  // Customer Lifetime Value Prediction
  predictCLV: async (customerData: {
    orderHistory: number;
    totalSpent: number;
    daysSinceLastOrder: number;
    avgOrderValue: number;
  }) => {
    const response = await mlClient.post('/api/ml/predict/clv', customerData);
    return response.data;
  },

  // Model Playground
  runPlayground: async (inputData: any) => {
    const response = await mlClient.post('/api/ml/playground', inputData);
    return response.data;
  },

  // Model Information
  getModelsInfo: async () => {
    const response = await mlClient.get('/api/ml/models/info');
    return response.data;
  },
};

export default mlApi;
