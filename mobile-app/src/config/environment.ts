interface EnvironmentConfig {
  API_BASE_URL: string;
  API_TIMEOUT: number;
  CACHE_EXPIRY: number;
  SYNC_INTERVAL: number;
  LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
  FEATURES: {
    PUSH_NOTIFICATIONS: boolean;
    OFFLINE_MODE: boolean;
    REAL_TIME_SYNC: boolean;
    ANALYTICS: boolean;
    CRASH_REPORTING: boolean;
  };
  SECURITY: {
    JWT_EXPIRY: number;
    REFRESH_TOKEN_EXPIRY: number;
    MAX_LOGIN_ATTEMPTS: number;
    SESSION_TIMEOUT: number;
  };
  PERFORMANCE: {
    LAZY_LOADING: boolean;
    VIRTUALIZATION: boolean;
    IMAGE_CACHING: boolean;
    BUNDLE_ANALYSIS: boolean;
  };
}

const developmentConfig: EnvironmentConfig = {
  API_BASE_URL: 'http://localhost:3001/api',
  API_TIMEOUT: 10000,
  CACHE_EXPIRY: 5 * 60 * 1000, // 5 minutos
  SYNC_INTERVAL: 30000, // 30 segundos
  LOG_LEVEL: 'debug',
  FEATURES: {
    PUSH_NOTIFICATIONS: true,
    OFFLINE_MODE: true,
    REAL_TIME_SYNC: true,
    ANALYTICS: false,
    CRASH_REPORTING: false,
  },
  SECURITY: {
    JWT_EXPIRY: 15 * 60 * 1000, // 15 minutos
    REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 días
    MAX_LOGIN_ATTEMPTS: 5,
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos
  },
  PERFORMANCE: {
    LAZY_LOADING: true,
    VIRTUALIZATION: true,
    IMAGE_CACHING: true,
    BUNDLE_ANALYSIS: true,
  },
};

const stagingConfig: EnvironmentConfig = {
  API_BASE_URL: 'https://staging-api.renta-uber.com/api',
  API_TIMEOUT: 15000,
  CACHE_EXPIRY: 10 * 60 * 1000, // 10 minutos
  SYNC_INTERVAL: 60000, // 1 minuto
  LOG_LEVEL: 'info',
  FEATURES: {
    PUSH_NOTIFICATIONS: true,
    OFFLINE_MODE: true,
    REAL_TIME_SYNC: true,
    ANALYTICS: true,
    CRASH_REPORTING: true,
  },
  SECURITY: {
    JWT_EXPIRY: 15 * 60 * 1000, // 15 minutos
    REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 días
    MAX_LOGIN_ATTEMPTS: 5,
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos
  },
  PERFORMANCE: {
    LAZY_LOADING: true,
    VIRTUALIZATION: true,
    IMAGE_CACHING: true,
    BUNDLE_ANALYSIS: false,
  },
};

const productionConfig: EnvironmentConfig = {
  API_BASE_URL: 'https://api.renta-uber.com/api',
  API_TIMEOUT: 20000,
  CACHE_EXPIRY: 15 * 60 * 1000, // 15 minutos
  SYNC_INTERVAL: 2 * 60 * 1000, // 2 minutos
  LOG_LEVEL: 'warn',
  FEATURES: {
    PUSH_NOTIFICATIONS: true,
    OFFLINE_MODE: true,
    REAL_TIME_SYNC: true,
    ANALYTICS: true,
    CRASH_REPORTING: true,
  },
  SECURITY: {
    JWT_EXPIRY: 15 * 60 * 1000, // 15 minutos
    REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 días
    MAX_LOGIN_ATTEMPTS: 3,
    SESSION_TIMEOUT: 15 * 60 * 1000, // 15 minutos
  },
  PERFORMANCE: {
    LAZY_LOADING: true,
    VIRTUALIZATION: true,
    IMAGE_CACHING: true,
    BUNDLE_ANALYSIS: false,
  },
};

// Determinar el ambiente actual
const getEnvironment = (): 'development' | 'staging' | 'production' => {
  if (__DEV__) {
    return 'development';
  }
  
  // En producción, se puede usar un flag de build o variable de entorno
  // Por ahora, asumimos que si no es development, es production
  return 'production';
};

// Obtener configuración del ambiente actual
export const getConfig = (): EnvironmentConfig => {
  const env = getEnvironment();
  
  switch (env) {
    case 'development':
      return developmentConfig;
    case 'staging':
      return stagingConfig;
    case 'production':
      return productionConfig;
    default:
      return productionConfig;
  }
};

// Configuración actual
export const config = getConfig();

// Función para validar configuración
export const validateConfig = (): boolean => {
  const requiredFields = [
    'API_BASE_URL',
    'API_TIMEOUT',
    'CACHE_EXPIRY',
    'SYNC_INTERVAL',
  ];
  
  for (const field of requiredFields) {
    if (!config[field as keyof EnvironmentConfig]) {
      console.error(`Missing required config field: ${field}`);
      return false;
    }
  }
  
  return true;
};

// Función para obtener configuración específica
export const getFeatureFlag = (feature: keyof EnvironmentConfig['FEATURES']): boolean => {
  return config.FEATURES[feature];
};

export const getSecuritySetting = (setting: keyof EnvironmentConfig['SECURITY']): any => {
  return config.SECURITY[setting];
};

export const getPerformanceSetting = (setting: keyof EnvironmentConfig['PERFORMANCE']): boolean => {
  return config.PERFORMANCE[setting];
};

// Configuración de logging
export const logConfig = {
  level: config.LOG_LEVEL,
  enabled: __DEV__ || config.LOG_LEVEL !== 'error',
  maxLogs: 1000,
  persistLogs: config.LOG_LEVEL === 'debug',
};

// Configuración de caché
export const cacheConfig = {
  expiry: config.CACHE_EXPIRY,
  maxSize: 50 * 1024 * 1024, // 50MB
  cleanupInterval: 5 * 60 * 1000, // 5 minutos
};

// Configuración de sincronización
export const syncConfig = {
  interval: config.SYNC_INTERVAL,
  retryAttempts: 3,
  retryDelay: 1000,
  batchSize: 100,
  maxConcurrent: 3,
};

export default config;