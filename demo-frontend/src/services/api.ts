import { toast } from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:3001/api';

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  status: { name: string; color: string };
  vehicle?: { id: string; plate: string; model: string };
  contract?: { id: string; startDate: string; endDate: string };
}

interface Vehicle {
  id: string;
  plate: string;
  model: string;
  year: number;
  color: string;
  status: { name: string; color: string };
  driver?: { id: string; name: string };
}

interface Contract {
  id: string;
  driverId: string;
  vehicleId: string;
  startDate: string;
  endDate: string;
  weeklyRate: number;
  status: string;
}

interface Payment {
  id: string;
  contractId: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: string;
  type: string;
  method: string;
}

interface Expense {
  id: string;
  vehicleId: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  status: string;
}

interface DashboardStats {
  activeDrivers: number;
  totalVehicles: number;
  monthlyIncome: number;
  pendingDebts: number;
  activeContracts: number;
  vehiclesInMaintenance: number;
  incomeGrowth: number;
  pendingCases: number;
}

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  amount?: number;
  timestamp: string;
}

interface UpcomingPayment {
  id: string;
  driverName: string;
  amount: number;
  dueDate: string;
}

interface DashboardData {
  stats: DashboardStats;
  recentActivities: RecentActivity[];
  upcomingPayments: UpcomingPayment[];
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    avatar?: string;
  };
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
  message?: string;
}

// Helper function to get auth headers
const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

class ApiService {
  // Dashboard
  async getDashboardData(): Promise<ApiResponse<DashboardData>> {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  // Drivers
  async getDrivers(params?: { status?: string; search?: string }): Promise<ApiResponse<Driver[]>> {
    try {
      const searchParams = new URLSearchParams();
      if (params?.status) searchParams.set('status', params.status);
      if (params?.search) searchParams.set('search', params.search);
      
      const response = await fetch(`${API_BASE_URL}/drivers?${searchParams.toString()}`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching drivers:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async getDriverById(id: string): Promise<ApiResponse<Driver>> {
    try {
      const response = await fetch(`${API_BASE_URL}/drivers/${id}`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching driver:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async createDriver(driverData: Partial<Driver>): Promise<ApiResponse<Driver>> {
    try {
      const response = await fetch(`${API_BASE_URL}/drivers`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(driverData)
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Conductor creado exitosamente');
      }
      return data;
    } catch (error) {
      console.error('Error creating driver:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async updateDriver(id: string, driverData: Partial<Driver>): Promise<ApiResponse<Driver>> {
    try {
      const response = await fetch(`${API_BASE_URL}/drivers/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(driverData)
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Conductor actualizado exitosamente');
      }
      return data;
    } catch (error) {
      console.error('Error updating driver:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async deleteDriver(id: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/drivers/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Conductor eliminado exitosamente');
      }
      return data;
    } catch (error) {
      console.error('Error deleting driver:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  // Vehicles
  async getVehicles(params?: { status?: string; search?: string }): Promise<ApiResponse<Vehicle[]>> {
    try {
      const searchParams = new URLSearchParams();
      if (params?.status) searchParams.set('status', params.status);
      if (params?.search) searchParams.set('search', params.search);
      
      const response = await fetch(`${API_BASE_URL}/vehicles?${searchParams.toString()}`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async createVehicle(vehicleData: Partial<Vehicle>): Promise<ApiResponse<Vehicle>> {
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(vehicleData)
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Vehículo creado exitosamente');
      }
      return data;
    } catch (error) {
      console.error('Error creating vehicle:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async updateVehicle(id: string, vehicleData: Partial<Vehicle>): Promise<ApiResponse<Vehicle>> {
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(vehicleData)
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Vehículo actualizado exitosamente');
      }
      return data;
    } catch (error) {
      console.error('Error updating vehicle:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async deleteVehicle(id: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Vehículo eliminado exitosamente');
      }
      return data;
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  // Contracts
  async getContracts(): Promise<ApiResponse<Contract[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/contracts`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching contracts:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async createContract(data: Partial<Contract>): Promise<ApiResponse<Contract>> {
    try {
      const response = await fetch(`${API_BASE_URL}/contracts`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (result.success) {
        toast.success('Contrato creado exitosamente');
      }
      return result;
    } catch (error) {
      console.error('Error creating contract:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async updateContract(id: string, data: Partial<Contract>): Promise<ApiResponse<Contract>> {
    try {
      const response = await fetch(`${API_BASE_URL}/contracts/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (result.success) {
        toast.success('Contrato actualizado exitosamente');
      }
      return result;
    } catch (error) {
      console.error('Error updating contract:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async deleteContract(id: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/contracts/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const result = await response.json();
      if (result.success) {
        toast.success('Contrato eliminado exitosamente');
      }
      return result;
    } catch (error) {
      console.error('Error deleting contract:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  // Payments
  async getPayments(): Promise<ApiResponse<Payment[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching payments:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async createPayment(data: Partial<Payment>): Promise<ApiResponse<Payment>> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (result.success) {
        toast.success('Pago creado exitosamente');
      }
      return result;
    } catch (error) {
      console.error('Error creating payment:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async updatePayment(id: string, data: Partial<Payment>): Promise<ApiResponse<Payment>> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (result.success) {
        toast.success('Pago actualizado exitosamente');
      }
      return result;
    } catch (error) {
      console.error('Error updating payment:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async deletePayment(id: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const result = await response.json();
      if (result.success) {
        toast.success('Pago eliminado exitosamente');
      }
      return result;
    } catch (error) {
      console.error('Error deleting payment:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  // Expenses
  async getExpenses(): Promise<ApiResponse<Expense[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/expenses`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching expenses:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async createExpense(data: Partial<Expense>): Promise<ApiResponse<Expense>> {
    try {
      const response = await fetch(`${API_BASE_URL}/expenses`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (result.success) {
        toast.success('Gasto creado exitosamente');
      }
      return result;
    } catch (error) {
      console.error('Error creating expense:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async updateExpense(id: string, data: Partial<Expense>): Promise<ApiResponse<Expense>> {
    try {
      const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (result.success) {
        toast.success('Gasto actualizado exitosamente');
      }
      return result;
    } catch (error) {
      console.error('Error updating expense:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async deleteExpense(id: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const result = await response.json();
      if (result.success) {
        toast.success('Gasto eliminado exitosamente');
      }
      return result;
    } catch (error) {
      console.error('Error deleting expense:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  // Reports
  async getReports(params?: Record<string, any>): Promise<ApiResponse<any[]>> {
    try {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.set(key, String(value));
          }
        });
      }
      
      const response = await fetch(`${API_BASE_URL}/reports?${searchParams.toString()}`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching reports:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  // Auth
  async login(credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await response.json();
      
      if (data.success && data.data) {
        localStorage.setItem('authToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        toast.success('Inicio de sesión exitoso');
      }
      
      return data;
    } catch (error) {
      console.error('Error during login:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async verifyToken(token: string): Promise<ApiResponse<{ user: any }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/validate`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error verifying token:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async logout(): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      const data = await response.json();
      
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      
      if (data.success) {
        toast.success('Sesión cerrada exitosamente');
      }
      
      return data;
    } catch (error) {
      console.error('Error during logout:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      return { success: false, error: 'Error de conexión' };
    }
  }
}

export const apiService = new ApiService();

export const handleApiResponse = async <T>(
  apiCall: () => Promise<ApiResponse<T>>,
  successMessage?: string,
  errorMessage?: string
): Promise<T | null> => {
  const response = await apiCall();
  if (response.success && response.data) {
    if (successMessage) toast.success(successMessage);
    return response.data;
  }
  const message = errorMessage || response.error || response.message || 'Error en la operación';
  toast.error(message);
  return null;
};

export default apiService; 