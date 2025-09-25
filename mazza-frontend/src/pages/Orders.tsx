import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, MapPin, Phone, ArrowLeft } from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation';
import { ordersApi } from '../services/api';
import { useTelegram } from '../contexts/TelegramContext';

interface Order {
  id: number;
  code: string;
  status: 'pending' | 'completed' | 'cancelled';
  totalPrice: number;
  quantity: number;
  createdAt: string;
  product: {
    id: number;
    price: number;
    description: string;
    seller: {
      id: number;
      businessName: string;
      businessType: string;
      phoneNumber: string;
    };
  };
}

const Orders: React.FC = () => {
  const { user } = useTelegram();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      if (!user?.id) return;
      
      try {
        const response = await ordersApi.getUserOrders(user.id.toString());
        setOrders(response.data);
      } catch (err) {
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

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
            <h1 className="text-lg font-semibold text-gray-900">My Orders</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {error && (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-lg"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="text-center py-8">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No orders yet</p>
            <p className="text-sm text-gray-400">Start exploring products to place your first order!</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg"
            >
              Browse Products
            </button>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    {getStatusIcon(order.status)}
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">Order #{order.code}</p>
                      <p className="text-sm text-gray-600">{order.product.description}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{order.product.seller.businessName}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span>Quantity: {order.quantity}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => navigate(`/seller-detail/${order.product.seller.id}`)}
                      className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
                    >
                      <Phone className="w-4 h-4 mr-1" />
                      Contact Seller
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{order.totalPrice.toFixed(0)} so'm</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNavigation currentPage="orders" />
    </div>
  );
};

export default Orders;
