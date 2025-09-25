import React from 'react';
import { Navigate } from 'react-router-dom';
import { useTelegram } from '../contexts/TelegramContext';

const RoleBasedRedirect: React.FC = () => {
  const { userRole } = useTelegram();

  // Redirect based on user role - NO registration needed
  switch (userRole) {
    case 'user':
      return <Navigate to="/user" replace />;
    case 'seller':
      return <Navigate to="/seller" replace />;
    case 'admin':
      return <Navigate to="/admin" replace />;
    default:
      // This should never happen since users are pre-registered
      // But if it does, default to user experience
      return <Navigate to="/user" replace />;
  }
};

export default RoleBasedRedirect;
