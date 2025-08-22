import React from 'react';
import { ComponentVariant } from '../index';

interface CardProps {
  children: React.ReactNode;
  variant?: ComponentVariant;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
  loading?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'neutral',
  className = '',
  onClick,
  interactive = false,
  loading = false,
  header,
  footer,
  padding = 'md',
}) => {
  const baseClasses = 'bg-white rounded-lg border shadow-sm transition-all duration-200';
  
  const variantClasses = {
    primary: 'border-blue-200 hover:border-blue-300',
    secondary: 'border-gray-200 hover:border-gray-300',
    success: 'border-green-200 hover:border-green-300',
    warning: 'border-yellow-200 hover:border-yellow-300',
    error: 'border-red-200 hover:border-red-300',
    info: 'border-blue-200 hover:border-blue-300',
    neutral: 'border-gray-200 hover:border-gray-300',
  };
  
  const interactiveClasses = interactive ? 'cursor-pointer hover:shadow-md active:shadow-sm' : '';
  const clickableClasses = onClick ? 'cursor-pointer hover:shadow-md active:shadow-sm' : '';
  
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  };
  
  const classes = [
    baseClasses,
    variantClasses[variant],
    interactiveClasses,
    clickableClasses,
    className
  ].filter(Boolean).join(' ');
  
  const handleClick = () => {
    if (onClick && !loading) {
      onClick();
    }
  };
  
  return (
    <div 
      className={classes}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {header && (
        <div className="px-6 py-4 border-b border-gray-200">
          {header}
        </div>
      )}
      
      <div className={paddingClasses[padding]}>
        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        ) : (
          children
        )}
      </div>
      
      {footer && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;