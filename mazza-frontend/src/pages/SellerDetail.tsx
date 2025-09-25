import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Star, Phone, Store, Calendar } from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation';
import ProductCard from '../components/ProductCard';
import { sellersApi } from '../services/api';
import { Seller, Product } from '../types';

const SellerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSeller = async () => {
      if (!id) return;
      
      try {
        const response = await sellersApi.getSellerById(parseInt(id));
        setSeller(response.data);
        setProducts(response.data.products || []);
      } catch (err) {
        setError('Failed to load seller details');
      } finally {
        setLoading(false);
      }
    };

    loadSeller();
  }, [id]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const getBusinessTypeColor = (businessType: string) => {
    switch (businessType) {
      case 'market':
        return 'bg-green-100 text-green-800';
      case 'bakery':
        return 'bg-yellow-100 text-yellow-800';
      case 'restaurant':
        return 'bg-red-100 text-red-800';
      case 'cafe':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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

  if (error || !seller) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Seller not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-4 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-3 p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Seller Details</h1>
        </div>
      </div>

      {/* Seller Info */}
      <div className="bg-white p-4 mb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mr-4">
              <Store className="w-8 h-8 text-orange-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{seller.businessName}</h2>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getBusinessTypeColor(seller.businessType)}`}>
                {seller.businessType}
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">4.8</span>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="w-4 h-4 mr-2" />
            <span>{seller.phoneNumber}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{seller.distance ? `${seller.distance.toFixed(1)} km away` : 'Nearby'}</span>
          </div>
          {seller.opensAt && seller.closesAt && (
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              <span>Open {formatTime(seller.opensAt)} - {formatTime(seller.closesAt)}</span>
            </div>
          )}
        </div>

        {/* Contact Button */}
        <button className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center">
          <Phone className="w-5 h-5 mr-2" />
          Contact Seller
        </button>
      </div>

      {/* Products Section */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Available Products</h3>
          <span className="text-sm text-gray-500">{products.length} items</span>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products available</h3>
            <p className="text-gray-600">This seller hasn't posted any products yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                distance={seller.distance}
                onProductClick={() => navigate(`/product/${product.id}`)}
                onSellerClick={() => navigate(`/seller/${seller.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      <BottomNavigation currentPage="home" />
    </div>
  );
};

export default SellerDetail;
