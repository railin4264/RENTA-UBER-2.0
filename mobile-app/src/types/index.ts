// Tipos de usuario
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user' | 'manager';
  createdAt: string;
  updatedAt: string;
}

// Tipos de estado
export interface Status {
  id: string;
  name: string;
  module: string;
  color: string;
  createdAt: string;
}

// Tipos de chofer
export interface Driver {
  id: string;
  photo?: string;
  firstName: string;
  lastName: string;
  cedula: string;
  cedulaPhoto?: string;
  license: string;
  licensePhoto?: string;
  licenseExpiry?: string;
  startDate?: string;
  address?: string;
  googleMapsLink?: string;
  phone: string;
  email?: string;
  workplace?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  salary?: number;
  commission?: number;
  notes?: string;
  documents?: string;
  createdAt: string;
  status?: Status;
  guarantors?: Guarantor[];
}

// Tipos de garante
export interface Guarantor {
  id: string;
  driverId: string;
  photo?: string;
  firstName: string;
  lastName: string;
  cedula: string;
  cedulaPhoto?: string;
  address: string;
  googleMapsLink?: string;
  workplace: string;
  phone: string;
  createdAt: string;
}

// Tipos de vehículo
export interface Vehicle {
  id: string;
  brand?: string;
  model: string;
  year?: number;
  color?: string;
  plate: string;
  vin?: string;
  engine?: string;
  transmission?: string;
  fuelType?: string;
  mileage?: number;
  lastMaintenance?: string;
  nextMaintenance?: string;
  insuranceExpiry?: string;
  registrationExpiry?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  currentValue?: number;
  photos?: string;
  generalPhoto?: string;
  currentConditionPhotos?: string;
  notes?: string;
  documents?: string;
  createdAt: string;
  status?: Status;
}

// Tipos de contrato
export interface Contract {
  id: string;
  tenantId?: string;
  driverId: string;
  vehicleId: string;
  startDate: string;
  endDate?: string;
  type: 'DAILY' | 'MONTHLY' | 'CUSTOM';
  basePrice?: number;
  dailyPrice?: number;
  monthlyPrice?: number;
  deposit?: number;
  penaltyRate?: number;
  allowedDelayDays?: number;
  automaticRenewal?: boolean;
  terms?: string;
  notes?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  driver?: Driver;
  vehicle?: Vehicle;
  status?: Status;
}

// Tipos de pago
export interface Payment {
  id: string;
  contractId?: string;
  driverId: string;
  amount: number;
  type: 'payment' | 'deposit' | 'penalty' | 'refund';
  method?: 'cash' | 'bank_transfer' | 'credit_card' | 'debit_card' | 'mobile_payment';
  status?: 'pending' | 'completed' | 'failed' | 'cancelled';
  date: string;
  dueDate?: string;
  description?: string;
  reference?: string;
  notes?: string;
  createdAt: string;
  driver?: Driver;
  contract?: Contract;
}

// Tipos de gasto
export interface Expense {
  id: string;
  vehicleId: string;
  category: 'maintenance' | 'fuel' | 'insurance' | 'repairs' | 'tires' | 'other';
  amount: number;
  description: string;
  date: string;
  vendor?: string;
  invoiceNumber?: string;
  paymentMethod?: 'cash' | 'bank_transfer' | 'credit_card' | 'debit_card';
  status?: 'pending' | 'paid' | 'cancelled';
  notes?: string;
  createdAt: string;
  vehicle?: Vehicle;
}

// Tipos de reporte
export interface Report {
  id: string;
  title: string;
  description: string;
  data: any;
  createdAt: string;
}

// Tipos de registro de deuda
export interface DebtRecord {
  id: string;
  driverId: string;
  vehiclePlate: string;
  amount: number;
  dueDate: string;
  status?: 'pending' | 'paid';
  isVehicleInactive?: boolean;
  notes?: string;
  createdAt: string;
  driver?: Driver;
}

// Tipos de respuesta de API
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

// Tipos de paginación
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Tipos de filtros
export interface DriverFilters extends PaginationParams {
  status?: string;
  active?: boolean;
}

export interface VehicleFilters extends PaginationParams {
  status?: string;
  brand?: string;
  available?: boolean;
}

export interface PaymentFilters extends PaginationParams {
  status?: string;
  type?: string;
  dateFrom?: string;
  dateTo?: string;
  driverId?: string;
}

export interface ExpenseFilters extends PaginationParams {
  category?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  vehicleId?: string;
}

// Tipos de estadísticas del dashboard
export interface DashboardStats {
  totalDrivers: number;
  activeDrivers: number;
  totalVehicles: number;
  availableVehicles: number;
  monthlyIncome: number;
  pendingPayments: number;
  activeContracts: number;
  vehiclesInMaintenance: number;
}

export interface RecentActivity {
  id: string;
  type: 'payment' | 'contract';
  description: string;
  amount: number;
  date: string;
  status: string;
}

export interface UpcomingPayment {
  id: string;
  driverName: string;
  amount: number;
  dueDate: string;
  status: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentActivities: RecentActivity[];
  upcomingPayments: UpcomingPayment[];
}

// Tipos de navegación
export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  DriverDetail: { driverId: string };
  VehicleDetail: { vehicleId: string };
  ContractDetail: { contractId: string };
  PaymentDetail: { paymentId: string };
  ExpenseDetail: { expenseId: string };
  AddDriver: undefined;
  AddVehicle: undefined;
  AddContract: undefined;
  AddPayment: undefined;
  AddExpense: undefined;
  EditDriver: { driver: Driver };
  EditVehicle: { vehicle: Vehicle };
  EditContract: { contract: Contract };
  EditPayment: { payment: Payment };
  EditExpense: { expense: Expense };
};

export type MainTabParamList = {
  Dashboard: undefined;
  Drivers: undefined;
  Vehicles: undefined;
  Payments: undefined;
  Expenses: undefined;
  Reports: undefined;
  Contracts: undefined;
  Profile: undefined;
};

// Tipos de formularios
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface DriverForm {
  firstName: string;
  lastName: string;
  cedula: string;
  license: string;
  phone: string;
  email?: string;
  address?: string;
  salary?: number;
  commission?: number;
  notes?: string;
}

export interface VehicleForm {
  brand: string;
  model: string;
  year: number;
  plate: string;
  color?: string;
  mileage?: number;
  purchasePrice?: number;
  notes?: string;
}

export interface PaymentForm {
  driverId: string;
  contractId?: string;
  amount: number;
  type: 'payment' | 'deposit' | 'penalty' | 'refund';
  method?: 'cash' | 'bank_transfer' | 'credit_card' | 'debit_card' | 'mobile_payment';
  date: string;
  dueDate?: string;
  description?: string;
  reference?: string;
}

export interface ExpenseForm {
  vehicleId: string;
  category: 'maintenance' | 'fuel' | 'insurance' | 'repairs' | 'tires' | 'other';
  amount: number;
  description: string;
  date: string;
  vendor?: string;
  invoiceNumber?: string;
  paymentMethod?: 'cash' | 'bank_transfer' | 'credit_card' | 'debit_card';
}

// Tipos de notificaciones
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  data?: any;
}

// Tipos de configuración
export interface AppConfig {
  apiUrl: string;
  appName: string;
  version: string;
  environment: 'development' | 'staging' | 'production';
  features: {
    biometrics: boolean;
    pushNotifications: boolean;
    offlineMode: boolean;
    darkMode: boolean;
  };
}