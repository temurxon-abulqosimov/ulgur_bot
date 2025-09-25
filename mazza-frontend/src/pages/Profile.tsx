import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Store, Shield, Settings, LogOut, ArrowLeft, MapPin, Clock, Star, Bell, Lock, Globe, Smartphone } from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation';
import { useTelegram } from '../contexts/TelegramContext';

const Profile: React.FC = () => {
  const { user, isReady, userRole } = useTelegram();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isReady) {
      setLoading(false);
    }
  }, [isReady]);

  const handleLogout = () => {
    // Clear user data and redirect to home
    localStorage.clear();
    window.location.reload();
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'seller':
        return <Store className="w-5 h-5 text-blue-500" />;
      case 'admin':
        return <Shield className="w-5 h-5 text-red-500" />;
      default:
        return <User className="w-5 h-5 text-green-500" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'seller':
        return 'Seller';
      case 'admin':
        return 'Admin';
      default:
        return 'User';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
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
            <h1 className="text-lg font-semibold text-gray-900">Profile</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* User Info */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mr-4">
              <User className="w-8 h-8 text-orange-500" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{user?.first_name} {user?.last_name}</h2>
              <p className="text-sm text-gray-600">@{user?.username}</p>
              <div className="flex items-center mt-1">
                {getRoleIcon(userRole)}
                <span className="ml-2 text-sm font-medium text-gray-700">{getRoleLabel(userRole)}</span>
              </div>
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

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/orders')}
              className="w-full flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Clock className="w-5 h-5 text-gray-600 mr-3" />
              <span className="text-gray-900">My Orders</span>
            </button>
            
            <button
              onClick={() => navigate('/search')}
              className="w-full flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-600 mr-3" />
              <span className="text-gray-900">Search Products</span>
            </button>
            
            {userRole === 'seller' && (
              <button
                onClick={() => navigate('/seller')}
                className="w-full flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Store className="w-5 h-5 text-gray-600 mr-3" />
                <span className="text-gray-900">Seller Dashboard</span>
              </button>
            )}
            
            {userRole === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="w-full flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Shield className="w-5 h-5 text-gray-600 mr-3" />
                <span className="text-gray-900">Admin Dashboard</span>
              </button>
            )}
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/settings/account')}
              className="w-full flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-600 mr-3" />
              <span className="text-gray-900">Account Settings</span>
            </button>
            
            <button 
              onClick={() => navigate('/settings/privacy')}
              className="w-full flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Lock className="w-5 h-5 text-gray-600 mr-3" />
              <span className="text-gray-900">Privacy Settings</span>
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-5 h-5 text-red-600 mr-3" />
              <span className="text-red-600">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <BottomNavigation currentPage="profile" />
    </div>
  );
};

export default Profile;
