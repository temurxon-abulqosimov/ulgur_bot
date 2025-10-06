<<<<<<< HEAD
﻿import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
=======
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
>>>>>>> e1835f2 (completed)

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
  userRole: "user" | "seller" | "admin";
  setUserRole: (role: "user" | "seller" | "admin") => void;
}

const TelegramContext = createContext<TelegramContextType>({
  user: null,
  initData: null,
  isReady: false,
  webApp: null,
  userRole: "user",
  setUserRole: () => {},
});

export const useTelegram = () => {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error("useTelegram must be used within a TelegramProvider");
  }
  return context;
};

export const TelegramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [initData, setInitData] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [webApp, setWebApp] = useState<any>(null);
  const [userRole, setUserRoleState] = useState<"user" | "seller" | "admin">("user");

  const setUserRole = (role: "user" | "seller" | "admin") => {
    setUserRoleState(role);
    localStorage.setItem("userRole", role);
  };

  const contextValue = useMemo(() => ({
    user,
    initData,
    isReady,
    webApp,
    userRole,
    setUserRole
  }), [user, initData, isReady, webApp, userRole]);

  useEffect(() => {
    const initializeTelegram = () => {
      if (typeof window !== "undefined" && (window as any).Telegram?.WebApp) {
        const tg = (window as any).Telegram.WebApp;
        setWebApp(tg);
        
        tg.ready();
        tg.expand();
        
        const data = tg.initData;
        setInitData(data);
        
        const userData = tg.initDataUnsafe?.user;
        if (userData) {
          setUser({
            id: userData.id,
            first_name: userData.first_name,
            last_name: userData.last_name,
            username: userData.username,
            language_code: userData.language_code
          });
        }
        
        setIsReady(true);
      } else {
        // Fallback for development
        setUser({
          id: 123456789,
<<<<<<< HEAD
          first_name: "Test",
          last_name: "User",
          username: "testuser",
          language_code: "uz"
        });
        setIsReady(true);
=======
          first_name: 'Test',
          last_name: 'User',
          username: 'testuser',
          language_code: 'uz'
        };
        
        const mockInitData = `user=${encodeURIComponent(JSON.stringify(mockUser))}&auth_date=${Math.floor(Date.now() / 1000)}&hash=mock_hash_for_development`;
        setInitData(mockInitData);
        localStorage.setItem('telegramInitData', mockInitData);
        
        // Check role from localStorage for development
        const savedRole = localStorage.getItem('userRole') as 'user' | 'seller' | 'admin';
        if (savedRole) {
          setUserRole(savedRole);
        }
>>>>>>> e1835f2 (completed)
      }
    };

    if (typeof requestIdleCallback !== "undefined") {
      requestIdleCallback(initializeTelegram);
    } else {
      setTimeout(initializeTelegram, 0);
    }
  }, []);

  return (
    <TelegramContext.Provider value={contextValue}>
      {children}
    </TelegramContext.Provider>
  );
};


