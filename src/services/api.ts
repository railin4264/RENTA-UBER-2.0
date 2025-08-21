import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Inject Authorization header automatically if token exists
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
      }
    } catch {
      // ignore localStorage access errors
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // Propagate backend message when available
        const backendMessage = errorData?.message || errorData?.error;
        throw new Error(backendMessage || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return { data, success: true };
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      return {
        error: error instanceof Error ? error.message : 'Error de conexión',
        success: false
      };
    }
  }

  // Dashboard
  async getDashboardData(): Promise<ApiResponse<{
    stats: {
      totalDrivers: number;
      activeDrivers: number;
      totalVehicles: number;
      availableVehicles: number;
      monthlyIncome: number;
      pendingPayments: number;
      activeContracts: number;
      vehiclesInMaintenance: number;
    };
    recentActivities: Array<{
      id: string;
      type: string;
      description: string;
      amount: number;
      date: string;
      status: string;
    }>;
    upcomingPayments: Array<{
      id: string;
      driverName: string;
      amount: number;
      dueDate: string;
      status: string;
    }>;
  }>> {
    return this.request('/dashboard');
  }

  // Drivers
  async getDrivers() {
    return this.request('/drivers');
  }

  async getDriverById(id: string) {
    return this.request(`/drivers/${id}`);
  }

  async createDriver(driverData: any) {
    return this.request('/drivers', {
      method: 'POST',
      body: JSON.stringify(driverData),
    });
  }

  async updateDriver(id: string, driverData: any) {
    return this.request(`/drivers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(driverData),
    });
  }

  async deleteDriver(id: string) {
    return this.request(`/drivers/${id}`, {
      method: 'DELETE',
    });
  }

  // Vehicles
  async getVehicles() {
    return this.request('/vehicles');
  }

  async createVehicle(vehicleData: any) {
    return this.request('/vehicles', {
      method: 'POST',
      body: JSON.stringify(vehicleData),
    });
  }

  async updateVehicle(id: string, vehicleData: any) {
    return this.request(`/vehicles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vehicleData),
    });
  }

  async deleteVehicle(id: string) {
    return this.request(`/vehicles/${id}`, {
      method: 'DELETE',
    });
  }

  // Payments
  async getPayments() {
    return this.request('/payments');
  }

  async createPayment(paymentData: any) {
    return this.request('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async updatePayment(id: string, paymentData: any) {
    return this.request(`/payments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(paymentData),
    });
  }

  async deletePayment(id: string) {
    return this.request(`/payments/${id}`, {
      method: 'DELETE',
    });
  }

  // Expenses
  async getExpenses() {
    return this.request('/expenses');
  }

  async createExpense(expenseData: any) {
    return this.request('/expenses', {
      method: 'POST',
      body: JSON.stringify(expenseData),
    });
  }

  async updateExpense(id: string, expenseData: any) {
    return this.request(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(expenseData),
    });
  }

  async deleteExpense(id: string) {
    return this.request(`/expenses/${id}`, {
      method: 'DELETE',
    });
  }

  // Contracts
  async getContracts() {
    return this.request('/contracts');
  }

  async createContract(contractData: any) {
    return this.request('/contracts', {
      method: 'POST',
      body: JSON.stringify(contractData),
    });
  }

  async updateContract(id: string, contractData: any) {
    return this.request(`/contracts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(contractData),
    });
  }

  async deleteContract(id: string) {
    return this.request(`/contracts/${id}`, {
      method: 'DELETE',
    });
  }

  // Reports
  async getReports(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request(`/reports${queryString}`);
  }

  // Auth
  async login(credentials: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async verifyToken(token: string) {
    return this.request('/auth/verify', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }
}

export const apiService = new ApiService();

// Utility function to handle API responses with toast notifications
export const handleApiResponse = async <T>(
  apiCall: () => Promise<ApiResponse<T>>,
  successMessage?: string,
  errorMessage?: string
): Promise<T | null> => {
  const response = await apiCall();
  
  if (response.success && response.data) {
    if (successMessage) {
      toast.success(successMessage);
    }
    return response.data;
  } else {
    const message = errorMessage || response.error || 'Error en la operación';
    toast.error(message);
    return null;
  }
}; 
export default apiService; 