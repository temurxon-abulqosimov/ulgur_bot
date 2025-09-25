import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Store, 
  Package, 
  TrendingUp, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Upload,
  Settings,
  BarChart3,
  ShoppingBag,
  Star,
  Clock,
  MapPin
} from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation';
import { useTelegram } from '../contexts/TelegramContext';
import { miniAppApi, dashboardApi, productsApi, sellersApi } from '../services/api';
import { Product, Seller } from '../types';
import ImageUpload from '../components/ImageUpload';

const SellerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isReady } = useTelegram();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'profile' | 'analytics'>('dashboard');
  const [seller, setSeller] = useState<Seller | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isReady && user) {
      loadSellerData();
    }
  }, [isReady, user]);

  const loadSellerData = async () => {
    try {
      setLoading(true);
      const [sellerResponse, productsResponse, ordersResponse] = await Promise.all([
        sellersApi.getSellerProfile(),
        productsApi.getSellerProducts(),
        dashboardApi.getSellerOrders()
      ]);

      setSeller(sellerResponse.data);
      setProducts(productsResponse.data || []);
      setOrders(ordersResponse.data || []);
    } catch (err) {
      console.error('Failed to load seller data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = () => {
    // Navigate to product creation
    navigate('/seller/products/create');
  };

  const handleEditProduct = (productId: number) => {
    navigate(`/seller/products/edit/${productId}`);
  };

  const handleDeleteProduct = async (productId: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsApi.deleteProduct(productId);
        setProducts(products.filter(p => p.id !== productId));
      } catch (err) {
        console.error('Failed to delete product:', err);
      }
    }
  };

  const handleImageUpload = (file: File | null) => {
    if (file) {
      // Handle business image upload
      try {
        // Upload logic here
        console.log('Uploading business image:', file);
      } catch (err) {
        console.error('Failed to upload image:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                <Store className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Seller Dashboard</h1>
                <p className="text-sm text-gray-600">{seller?.businessName || 'Your Business'}</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('profile')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="flex overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'orders', label: 'Orders', icon: ShoppingBag },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            { id: 'profile', label: 'Profile', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-orange-500 border-b-2 border-orange-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <ShoppingBag className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-600">Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">$2,450</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Star className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-600">Rating</p>
                    <p className="text-2xl font-bold text-gray-900">4.8</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleCreateProduct}
                  className="flex items-center justify-center p-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Product
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="flex items-center justify-center p-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  View Orders
                </button>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
              <div className="space-y-3">
                {orders.slice(0, 3).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Order #{order.id}</p>
                      <p className="text-sm text-gray-600">{order.product?.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${order.totalPrice}</p>
                      <p className="text-sm text-gray-600">{order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">My Products</h3>
              <button
                onClick={handleCreateProduct}
                className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </button>
            </div>

            <div className="grid gap-4">
              {products.map((product) => (
                <div key={product.id} className="bg-white p-4 rounded-lg shadow-sm border">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{product.description}</h4>
                      <p className="text-sm text-gray-600">Price: ${product.price}</p>
                      <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditProduct(product.id)}
                        className="p-2 text-gray-500 hover:text-blue-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 text-gray-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Orders</h3>
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="bg-white p-4 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Order #{order.id}</p>
                      <p className="text-sm text-gray-600">{order.product?.description}</p>
                      <p className="text-sm text-gray-600">Quantity: {order.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${order.totalPrice}</p>
                      <p className="text-sm text-gray-600">{order.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Business Profile</h3>
            
            {/* Business Image Upload */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h4 className="font-medium text-gray-900 mb-4">Business Image</h4>
              <ImageUpload
                onImageSelect={handleImageUpload}
                currentImageUrl={seller?.businessImageUrl}
                label="Upload Business Image"
                maxSize={5}
              />
            </div>

            {/* Business Info */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h4 className="font-medium text-gray-900 mb-4">Business Information</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                  <input
                    type="text"
                    value={seller?.businessName || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                  <input
                    type="text"
                    value={seller?.businessType || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="text"
                    value={seller?.phoneNumber || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <p className="text-gray-600">Analytics dashboard coming soon...</p>
            </div>
          </div>
        )}
      </div>

      <BottomNavigation currentPage="profile" />
    </div>
  );
};

export default SellerDashboard;
