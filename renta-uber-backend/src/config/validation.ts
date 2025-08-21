import { z } from 'zod';

// Esquemas de validación para autenticación
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  role: z.enum(['admin', 'user', 'manager']).optional().default('user'),
});

// Esquemas de validación para choferes
export const driverSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  cedula: z.string().min(10, 'La cédula debe tener al menos 10 caracteres'),
  license: z.string().min(5, 'La licencia debe tener al menos 5 caracteres'),
  phone: z.string().min(10, 'El teléfono debe tener al menos 10 caracteres'),
  email: z.string().email('Email inválido').optional(),
  address: z.string().optional(),
  salary: z.number().positive('El salario debe ser positivo').optional(),
  commission: z.number().min(0, 'La comisión no puede ser negativa').max(100, 'La comisión no puede exceder 100%').optional(),
});

// Esquemas de validación para vehículos
export const vehicleSchema = z.object({
  brand: z.string().min(2, 'La marca debe tener al menos 2 caracteres'),
  model: z.string().min(2, 'El modelo debe tener al menos 2 caracteres'),
  year: z.number().int().min(1900, 'Año inválido').max(new Date().getFullYear() + 1, 'Año inválido'),
  plate: z.string().min(5, 'La placa debe tener al menos 5 caracteres'),
  vin: z.string().min(17, 'El VIN debe tener 17 caracteres').optional(),
  color: z.string().optional(),
  mileage: z.number().int().min(0, 'El kilometraje no puede ser negativo').optional(),
  purchasePrice: z.number().positive('El precio de compra debe ser positivo').optional(),
  currentValue: z.number().positive('El valor actual debe ser positivo').optional(),
});

// Esquemas de validación para pagos
export const paymentSchema = z.object({
  driverId: z.string().cuid('ID de chofer inválido'),
  contractId: z.string().cuid('ID de contrato inválido').optional(),
  amount: z.number().positive('El monto debe ser positivo'),
  type: z.enum(['payment', 'deposit', 'penalty', 'refund']),
  method: z.enum(['cash', 'bank_transfer', 'credit_card', 'debit_card', 'mobile_payment']).optional(),
  status: z.enum(['pending', 'completed', 'failed', 'cancelled']).default('pending'),
  date: z.string().datetime('Fecha inválida'),
  dueDate: z.string().datetime('Fecha de vencimiento inválida').optional(),
  description: z.string().optional(),
  reference: z.string().optional(),
});

// Esquemas de validación para gastos
export const expenseSchema = z.object({
  vehicleId: z.string().cuid('ID de vehículo inválido'),
  category: z.enum(['maintenance', 'fuel', 'insurance', 'repairs', 'tires', 'other']),
  amount: z.number().positive('El monto debe ser positivo'),
  description: z.string().min(5, 'La descripción debe tener al menos 5 caracteres'),
  date: z.string().datetime('Fecha inválida'),
  vendor: z.string().optional(),
  invoiceNumber: z.string().optional(),
  paymentMethod: z.enum(['cash', 'bank_transfer', 'credit_card', 'debit_card']).optional(),
  status: z.enum(['pending', 'paid', 'cancelled']).default('pending'),
});

// Esquemas de validación para contratos
export const contractSchema = z.object({
  driverId: z.string().cuid('ID de chofer inválido'),
  vehicleId: z.string().cuid('ID de vehículo inválido'),
  startDate: z.string().datetime('Fecha de inicio inválida'),
  endDate: z.string().datetime('Fecha de fin inválida').optional(),
  type: z.enum(['DAILY', 'MONTHLY', 'CUSTOM']),
  basePrice: z.number().positive('El precio base debe ser positivo').optional(),
  dailyPrice: z.number().positive('El precio diario debe ser positivo').optional(),
  monthlyPrice: z.number().positive('El precio mensual debe ser positivo').optional(),
  deposit: z.number().min(0, 'El depósito no puede ser negativo').optional(),
  penaltyRate: z.number().min(0, 'La tasa de penalización no puede ser negativa').max(1, 'La tasa de penalización no puede exceder 100%').optional(),
  allowedDelayDays: z.number().int().min(0, 'Los días de retraso permitidos no pueden ser negativos').optional(),
  automaticRenewal: z.boolean().optional(),
  terms: z.string().optional(),
});

// Función para validar datos usando un esquema
export const validateData = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      throw new Error(`Validación fallida: ${JSON.stringify(errors)}`);
    }
    throw error;
  }
};

// Función para validar datos parciales
export const validatePartialData = <T>(schema: z.ZodSchema<T>, data: unknown): Partial<T> => {
  try {
    return schema.partial().parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      throw new Error(`Validación fallida: ${JSON.stringify(errors)}`);
    }
    throw error;
  }
};