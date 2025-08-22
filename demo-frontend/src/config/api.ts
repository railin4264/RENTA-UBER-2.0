export const API_CONFIG = {
  BASE_URL: 'http://localhost:3001/api',
  TIMEOUT: 10000, // 10 segundos
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 segundo
};

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    VALIDATE: '/auth/validate',
    REFRESH: '/auth/refresh'
  },
  DASHBOARD: '/dashboard',
  DRIVERS: '/drivers',
  VEHICLES: '/vehicles',
  CONTRACTS: '/contracts',
  PAYMENTS: '/payments',
  EXPENSES: '/expenses',
  REPORTS: '/reports'
};

export const buildUrl = (endpoint: string, params?: Record<string, string | number>) => {
  let url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.set(key, String(value));
      }
    });
    
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }
  
  return url;
};