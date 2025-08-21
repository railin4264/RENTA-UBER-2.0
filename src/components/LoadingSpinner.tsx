import React from 'react';
import { RefreshCw } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  text = 'Cargando...',
  className = ''
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <RefreshCw className={`${sizeClasses[size]} animate-spin text-blue-500 mb-2`} />
      {text && (
        <p className="text-sm text-gray-600">{text}</p>
      )}
    </div>
  );
}

// Full screen loading component
export function FullScreenLoader({ text = 'Cargando aplicación...' }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <RefreshCw className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">{text}</p>
        <p className="text-sm text-gray-600">Por favor espera...</p>
      </div>
    </div>
  );
}

// Inline loading component
export function InlineLoader({ text = 'Cargando...' }: { text?: string }) {
  return (
    <div className="flex items-center space-x-2">
      <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
      <span className="text-sm text-gray-600">{text}</span>
    </div>
  );
} 