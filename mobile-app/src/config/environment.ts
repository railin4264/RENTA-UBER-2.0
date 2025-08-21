// Configuración de entorno para la aplicación móvil
export const ENV = {
  // Entorno actual
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // URLs de la API
  API: {
    DEVELOPMENT: 'http://localhost:3001/api',
    STAGING: 'https://staging-api.renta-uber.com/api',
    PRODUCTION: 'https://api.renta-uber.com/api',
  },
  
  // Configuración de la aplicación
  APP: {
    NAME: 'Renta Uber',
    VERSION: '1.0.0',
    BUILD_NUMBER: '1',
  },
  
  // Configuración de características
  FEATURES: {
    BIOMETRICS: true,
    PUSH_NOTIFICATIONS: true,
    OFFLINE_MODE: true,
    DARK_MODE: true,
    CAMERA: true,
    GPS: true,
    FILE_UPLOAD: true,
  },
  
  // Configuración de archivos
  FILES: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    UPLOAD_TIMEOUT: 30000, // 30 segundos
  },
  
  // Configuración de caché
  CACHE: {
    DRIVERS_TTL: 5 * 60 * 1000, // 5 minutos
    VEHICLES_TTL: 5 * 60 * 1000, // 5 minutos
    PAYMENTS_TTL: 2 * 60 * 1000, // 2 minutos
    EXPENSES_TTL: 2 * 60 * 1000, // 2 minutos
    DASHBOARD_TTL: 1 * 60 * 1000, // 1 minuto
  },
  
  // Configuración de paginación
  PAGINATION: {
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },
  
  // Configuración de timeouts
  TIMEOUTS: {
    API_REQUEST: 10000, // 10 segundos
    IMAGE_LOAD: 5000, // 5 segundos
    SPLASH_SCREEN: 2000, // 2 segundos
  },
  
  // Configuración de reintentos
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000, // 1 segundo
    BACKOFF_MULTIPLIER: 2,
  },
  
  // Configuración de validación
  VALIDATION: {
    PASSWORD_MIN_LENGTH: 6,
    PHONE_MIN_LENGTH: 10,
    CEDULA_MIN_LENGTH: 10,
    LICENSE_MIN_LENGTH: 5,
    PLATE_MIN_LENGTH: 5,
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
      XS: 12,
      SM: 14,
      BASE: 16,
      LG: 18,
      XL: 20,
      '2XL': 24,
      '3XL': 30,
      '4XL': 36,
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
    XS: 4,
    SM: 8,
    BASE: 16,
    LG: 24,
    XL: 32,
    '2XL': 48,
    '3XL': 64,
  },
  
  // Configuración de bordes
  BORDERS: {
    RADIUS: {
      SM: 4,
      BASE: 8,
      LG: 12,
      XL: 16,
      FULL: 9999,
    },
    WIDTH: {
      THIN: 1,
      BASE: 2,
      THICK: 4,
    },
  },
  
  // Configuración de sombras
  SHADOWS: {
    SM: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    BASE: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    LG: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 6,
    },
  },
};

// Función para obtener la URL de la API según el entorno
export const getApiUrl = (): string => {
  switch (ENV.NODE_ENV) {
    case 'development':
      return ENV.API.DEVELOPMENT;
    case 'staging':
      return ENV.API.STAGING;
    case 'production':
      return ENV.API.PRODUCTION;
    default:
      return ENV.API.DEVELOPMENT;
  }
};

// Función para verificar si estamos en desarrollo
export const isDevelopment = (): boolean => {
  return ENV.NODE_ENV === 'development';
};

// Función para verificar si estamos en producción
export const isProduction = (): boolean => {
  return ENV.NODE_ENV === 'production';
};

// Función para obtener la configuración de reintentos
export const getRetryConfig = () => {
  return {
    maxAttempts: ENV.RETRY.MAX_ATTEMPTS,
    delay: ENV.RETRY.DELAY,
    backoffMultiplier: ENV.RETRY.BACKOFF_MULTIPLIER,
  };
};

// Función para obtener la configuración de caché
export const getCacheConfig = () => {
  return {
    drivers: ENV.CACHE.DRIVERS_TTL,
    vehicles: ENV.CACHE.VEHICLES_TTL,
    payments: ENV.CACHE.PAYMENTS_TTL,
    expenses: ENV.CACHE.EXPENSES_TTL,
    dashboard: ENV.CACHE.DASHBOARD_TTL,
  };
};

// Función para obtener la configuración de validación
export const getValidationConfig = () => {
  return {
    password: {
      minLength: ENV.VALIDATION.PASSWORD_MIN_LENGTH,
    },
    phone: {
      minLength: ENV.VALIDATION.PHONE_MIN_LENGTH,
    },
    cedula: {
      minLength: ENV.VALIDATION.CEDULA_MIN_LENGTH,
    },
    license: {
      minLength: ENV.VALIDATION.LICENSE_MIN_LENGTH,
    },
    plate: {
      minLength: ENV.VALIDATION.PLATE_MIN_LENGTH,
    },
  };
};

export default ENV;