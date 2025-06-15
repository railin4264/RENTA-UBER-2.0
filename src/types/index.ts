export interface Driver {
  id: string;
  photo?: string;
  firstName: string;
  lastName: string;
  cedula: string;
  cedulaPhoto?: string;
  license: string;
  licensePhoto?: string;
  startDate: string;
  address: string;
  googleMapsLink?: string;
  phone: string;
  workplace: string;
  vehicleId?: string;
  createdAt: string;
}

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

export interface Vehicle {
  id: string;
  driverId?: string;
  model: string;
  year: number;
  color: string;
  plate: string;
  photos: string[];
  generalPhoto?: string;
  currentConditionPhotos: string[];
  createdAt: string;
}

export interface Expense {
  id: string;
  vehicleId: string;
  date: string;
  place: string;
  type: 'mechanical' | 'paint' | 'loss' | 'maintenance';
  cost: number;
  invoicePhoto?: string;
  description?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  driverId: string;
  date: string;
  amount: number;
  type: 'complete' | 'partial';
  dailySavings: number;
  notes?: string;
  createdAt: string;
}

export interface DebtRecord {
  id: string;
  driverId: string;
  vehiclePlate: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid';
  isVehicleInactive?: boolean;
  notes?: string;
  createdAt: string;
}