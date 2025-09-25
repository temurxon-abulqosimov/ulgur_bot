import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Star, Phone, ShoppingBag, Heart, User, CheckCircle } from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation';
import { productsApi, sellersApi, ordersApi } from '../services/api';
import { Product, Seller } from '../types';
import { useTelegram } from '../contexts/TelegramContext';
import { useLocalization } from '../contexts/LocalizationContext';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isReady } = useTelegram();
  const { t } = useLocalization();
  const [product, setProduct] = useState<Product | null>(null);
  const [seller, setSeller] = useState<Seller | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isOrdering, setIsOrdering] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setError('Product ID not found');
        setLoading(false);
        return;
      }
      
      try {
        console.log('Loading product with ID:', id);
        console.log('User data:', user);
        console.log('Is ready:', isReady);
        
        const productResponse = await productsApi.getProductById(parseInt(id));
        console.log('Product loaded:', productResponse.data);
        setProduct(productResponse.data);
        
        // Load seller info
        const sellerResponse = await sellersApi.getSellerById(productResponse.data.seller.id);
        console.log('Seller loaded:', sellerResponse.data);
        setSeller(sellerResponse.data);
      } catch (err) {
        console.error('Error loading product:', err);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    if (isReady) {
      loadProduct();
    }
  }, [id, isReady]);

  const handleOrder = async () => {
    console.log('Order button clicked!');
    console.log('Product:', product);
    console.log('User:', user);
    console.log('Quantity:', quantity);
    
    if (!product) {
      console.log('Missing product');
      setError('Product information is missing');
      return;
    }
    
    if (!user) {
      console.log('Missing user');
      setError('User information is missing');
      return;
    }
    
    // Show confirmation dialog instead of placing order directly
    setShowConfirmation(true);
  };

  const handleConfirmOrder = async () => {
    if (!product || !user) return;
    
    setIsOrdering(true);
    try {
      const orderData = {
        productId: product.id,
        quantity,
        totalPrice: product.price * quantity
      };
      
      console.log('Creating order with data:', orderData);
      const response = await ordersApi.createOrder(orderData);
      console.log('Order created successfully:', response);
      
      // Show success message
      alert('Order placed successfully! The seller will be notified.');
      setShowConfirmation(false);
      navigate('/orders');
    } catch (err) {
      console.error('Error creating order:', err);
      setError('Failed to place order. Please try again.');
      alert('Failed to place order. Please try again.');
    } finally {
      setIsOrdering(false);
    }
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  const getDiscountPercentage = (price: number, originalPrice?: number) => {
    if (!originalPrice || originalPrice <= price) return null;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product || !seller) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Product not found'}</p>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Debug info:</p>
            <p className="text-xs text-gray-500">Product: {product ? 'Loaded' : 'Missing'}</p>
            <p className="text-xs text-gray-500">Seller: {seller ? 'Loaded' : 'Missing'}</p>
            <p className="text-xs text-gray-500">User: {user ? 'Loaded' : 'Missing'}</p>
            <p className="text-xs text-gray-500">Product ID: {id}</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const discountPercentage = getDiscountPercentage(product.price, product.originalPrice);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-3 p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Product Details</h1>
          </div>
        </div>
      </div>

      {/* Product Image */}
      <div className="relative">
        <img
          src={product.seller.businessImageUrl || '/api/placeholder/400/300'}
          alt={product.description}
          className="w-full h-64 object-cover"
        />
        {discountPercentage && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-medium">
            -{discountPercentage}%
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 bg-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{product.description}</h2>
            <div className="flex items-center mb-2">
              <div className="flex items-center mr-4">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span className="text-sm text-gray-600">4.8</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                <span className="text-sm text-gray-600">{seller.businessName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {product.originalPrice && (
              <span className="text-lg text-gray-500 line-through">
                {product.originalPrice.toFixed(0)} {t('so_m')}
              </span>
            )}
            <span className="text-2xl font-bold text-orange-500">
              {product.price.toFixed(0)} {t('so_m')}
            </span>
          </div>
          <button className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            {t('available')}
          </button>
        </div>

        {/* Product Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span>Available at {seller.businessName}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span>Available until {formatTime(product.availableUntil)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2"></span>
            <span>{product.quantity} items available</span>
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('quantity')}
          </label>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
            >
              -
            </button>
            <span className="text-lg font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
              className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleOrder}
            disabled={isOrdering}
            className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            {isOrdering ? 'Placing Order...' : `${t('bookNow')} - ${(product.price * quantity).toFixed(0)} ${t('so_m')}`}
          </button>
          
          <button
            onClick={() => navigate(`/seller-detail/${seller.id}`)}
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            <Phone className="w-5 h-5 mr-2" />
            {t('contactSeller')}
          </button>
        </div>

        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg text-xs">
            <p><strong>Debug Info:</strong></p>
            <p>Product ID: {product.id}</p>
            <p>User ID: {user?.id}</p>
            <p>Quantity: {quantity}</p>
            <p>Total Price: {product.price * quantity}</p>
            <p>Is Ready: {isReady ? 'Yes' : 'No'}</p>
          </div>
        )}
      </div>

      {/* Order Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Order</h3>
            </div>
            
            {/* Order Details */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Product:</span>
                <span className="text-sm font-medium">{product.description}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Seller:</span>
                <span className="text-sm font-medium">{seller.businessName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Quantity:</span>
                <span className="text-sm font-medium">{quantity}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Price per item:</span>
                <span className="text-sm font-medium">{product.price.toFixed(0)} {t('so_m')}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-lg font-bold text-orange-500">{(product.price * quantity).toFixed(0)} {t('so_m')}</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4 text-center">
              The seller will be notified about your order and will contact you for pickup details.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={handleConfirmOrder}
                disabled={isOrdering}
                className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50"
              >
                {isOrdering ? 'Placing Order...' : 'Confirm Order'}
              </button>
              <button
                onClick={() => setShowConfirmation(false)}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNavigation currentPage="home" />
    </div>
  );
};

export default ProductDetail;
