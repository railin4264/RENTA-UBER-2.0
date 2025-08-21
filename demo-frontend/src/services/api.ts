import { toast } from 'react-hot-toast';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

// Simple in-memory demo data
const demoDb = {
  drivers: [
    { id: 'd1', firstName: 'Carlos', lastName: 'Martínez', phone: '0991234567', status: 'Activo' },
    { id: 'd2', firstName: 'Ana', lastName: 'López', phone: '0992345678', status: 'Activo' },
  ],
  vehicles: [
    { id: 'v1', plate: 'ABC1234', model: 'Corolla', status: 'Disponible' },
    { id: 'v2', plate: 'XYZ5678', model: 'Civic', status: 'En Mantenimiento' },
  ],
  payments: [],
  contracts: [],
  stats: {
    totalDrivers: 2,
    activeDrivers: 2,
    totalVehicles: 2,
    availableVehicles: 1,
    monthlyIncome: 6400,
    pendingPayments: 0,
    activeContracts: 0,
    vehiclesInMaintenance: 1,
  },
};

class ApiService {
  private async respond<T>(data: T): Promise<ApiResponse<T>> {
    await delay(200);
    return { data, success: true };
  }

  // Dashboard
  async getDashboardData(): Promise<ApiResponse<any>> {
    const recentActivities = [] as any[];
    const upcomingPayments = [] as any[];
    return this.respond({
      stats: demoDb.stats,
      recentActivities,
      upcomingPayments,
    });
  }

  // Drivers
  async getDrivers() {
    return this.respond(demoDb.drivers);
  }
  async getDriverById(id: string) {
    const d = demoDb.drivers.find((x) => x.id === id) || null;
    return this.respond(d);
  }
  async createDriver(driverData: any) {
    const id = `d${Date.now()}`;
    const driver = { id, ...driverData };
    demoDb.drivers.push(driver);
    toast.success('Conductor creado');
    return this.respond(driver);
  }
  async updateDriver(id: string, driverData: any) {
    const idx = demoDb.drivers.findIndex((x) => x.id === id);
    if (idx >= 0) demoDb.drivers[idx] = { ...demoDb.drivers[idx], ...driverData };
    toast.success('Conductor actualizado');
    return this.respond(demoDb.drivers[idx]);
  }
  async deleteDriver(id: string) {
    const idx = demoDb.drivers.findIndex((x) => x.id === id);
    if (idx >= 0) demoDb.drivers.splice(idx, 1);
    toast.success('Conductor eliminado');
    return this.respond({ ok: true } as any);
  }

  // Vehicles
  async getVehicles() {
    return this.respond(demoDb.vehicles);
  }
  async createVehicle(vehicleData: any) {
    const id = `v${Date.now()}`;
    const vehicle = { id, ...vehicleData };
    demoDb.vehicles.push(vehicle);
    toast.success('Vehículo creado');
    return this.respond(vehicle);
  }
  async updateVehicle(id: string, vehicleData: any) {
    const idx = demoDb.vehicles.findIndex((x) => x.id === id);
    if (idx >= 0) demoDb.vehicles[idx] = { ...demoDb.vehicles[idx], ...vehicleData };
    toast.success('Vehículo actualizado');
    return this.respond(demoDb.vehicles[idx]);
  }
  async deleteVehicle(id: string) {
    const idx = demoDb.vehicles.findIndex((x) => x.id === id);
    if (idx >= 0) demoDb.vehicles.splice(idx, 1);
    toast.success('Vehículo eliminado');
    return this.respond({ ok: true } as any);
  }

  // Contracts
  async getContracts() { return this.respond(demoDb.contracts); }
  async createContract(data: any) { return this.respond({ id: `c${Date.now()}`, ...data }); }
  async updateContract(id: string, data: any) { return this.respond({ id, ...data }); }
  async deleteContract(id: string) { return this.respond({ ok: true } as any); }

  // Payments
  async getPayments() { return this.respond(demoDb.payments); }
  async createPayment(data: any) { return this.respond({ id: `p${Date.now()}`, ...data }); }
  async updatePayment(id: string, data: any) { return this.respond({ id, ...data }); }
  async deletePayment(id: string) { return this.respond({ ok: true } as any); }

  // Expenses
  async getExpenses() { return this.respond([]); }
  async createExpense(data: any) { return this.respond({ id: `e${Date.now()}`, ...data }); }
  async updateExpense(id: string, data: any) { return this.respond({ id, ...data }); }
  async deleteExpense(id: string) { return this.respond({ ok: true } as any); }

  // Reports (stub)
  async getReports(params?: any) { return this.respond([]); }

  // Auth
  async login(credentials: { email: string; password: string }) {
    // Always succeed in demo
    const token = 'demo-token';
    localStorage.setItem('authToken', token);
    return this.respond({ token, user: { email: credentials.email, name: 'Demo' } });
  }
  async verifyToken(token: string) { return this.respond({ ok: true } as any); }
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
  const message = errorMessage || response.error || 'Error en la operación';
  toast.error(message);
  return null;
};
export default apiService; 