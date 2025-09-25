import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Store, Package, TrendingUp, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation';
import { useTelegram } from '../contexts/TelegramContext';
import { miniAppApi, adminApi } from '../services/api';

interface DashboardData {
  features: string[];
  quickActions: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    route: string;
  }>;
}

interface AdminStats {
  totalUsers: number;
  totalSellers: number;
  totalProducts: number;
  totalOrders: number;
  pendingSellers: number;
  recentActivity: any[];
}

const AdminDashboard: React.FC = () => {
  const { user, isReady } = useTelegram();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isReady && user) {
      loadDashboardData();
    }
  }, [isReady, user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardResponse, statsResponse] = await Promise.all([
        miniAppApi.getAdminDashboard(),
        adminApi.getDashboard().catch(() => null),
      ]);

      setDashboardData(dashboardResponse.data);
      if (statsResponse) {
        setAdminStats(statsResponse.data);
      }
    } catch (err: any) {
      console.error('Failed to load admin dashboard:', err);
      setError(err.response?.data?.message || 'Failed to load admin dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (route: string) => {
    navigate(route);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={loadDashboardData}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 shadow-sm">
        <div className="px-4 py-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Admin Panel 🔧</h1>
              <p className="text-sm text-purple-100">Manage the entire system</p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Overview */}
      {adminStats && (
        <div className="px-4 py-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h2>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-xl font-bold text-gray-900">{adminStats.totalUsers}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-orange-500">
              <div className="flex items-center">
                <Store className="w-8 h-8 text-orange-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total Sellers</p>
                  <p className="text-xl font-bold text-gray-900">{adminStats.totalSellers}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
              <div className="flex items-center">
                <Package className="w-8 h-8 text-green-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total Products</p>
                  <p className="text-xl font-bold text-gray-900">{adminStats.totalProducts}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-purple-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-xl font-bold text-gray-900">{adminStats.totalOrders}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Approvals Alert */}
          {adminStats.pendingSellers > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="text-yellow-800 font-medium">
                  {adminStats.pendingSellers} seller{adminStats.pendingSellers !== 1 ? 's' : ''} awaiting approval
                </span>
              </div>
              <button
                onClick={() => navigate('/admin/sellers')}
                className="mt-2 text-yellow-600 hover:text-yellow-800 font-medium text-sm"
              >
                Review pending sellers →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="px-4 py-2">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          {dashboardData?.quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleQuickAction(action.route)}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="text-2xl mb-2">{action.icon}</div>
              <h3 className="font-medium text-gray-900 text-sm">{action.title}</h3>
              <p className="text-xs text-gray-600 mt-1">{action.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      {adminStats?.recentActivity && adminStats.recentActivity.length > 0 && (
        <div className="px-4 py-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="space-y-3">
              {adminStats.recentActivity.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                    {activity.type === 'order' && <Package className="w-4 h-4 text-green-500" />}
                    {activity.type === 'seller' && <Store className="w-4 h-4 text-orange-500" />}
                    {activity.type === 'user' && <Users className="w-4 h-4 text-blue-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-600">{new Date(activity.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <BottomNavigation currentPage="profile" />
    </div>
  );
};

export default AdminDashboard; 