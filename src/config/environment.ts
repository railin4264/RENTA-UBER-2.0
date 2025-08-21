// Configuración de entorno para el frontend
export const ENV = {
  // Entorno actual
  NODE_ENV: import.meta.env.MODE,
  
  // URLs de la API
  API: {
    BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
  },
  
  // Configuración de la aplicación
  APP: {
    NAME: import.meta.env.VITE_APP_NAME || 'Renta Uber - Sistema de Gestión',
    VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
    ENVIRONMENT: import.meta.env.VITE_APP_ENVIRONMENT || 'development',
  },
  
  // Configuración de características
  FEATURES: {
    PUSH_NOTIFICATIONS: import.meta.env.VITE_ENABLE_PUSH_NOTIFICATIONS === 'true',
    OFFLINE_MODE: import.meta.env.VITE_ENABLE_OFFLINE_MODE === 'true',
    DARK_MODE: import.meta.env.VITE_ENABLE_DARK_MODE === 'true',
    ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  },
  
  // Servicios externos
  EXTERNAL_SERVICES: {
    GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    WHATSAPP_BUSINESS_API_KEY: import.meta.env.VITE_WHATSAPP_BUSINESS_API_KEY,
  },
  
  // Configuración de desarrollo
  DEVELOPMENT: {
    DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true',
    LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL || 'info',
  },
  
  // Configuración de caché
  CACHE: {
    DASHBOARD_TTL: 5 * 60 * 1000, // 5 minutos
    DRIVERS_TTL: 10 * 60 * 1000, // 10 minutos
    VEHICLES_TTL: 10 * 60 * 1000, // 10 minutos
    PAYMENTS_TTL: 2 * 60 * 1000, // 2 minutos
    EXPENSES_TTL: 2 * 60 * 1000, // 2 minutos
  },
  
  // Configuración de paginación
  PAGINATION: {
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  },
  
  // Configuración de archivos
  FILES: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    UPLOAD_TIMEOUT: 30000, // 30 segundos
  },
  
  // Configuración de moneda
  CURRENCY: {
    CODE: 'COP',
    SYMBOL: '$',
    LOCALE: 'es-CO',
    DECIMAL_PLACES: 0,
  },
  
  // Configuración de fechas
  DATES: {
    LOCALE: 'es-CO',
    TIMEZONE: 'America/Bogota',
    FORMAT: {
      SHORT: 'DD/MM/YYYY',
      LONG: 'DD [de] MMMM [de] YYYY',
      TIME: 'HH:mm',
      DATETIME: 'DD/MM/YYYY HH:mm',
    },
  },
  
  // Configuración de colores del tema
  COLORS: {
    PRIMARY: '#3b82f6',
    SECONDARY: '#1e40af',
    SUCCESS: '#10b981',
    WARNING: '#f59e0b',
    ERROR: '#ef4444',
    INFO: '#06b6d4',
    LIGHT: '#f8fafc',
    DARK: '#1f2937',
    GRAY: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
  },
  
  // Configuración de fuentes
  FONTS: {
    SIZES: {
      XS: '0.75rem',
      SM: '0.875rem',
      BASE: '1rem',
      LG: '1.125rem',
      XL: '1.25rem',
      '2XL': '1.5rem',
      '3XL': '1.875rem',
      '4XL': '2.25rem',
    },
    WEIGHTS: {
      NORMAL: '400',
      MEDIUM: '500',
      SEMIBOLD: '600',
      BOLD: '700',
    },
  },
  
  // Configuración de espaciado
  SPACING: {
    XS: '0.25rem',
    SM: '0.5rem',
    BASE: '1rem',
    LG: '1.5rem',
    XL: '2rem',
    '2XL': '3rem',
    '3XL': '4rem',
  },
  
  // Configuración de bordes
  BORDERS: {
    RADIUS: {
      SM: '0.25rem',
      BASE: '0.375rem',
      LG: '0.5rem',
      XL: '0.75rem',
      FULL: '9999px',
    },
    WIDTH: {
      THIN: '1px',
      BASE: '2px',
      THICK: '4px',
    },
  },
  
  // Configuración de sombras
  SHADOWS: {
    SM: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    BASE: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    LG: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    XL: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  
  // Configuración de breakpoints
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
    '2XL': '1536px',
  },
  
  // Configuración de z-index
  Z_INDEX: {
    DROPDOWN: 1000,
    STICKY: 1020,
    FIXED: 1030,
    MODAL_BACKDROP: 1040,
    MODAL: 1050,
    POPOVER: 1060,
    TOOLTIP: 1070,
  },
};

// Función para obtener la URL de la API según el entorno
export const getApiUrl = (): string => {
  return ENV.API.BASE_URL;
};

// Función para verificar si estamos en desarrollo
export const isDevelopment = (): boolean => {
  return ENV.NODE_ENV === 'development';
};

// Función para verificar si estamos en producción
export const isProduction = (): boolean => {
  return ENV.NODE_ENV === 'production';
};

// Función para verificar si estamos en staging
export const isStaging = (): boolean => {
  return ENV.NODE_ENV === 'staging';
};

// Función para obtener la configuración de caché
export const getCacheConfig = () => {
  return {
    dashboard: ENV.CACHE.DASHBOARD_TTL,
    drivers: ENV.CACHE.DRIVERS_TTL,
    vehicles: ENV.CACHE.VEHICLES_TTL,
    payments: ENV.CACHE.PAYMENTS_TTL,
    expenses: ENV.CACHE.EXPENSES_TTL,
  };
};

// Función para obtener la configuración de paginación
export const getPaginationConfig = () => {
  return {
    defaultLimit: ENV.PAGINATION.DEFAULT_LIMIT,
    maxLimit: ENV.PAGINATION.MAX_LIMIT,
    pageSizeOptions: ENV.PAGINATION.PAGE_SIZE_OPTIONS,
  };
};

// Función para obtener la configuración de archivos
export const getFileConfig = () => {
  return {
    maxSize: ENV.FILES.MAX_SIZE,
    allowedTypes: ENV.FILES.ALLOWED_TYPES,
    uploadTimeout: ENV.FILES.UPLOAD_TIMEOUT,
  };
};

// Función para obtener la configuración de moneda
export const getCurrencyConfig = () => {
  return {
    code: ENV.CURRENCY.CODE,
    symbol: ENV.CURRENCY.SYMBOL,
    locale: ENV.CURRENCY.LOCALE,
    decimalPlaces: ENV.CURRENCY.DECIMAL_PLACES,
  };
};

// Función para obtener la configuración de fechas
export const getDateConfig = () => {
  return {
    locale: ENV.DATES.LOCALE,
    timezone: ENV.DATES.TIMEZONE,
    format: ENV.DATES.FORMAT,
  };
};

// Función para obtener la configuración de colores
export const getColorConfig = () => {
  return ENV.COLORS;
};

// Función para obtener la configuración de fuentes
export const getFontConfig = () => {
  return ENV.FONTS;
};

// Función para obtener la configuración de espaciado
export const getSpacingConfig = () => {
  return ENV.SPACING;
};

// Función para obtener la configuración de bordes
export const getBorderConfig = () => {
  return ENV.BORDERS;
};

// Función para obtener la configuración de sombras
export const getShadowConfig = () => {
  return ENV.SHADOWS;
};

// Función para obtener la configuración de breakpoints
export const getBreakpointConfig = () => {
  return ENV.BREAKPOINTS;
};

// Función para obtener la configuración de z-index
export const getZIndexConfig = () => {
  return ENV.Z_INDEX;
};

export default ENV;