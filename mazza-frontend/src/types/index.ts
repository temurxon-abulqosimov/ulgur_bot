export enum BusinessType {
  CAFE = 'cafe',
  RESTAURANT = 'restaurant',
  MARKET = 'market',
  BAKERY = 'bakery',
  OTHER = 'other',
}

export enum ProductCategory {
  BREAD = 'bread',
  PASTRY = 'pastry',
  MAIN_DISH = 'main_dish',
  DESSERT = 'dessert',
  BEVERAGE = 'beverage',
  SNACK = 'snack',
  SALAD = 'salad',
  SOUP = 'soup',
  OTHER = 'other',
}

export enum SellerVerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface Product {
  id: number;
  price: number;
  originalPrice?: number;
  description?: string;
  availableFrom?: string;
  availableUntil: string;
  code?: string;
  isActive: boolean;
  quantity: number;
  category?: ProductCategory;
  createdAt: string;
  updatedAt: string;
  seller: Seller;
  ratings?: Rating[];
}

export interface Seller {
  id: number;
  telegramId: string;
  phoneNumber: string;
  businessName: string;
  businessType: BusinessType;
  location?: Location;
  opensAt?: number;
  closesAt?: number;
  status: 'pending' | 'approved' | 'rejected' | 'blocked';
  language: 'uz' | 'ru';
  imageUrl?: string;
  businessImageUrl?: string;
  verificationStatus: SellerVerificationStatus;
  verificationDocuments?: string[];
  createdAt: string;
  updatedAt: string;
  products?: Product[];
  distance?: number | null;
  isOpen?: boolean;
  averageRating?: number;
}

export interface User {
  id: number;
  telegramId: string;
  phoneNumber: string;
  location?: Location;
  language: 'uz' | 'ru';
  notificationSettings?: NotificationSettings;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: number;
  code: string;
  status: 'pending' | 'completed' | 'cancelled';
  totalPrice: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  user: User;
  product: Product;
}

export interface Rating {
  id: number;
  rating: number;
  comment?: string;
  type: 'product' | 'seller';
  createdAt: string;
  updatedAt: string;
  user: User;
  product?: Product;
  seller?: Seller;
}

export interface CreateUserDto {
  telegramId: string;
  phoneNumber: string;
  location?: Location;
  language: 'uz' | 'ru';
}

export interface CreateSellerDto {
  telegramId: string;
  phoneNumber: string;
  businessName: string;
  businessType: BusinessType;
  location?: Location;
  opensAt?: number;
  closesAt?: number;
  language: 'uz' | 'ru';
  status?: 'pending' | 'approved' | 'rejected' | 'blocked';
  imageUrl?: string;
  businessImageUrl?: string;
}

export interface CreateProductDto {
  price: number;
  originalPrice?: number;
  description?: string;
  availableFrom?: Date;
  availableUntil: Date;
  quantity?: number;
  category?: ProductCategory;
  sellerId: number;
}

export interface CreateOrderDto {
  productId: number;
  quantity: number;
}

export interface CreateRatingDto {
  rating: number;
  comment?: string;
  type: 'product' | 'seller';
  productId?: number;
  sellerId?: number;
}

export interface AnalyticsData {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  averageRating: number;
  monthlyStats: Array<{
    month: string;
    products: number;
    orders: number;
    revenue: number;
  }>;
  topProducts: Array<{
    id: number;
    name: string;
    orders: number;
    revenue: number;
  }>;
}

export interface NotificationSettings {
  newProducts: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  sellerUpdates: boolean;
}

export interface SearchFilters {
  category?: ProductCategory;
  businessType?: BusinessType;
  priceRange?: {
    min: number;
    max: number;
  };
  distance?: number;
  rating?: number;
  availability?: 'now' | 'today' | 'all';
}

export interface NotificationData {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
  data?: any;
}
