import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const API_BASE_URL = 'http://localhost:3001/api';
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutos

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

class ApiService {
  private baseURL: string;
  private cache: Map<string, CacheItem<any>>;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.cache = new Map();
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await AsyncStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  private async isOnline(): Promise<boolean> {
    const netInfo = await NetInfo.fetch();
    return netInfo.isConnected ?? false;
  }

  private async getCachedData<T>(key: string): Promise<T | null> {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
      return cached.data;
    }
    return null;
  }

  private setCachedData<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  private clearCache(): void {
    this.cache.clear();
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      const data = await response.json();
      
      if (response.ok) {
        return { success: true, data };
      } else {
        // Manejar errores específicos
        if (response.status === 401) {
          // Token expirado, limpiar cache y redirigir a login
          await this.clearCache();
          await AsyncStorage.removeItem('auth_token');
          await AsyncStorage.removeItem('auth_user');
        }
        
        return {
          success: false,
          error: data.error || `Error ${response.status}: ${response.statusText}`,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Error al procesar la respuesta del servidor',
      };
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    useCache: boolean = false,
    cacheKey?: string
  ): Promise<ApiResponse<T>> {
    try {
      // Verificar conexión
      const online = await this.isOnline();
      
      // Si no hay conexión y se requiere cache, devolver datos cacheados
      if (!online && useCache && cacheKey) {
        const cachedData = await this.getCachedData<T>(cacheKey);
        if (cachedData) {
          return { success: true, data: cachedData };
        }
        return { success: false, error: 'Sin conexión y sin datos en cache' };
      }

      // Si no hay conexión y no se requiere cache
      if (!online) {
        return { success: false, error: 'Sin conexión a internet' };
      }

      const url = `${this.baseURL}${endpoint}`;
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      const result = await this.handleResponse<T>(response);

      // Cachear respuesta exitosa si se requiere
      if (result.success && useCache && cacheKey) {
        this.setCachedData(cacheKey, result.data);
      }

      return result;
    } catch (error) {
      console.error('API request error:', error);
      return {
        success: false,
        error: 'Error de conexión. Intenta nuevamente.',
      };
    }
  }

  // Métodos HTTP
  async get<T>(endpoint: string, useCache: boolean = true): Promise<ApiResponse<T>> {
    const cacheKey = useCache ? endpoint : undefined;
    return this.request<T>(endpoint, { method: 'GET' }, useCache, cacheKey);
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async patch<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Métodos específicos para entidades
  async getDashboard() {
    return this.get('/dashboard', true);
  }

  async getDrivers(params?: { status?: string; search?: string }) {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.get(`/drivers${query}`, true);
  }

  async getDriver(id: number) {
    return this.get(`/drivers/${id}`, true);
  }

  async createDriver(driverData: any) {
    return this.post('/drivers', driverData);
  }

  async updateDriver(id: number, driverData: any) {
    return this.put(`/drivers/${id}`, driverData);
  }

  async deleteDriver(id: number) {
    return this.delete(`/drivers/${id}`);
  }

  async getVehicles(params?: { status?: string; search?: string }) {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.get(`/vehicles${query}`, true);
  }

  async getVehicle(id: number) {
    return this.get(`/vehicles/${id}`, true);
  }

  async createVehicle(vehicleData: any) {
    return this.post('/vehicles', vehicleData);
  }

  async updateVehicle(id: number, vehicleData: any) {
    return this.put(`/vehicles/${id}`, vehicleData);
  }

  async deleteVehicle(id: number) {
    return this.delete(`/vehicles/${id}`);
  }

  async getPayments(params?: { status?: string; type?: string; search?: string }) {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.get(`/payments${query}`, true);
  }

  async getPayment(id: number) {
    return this.get(`/payments/${id}`, true);
  }

  async createPayment(paymentData: any) {
    return this.post('/payments', paymentData);
  }

  async updatePayment(id: number, paymentData: any) {
    return this.put(`/payments/${id}`, paymentData);
  }

  async deletePayment(id: number) {
    return this.delete(`/payments/${id}`);
  }

  async getContracts(params?: { status?: string; search?: string }) {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.get(`/contracts${query}`, true);
  }

  async getContract(id: number) {
    return this.get(`/contracts/${id}`, true);
  }

  async createContract(contractData: any) {
    return this.post('/contracts', contractData);
  }

  async updateContract(id: number, contractData: any) {
    return this.put(`/contracts/${id}`, contractData);
  }

  async deleteContract(id: number) {
    return this.delete(`/contracts/${id}`);
  }

  async getExpenses(params?: { category?: string; status?: string; search?: string }) {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.get(`/expenses${query}`, true);
  }

  async getExpense(id: number) {
    return this.get(`/expenses/${id}`, true);
  }

  async createExpense(expenseData: any) {
    return this.post('/expenses', expenseData);
  }

  async updateExpense(id: number, expenseData: any) {
    return this.put(`/expenses/${id}`, expenseData);
  }

  async deleteExpense(id: number) {
    return this.delete(`/expenses/${id}`);
  }

  async getStatuses(module?: string) {
    const query = module ? `?module=${module}` : '';
    return this.get(`/statuses${query}`, true);
  }

  // Métodos de autenticación
  async login(credentials: { email: string; password: string }) {
    return this.post('/auth/login', credentials);
  }

  async logout() {
    return this.post('/auth/logout', {});
  }

  async refreshToken(refreshToken: string) {
    return this.post('/auth/refresh', { refreshToken });
  }

  async validateToken() {
    return this.get('/auth/validate');
  }

  // Métodos de utilidad
  async uploadFile(endpoint: string, file: any, onProgress?: (progress: number) => void) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = await AsyncStorage.getItem('auth_token');
      const headers: Record<string, string> = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('File upload error:', error);
      return {
        success: false,
        error: 'Error al subir el archivo',
      };
    }
  }

  // Limpiar cache
  clearCache() {
    this.clearCache();
  }

  // Verificar estado de conexión
  async checkConnection(): Promise<boolean> {
    return this.isOnline();
  }
}

// Instancia singleton
export const apiService = new ApiService();

// Exportar tipos
export type { ApiResponse, CacheItem };