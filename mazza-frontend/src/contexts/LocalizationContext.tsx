import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'uz' | 'ru';

interface LocalizationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LocalizationContext = createContext<LocalizationContextType>({
  language: 'uz',
  setLanguage: () => {},
  t: () => '',
});

const translations = {
  uz: {
    // Navigation
    home: 'Bosh sahifa',
    search: 'Qidirish',
    orders: 'Buyurtmalar',
    profile: 'Profil',
    
    // Product
    viewDetails: 'Tafsilotlarni ko\'rish',
    bookNow: 'Buyurtma berish',
    orderNow: 'Buyurtma berish',
    available: 'Mavjud',
    quantity: 'Miqdor',
    price: 'Narx',
    so_m: 'so\'m',
    
    // Registration
    registrationRequired: 'Ro\'yxatdan o\'tish talab qilinadi',
    registrationRequiredMessage: 'Buyurtma berish va barcha imkoniyatlardan foydalanish uchun ro\'yxatdan o\'tishingiz kerak.',
    registerAndContinue: 'Ro\'yxatdan o\'tish va davom etish',
    cancel: 'Bekor qilish',
    
    // Common
    loading: 'Yuklanmoqda...',
    error: 'Xatolik',
    retry: 'Qayta urinish',
    contact: 'Aloqa',
    contactSeller: 'Sotuvchi bilan bog\'lanish',
  },
  ru: {
    // Navigation
    home: 'Главная',
    search: 'Поиск',
    orders: 'Заказы',
    profile: 'Профиль',
    
    // Product
    viewDetails: 'Подробнее',
    bookNow: 'Забронировать',
    orderNow: 'Заказать',
    available: 'Доступно',
    quantity: 'Количество',
    price: 'Цена',
    so_m: 'сум',
    
    // Registration
    registrationRequired: 'Требуется регистрация',
    registrationRequiredMessage: 'Для размещения заказов и доступа ко всем функциям необходимо зарегистрироваться.',
    registerAndContinue: 'Зарегистрироваться и продолжить',
    cancel: 'Отмена',
    
    // Common
    loading: 'Загрузка...',
    error: 'Ошибка',
    retry: 'Повторить',
    contact: 'Связаться',
    contactSeller: 'Связаться с продавцом',
  }
};

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('uz');

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations.uz] || key;
  };

  return (
    <LocalizationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LocalizationContext.Provider>
  );
}; 