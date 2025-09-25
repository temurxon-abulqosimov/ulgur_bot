import axios from 'axios';
import { mockSellers, mockProducts } from './mockData';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/webapp';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add Telegram initData to requests
api.interceptors.request.use((config) => {
  const initData = (window as any).Telegram?.WebApp?.initData;
  if (initData) {
    config.headers['X-Telegram-Init-Data'] = initData;
  }
  return config;
});

// Mini App API endpoints
export const miniAppApi = {
  getEntry: () => api.get('/mini-app/entry'),
  getUserDashboard: () => api.get('/mini-app/user-dashboard'),
  getSellerDashboard: () => api.get('/mini-app/seller-dashboard'),
  getAdminDashboard: () => api.get('/mini-app/admin-dashboard'),
};

// Products API endpoints
export const productsApi = {
  getProducts: async () => {
    try {
      const response = await api.get('/products');
      return response;
    } catch (error) {
      // Return mock data if backend is not available
      return { data: mockProducts };
    }
  },
  getProductById: async (id: number) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response;
    } catch (error) {
      // Return mock data if backend is not available
      const product = mockProducts.find(p => p.id === id);
      if (product) {
        return { data: product };
      }
      throw new Error('Product not found');
    }
  },
  getSellerProducts: async () => {
    try {
      const response = await api.get('/products/seller');
      return response;
    } catch (error) {
      // Return mock data if backend is not available
      return { data: mockProducts.filter(p => p.seller.id === 1) };
    }
  },
  searchProducts: async (query: string, category?: string) => {
    try {
      const response = await api.get(`/products/search?q=${query}${category ? `&category=${category}` : ''}`);
      return response;
    } catch (error) {
      // Return mock data if backend is not available
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
  createProduct: (data: any) => api.post('/products', data),
  updateProduct: (id: number, data: any) => api.patch(`/products/${id}`, data),
  deleteProduct: (id: number) => api.delete(`/products/${id}`),
};

// Sellers API endpoints
export const sellersApi = {
  getSellers: async () => {
    try {
      const response = await api.get('/sellers');
      return response;
    } catch (error) {
      // Return mock data if backend is not available
      return { data: mockSellers };
    }
  },
  getSellerById: async (id: number) => {
    try {
      const response = await api.get(`/sellers/${id}`);
      return response;
    } catch (error) {
      // Return mock data if backend is not available
      const seller = mockSellers.find(s => s.id === id);
      if (seller) {
        return { data: seller };
      }
      throw new Error('Seller not found');
    }
  },
  getNearbySellers: async (lat: number, lng: number) => {
    try {
      const response = await api.get(`/sellers/nearby?lat=${lat}&lng=${lng}`);
      return response;
    } catch (error) {
      // Return mock data if backend is not available
      return { data: mockSellers };
    }
  },
  getSellerProfile: async () => {
    try {
      const response = await api.get('/sellers/profile');
      return response;
    } catch (error) {
      // Return mock data if backend is not available
      return { data: mockSellers[0] };
    }
  },
  createSeller: (data: any) => api.post('/sellers', data),
  updateSellerProfile: (data: any) => api.patch('/sellers/profile', data),
  uploadBusinessImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/sellers/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

// Users API endpoints
export const usersApi = {
  getUserByTelegramId: (telegramId: string) => api.get(`/users/telegram/${telegramId}`),
  createUser: (data: any) => api.post('/users', data),
  updateUser: (id: number, data: any) => api.patch(`/users/${id}`, data),
  deleteUser: (id: number) => api.delete(`/users/${id}`),
};

// Orders API endpoints
export const ordersApi = {
  createOrder: async (data: any) => {
    try {
      const response = await api.post('/orders', data);
      return response;
    } catch (error) {
      // Mock order creation for development
      console.log('Backend not available, creating mock order:', data);
      const mockOrder = {
        id: Date.now(),
        productId: data.productId,
        quantity: data.quantity,
        totalPrice: data.totalPrice,
        status: 'pending',
        createdAt: new Date().toISOString(),
        product: mockProducts.find(p => p.id === data.productId)
      };
      return { data: mockOrder };
    }
  },
  getUserOrders: async (telegramId?: string) => {
    try {
      const response = await api.get(`/orders/user${telegramId ? `/${telegramId}` : ''}`);
      return response;
    } catch (error) {
      // Return mock data if backend is not available
      const mockOrders = [
        {
          id: 1,
          productId: 1,
          quantity: 2,
          totalPrice: 15000,
          status: 'pending',
          createdAt: new Date().toISOString(),
          product: mockProducts[0]
        },
        {
          id: 2,
          productId: 2,
          quantity: 1,
          totalPrice: 8000,
          status: 'confirmed',
          createdAt: new Date().toISOString(),
          product: mockProducts[1]
        }
      ];
      return { data: mockOrders };
    }
  },
  getSellerOrders: async () => {
    try {
      const response = await api.get('/orders/seller');
      return response;
    } catch (error) {
      // Return mock data if backend is not available
      const mockOrders = [
        {
          id: 1,
          productId: 1,
          quantity: 2,
          totalPrice: 15000,
          status: 'pending',
          createdAt: new Date().toISOString(),
          product: mockProducts[0]
        }
      ];
      return { data: mockOrders };
    }
  },
  getAllOrders: () => api.get('/orders'),
  getOrderById: (id: number) => api.get(`/orders/${id}`),
  updateOrderStatus: (id: number, status: string) => api.patch(`/orders/${id}/status`, { status }),
  confirmOrder: (id: number) => api.patch(`/orders/${id}/confirm`),
  cancelOrder: (id: number) => api.patch(`/orders/${id}/cancel`),
};

// Ratings API endpoints
export const ratingsApi = {
  createRating: (data: any) => api.post('/ratings', data),
  getProductRatings: (productId: number) => api.get(`/ratings/product/${productId}`),
  getSellerRatings: (sellerId: number) => api.get(`/ratings/seller/${sellerId}`),
  updateRating: (id: number, data: any) => api.patch(`/ratings/${id}`, data),
  deleteRating: (id: number) => api.delete(`/ratings/${id}`),
};

// Admin API endpoints
export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getSellers: () => api.get('/admin/sellers'),
  getUsers: () => api.get('/admin/users'),
  getProducts: () => api.get('/admin/products'),
  getOrders: () => api.get('/admin/orders'),
  approveSeller: (id: number) => api.patch(`/admin/sellers/${id}/approve`),
  rejectSeller: (id: number) => api.patch(`/admin/sellers/${id}/reject`),
  blockSeller: (id: number) => api.patch(`/admin/sellers/${id}/block`),
  unblockSeller: (id: number) => api.patch(`/admin/sellers/${id}/unblock`),
  deleteSeller: (id: number) => api.delete(`/admin/sellers/${id}`),
  deleteUser: (id: number) => api.delete(`/admin/users/${id}`),
  deleteProduct: (id: number) => api.delete(`/admin/products/${id}`),
  deleteOrder: (id: number) => api.delete(`/admin/orders/${id}`),
};

// Dashboard API endpoints
export const dashboardApi = {
  getUserDashboard: () => api.get('/dashboard/user'),
  getSellerDashboard: () => api.get('/dashboard/seller'),
  getAdminDashboard: () => api.get('/dashboard/admin'),
  getSellerOrders: () => api.get('/dashboard/seller/orders'),
  getSellerAnalytics: () => api.get('/dashboard/seller/analytics'),
  getSellerProducts: () => api.get('/dashboard/seller/products'),
};

// Analytics API endpoints
export const analyticsApi = {
  getSellerAnalytics: () => api.get('/analytics/seller'),
  getAdminAnalytics: () => api.get('/analytics/admin'),
  getProductAnalytics: (productId: number) => api.get(`/analytics/product/${productId}`),
  getSalesReport: (startDate: string, endDate: string) => api.get(`/analytics/sales?start=${startDate}&end=${endDate}`),
};

// Notifications API endpoints
export const notificationsApi = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id: number) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
  createNotification: (data: any) => api.post('/notifications', data),
  deleteNotification: (id: number) => api.delete(`/notifications/${id}`),
};

// Search API endpoints
export const searchApi = {
  searchProducts: (query: string, filters?: any) => api.get(`/search/products?q=${query}`, { params: filters }),
  searchSellers: (query: string, filters?: any) => api.get(`/search/sellers?q=${query}`, { params: filters }),
  getSearchSuggestions: (query: string) => api.get(`/search/suggestions?q=${query}`),
};

export default api;
