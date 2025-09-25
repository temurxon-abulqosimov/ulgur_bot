import React, { createContext, useContext, useEffect, useState } from 'react';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramContextType {
  user: TelegramUser | null;
  initData: string | null;
  isReady: boolean;
  webApp: any;
  userRole: 'user' | 'seller' | 'admin';
  setUserRole: (role: 'user' | 'seller' | 'admin') => void;
}

const TelegramContext = createContext<TelegramContextType>({
  user: null,
  initData: null,
  isReady: false,
  webApp: null,
  userRole: 'user',
  setUserRole: () => {},
});

export const useTelegram = () => {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error('useTelegram must be used within a TelegramProvider');
  }
  return context;
};

export const TelegramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always provide a default user for development
  const [user, setUser] = useState<TelegramUser | null>({
    id: 123456789,
    first_name: 'Test',
    last_name: 'User',
    username: 'testuser',
    language_code: 'uz'
  });
  const [initData, setInitData] = useState<string | null>('test_init_data');
  const [isReady, setIsReady] = useState(true);
  const [webApp, setWebApp] = useState<any>(null);
  const [userRole, setUserRole] = useState<'user' | 'seller' | 'admin'>('user');

  useEffect(() => {
    console.log('TelegramContext: Initializing...');
    
    // Check if we're in Telegram WebApp environment
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      console.log('TelegramContext: Running in Telegram WebApp');
      const tg = (window as any).Telegram.WebApp;
      setWebApp(tg);
      
      // Initialize the WebApp
      tg.ready();
      tg.expand();
      
      // Get init data
      const data = tg.initData;
      setInitData(data);
      
      // Parse user data
      if (data) {
        const urlParams = new URLSearchParams(data);
        const userStr = urlParams.get('user');
        if (userStr) {
          try {
            const userData = JSON.parse(userStr);
            setUser(userData);
            console.log('TelegramContext: User data from Telegram:', userData);
            
            // Get role from URL parameters or backend
            const roleFromUrl = urlParams.get('role') as 'user' | 'seller' | 'admin';
            if (roleFromUrl) {
              setUserRole(roleFromUrl);
              localStorage.setItem('userRole', roleFromUrl);
            } else {
              // Check localStorage for development
              const savedRole = localStorage.getItem('userRole') as 'user' | 'seller' | 'admin';
              setUserRole(savedRole || 'user');
            }
          } catch (error) {
            console.error('Error parsing user data:', error);
          }
        }
      }
      
      setIsReady(true);
    } else {
      // For development/testing in browser - users are pre-registered
      console.log('TelegramContext: Running in browser development mode');
      console.log('TelegramContext: User already set to:', user);
      
      // Check role from localStorage for development
      const savedRole = localStorage.getItem('userRole') as 'user' | 'seller' | 'admin';
      setUserRole(savedRole || 'user');
      console.log('TelegramContext: User role set to:', savedRole || 'user');
    }
  }, []);

  console.log('TelegramContext: Current state - user:', user, 'isReady:', isReady);

  return (
    <TelegramContext.Provider value={{ 
      user, 
      initData, 
      isReady, 
      webApp, 
      userRole, 
      setUserRole 
    }}>
      {children}
    </TelegramContext.Provider>
  );
};
