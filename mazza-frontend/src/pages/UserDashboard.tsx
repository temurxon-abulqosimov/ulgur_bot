import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Heart, 
  Star, 
  MapPin, 
  Clock, 
  TrendingUp,
  Package,
  User,
  Bell,
  Search
} from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation';
import ProductCard from '../components/ProductCard';
import { useTelegram } from '../contexts/TelegramContext';
import { productsApi, ordersApi } from '../services/api';
import { Product } from '../types';

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isReady } = useTelegram();
  const [activeTab, setActiveTab] = useState<'home' | 'orders' | 'profile' | 'favorites'>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isReady && user) {
      loadUserData();
    }
  }, [isReady, user]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const [productsResponse, ordersResponse] = await Promise.all([
        productsApi.getProducts(),
        ordersApi.getUserOrders()
      ]);

      setProducts(productsResponse.data || []);
      setOrders(ordersResponse.data || []);
    } catch (err) {
      console.error('Failed to load user data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  const handleSellerClick = (seller: any) => {
    navigate(`/seller-detail/${seller.id}`);
  };

  const handleSearch = () => {
    navigate('/search');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
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
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Mazza</h1>
                <p className="text-sm text-gray-600">Save food near you</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <User className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3 bg-white border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search products or sellers..."
            onClick={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            readOnly
          />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="flex overflow-x-auto">
          {[
            { id: 'home', label: 'Discover', icon: Package },
            { id: 'orders', label: 'Orders', icon: ShoppingBag },
            { id: 'favorites', label: 'Favorites', icon: Heart },
            { id: 'profile', label: 'Profile', icon: User },
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
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Mission Card */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Today's Mission</h3>
                <TrendingUp className="w-5 h-5" />
              </div>
              
              <p className="text-sm mb-4 opacity-90">
                Join the fight against food waste! Save money and help the environment.
              </p>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">247</div>
                  <div className="text-xs opacity-90">Boxes saved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">892</div>
                  <div className="text-xs opacity-90">Money saved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">423kg</div>
                  <div className="text-xs opacity-90">CO saved</div>
                </div>
              </div>
            </div>

            {/* Available Products */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Available now</h2>
                <span className="text-sm text-gray-500">{products.length} items</span>
              </div>

              {error && (
                <div className="text-center py-8">
                  <p className="text-red-500">{error}</p>
                  <button 
                    onClick={loadUserData}
                    className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-lg"
                  >
                    Retry
                  </button>
                </div>
              )}

              {!loading && !error && products.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No products available right now.</p>
                </div>
              )}

              <div className="space-y-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    distance={product.seller.distance}
                    onProductClick={() => handleProductClick(product)}
                    onSellerClick={() => handleSellerClick(product.seller)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">My Orders</h3>
              <span className="text-sm text-gray-500">{orders.length} orders</span>
            </div>
            
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No orders yet</p>
                <p className="text-sm text-gray-400">Start exploring products to place your first order!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white p-4 rounded-lg shadow-sm border">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                            <Package className="w-5 h-5 text-orange-500" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Order #{order.id}</p>
                            <p className="text-sm text-gray-600">{order.product?.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span>Quantity: {order.quantity}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{order.totalPrice.toFixed(0)} so'm</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Favorites</h3>
              <span className="text-sm text-gray-500">{favorites.length} items</span>
            </div>
            
            {favorites.length === 0 ? (
              <div className="text-center py-8">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No favorites yet</p>
                <p className="text-sm text-gray-400">Tap the heart icon on products to add them to favorites!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {favorites.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    distance={product.seller.distance}
                    onProductClick={() => handleProductClick(product)}
                    onSellerClick={() => handleSellerClick(product.seller)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Profile</h3>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                  <User className="w-8 h-8 text-orange-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{user?.first_name} {user?.last_name}</h4>
                  <p className="text-sm text-gray-600">@{user?.username}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 text-gray-500 mr-3" />
                  <span className="text-sm text-gray-600">Location: Tashkent, Uzbekistan</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-gray-500 mr-3" />
                  <span className="text-sm text-gray-600">Member since: January 2024</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-gray-500 mr-3" />
                  <span className="text-sm text-gray-600">Rating: 4.8</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNavigation currentPage="home" />
    </div>
  );
};

export default UserDashboard;
