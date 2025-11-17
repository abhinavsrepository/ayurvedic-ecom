import axios from 'axios';

// API Configuration
const API_URL = 'http://10.0.2.2:3333/api'; // Android emulator
// For iOS simulator use: http://localhost:3333/api
// For physical device use your computer's IP: http://192.168.x.x:3333/api

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Product API
export const getProducts = async () => {
  try {
    const response = await api.get('/products');
    return response.data.content || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductBySlug = async (slug: string) => {
  try {
    const response = await api.get(`/products/slug/${slug}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export default api;
