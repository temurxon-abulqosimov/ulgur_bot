import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Filter, Search } from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import MissionCard from '../components/MissionCard';
import { sellersApi, usersApi } from '../services/api';
import { Product, Seller, BusinessType } from '../types';
import { useTelegram } from '../contexts/TelegramContext';

const Home: React.FC = () => {
  const { user, webApp, isReady } = useTelegram();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<BusinessType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Get user location
  useEffect(() => {
    if (webApp?.initDataUnsafe?.user?.id) {
      // Mock location for demo - in real app, get from Telegram WebApp
      const mockLat = 41.3111 + (Math.random() - 0.5) * 0.01;
      const mockLng = 69.2797 + (Math.random() - 0.5) * 0.01;
      setUserLocation({ lat: mockLat, lng: mockLng });
    }
  }, [webApp]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let fetchedSellers: Seller[] = [];
      
      if (userLocation) {
        fetchedSellers = (await sellersApi.getNearbySellers(userLocation.lat, userLocation.lng)).data;
      } else {
        fetchedSellers = (await sellersApi.getSellers()).data;
      }

      // Get products from all sellers
      let allProducts: Product[] = [];
      for (const seller of fetchedSellers) {
        if (seller.products) {
          allProducts = allProducts.concat(
            seller.products.map(p => ({ 
              ...p, 
              seller: {
                ...seller,
                distance: calculateDistance(userLocation, seller.location)
              }
            }))
          );
        }
      }

      setProducts(allProducts);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load products and sellers.');
    } finally {
      setLoading(false);
    }
  }, [userLocation]);

  useEffect(() => {
    if (isReady) {
      loadData();
    }
  }, [isReady, loadData]);

  const calculateDistance = (userLoc: { lat: number; lng: number } | null, sellerLoc: { latitude: number; longitude: number } | null | undefined) => {
    if (!userLoc || !sellerLoc) return null;
    
    const R = 6371; // Earth's radius in kilometers
    const dLat = (sellerLoc.latitude - userLoc.lat) * Math.PI / 180;
    const dLng = (sellerLoc.longitude - userLoc.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(userLoc.lat * Math.PI / 180) * Math.cos(sellerLoc.latitude * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleCategoryChange = (category: BusinessType | 'all') => {
    setSelectedCategory(category);
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.seller.businessType === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.seller.businessName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleProductClick = (product: Product) => {
    // Users are pre-registered, so no need to check registration
    navigate(`/product/${product.id}`);
  };

  const handleSellerClick = (seller: Seller) => {
    navigate(`/seller-detail/${seller.id}`);
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
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Mazza</h1>
                <p className="text-sm text-gray-600">Save food near you</p>
              </div>
            </div>
            <button className="flex items-center px-3 py-2 bg-gray-100 rounded-full text-sm">
              <MapPin className="w-4 h-4 mr-1" />
              <span>Location</span>
            </button>
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Category Filter */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* Mission Card */}
      <div className="px-4 py-4">
        <MissionCard />
      </div>

      {/* Products Section */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Available now</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">{filteredProducts.length} items</span>
            <button className="p-2 bg-gray-100 rounded-lg">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {error && (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
            <button 
              onClick={loadData}
              className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-lg"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No products found for this category.</p>
          </div>
        )}

        <div className="space-y-4">
          {filteredProducts.map((product) => (
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

      <BottomNavigation currentPage="home" />
    </div>
  );
};

export default Home;
