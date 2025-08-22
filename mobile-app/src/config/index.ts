// Configuración de la aplicación móvil Renta Uber

export const CONFIG = {
  // Configuración de la API
  API: {
    BASE_URL: __DEV__ 
      ? 'http://localhost:3001/api' 
      : 'https://api.renta-uber.com/api',
    TIMEOUT: 30000, // 30 segundos
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 segundo
  },

  // Configuración de autenticación
  AUTH: {
    TOKEN_EXPIRY: 15 * 60 * 1000, // 15 minutos
    REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 días
    AUTO_REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutos antes de expirar
  },

  // Configuración de caché
  CACHE: {
    DEFAULT_EXPIRY: 5 * 60 * 1000, // 5 minutos
    MAX_SIZE: 100, // Máximo número de elementos en caché
    CLEANUP_INTERVAL: 10 * 60 * 1000, // 10 minutos
  },

  // Configuración de sincronización
  SYNC: {
    DASHBOARD_INTERVAL: 30 * 1000, // 30 segundos
    DRIVERS_INTERVAL: 60 * 1000, // 1 minuto
    VEHICLES_INTERVAL: 60 * 1000, // 1 minuto
    PAYMENTS_INTERVAL: 2 * 60 * 1000, // 2 minutos
    CONTRACTS_INTERVAL: 5 * 60 * 1000, // 5 minutos
    EXPENSES_INTERVAL: 5 * 60 * 1000, // 5 minutos
  },

  // Configuración de la interfaz
  UI: {
    ANIMATION_DURATION: 300, // milisegundos
    DEBOUNCE_DELAY: 500, // milisegundos
    PULL_TO_REFRESH_DISTANCE: 80, // píxeles
    LOADING_TIMEOUT: 10000, // 10 segundos
  },

  // Configuración de notificaciones
  NOTIFICATIONS: {
    AUTO_HIDE_DELAY: 4000, // 4 segundos
    MAX_VISIBLE: 5,
    STACK_OFFSET: 10,
  },

  // Configuración de archivos
  FILES: {
    MAX_SIZE: 10 * 1024 * 1024, // 10 MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    UPLOAD_TIMEOUT: 60000, // 60 segundos
  },

  // Configuración de paginación
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
    LOAD_MORE_THRESHOLD: 5, // Cargar más cuando queden 5 elementos
  },

  // Configuración de errores
  ERRORS: {
    NETWORK_TIMEOUT: 'Tiempo de espera agotado. Verifica tu conexión.',
    NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
    UNAUTHORIZED: 'Sesión expirada. Inicia sesión nuevamente.',
    FORBIDDEN: 'No tienes permisos para realizar esta acción.',
    NOT_FOUND: 'Recurso no encontrado.',
    SERVER_ERROR: 'Error del servidor. Intenta más tarde.',
    VALIDATION_ERROR: 'Datos inválidos. Verifica la información.',
  },

  // Configuración de validación
  VALIDATION: {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_REGEX: /^\+?[\d\s\-\(\)]+$/,
    LICENSE_REGEX: /^[A-Z0-9]{6,12}$/,
    PLATE_REGEX: /^[A-Z]{3}-\d{3}$/,
    PASSWORD_MIN_LENGTH: 6,
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 50,
  },

  // Configuración de moneda
  CURRENCY: {
    SYMBOL: '$',
    LOCALE: 'es-MX',
    DECIMAL_PLACES: 2,
  },

  // Configuración de fechas
  DATES: {
    LOCALE: 'es-ES',
    TIMEZONE: 'America/Mexico_City',
    FORMATS: {
      SHORT: 'DD/MM/YYYY',
      LONG: 'DD [de] MMMM [de] YYYY',
      TIME: 'HH:mm',
      DATETIME: 'DD/MM/YYYY HH:mm',
    },
  },

  // Configuración de desarrollo
  DEV: {
    ENABLE_LOGS: __DEV__,
    ENABLE_DEBUG_MENU: __DEV__,
    MOCK_DATA: __DEV__,
    API_LOGGING: __DEV__,
  },
};

// Tipos de configuración
export type ConfigKey = keyof typeof CONFIG;
export type ApiConfig = typeof CONFIG.API;
export type AuthConfig = typeof CONFIG.AUTH;
export type CacheConfig = typeof CONFIG.CACHE;
export type SyncConfig = typeof CONFIG.SYNC;
export type UIConfig = typeof CONFIG.UI;
export type NotificationConfig = typeof CONFIG.NOTIFICATIONS;
export type FileConfig = typeof CONFIG.FILES;
export type PaginationConfig = typeof CONFIG.PAGINATION;
export type ErrorConfig = typeof CONFIG.ERRORS;
export type ValidationConfig = typeof CONFIG.VALIDATION;
export type CurrencyConfig = typeof CONFIG.CURRENCY;
export type DateConfig = typeof CONFIG.DATES;
export type DevConfig = typeof CONFIG.DEV;

// Función para obtener configuración
export function getConfig<T extends ConfigKey>(key: T): typeof CONFIG[T] {
  return CONFIG[key];
}

// Función para actualizar configuración en tiempo de ejecución
export function updateConfig<T extends ConfigKey>(
  key: T, 
  value: Partial<typeof CONFIG[T]>
): void {
  Object.assign(CONFIG[key], value);
}

// Función para obtener configuración de API
export function getApiConfig(): ApiConfig {
  return CONFIG.API;
}

// Función para obtener configuración de autenticación
export function getAuthConfig(): AuthConfig {
  return CONFIG.AUTH;
}

// Función para obtener configuración de caché
export function getCacheConfig(): CacheConfig {
  return CONFIG.CACHE;
}

// Función para obtener configuración de sincronización
export function getSyncConfig(): SyncConfig {
  return CONFIG.SYNC;
}

// Función para obtener configuración de UI
export function getUIConfig(): UIConfig {
  return CONFIG.UI;
}

// Función para obtener configuración de notificaciones
export function getNotificationConfig(): NotificationConfig {
  return CONFIG.NOTIFICATIONS;
}

// Función para obtener configuración de archivos
export function getFileConfig(): FileConfig {
  return CONFIG.FILES;
}

// Función para obtener configuración de paginación
export function getPaginationConfig(): PaginationConfig {
  return CONFIG.PAGINATION;
}

// Función para obtener configuración de errores
export function getErrorConfig(): ErrorConfig {
  return CONFIG.ERRORS;
}

// Función para obtener configuración de validación
export function getValidationConfig(): ValidationConfig {
  return CONFIG.VALIDATION;
}

// Función para obtener configuración de moneda
export function getCurrencyConfig(): CurrencyConfig {
  return CONFIG.CURRENCY;
}

// Función para obtener configuración de fechas
export function getDateConfig(): DateConfig {
  return CONFIG.DATES;
}

// Función para obtener configuración de desarrollo
export function getDevConfig(): DevConfig {
  return CONFIG.DEV;
}

// Función para verificar si estamos en modo desarrollo
export function isDevelopment(): boolean {
  return __DEV__;
}

// Función para verificar si estamos en modo producción
export function isProduction(): boolean {
  return !__DEV__;
}

// Función para obtener la URL base de la API según el entorno
export function getApiBaseUrl(): string {
  return CONFIG.API.BASE_URL;
}

// Función para obtener el timeout de la API
export function getApiTimeout(): number {
  return CONFIG.API.TIMEOUT;
}

// Función para obtener el número de intentos de reintento
export function getApiRetryAttempts(): number {
  return CONFIG.API.RETRY_ATTEMPTS;
}

// Función para obtener el delay entre reintentos
export function getApiRetryDelay(): number {
  return CONFIG.API.RETRY_DELAY;
}

// Función para obtener el tiempo de expiración del token
export function getTokenExpiry(): number {
  return CONFIG.AUTH.TOKEN_EXPIRY;
}

// Función para obtener el tiempo de expiración del refresh token
export function getRefreshTokenExpiry(): number {
  return CONFIG.AUTH.REFRESH_TOKEN_EXPIRY;
}

// Función para obtener el umbral de auto-refresh
export function getAutoRefreshThreshold(): number {
  return CONFIG.AUTH.AUTO_REFRESH_THRESHOLD;
}

// Función para obtener el tiempo de expiración del caché por defecto
export function getCacheExpiry(): number {
  return CONFIG.CACHE.DEFAULT_EXPIRY;
}

// Función para obtener el tamaño máximo del caché
export function getMaxCacheSize(): number {
  return CONFIG.CACHE.MAX_SIZE;
}

// Función para obtener el intervalo de limpieza del caché
export function getCacheCleanupInterval(): number {
  return CONFIG.CACHE.CLEANUP_INTERVAL;
}

// Función para obtener el intervalo de sincronización del dashboard
export function getDashboardSyncInterval(): number {
  return CONFIG.SYNC.DASHBOARD_INTERVAL;
}

// Función para obtener el intervalo de sincronización de conductores
export function getDriversSyncInterval(): number {
  return CONFIG.SYNC.DRIVERS_INTERVAL;
}

// Función para obtener el intervalo de sincronización de vehículos
export function getVehiclesSyncInterval(): number {
  return CONFIG.SYNC.VEHICLES_INTERVAL;
}

// Función para obtener el intervalo de sincronización de pagos
export function getPaymentsSyncInterval(): number {
  return CONFIG.SYNC.PAYMENTS_INTERVAL;
}

// Función para obtener el intervalo de sincronización de contratos
export function getContractsSyncInterval(): number {
  return CONFIG.SYNC.CONTRACTS_INTERVAL;
}

// Función para obtener el intervalo de sincronización de gastos
export function getExpensesSyncInterval(): number {
  return CONFIG.SYNC.EXPENSES_INTERVAL;
}

// Función para obtener la duración de las animaciones
export function getAnimationDuration(): number {
  return CONFIG.UI.ANIMATION_DURATION;
}

// Función para obtener el delay del debounce
export function getDebounceDelay(): number {
  return CONFIG.UI.DEBOUNCE_DELAY;
}

// Función para obtener la distancia del pull-to-refresh
export function getPullToRefreshDistance(): number {
  return CONFIG.UI.PULL_TO_REFRESH_DISTANCE;
}

// Función para obtener el timeout de carga
export function getLoadingTimeout(): number {
  return CONFIG.UI.LOADING_TIMEOUT;
}

// Función para obtener el delay de auto-ocultar notificaciones
export function getNotificationAutoHideDelay(): number {
  return CONFIG.NOTIFICATIONS.AUTO_HIDE_DELAY;
}

// Función para obtener el número máximo de notificaciones visibles
export function getMaxVisibleNotifications(): number {
  return CONFIG.NOTIFICATIONS.MAX_VISIBLE;
}

// Función para obtener el offset del stack de notificaciones
export function getNotificationStackOffset(): number {
  return CONFIG.NOTIFICATIONS.STACK_OFFSET;
}

// Función para obtener el tamaño máximo de archivos
export function getMaxFileSize(): number {
  return CONFIG.FILES.MAX_SIZE;
}

// Función para obtener los tipos de archivo permitidos
export function getAllowedFileTypes(): string[] {
  return CONFIG.FILES.ALLOWED_TYPES;
}

// Función para obtener el timeout de subida de archivos
export function getUploadTimeout(): number {
  return CONFIG.FILES.UPLOAD_TIMEOUT;
}

// Función para obtener el tamaño de página por defecto
export function getDefaultPageSize(): number {
  return CONFIG.PAGINATION.DEFAULT_PAGE_SIZE;
}

// Función para obtener el tamaño máximo de página
export function getMaxPageSize(): number {
  return CONFIG.PAGINATION.MAX_PAGE_SIZE;
}

// Función para obtener el umbral de carga de más elementos
export function getLoadMoreThreshold(): number {
  return CONFIG.PAGINATION.LOAD_MORE_THRESHOLD;
}

// Función para obtener el mensaje de error de timeout de red
export function getNetworkTimeoutError(): string {
  return CONFIG.ERRORS.NETWORK_TIMEOUT;
}

// Función para obtener el mensaje de error de red
export function getNetworkError(): string {
  return CONFIG.ERRORS.NETWORK_ERROR;
}

// Función para obtener el mensaje de error de no autorizado
export function getUnauthorizedError(): string {
  return CONFIG.ERRORS.UNAUTHORIZED;
}

// Función para obtener el mensaje de error de prohibido
export function getForbiddenError(): string {
  return CONFIG.ERRORS.FORBIDDEN;
}

// Función para obtener el mensaje de error de no encontrado
export function getNotFoundError(): string {
  return CONFIG.ERRORS.NOT_FOUND;
}

// Función para obtener el mensaje de error del servidor
export function getServerError(): string {
  return CONFIG.ERRORS.SERVER_ERROR;
}

// Función para obtener el mensaje de error de validación
export function getValidationError(): string {
  return CONFIG.ERRORS.VALIDATION_ERROR;
}

// Función para obtener la regex de validación de email
export function getEmailRegex(): RegExp {
  return CONFIG.VALIDATION.EMAIL_REGEX;
}

// Función para obtener la regex de validación de teléfono
export function getPhoneRegex(): RegExp {
  return CONFIG.VALIDATION.PHONE_REGEX;
}

// Función para obtener la regex de validación de licencia
export function getLicenseRegex(): RegExp {
  return CONFIG.VALIDATION.LICENSE_REGEX;
}

// Función para obtener la regex de validación de placa
export function getPlateRegex(): RegExp {
  return CONFIG.VALIDATION.PLATE_REGEX;
}

// Función para obtener la longitud mínima de contraseña
export function getPasswordMinLength(): number {
  return CONFIG.VALIDATION.PASSWORD_MIN_LENGTH;
}

// Función para obtener la longitud mínima de nombre
export function getNameMinLength(): number {
  return CONFIG.VALIDATION.NAME_MIN_LENGTH;
}

// Función para obtener la longitud máxima de nombre
export function getNameMaxLength(): number {
  return CONFIG.VALIDATION.NAME_MAX_LENGTH;
}

// Función para obtener el símbolo de moneda
export function getCurrencySymbol(): string {
  return CONFIG.CURRENCY.SYMBOL;
}

// Función para obtener la localización de moneda
export function getCurrencyLocale(): string {
  return CONFIG.CURRENCY.LOCALE;
}

// Función para obtener el número de decimales de moneda
export function getCurrencyDecimalPlaces(): number {
  return CONFIG.CURRENCY.DECIMAL_PLACES;
}

// Función para obtener la localización de fechas
export function getDateLocale(): string {
  return CONFIG.DATES.LOCALE;
}

// Función para obtener la zona horaria
export function getTimezone(): string {
  return CONFIG.DATES.TIMEZONE;
}

// Función para obtener los formatos de fecha
export function getDateFormats() {
  return CONFIG.DATES.FORMATS;
}

// Función para verificar si los logs están habilitados
export function areLogsEnabled(): boolean {
  return CONFIG.DEV.ENABLE_LOGS;
}

// Función para verificar si el menú de debug está habilitado
export function isDebugMenuEnabled(): boolean {
  return CONFIG.DEV.ENABLE_DEBUG_MENU;
}

// Función para verificar si los datos mock están habilitados
export function areMockDataEnabled(): boolean {
  return CONFIG.DEV.MOCK_DATA;
}

// Función para verificar si el logging de API está habilitado
export function isApiLoggingEnabled(): boolean {
  return CONFIG.DEV.API_LOGGING;
}

export default CONFIG;