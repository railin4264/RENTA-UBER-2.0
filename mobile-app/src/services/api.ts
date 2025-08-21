import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-netinfo/netinfo';

// Configuración de la API
const API_CONFIG = {
  baseURL: __DEV__ 
    ? 'http://localhost:3001/api' 
    : 'https://your-production-api.com/api',
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000,
};

// Tipos de respuesta
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

interface ApiError {
  message: string;
  status: number;
  errors?: any[];
}

// Clase principal de la API
class ApiService {
  private baseURL: string;
  private timeout: number;
  private retryAttempts: number;
  private retryDelay: number;

  constructor() {
    this.baseURL = API_CONFIG.baseURL;
    this.timeout = API_CONFIG.timeout;
    this.retryAttempts = API_CONFIG.retryAttempts;
    this.retryDelay = API_CONFIG.retryDelay;
  }

  // Obtener token de autenticación
  private async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  // Verificar conectividad
  private async checkConnectivity(): Promise<boolean> {
    try {
      const netInfo = await NetInfo.fetch();
      return netInfo.isConnected ?? false;
    } catch (error) {
      console.error('Error checking connectivity:', error);
      return false;
    }
  }

  // Crear headers de la petición
  private async createHeaders(): Promise<HeadersInit> {
    const token = await this.getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // Crear URL completa
  private createURL(endpoint: string): string {
    return `${this.baseURL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  }

  // Función de retry con delay exponencial
  private async retryWithDelay<T>(
    fn: () => Promise<T>,
    attempt: number = 1
  ): Promise<T> {
    try {
      return await fn();
    } catch (error: any) {
      if (attempt < this.retryAttempts && this.isRetryableError(error)) {
        const delay = this.retryDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.retryWithDelay(fn, attempt + 1);
      }
      throw error;
    }
  }

  // Verificar si el error es retryable
  private isRetryableError(error: any): boolean {
    return (
      error.status >= 500 ||
      error.status === 429 ||
      error.message?.includes('network') ||
      error.message?.includes('timeout')
    );
  }

  // Función principal para hacer requests
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retry: boolean = true
  ): Promise<ApiResponse<T>> {
    try {
      // Verificar conectividad
      const isConnected = await this.checkConnectivity();
      if (!isConnected) {
        throw new Error('No hay conexión a internet');
      }

      const url = this.createURL(endpoint);
      const headers = await this.createHeaders();

      const requestOptions: RequestInit = {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      };

      // Crear timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), this.timeout);
      });

      // Función de request
      const requestPromise = fetch(url, requestOptions);

      // Ejecutar request con timeout
      const response = await Promise.race([requestPromise, timeoutPromise]);

      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          message: errorData.message || `HTTP ${response.status}`,
          status: response.status,
          errors: errorData.errors,
        };
      }

      // Parsear respuesta
      const data = await response.json();
      return data;
    } catch (error: any) {
      // Manejar errores específicos
      if (error.status === 401) {
        // Token expirado o inválido
        await this.handleUnauthorized();
      }

      if (retry) {
        return this.retryWithDelay(() => this.request(endpoint, options, false));
      }

      throw error;
    }
  }

  // Manejar error de autorización
  private async handleUnauthorized(): Promise<void> {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
      // Aquí podrías emitir un evento para redirigir al login
    } catch (error) {
      console.error('Error handling unauthorized:', error);
    }
  }

  // Métodos HTTP
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    let url = endpoint;
    
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      url += `?${searchParams.toString()}`;
    }

    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Upload de archivos
  async uploadFile<T>(
    endpoint: string,
    file: any,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> {
    try {
      const token = await this.getAuthToken();
      const headers: HeadersInit = {};

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(this.createURL(endpoint), {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          message: errorData.message || `HTTP ${response.status}`,
          status: response.status,
          errors: errorData.errors,
        };
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      throw error;
    }
  }

  // Download de archivos
  async downloadFile(endpoint: string, filename?: string): Promise<void> {
    try {
      const token = await this.getAuthToken();
      const headers: HeadersInit = {};

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(this.createURL(endpoint), {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || 'download';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.get('/health');
      return response.success;
    } catch (error) {
      return false;
    }
  }

  // Cambiar URL base (útil para cambiar entre entornos)
  setBaseURL(url: string): void {
    this.baseURL = url;
  }

  // Obtener URL base actual
  getBaseURL(): string {
    return this.baseURL;
  }
}

// Instancia singleton
export const apiService = new ApiService();

// Exportar métodos individuales para conveniencia
export const api = {
  get: <T>(endpoint: string, params?: Record<string, any>) => 
    apiService.get<T>(endpoint, params),
  post: <T>(endpoint: string, data?: any) => 
    apiService.post<T>(endpoint, data),
  put: <T>(endpoint: string, data?: any) => 
    apiService.put<T>(endpoint, data),
  patch: <T>(endpoint: string, data?: any) => 
    apiService.patch<T>(endpoint, data),
  delete: <T>(endpoint: string) => 
    apiService.delete<T>(endpoint),
  uploadFile: <T>(endpoint: string, file: any, onProgress?: (progress: number) => void) =>
    apiService.uploadFile<T>(endpoint, file, onProgress),
  downloadFile: (endpoint: string, filename?: string) =>
    apiService.downloadFile(endpoint, filename),
  healthCheck: () => apiService.healthCheck(),
  setBaseURL: (url: string) => apiService.setBaseURL(url),
  getBaseURL: () => apiService.getBaseURL(),
};

export default apiService;