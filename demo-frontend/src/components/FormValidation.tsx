import React from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

export interface ValidationRule {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'email' | 'date' | 'phone' | 'cedula';
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: Record<string, string | number | boolean>) => boolean;
  message?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  type: 'error' | 'warning' | 'info';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

export const validateField = (value: Record<string, string | number | boolean>, rules: ValidationRule[]): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  rules.forEach(rule => {
    const fieldValue = value[rule.field];

    // Check required
    if (rule.required && (!fieldValue || fieldValue === '')) {
      errors.push({
        field: rule.field,
        message: rule.message || `${rule.field} es requerido`,
        type: 'error'
      });
      return;
    }

    if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
      // Check type
      if (rule.type === 'number' && isNaN(Number(fieldValue))) {
        errors.push({
          field: rule.field,
          message: rule.message || `${rule.field} debe ser un número`,
          type: 'error'
        });
      }

      if (rule.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fieldValue as string)) {
        errors.push({
          field: rule.field,
          message: rule.message || `${rule.field} debe ser un email válido`,
          type: 'error'
        });
      }

      if (rule.type === 'date' && isNaN(Date.parse(fieldValue as string))) {
        errors.push({
          field: rule.field,
          message: rule.message || `${rule.field} debe ser una fecha válida`,
          type: 'error'
        });
      }

      if (rule.type === 'phone' && !/^[\d\s\-+()]+$/.test(fieldValue as string)) {
        errors.push({
          field: rule.field,
          message: rule.message || `${rule.field} debe ser un teléfono válido`,
          type: 'error'
        });
      }

      if (rule.type === 'cedula' && !/^\d{11}$/.test(fieldValue as string)) {
        errors.push({
          field: rule.field,
          message: rule.message || `${rule.field} debe tener 11 dígitos`,
          type: 'error'
        });
      }

      // Check length
      if (rule.minLength && (fieldValue as string).length < rule.minLength) {
        errors.push({
          field: rule.field,
          message: rule.message || `${rule.field} debe tener al menos ${rule.minLength} caracteres`,
          type: 'error'
        });
      }

      if (rule.maxLength && (fieldValue as string).length > rule.maxLength) {
        errors.push({
          field: rule.field,
          message: rule.message || `${rule.field} debe tener máximo ${rule.maxLength} caracteres`,
          type: 'error'
        });
      }

      // Check numeric range
      if (rule.min !== undefined && Number(fieldValue) < rule.min) {
        errors.push({
          field: rule.field,
          message: rule.message || `${rule.field} debe ser mayor o igual a ${rule.min}`,
          type: 'error'
        });
      }

      if (rule.max !== undefined && Number(fieldValue) > rule.max) {
        errors.push({
          field: rule.field,
          message: rule.message || `${rule.field} debe ser menor o igual a ${rule.max}`,
          type: 'error'
        });
      }

      // Check pattern
      if (rule.pattern && !rule.pattern.test(fieldValue as string)) {
        errors.push({
          field: rule.field,
          message: rule.message || `${rule.field} no tiene el formato correcto`,
          type: 'error'
        });
      }

      // Custom validation
      if (rule.custom && !rule.custom(value)) {
        errors.push({
          field: rule.field,
          message: rule.message || `${rule.field} no es válido`,
          type: 'error'
        });
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

interface ValidationMessageProps {
  error?: ValidationError;
  className?: string;
}

export const ValidationMessage: React.FC<ValidationMessageProps> = ({ error, className = '' }) => {
  if (!error) return null;

  const getIcon = () => {
    switch (error.type) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  const getColorClasses = () => {
    switch (error.type) {
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'info':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  return (
    <div className={`flex items-center space-x-2 p-2 rounded-lg border ${getColorClasses()} ${className}`}>
      {getIcon()}
      <span className="text-sm font-medium">{error.message}</span>
    </div>
  );
};

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'tel' | 'textarea';
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  required?: boolean;
  error?: ValidationError;
  className?: string;
  rows?: number;
  disabled?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  className = '',
  rows = 3,
  disabled = false
}) => {
  const baseInputClasses = `
    w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    ${error ? 'border-red-300' : 'border-gray-300'}
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
  `;

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {type === 'textarea' ? (
        <textarea
          name={name}
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          className={baseInputClasses}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={baseInputClasses}
        />
      )}
      
      {error && <ValidationMessage error={error} />}
    </div>
  );
};

// Common validation rules
export const commonValidationRules: Record<string, ValidationRule[]> = {
  firstName: [
    { field: 'firstName', required: true, type: 'string', minLength: 2, maxLength: 50 }
  ],
  lastName: [
    { field: 'lastName', required: true, type: 'string', minLength: 2, maxLength: 50 }
  ],
  email: [
    { field: 'email', required: true, type: 'email' }
  ],
  phone: [
    { field: 'phone', required: true, type: 'phone', minLength: 10 }
  ],
  cedula: [
    { field: 'cedula', required: true, type: 'cedula' }
  ],
  license: [
    { field: 'license', required: true, type: 'string', minLength: 5, maxLength: 20 }
  ],
  plate: [
    { field: 'plate', required: true, type: 'string', pattern: /^[A-Z]{3}-\d{3}$/ }
  ],
  amount: [
    { field: 'amount', required: true, type: 'number', min: 0 }
  ]
}; 