import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

class RealApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || `Error: ${response.status}`
        };
      }

      return {
        success: true,
        data: data.data || data
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error procesando la respuesta del servidor'
      };
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers
        }
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error('API Request Error:', error);
      return {
        success: false,
        error: 'Error de conexión con el servidor'
      };
    }
  }

  // Authentication
  async login(credentials: { email: string; password: string }) {
    const response = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });

    if (response.success && response.data) {
      localStorage.setItem('authToken', response.data.token);
    }

    return response;
  }

  async verifyToken(token: string) {
    return this.request('/auth/verify', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  async logout() {
    localStorage.removeItem('authToken');
    return { success: true, data: null };
  }

  // Dashboard
  async getDashboardData() {
    return this.request('/reports/dashboard');
  }

  // Drivers
  async getDrivers() {
    return this.request('/drivers');
  }

  async getDriverById(id: string) {
    return this.request(`/drivers/${id}`);
  }

  async createDriver(driverData: any) {
    const response = await this.request('/drivers', {
      method: 'POST',
      body: JSON.stringify(driverData)
    });
    
    if (response.success) {
      toast.success('Conductor creado exitosamente');
    }
    
    return response;
  }

  async updateDriver(id: string, driverData: any) {
    const response = await this.request(`/drivers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(driverData)
    });
    
    if (response.success) {
      toast.success('Conductor actualizado exitosamente');
    }
    
    return response;
  }

  async deleteDriver(id: string) {
    const response = await this.request(`/drivers/${id}`, {
      method: 'DELETE'
    });
    
    if (response.success) {
      toast.success('Conductor eliminado exitosamente');
    }
    
    return response;
  }

  // Vehicles
  async getVehicles() {
    return this.request('/vehicles');
  }

  async getVehicleById(id: string) {
    return this.request(`/vehicles/${id}`);
  }

  async createVehicle(vehicleData: any) {
    const response = await this.request('/vehicles', {
      method: 'POST',
      body: JSON.stringify(vehicleData)
    });
    
    if (response.success) {
      toast.success('Vehículo creado exitosamente');
    }
    
    return response;
  }

  async updateVehicle(id: string, vehicleData: any) {
    const response = await this.request(`/vehicles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vehicleData)
    });
    
    if (response.success) {
      toast.success('Vehículo actualizado exitosamente');
    }
    
    return response;
  }

  async deleteVehicle(id: string) {
    const response = await this.request(`/vehicles/${id}`, {
      method: 'DELETE'
    });
    
    if (response.success) {
      toast.success('Vehículo eliminado exitosamente');
    }
    
    return response;
  }

  // Contracts
  async getContracts(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request(`/contracts${queryString}`);
  }

  async getContractById(id: string) {
    return this.request(`/contracts/${id}`);
  }

  async createContract(contractData: any) {
    const response = await this.request('/contracts', {
      method: 'POST',
      body: JSON.stringify(contractData)
    });
    
    if (response.success) {
      toast.success('Contrato creado exitosamente');
    }
    
    return response;
  }

  async updateContract(id: string, contractData: any) {
    const response = await this.request(`/contracts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(contractData)
    });
    
    if (response.success) {
      toast.success('Contrato actualizado exitosamente');
    }
    
    return response;
  }

  async deleteContract(id: string) {
    const response = await this.request(`/contracts/${id}`, {
      method: 'DELETE'
    });
    
    if (response.success) {
      toast.success('Contrato eliminado exitosamente');
    }
    
    return response;
  }

  // Payments
  async getPayments() {
    return this.request('/payments');
  }

  async createPayment(paymentData: any) {
    const response = await this.request('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData)
    });
    
    if (response.success) {
      toast.success('Pago registrado exitosamente');
    }
    
    return response;
  }

  async updatePayment(id: string, paymentData: any) {
    const response = await this.request(`/payments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(paymentData)
    });
    
    if (response.success) {
      toast.success('Pago actualizado exitosamente');
    }
    
    return response;
  }

  async deletePayment(id: string) {
    const response = await this.request(`/payments/${id}`, {
      method: 'DELETE'
    });
    
    if (response.success) {
      toast.success('Pago eliminado exitosamente');
    }
    
    return response;
  }

  // Expenses
  async getExpenses() {
    return this.request('/expenses');
  }

  async createExpense(expenseData: any) {
    const response = await this.request('/expenses', {
      method: 'POST',
      body: JSON.stringify(expenseData)
    });
    
    if (response.success) {
      toast.success('Gasto registrado exitosamente');
    }
    
    return response;
  }

  async updateExpense(id: string, expenseData: any) {
    const response = await this.request(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(expenseData)
    });
    
    if (response.success) {
      toast.success('Gasto actualizado exitosamente');
    }
    
    return response;
  }

  async deleteExpense(id: string) {
    const response = await this.request(`/expenses/${id}`, {
      method: 'DELETE'
    });
    
    if (response.success) {
      toast.success('Gasto eliminado exitosamente');
    }
    
    return response;
  }

  // Reports
  async getReports(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request(`/reports${queryString}`);
  }

  async getFinancialReport(startDate: string, endDate: string) {
    return this.request(`/reports/financial?startDate=${startDate}&endDate=${endDate}`);
  }

  // Status
  async getStatuses() {
    return this.request('/status');
  }

  // Activity Logs
  async getActivityLogs(type: string) {
    return this.request(`/logs/${type}`);
  }

  async clearActivityLogs() {
    return this.request('/logs/clear', {
      method: 'DELETE'
    });
  }

  // File uploads
  async uploadFile(endpoint: string, file: File, fieldName: string = 'file') {
    const formData = new FormData();
    formData.append(fieldName, file);

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: formData
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Upload Error:', error);
      return {
        success: false,
        error: 'Error al subir el archivo'
      };
    }
  }
}

export const realApiService = new RealApiService();

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
  }
  
  const message = errorMessage || response.error || 'Error en la operación';
  toast.error(message);
  return null;
};

export default realApiService;