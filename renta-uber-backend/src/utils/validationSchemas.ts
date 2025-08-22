import { z } from 'zod';

// Auth schemas
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
  })
});

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
    role: z.enum(['admin', 'user', 'driver']).optional()
  })
});

// Driver schemas
export const createDriverSchema = z.object({
  body: z.object({
    firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
    cedula: z.string().min(6, 'La cédula debe tener al menos 6 caracteres'),
    license: z.string().min(5, 'La licencia debe tener al menos 5 caracteres'),
    phone: z.string().regex(/^\d{10,15}$/, 'Teléfono inválido'),
    email: z.string().email('Email inválido').optional(),
    address: z.string().optional(),
    workplace: z.string().optional(),
    emergencyContact: z.string().optional(),
    emergencyPhone: z.string().regex(/^\d{10,15}$/, 'Teléfono inválido').optional(),
    salary: z.number().positive('El salario debe ser positivo').optional(),
    commission: z.number().min(0).max(100, 'La comisión debe estar entre 0 y 100').optional(),
    licenseExpiry: z.string().datetime().optional(),
    startDate: z.string().datetime().optional(),
    statusId: z.string().optional()
  })
});

export const updateDriverSchema = z.object({
  params: z.object({
    id: z.string()
  }),
  body: createDriverSchema.shape.body.partial()
});

// Vehicle schemas
export const createVehicleSchema = z.object({
  body: z.object({
    brand: z.string().optional(),
    model: z.string().min(1, 'El modelo es requerido'),
    year: z.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
    color: z.string().optional(),
    plate: z.string().min(5, 'La placa debe tener al menos 5 caracteres'),
    vin: z.string().optional(),
    engine: z.string().optional(),
    transmission: z.enum(['manual', 'automatic', 'semi-automatic']).optional(),
    fuelType: z.enum(['gasoline', 'diesel', 'electric', 'hybrid']).optional(),
    mileage: z.number().int().min(0).optional(),
    lastMaintenance: z.string().datetime().optional(),
    nextMaintenanceKm: z.number().int().positive().optional(),
    dailyRate: z.number().positive('La tarifa diaria debe ser positiva'),
    weeklyRate: z.number().positive().optional(),
    monthlyRate: z.number().positive().optional(),
    insuranceExpiry: z.string().datetime().optional(),
    circulationPermitExpiry: z.string().datetime().optional(),
    inspectionExpiry: z.string().datetime().optional(),
    statusId: z.string().optional()
  })
});

export const updateVehicleSchema = z.object({
  params: z.object({
    id: z.string()
  }),
  body: createVehicleSchema.shape.body.partial()
});

// Payment schemas
export const createPaymentSchema = z.object({
  body: z.object({
    driverId: z.string(),
    amount: z.number().positive('El monto debe ser positivo'),
    type: z.enum(['salary', 'commission', 'debt_payment', 'other']),
    date: z.string().datetime(),
    period: z.enum(['weekly', 'biweekly', 'monthly']).optional(),
    notes: z.string().optional()
  })
});

export const updatePaymentSchema = z.object({
  params: z.object({
    id: z.string()
  }),
  body: createPaymentSchema.shape.body.partial()
});

// Expense schemas
export const createExpenseSchema = z.object({
  body: z.object({
    vehicleId: z.string(),
    type: z.enum(['maintenance', 'fuel', 'insurance', 'fine', 'other']),
    amount: z.number().positive('El monto debe ser positivo'),
    date: z.string().datetime(),
    description: z.string().min(5, 'La descripción debe tener al menos 5 caracteres'),
    receipt: z.string().optional(),
    mileage: z.number().int().min(0).optional()
  })
});

export const updateExpenseSchema = z.object({
  params: z.object({
    id: z.string()
  }),
  body: createExpenseSchema.shape.body.partial()
});

// Contract schemas
export const createContractSchema = z.object({
  body: z.object({
    driverId: z.string(),
    vehicleId: z.string(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime().optional(),
    type: z.enum(['daily', 'weekly', 'monthly']),
    rate: z.number().positive('La tarifa debe ser positiva'),
    deposit: z.number().min(0).optional(),
    notes: z.string().optional()
  })
});

export const updateContractSchema = z.object({
  params: z.object({
    id: z.string()
  }),
  body: createContractSchema.shape.body.partial()
});

// ID validation schema for delete operations
export const idParamSchema = z.object({
  params: z.object({
    id: z.string()
  })
});

// Query schemas
export const paginationSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    sort: z.string().optional(),
    order: z.enum(['asc', 'desc']).optional()
  })
});

export const dateRangeSchema = z.object({
  query: z.object({
    startDate: z.string().datetime(),
    endDate: z.string().datetime()
  })
});