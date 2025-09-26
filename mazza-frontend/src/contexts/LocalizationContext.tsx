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
    
    // Account Settings
    accountSettings: 'Hisob sozlamalari',
    personalInformation: 'Shaxsiy ma\'lumotlar',
    contactInformation: 'Aloqa ma\'lumotlari',
    preferences: 'Afzalliklar',
    firstName: 'Ism',
    lastName: 'Familiya',
    username: 'Foydalanuvchi nomi',
    email: 'Elektron pochta',
    phone: 'Telefon raqami',
    location: 'Joylashuv',
    language: 'Til',
    saveChanges: 'O\'zgarishlarni saqlash',
    saving: 'Saqlanmoqda...',
    settingsSavedSuccessfully: 'Sozlamalar muvaffaqiyatli saqlandi!',
    uzbek: 'O\'zbekcha',
    russian: 'Русский',
    
    // Privacy Settings
    privacySettings: 'Maxfiylik sozlamalari',
    profileVisibility: 'Profil ko\'rinishi',
    informationSharing: 'Ma\'lumot almashish',
    notifications: 'Bildirishnomalar',
    whoCanSeeProfile: 'Profilingizni kim ko\'ra oladi',
    everyone: 'Hammaga',
    friendsOnly: 'Faqat do\'stlarga',
    private: 'Shaxsiy',
    showLocationToSellers: 'Sotuvchilarga joylashuvni ko\'rsatish',
    helpSellersFind: 'Sotuvchilarga yetkazib berish uchun sizni topishga yordam beradi',
    showPhoneNumber: 'Telefon raqamini ko\'rsatish',
    allowSellersContact: 'Sotuvchilarga to\'g\'ridan-to\'g\'ri aloqa qilishga ruxsat berish',
    allowMessagesFromSellers: 'Sotuvchilardan xabar olishga ruxsat berish',
    receiveDirectMessages: 'Buyurtmalar haqida to\'g\'ridan-to\'g\'ri xabar olish',
    orderUpdates: 'Buyurtma yangilanishlari',
    orderStatusUpdates: 'Buyurtma holati o\'zgarishlari haqida xabar olish',
    promotions: 'Aksiyalar',
    receiveSpecialOffers: 'Maxsus takliflar va chegirmalar olish',
    appUpdates: 'Ilova yangilanishlari',
    newFeaturesNotifications: 'Yangi imkoniyatlar haqida xabar olish',
    securityAlerts: 'Xavfsizlik ogohlantirishlari',
    importantSecurityNotifications: 'Muhim xavfsizlik bildirishnomalari',
    savePrivacySettings: 'Maxfiylik sozlamalarini saqlash',
    privacySettingsSavedSuccessfully: 'Maxfiylik sozlamalari muvaffaqiyatli saqlandi!',
    
    // Profile Page
    loadingProfile: 'Profil yuklanmoqda...',
    seller: 'Sotuvchi',
    admin: 'Administrator',
    user: 'Foydalanuvchi',
    accountSection: 'Hisob',
    settingsSection: 'Sozlamalar',
    languageAndRegion: 'Til va hudud',
    notifications_: 'Bildirishnomalar',
    privacy: 'Maxfiylik',
    security: 'Xavfsizlik',
    helpAndSupport: 'Yordam va qo\'llab-quvvatlash',
    helpCenter: 'Yordam markazi',
    contactSupport: 'Qo\'llab-quvvatlash bilan bog\'lanish',
    reportProblem: 'Muammo haqida xabar berish',
    about: 'Haqida',
    termsOfService: 'Foydalanish shartlari',
    privacyPolicy: 'Maxfiylik siyosati',
    appVersion: 'Ilova versiyasi',
    logout: 'Chiqish',
    
    // Dashboard
    dashboard: 'Boshqaruv paneli',
    todaysOrders: 'Bugungi buyurtmalar',
    totalRevenue: 'Umumiy daromad',
    activeProducts: 'Faol mahsulotlar',
    customerRating: 'Mijozlar baholovi',
    recentActivity: 'So\'nggi faoliyat',
    quickActions: 'Tezkor amallar',
    addProduct: 'Mahsulot qo\'shish',
    manageOrders: 'Buyurtmalarni boshqarish',
    viewAnalytics: 'Tahlilni ko\'rish',
    updateProfile: 'Profilni yangilash',
    
    // Common
    loading: 'Yuklanmoqda...',
    error: 'Xatolik',
    retry: 'Qayta urinish',
    contact: 'Aloqa',
    contactSeller: 'Sotuvchi bilan bog\'lanish',
    back: 'Orqaga',
    next: 'Keyingi',
    previous: 'Oldingi',
    save: 'Saqlash',
    edit: 'Tahrirlash',
    delete: 'O\'chirish',
    confirm: 'Tasdiqlash',
    yes: 'Ha',
    no: 'Yo\'q',
    
    // Order Confirmation
    productDetails: 'Mahsulot tafsilotlari',
    confirmYourOrder: 'Buyurtmangizni tasdiqlang',
    product: 'Mahsulot',
    unitPrice: 'Narx',
    savings: 'Tejash',
    total: 'Jami',
    confirmOrder: 'Buyurtmani tasdiqlash',
    orderConfirmed: 'Buyurtma tasdiqlandi!',
    orderConfirmationMessage: 'Buyurtmangiz muvaffaqiyatli qabul qilindi. Sotuvchi tez orada siz bilan bog\'lanadi.',
    orderNumber: 'Buyurtma raqami',
    goBack: 'Orqaga',
    open: 'Ochiq',
    closed: 'Yopiq',
    availableUntil: 'Mavjud muddati',
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
    
    // Account Settings
    accountSettings: 'Настройки аккаунта',
    personalInformation: 'Личная информация',
    contactInformation: 'Контактная информация',
    preferences: 'Предпочтения',
    firstName: 'Имя',
    lastName: 'Фамилия',
    username: 'Имя пользователя',
    email: 'Электронная почта',
    phone: 'Номер телефона',
    location: 'Местоположение',
    language: 'Язык',
    saveChanges: 'Сохранить изменения',
    saving: 'Сохранение...',
    settingsSavedSuccessfully: 'Настройки успешно сохранены!',
    uzbek: 'O\'zbekcha',
    russian: 'Русский',
    
    // Privacy Settings
    privacySettings: 'Настройки конфиденциальности',
    profileVisibility: 'Видимость профиля',
    informationSharing: 'Обмен информацией',
    notifications: 'Уведомления',
    whoCanSeeProfile: 'Кто может видеть ваш профиль',
    everyone: 'Все',
    friendsOnly: 'Только друзья',
    private: 'Приватный',
    showLocationToSellers: 'Показывать местоположение продавцам',
    helpSellersFind: 'Помочь продавцам найти вас для доставки',
    showPhoneNumber: 'Показывать номер телефона',
    allowSellersContact: 'Разрешить продавцам связываться напрямую',
    allowMessagesFromSellers: 'Разрешить сообщения от продавцов',
    receiveDirectMessages: 'Получать прямые сообщения о заказах',
    orderUpdates: 'Обновления заказов',
    orderStatusUpdates: 'Получать уведомления об изменении статуса заказа',
    promotions: 'Акции',
    receiveSpecialOffers: 'Получать специальные предложения и скидки',
    appUpdates: 'Обновления приложения',
    newFeaturesNotifications: 'Получать уведомления о новых функциях',
    securityAlerts: 'Предупреждения безопасности',
    importantSecurityNotifications: 'Важные уведомления безопасности',
    savePrivacySettings: 'Сохранить настройки конфиденциальности',
    privacySettingsSavedSuccessfully: 'Настройки конфиденциальности успешно сохранены!',
    
    // Profile Page
    loadingProfile: 'Загрузка профиля...',
    seller: 'Продавец',
    admin: 'Администратор',
    user: 'Пользователь',
    accountSection: 'Аккаунт',
    settingsSection: 'Настройки',
    languageAndRegion: 'Язык и регион',
    notifications_: 'Уведомления',
    privacy: 'Конфиденциальность',
    security: 'Безопасность',
    helpAndSupport: 'Помощь и поддержка',
    helpCenter: 'Центр помощи',
    contactSupport: 'Связаться с поддержкой',
    reportProblem: 'Сообщить о проблеме',
    about: 'О приложении',
    termsOfService: 'Условия использования',
    privacyPolicy: 'Политика конфиденциальности',
    appVersion: 'Версия приложения',
    logout: 'Выйти',
    
    // Dashboard
    dashboard: 'Панель управления',
    todaysOrders: 'Заказы сегодня',
    totalRevenue: 'Общий доход',
    activeProducts: 'Активные товары',
    customerRating: 'Рейтинг клиентов',
    recentActivity: 'Недавняя активность',
    quickActions: 'Быстрые действия',
    addProduct: 'Добавить товар',
    manageOrders: 'Управление заказами',
    viewAnalytics: 'Просмотр аналитики',
    updateProfile: 'Обновить профиль',
    
    // Common
    loading: 'Загрузка...',
    error: 'Ошибка',
    retry: 'Повторить',
    contact: 'Связаться',
    contactSeller: 'Связаться с продавцом',
    back: 'Назад',
    next: 'Далее',
    previous: 'Предыдущий',
    save: 'Сохранить',
    edit: 'Редактировать',
    delete: 'Удалить',
    confirm: 'Подтвердить',
    yes: 'Да',
    no: 'Нет',
    
    // Order Confirmation
    productDetails: 'Детали продукта',
    confirmYourOrder: 'Подтвердите ваш заказ',
    product: 'Продукт',
    unitPrice: 'Цена',
    savings: 'Экономия',
    total: 'Итого',
    confirmOrder: 'Подтвердить заказ',
    orderConfirmed: 'Заказ подтвержден!',
    orderConfirmationMessage: 'Ваш заказ успешно принят. Продавец свяжется с вами в ближайшее время.',
    orderNumber: 'Номер заказа',
    goBack: 'Назад',
    open: 'Открыто',
    closed: 'Закрыто',
    availableUntil: 'Доступно до',
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

  // Persist language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'uz' || savedLanguage === 'ru')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations.uz] || key;
  };

  return (
    <LocalizationContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LocalizationContext.Provider>
  );
}; 