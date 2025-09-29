import axios from 'axios';
import { mockSellers, mockProducts } from './mockData';

// Use a non-existent URL to force fallback to mock data
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:9999/webapp';

// Cache for API responses
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 3000, // Reduced timeout for faster fallback
});

// Cache interceptor
const getCachedData = (key: string) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key: string, data: any) => {
  cache.set(key, { data, timestamp: Date.now() });
};

// Interceptor to add Telegram initData to requests
api.interceptors.request.use((config) => {
  // Try to get initData from Telegram WebApp first
  let initData = (window as any).Telegram?.WebApp?.initData;
  
  // If not available, try to get from localStorage (for development)
  if (!initData) {
    initData = localStorage.getItem('telegramInitData');
  }
  
  // If still not available, create a mock one for development
  if (!initData) {
    const mockUser = {
      id: 123456789,
      first_name: 'Test',
      last_name: 'User',
      username: 'testuser',
      language_code: 'uz'
    };
    initData = `user=${encodeURIComponent(JSON.stringify(mockUser))}&auth_date=${Math.floor(Date.now() / 1000)}&hash=mock_hash_for_development`;
  }
  
  if (initData) {
    config.headers['X-Telegram-Init-Data'] = initData;
  }
  
  return config;
});

// Response interceptor for caching
api.interceptors.response.use(
  (response) => {
    // Cache GET requests
    if (response.config.method === 'get') {
      const cacheKey = `${response.config.method}:${response.config.url}`;
      setCachedData(cacheKey, response.data);
    }
    return response;
  },
  (error) => {
    // Return cached data if available on error
    if (error.config?.method === 'get') {
      const cacheKey = `${error.config.method}:${error.config.url}`;
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        return Promise.resolve({ data: cachedData });
      }
    }
    return Promise.reject(error);
  }
);

// Mini App API endpoints
export const miniAppApi = {
  getEntry: () => api.get('/mini-app/entry'),
  getUserDashboard: () => api.get('/mini-app/user-dashboard'),
  getSellerDashboard: () => api.get('/mini-app/seller-dashboard'),
  getAdminDashboard: () => api.get('/mini-app/admin-dashboard'),
};

// Products API endpoints with caching
export const productsApi = {
  getProducts: async () => {
    const cacheKey = 'products:all';
    const cached = getCachedData(cacheKey);
    if (cached) return { data: cached };

    try {
      const response = await api.get('/products');
      setCachedData(cacheKey, response.data);
      return response;
    } catch (error) {
      console.log('Backend not available, returning mock data');
      return { data: mockProducts };
    }
  },
  getProductById: async (id: number) => {
    const cacheKey = `products:${id}`;
    const cached = getCachedData(cacheKey);
    if (cached) return { data: cached };

    try {
      const response = await api.get(`/products/${id}`);
      setCachedData(cacheKey, response.data);
      return response;
    } catch (error) {
      console.log('Backend not available, returning mock data');
      const product = mockProducts.find(p => p.id === id);
      if (product) {
        return { data: product };
      }
      throw new Error('Product not found');
    }
  },
  getSellerProducts: async () => {
    const cacheKey = 'products:seller';
    const cached = getCachedData(cacheKey);
    if (cached) return { data: cached };

    try {
      const response = await api.get('/products/seller');
      setCachedData(cacheKey, response.data);
      return response;
    } catch (error) {
      console.log('Backend not available, returning mock data');
      return { data: mockProducts.filter(p => p.seller.id === 1) };
    }
  },
  searchProducts: async (query: string, category?: string) => {
    try {
      const response = await api.get(`/products/search?q=${query}${category ? `&category=${category}` : ''}`);
      return response;
    } catch (error) {
      console.log('Backend not available, returning mock data');
      let filteredProducts = mockProducts;
      if (query) {
        filteredProducts = mockProducts.filter(p => 
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.seller.businessName.toLowerCase().includes(query.toLowerCase())
        );
      }
      if (category && category !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.seller.businessType === category);
      }
      return { data: filteredProducts };
    }
  },
  createProduct: async (data: any) => {
    try {
      console.log('API: Creating product with data:', data);
      const response = await api.post('/products', data);
      console.log('API: Product created successfully:', response.data);
      // Clear cache after creating
      cache.delete('products:all');
      cache.delete('products:seller');
      return response;
    } catch (error: any) {
      console.log('Backend not available, simulating product creation for demo');
      return { 
        data: { 
          id: Math.floor(Math.random() * 1000), 
          ...data, 
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } 
      };
    }
  },
  updateProduct: async (id: number, data: any) => {
    try {
      console.log('API: Updating product with data:', data);
      const response = await api.patch(`/products/${id}`, data);
      console.log('API: Product updated successfully:', response.data);
      // Clear cache after updating
      cache.delete(`products:${id}`);
      cache.delete('products:all');
      cache.delete('products:seller');
      return response;
    } catch (error: any) {
      console.log('Backend not available, simulating product update for demo');
      return { 
        data: { 
          id, 
          ...data, 
          updatedAt: new Date().toISOString()
        } 
      };
    }
  },
  deleteProduct: async (id: number) => {
    try {
      console.log('API: Deleting product with id:', id);
      const response = await api.delete(`/products/${id}`);
      console.log('API: Product deleted successfully:', response.data);
      // Clear cache after deleting
      cache.delete(`products:${id}`);
      cache.delete('products:all');
      cache.delete('products:seller');
      return response;
    } catch (error: any) {
      console.log('Backend not available, simulating product deletion for demo');
      return { data: { id, deleted: true } };
    }
  },
};

// Sellers API endpoints with caching
export const sellersApi = {
  getSellers: async () => {
    const cacheKey = 'sellers:all';
    const cached = getCachedData(cacheKey);
    if (cached) return { data: cached };

    try {
      const response = await api.get('/sellers');
      setCachedData(cacheKey, response.data);
      return response;
    } catch (error) {
      console.log('Backend not available, returning mock data');
      return { data: mockSellers };
    }
  },
  getSellerById: async (id: number) => {
    const cacheKey = `sellers:${id}`;
    const cached = getCachedData(cacheKey);
    if (cached) return { data: cached };

    try {
      const response = await api.get(`/sellers/${id}`);
      setCachedData(cacheKey, response.data);
      return response;
    } catch (error) {
      console.log('Backend not available, returning mock data');
      const seller = mockSellers.find(s => s.id === id);
      if (seller) {
        return { data: seller };
      }
      throw new Error('Seller not found');
    }
  },
  getSellerProfile: async () => {
    const cacheKey = 'sellers:profile';
    const cached = getCachedData(cacheKey);
    if (cached) return { data: cached };

    try {
      const response = await api.get('/sellers/profile');
      setCachedData(cacheKey, response.data);
      return response;
    } catch (error) {
      console.log('Backend not available, returning mock data');
      return { data: mockSellers[0] };
    }
  },
  getNearbySellers: async (lat: number, lng: number) => {
    try {
      const response = await api.get(`/sellers/nearby?lat=${lat}&lng=${lng}`);
      return response;
    } catch (error) {
      console.log('Backend not available, returning mock data');
      return { data: mockSellers };
    }
  },
  createSeller: async (data: any) => {
    try {
      const response = await api.post('/sellers', data);
      // Clear cache after creating
      cache.delete('sellers:all');
      return response;
    } catch (error: any) {
      console.log('Backend not available, simulating seller creation for demo');
      return { 
        data: { 
          id: Math.floor(Math.random() * 1000), 
          ...data, 
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } 
      };
    }
  },
  updateSellerProfile: async (data: any) => {
    try {
      const response = await api.patch('/sellers/profile', data);
      // Clear cache after updating
      cache.delete('sellers:profile');
      cache.delete('sellers:all');
      return response;
    } catch (error: any) {
      console.log('Backend not available, simulating seller profile update for demo');
      return { 
        data: { 
          ...data, 
          updatedAt: new Date().toISOString()
        } 
      };
    }
  },
};

// Users API endpoints
export const usersApi = {
  getUsers: async () => {
    try {
      const response = await api.get('/users');
      return response;
    } catch (error) {
      console.log('Backend not available, returning mock data');
      return { data: [] };
    }
  },
  getUserById: async (id: number) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response;
    } catch (error) {
      console.log('Backend not available, returning mock data');
      return { data: null };
    }
  },
  getUserProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response;
    } catch (error) {
      console.log('Backend not available, returning mock data');
      return { data: null };
    }
  },
  createUser: async (data: any) => {
    try {
      const response = await api.post('/users', data);
      return response;
    } catch (error: any) {
      console.log('Backend not available, simulating user creation for demo');
      return { 
        data: { 
          id: Math.floor(Math.random() * 1000), 
          ...data, 
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } 
      };
    }
  },
  updateUserProfile: async (data: any) => {
    try {
      const response = await api.patch('/users/profile', data);
      return response;
    } catch (error: any) {
      console.log('Backend not available, simulating user profile update for demo');
      return { 
        data: { 
          ...data, 
          updatedAt: new Date().toISOString()
        } 
      };
    }
  },
};

// Orders API endpoints
export const ordersApi = {
  getOrders: async () => {
    try {
      const response = await api.get('/orders');
      return response;
    } catch (error) {
      console.log('Backend not available, returning mock data');
      return { data: [] };
    }
  },
  getOrderById: async (id: number) => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response;
    } catch (error) {
      throw new Error('Order not found');
    }
  },
  getUserOrders: async (userId: string) => {
    try {
      const response = await api.get(`/orders/user/${userId}`);
      return response;
    } catch (error) {
      console.log('Backend not available, returning mock data');
      return { data: [] };
    }
  },
  createOrder: async (data: any) => {
    try {
      const response = await api.post('/orders', data);
      return response;
    } catch (error: any) {
      console.log('Backend not available, simulating order creation for demo');
      return { 
        data: { 
          id: Math.floor(Math.random() * 1000), 
          ...data, 
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } 
      };
    }
  },
  updateOrderStatus: async (id: number, status: string) => {
    try {
      const response = await api.patch(`/orders/${id}/status`, { status });
      return response;
    } catch (error: any) {
      console.log('Backend not available, simulating order status update for demo');
      return { 
        data: { 
          id, 
          status, 
          updatedAt: new Date().toISOString()
        } 
      };
    }
  },
};

// Dashboard API endpoints
export const dashboardApi = {
  getSellerOrders: async () => {
    try {
      const response = await api.get('/dashboard/seller/orders');
      return response;
    } catch (error) {
      console.log('Backend not available, returning mock data');
      return { data: [] };
    }
  },
  getSellerStats: async () => {
    try {
      const response = await api.get('/dashboard/seller/stats');
      return response;
    } catch (error) {
      console.log('Backend not available, returning mock data');
      return { 
        data: {
          totalOrders: 0,
          totalRevenue: 0,
          activeProducts: 0,
          averageRating: 0
        }
      };
    }
  },
};

// Admin API endpoints
export const adminApi = {
  getUsers: async () => {
    try {
      const response = await api.get('/admin/users');
      return response;
    } catch (error) {
      console.log('Backend not available, returning mock data');
      return { data: [] };
    }
  },
  getSellers: async () => {
    try {
      const response = await api.get('/admin/sellers');
      return response;
    } catch (error) {
      console.log('Backend not available, returning mock data');
      return { data: mockSellers };
    }
  },
  getOrders: async () => {
    try {
      const response = await api.get('/admin/orders');
      return response;
    } catch (error) {
      console.log('Backend not available, returning mock data');
      return { data: [] };
    }
  },
  getDashboard: async () => {
    try {
      const response = await api.get('/admin/dashboard');
      return response;
    } catch (error) {
      console.log('Backend not available, returning mock data');
      return { 
        data: {
          totalUsers: 0,
          totalSellers: 0,
          totalProducts: 0,
          totalOrders: 0
        }
      };
    }
  },
  updateSellerStatus: async (id: number, status: string) => {
    try {
      const response = await api.patch(`/admin/sellers/${id}/status`, { status });
      return response;
    } catch (error: any) {
      console.log('Backend not available, simulating seller status update for demo');
      return { 
        data: { 
          id, 
          status, 
          updatedAt: new Date().toISOString()
        } 
      };
    }
  },
};
