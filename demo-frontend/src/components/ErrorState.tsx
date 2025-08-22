import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
  showRetry?: boolean;
}

export default function ErrorState({
  title = 'Error al cargar datos',
  message = 'Ocurrió un problema al cargar la información. Verifica tu conexión e inténtalo de nuevo.',
  onRetry,
  retryLabel = 'Reintentar',
  className = '',
  showRetry = true
}: ErrorStateProps) {
  return (
    <div className={`text-center py-12 ${className}`}>
      <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{message}</p>
      {showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{retryLabel}</span>
        </button>
      )}
    </div>
  );
}