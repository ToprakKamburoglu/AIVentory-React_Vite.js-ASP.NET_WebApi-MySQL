// 🔐 Kullanıcı Rolleri
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager', 
  EMPLOYEE: 'employee'
};

// 🛡️ Yetki
export const PERMISSIONS = {
  // Admin - Tam yetki
  [USER_ROLES.ADMIN]: [
    'view_dashboard',
    'manage_products', 
    'add_product',
    'edit_product',
    'delete_product',
    'manage_stock',
    'stock_adjustment',
    'view_reports',
    'export_reports',
    'manage_users',
    'add_user',
    'edit_user',
    'delete_user',
    'ai_analysis',
    'ai_recommendations',
    'change_password',
    'manage_settings',
    'manage_categories',
    'view_analytics'
  ],

  // Manager yetki
  [USER_ROLES.MANAGER]: [
    'view_dashboard',
    'manage_products',
    'add_product', 
    'edit_product',
    'manage_stock',
    'stock_adjustment',
    'view_reports',
    'export_reports',
    'ai_analysis',
    'ai_recommendations',
    'change_password',
    'manage_categories',
    'view_analytics'
  ],

  // Employee yetki
  [USER_ROLES.EMPLOYEE]: [
    'view_dashboard',
    'add_product',
    'view_products',
    'view_stock', 
    'update_stock',
    'search_products',
    'ai_analysis',
    'change_password'
  ]
};

// 📊 Dashboard Kartları - Role Göre
export const DASHBOARD_CARDS = {
  [USER_ROLES.ADMIN]: [
    'total_products',
    'critical_stock', 
    'daily_sales',
    'total_users',
    'ai_recommendations',
    'sales_chart',
    'stock_movements',
    'user_activities'
  ],
  [USER_ROLES.MANAGER]: [
    'total_products',
    'critical_stock',
    'daily_sales', 
    'ai_recommendations',
    'sales_chart',
    'stock_movements'
  ],
  [USER_ROLES.EMPLOYEE]: [
    'total_products',
    'critical_stock',
    'recent_activities',
    'quick_actions'
  ]
};

// 🎨 Rol Renkleri 
export const ROLE_COLORS = {
  [USER_ROLES.ADMIN]: '#DC2626',      // Kırmızı
  [USER_ROLES.MANAGER]: '#2563EB',    // Mavi  
  [USER_ROLES.EMPLOYEE]: '#059669'    // Yeşil
};

// 📱 Sidebar Menüler - Role Göre - GÜNCELLENMIŞ PATHLER
export const SIDEBAR_MENUS = {
  [USER_ROLES.ADMIN]: [
    {
      title: 'Dashboard',
      icon: 'fas fa-tachometer-alt',
      path: '/admin',
      permission: 'view_dashboard'
    },
    {
      title: 'Ürün Yönetimi',
      icon: 'fas fa-box',
      submenus: [
        { title: 'Ürün Listesi', path: '/admin/products', permission: 'manage_products' },
        { title: 'Ürün Ekle', path: '/admin/products/add', permission: 'add_product' },
        { title: 'Kategoriler', path: '/admin/categories', permission: 'manage_categories' }
      ]
    },
    {
      title: 'Stok Yönetimi', 
      icon: 'fas fa-warehouse',
      submenus: [
        { title: 'Stok Durumu', path: '/admin/stock', permission: 'manage_stock' },
        { title: 'Stok Hareketleri', path: '/admin/stock/movements', permission: 'manage_stock' },
        { title: 'Stok Tahminleri', path: '/admin/stock/predictions', permission: 'ai_analysis' },
        { title: 'Stok Güncelle', path: '/admin/stock/update', permission: 'stock_adjustment' }
      ]
    },
    {
      title: 'AI Analiz',
      icon: 'fas fa-robot', 
      submenus: [
        { title: 'Ürün Tanıma', path: '/admin/ai/recognition', permission: 'ai_analysis' },
        { title: 'Renk Analizi', path: '/admin/ai/colors', permission: 'ai_analysis' },
        { title: 'Akıllı Öneriler', path: '/admin/ai/recommendations', permission: 'ai_recommendations' }
      ]
    },
    {
      title: 'Kullanıcı Yönetimi',
      icon: 'fas fa-users',
      submenus: [
        { title: 'Kullanıcılar', path: '/admin/users', permission: 'manage_users' },
        { title: 'Kullanıcı Ekle', path: '/admin/users/add', permission: 'add_user' }
      ]
    },
    {
      title: 'Raporlar',
      icon: 'fas fa-chart-bar',
      submenus: [
        { title: 'Satış Raporları', path: '/admin/reports/sales', permission: 'view_reports' },
        { title: 'Stok Raporları', path: '/admin/reports/stock', permission: 'view_reports' },
        { title: 'AI Analizleri', path: '/admin/reports/ai', permission: 'view_reports' }
      ]
    },
    {
      title: 'Ayarlar',
      icon: 'fas fa-cog',
      submenus: [
        { title: 'Profil', path: '/admin/profile', permission: 'change_password' },
        { title: 'Şirket Ayarları', path: '/admin/settings', permission: 'manage_settings' }
      ]
    }
  ],

  [USER_ROLES.MANAGER]: [
    {
      title: 'Dashboard',
      icon: 'fas fa-tachometer-alt', 
      path: '/manager',
      permission: 'view_dashboard'
    },
    {
      title: 'Ürün Yönetimi',
      icon: 'fas fa-box',
      submenus: [
        { title: 'Ürün Listesi', path: '/manager/products', permission: 'manage_products' },
        { title: 'Ürün Ekle', path: '/manager/products/add', permission: 'add_product' },
        { title: 'Kategoriler', path: '/manager/categories', permission: 'manage_categories' }
      ]
    },
    {
      title: 'Stok Yönetimi',
      icon: 'fas fa-warehouse', 
      submenus: [
        { title: 'Stok Durumu', path: '/manager/stock', permission: 'manage_stock' },
        { title: 'Stok Hareketleri', path: '/manager/stock/movements', permission: 'manage_stock' },
        { title: 'Stok Tahminleri', path: '/manager/stock/predictions', permission: 'ai_analysis' },
        { title: 'Stok Güncelle', path: '/manager/stock/update', permission: 'stock_adjustment' }
      ]
    },
    {
      title: 'AI Analiz',
      icon: 'fas fa-robot',
      submenus: [
        { title: 'Ürün Tanıma', path: '/manager/ai/recognition', permission: 'ai_analysis' },
        { title: 'Renk Analizi', path: '/manager/ai/colors', permission: 'ai_analysis' },
        { title: 'Akıllı Öneriler', path: '/manager/ai/recommendations', permission: 'ai_recommendations' }
      ]
    },
    {
      title: 'Raporlar',
      icon: 'fas fa-chart-bar',
      submenus: [
        { title: 'Satış Raporları', path: '/manager/reports/sales', permission: 'view_reports' },
        { title: 'Stok Raporları', path: '/manager/reports/stock', permission: 'view_reports' }
      ]
    },
    {
      title: 'Profil',
      icon: 'fas fa-user', 
      path: '/manager/profile',
      permission: 'change_password'
    }
  ],

  [USER_ROLES.EMPLOYEE]: [
    {
      title: 'Dashboard',
      icon: 'fas fa-tachometer-alt',
      path: '/employee', 
      permission: 'view_dashboard'
    },
    {
      title: 'Ürün İşlemleri',
      icon: 'fas fa-box',
      submenus: [
        { title: 'Ürün Listesi', path: '/employee/products', permission: 'view_products' },
        { title: 'Ürün Ekle', path: '/employee/products/add', permission: 'add_product' }
      ]
    },
    {
      title: 'Stok',
      icon: 'fas fa-warehouse',
      submenus: [
        { title: 'Stok Durumu', path: '/employee/stock', permission: 'view_stock' },
        { title: 'Stok Güncelle', path: '/employee/stock/update', permission: 'update_stock' }
      ]
    },
    {
      title: 'AI Araçları',
      icon: 'fas fa-robot',
      submenus: [
        { title: 'Ürün Tanıma', path: '/employee/ai/recognition', permission: 'ai_analysis' },
        { title: 'Renk Analizi', path: '/employee/ai/colors', permission: 'ai_analysis' }
      ]
    },
    {
      title: 'Profil',
      icon: 'fas fa-user',
      path: '/employee/profile',
      permission: 'change_password'
    }
  ]
};

// 📦 Stok Durumları
export const STOCK_STATUS = {
  IN_STOCK: 'in_stock',
  LOW_STOCK: 'low_stock', 
  OUT_OF_STOCK: 'out_of_stock',
  CRITICAL: 'critical'
};

export const STOCK_STATUS_COLORS = {
  [STOCK_STATUS.IN_STOCK]: '#16A34A',    // Yeşil
  [STOCK_STATUS.LOW_STOCK]: '#F59E0B',   // Sarı
  [STOCK_STATUS.OUT_OF_STOCK]: '#DC2626', // Kırmızı
  [STOCK_STATUS.CRITICAL]: '#7C2D12'      // Koyu kırmızı
};

// 🔄 Stok Hareket Tipleri
export const STOCK_MOVEMENT_TYPES = {
  IN: 'in',           // Giriş
  OUT: 'out',         // Çıkış  
  ADJUSTMENT: 'adjustment' // Düzeltme
};

// 🎯 AI Analiz Tipleri
export const AI_ANALYSIS_TYPES = {
  PRODUCT_RECOGNITION: 'product_recognition',
  COLOR_ANALYSIS: 'color_analysis', 
  PRICE_PREDICTION: 'price_prediction',
  DEMAND_FORECAST: 'demand_forecast'
};

// 📊 Grafik Renkleri
export const CHART_COLORS = {
  primary: '#2563EB',
  secondary: '#059669', 
  warning: '#F59E0B',
  danger: '#DC2626',
  info: '#0891B2',
  success: '#16A34A'
};

// ⚙️ Uygulama Ayarları
export const APP_CONFIG = {
  APP_NAME: 'AIVentory',
  VERSION: '1.0.0',
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  AI_SERVICE_URL: import.meta.env.VITE_AI_URL || 'http://localhost:8000',
  ITEMS_PER_PAGE: 20,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  JWT_EXPIRY_TIME: 24 * 60 * 60 * 1000 // 24 saat
};

// 🌐 API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register', 
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password'
  },
  USERS: {
    GET_ALL: '/users',
    GET_BY_ID: '/users/:id',
    CREATE: '/users',
    UPDATE: '/users/:id', 
    DELETE: '/users/:id',
    CHANGE_PASSWORD: '/users/change-password'
  },
  PRODUCTS: {
    GET_ALL: '/products',
    GET_BY_ID: '/products/:id',
    CREATE: '/products',
    UPDATE: '/products/:id',
    DELETE: '/products/:id',
    SEARCH: '/products/search'
  },
  STOCK: {
    GET_ALL: '/stock',
    UPDATE: '/stock/:id',
    MOVEMENTS: '/stock/movements',
    PREDICTIONS: '/stock/predictions'
  },
  AI: {
    ANALYZE_IMAGE: '/ai/analyze-image',
    COLOR_ANALYSIS: '/ai/color-analysis', 
    PRICE_PREDICTION: '/ai/price-prediction',
    RECOMMENDATIONS: '/ai/recommendations'
  },
  REPORTS: {
    SALES: '/reports/sales',
    STOCK: '/reports/stock',
    AI_INSIGHTS: '/reports/ai-insights'
  }
};

// Default export - Tüm constant'ları içerir
export default {
  USER_ROLES,
  PERMISSIONS,
  DASHBOARD_CARDS,
  ROLE_COLORS,
  SIDEBAR_MENUS,
  STOCK_STATUS,
  STOCK_STATUS_COLORS,
  STOCK_MOVEMENT_TYPES,
  AI_ANALYSIS_TYPES,
  CHART_COLORS,
  APP_CONFIG,
  API_ENDPOINTS
};