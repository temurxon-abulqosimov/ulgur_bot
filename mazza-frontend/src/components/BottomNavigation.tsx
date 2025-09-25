import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingBag, User } from 'lucide-react';

interface BottomNavigationProps {
  currentPage: string;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ currentPage }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'search', label: 'Search', icon: Search, path: '/search' },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, path: '/orders' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex-1 flex flex-col items-center py-3 px-2 ${
                isActive ? 'text-orange-500' : 'text-gray-500'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-orange-500' : 'text-gray-500'}`} />
              <span className={`text-xs mt-1 ${isActive ? 'text-orange-500' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
