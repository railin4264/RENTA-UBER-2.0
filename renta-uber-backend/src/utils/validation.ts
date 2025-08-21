import { Request, Response, NextFunction } from 'express';

export interface ValidationRule {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'email' | 'date';
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
}

export const validateRequest = (rules: ValidationRule[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: string[] = [];
    const data = { ...req.body, ...req.params, ...req.query };

    rules.forEach(rule => {
      const value = data[rule.field];

      // Check required
      if (rule.required && (!value || value === '')) {
        errors.push(`${rule.field} es requerido`);
        return;
      }

      if (value !== undefined && value !== null && value !== '') {
        // Check type
        if (rule.type === 'number' && isNaN(Number(value))) {
          errors.push(`${rule.field} debe ser un número`);
        }

        if (rule.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.push(`${rule.field} debe ser un email válido`);
        }

        if (rule.type === 'date' && isNaN(Date.parse(value))) {
          errors.push(`${rule.field} debe ser una fecha válida`);
        }

        // Check length
        if (rule.minLength && value.length < rule.minLength) {
          errors.push(`${rule.field} debe tener al menos ${rule.minLength} caracteres`);
        }

        if (rule.maxLength && value.length > rule.maxLength) {
          errors.push(`${rule.field} debe tener máximo ${rule.maxLength} caracteres`);
        }

        // Check numeric range
        if (rule.min !== undefined && Number(value) < rule.min) {
          errors.push(`${rule.field} debe ser mayor o igual a ${rule.min}`);
        }

        if (rule.max !== undefined && Number(value) > rule.max) {
          errors.push(`${rule.field} debe ser menor o igual a ${rule.max}`);
        }

        // Check pattern
        if (rule.pattern && !rule.pattern.test(value)) {
          errors.push(`${rule.field} no tiene el formato correcto`);
        }

        // Custom validation
        if (rule.custom && !rule.custom(value)) {
          errors.push(`${rule.field} no es válido`);
        }
      }
    });

    if (errors.length > 0) {
      return res.status(400).json({
        message: 'Errores de validación',
        errors
      });
    }

    next();
  };
};

// Validation rules for common entities
export const driverValidationRules: ValidationRule[] = [
  { field: 'firstName', required: true, type: 'string', minLength: 2, maxLength: 50 },
  { field: 'lastName', required: true, type: 'string', minLength: 2, maxLength: 50 },
  { field: 'phone', required: true, type: 'string', pattern: /^[\d\s\-\+\(\)]+$/ },
  { field: 'license', required: true, type: 'string', minLength: 5, maxLength: 20 },
  { field: 'cedula', required: true, type: 'string', pattern: /^\d{11}$/ },
];

export const vehicleValidationRules: ValidationRule[] = [
  { field: 'model', required: true, type: 'string', minLength: 2, maxLength: 50 },
  { field: 'plate', required: true, type: 'string', pattern: /^[A-Z]{3}-\d{3}$/ },
  { field: 'year', required: true, type: 'number', min: 1900, max: new Date().getFullYear() + 1 },
  { field: 'color', required: true, type: 'string', minLength: 2, maxLength: 30 },
];

export const paymentValidationRules: ValidationRule[] = [
  { field: 'amount', required: true, type: 'number', min: 0 },
  { field: 'driverId', required: true, type: 'string' },
  { field: 'date', required: true, type: 'date' },
];

export const contractValidationRules: ValidationRule[] = [
  { field: 'driverId', required: true, type: 'string' },
  { field: 'vehicleId', required: true, type: 'string' },
  { field: 'startDate', required: true, type: 'date' },
  { field: 'rate', required: true, type: 'number', min: 0 },
  { field: 'rateType', required: true, type: 'string' },
];

export const expenseValidationRules: ValidationRule[] = [
  { field: 'amount', required: true, type: 'number', min: 0 },
  { field: 'vehicleId', required: true, type: 'string' },
  { field: 'date', required: true, type: 'date' },
];

// Validation middleware functions
export const validateDriver = validateRequest(driverValidationRules);
export const validateVehicle = validateRequest(vehicleValidationRules);
export const validatePayment = validateRequest(paymentValidationRules);
export const validateExpense = validateRequest(expenseValidationRules);
export const validateContract = validateRequest(contractValidationRules); 