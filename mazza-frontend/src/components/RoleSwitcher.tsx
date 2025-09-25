import React from 'react';
import { useTelegram } from '../contexts/TelegramContext';
import { User, Store, Shield } from 'lucide-react';

const RoleSwitcher: React.FC = () => {
  const { userRole, setUserRole } = useTelegram();

  const handleRoleChange = (role: 'user' | 'seller' | 'admin') => {
    setUserRole(role);
    localStorage.setItem('userRole', role);
    window.location.reload(); // Reload to apply new role
  };

  if (process.env.NODE_ENV !== 'development') {
    return null; // Only show in development
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg p-4 border">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Dev: Switch Role</h3>
      <div className="space-y-2">
        <button
          onClick={() => handleRoleChange('user')}
          className={`w-full flex items-center px-3 py-2 rounded-lg text-sm ${
            userRole === 'user' 
              ? 'bg-blue-100 text-blue-700' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <User className="w-4 h-4 mr-2" />
          User
        </button>
        <button
          onClick={() => handleRoleChange('seller')}
          className={`w-full flex items-center px-3 py-2 rounded-lg text-sm ${
            userRole === 'seller' 
              ? 'bg-orange-100 text-orange-700' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Store className="w-4 h-4 mr-2" />
          Seller
        </button>
        <button
          onClick={() => handleRoleChange('admin')}
          className={`w-full flex items-center px-3 py-2 rounded-lg text-sm ${
            userRole === 'admin' 
              ? 'bg-red-100 text-red-700' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Shield className="w-4 h-4 mr-2" />
          Admin
        </button>
      </div>
    </div>
  );
};

export default RoleSwitcher;
