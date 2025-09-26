import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TelegramProvider } from './contexts/TelegramContext';
import { LocalizationProvider } from './contexts/LocalizationContext';

// Pages
import Home from './pages/Home';
import Search from './pages/Search';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import ProductDetail from './pages/ProductDetail';
import SellerDetail from './pages/SellerDetail';

// Settings pages
import AccountSettings from './pages/AccountSettings';

// Dashboard pages
import UserDashboard from './pages/UserDashboard';
import SellerDashboard from './pages/SellerDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Product management pages
import ProductCreate from './pages/ProductCreate';
import ProductEdit from './pages/ProductEdit';

// Components
import RoleBasedRedirect from './components/RoleBasedRedirect';
import RoleSwitcher from './components/RoleSwitcher';

import './App.css';

function App() {
  return (
    <TelegramProvider>
      <LocalizationProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Role-based redirect - NO registration needed */}
              <Route path="/" element={<RoleBasedRedirect />} />
              
              {/* User routes - Product discovery and ordering */}
              <Route path="/user" element={<UserDashboard />} />
              <Route path="/user/orders" element={<Orders />} />
              <Route path="/user/profile" element={<Profile />} />
              
              {/* Seller routes - Product management and dashboard */}
              <Route path="/seller" element={<SellerDashboard />} />
              <Route path="/seller/orders" element={<Orders />} />
              <Route path="/seller/profile" element={<Profile />} />
              <Route path="/seller/products/create" element={<ProductCreate />} />
              <Route path="/seller/products/edit/:id" element={<ProductEdit />} />
              
              {/* Admin routes - Platform management */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/orders" element={<Orders />} />
              <Route path="/admin/profile" element={<Profile />} />
              
              {/* Settings routes */}
              <Route path="/settings/account" element={<AccountSettings />} />
              
              {/* Shared routes - Available to all roles */}
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/seller-detail/:id" element={<SellerDetail />} />
              <Route path="/search" element={<Search />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/profile" element={<Profile />} />
              
              {/* Fallback - redirect to role-based home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            
            {/* Development role switcher - only in development */}
            {process.env.NODE_ENV === 'development' && <RoleSwitcher />}
          </div>
        </Router>
      </LocalizationProvider>
    </TelegramProvider>
  );
}

export default App;
