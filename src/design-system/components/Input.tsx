import React, { useState, forwardRef } from 'react';
import { ComponentSize, ComponentVariant } from '../index';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: ComponentSize;
  variant?: ComponentVariant;
  fullWidth?: boolean;
  showPasswordToggle?: boolean;
  onValidationChange?: (isValid: boolean) => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  success,
  helperText,
  leftIcon,
  rightIcon,
  size = 'md',
  variant = 'neutral',
  fullWidth = false,
  showPasswordToggle = false,
  onValidationChange,
  className = '',
  type = 'text',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  
  const inputType = type === 'password' && showPassword ? 'text' : type;
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
    xl: 'px-6 py-4 text-xl',
  };
  
  const baseClasses = 'border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const stateClasses = error 
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
    : success 
    ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
    : isFocused 
    ? 'border-blue-300 focus:border-blue-500 focus:ring-blue-500'
    : 'border-gray-300 hover:border-gray-400';
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  const inputClasses = [
    baseClasses,
    sizeClasses[size],
    stateClasses,
    widthClass,
    leftIcon ? 'pl-10' : '',
    (rightIcon || (showPasswordToggle && type === 'password')) ? 'pr-10' : '',
    className
  ].filter(Boolean).join(' ');
  
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isDirty) setIsDirty(true);
    props.onChange?.(e);
    
    // Notify validation state
    if (onValidationChange) {
      const isValid = !error && e.target.value.length > 0;
      onValidationChange(isValid);
    }
  };
  
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          type={inputType}
          className={inputClasses}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
            {rightIcon}
          </div>
        )}
        
        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            onClick={togglePassword}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
        
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
        )}
        
        {success && !error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
        )}
      </div>
      
      {(error || success || helperText) && (
        <div className="mt-2">
          {error && (
            <p className="text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {error}
            </p>
          )}
          {success && !error && (
            <p className="text-sm text-green-600 flex items-center">
              <CheckCircle className="h-4 w-4 mr-1" />
              {success}
            </p>
          )}
          {helperText && !error && !success && (
            <p className="text-sm text-gray-500">{helperText}</p>
          )}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;