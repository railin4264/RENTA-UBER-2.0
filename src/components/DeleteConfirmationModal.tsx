import React from 'react';
import { X, AlertTriangle, FileText, DollarSign } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  details?: any[];
  onConfirm?: () => void;
  showConfirmButton?: boolean;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  title,
  message,
  details,
  onConfirm,
  showConfirmButton = false
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'contracts':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'payments':
        return <DollarSign className="w-5 h-5 text-green-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'contracts':
        return 'Contratos Activos';
      case 'payments':
        return 'Pagos Pendientes';
      default:
        return 'Problemas';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-4">{message}</p>

          {details && details.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Detalles:</h4>
              {details.map((issue, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    {getIcon(issue.type)}
                    <span className="font-medium text-gray-900">
                      {getTypeLabel(issue.type)} ({issue.count})
                    </span>
                  </div>
                  
                  {issue.details && issue.details.length > 0 && (
                    <div className="ml-7 space-y-1">
                      {issue.details.map((detail: any, detailIndex: number) => (
                        <div key={detailIndex} className="text-sm text-gray-600">
                          {issue.type === 'contracts' && (
                            <span>
                              Contrato {detail.id}: {detail.vehicle} ({detail.status})
                            </span>
                          )}
                          {issue.type === 'payments' && (
                            <span>
                              Pago {detail.id}: ${detail.amount} ({detail.status})
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Para eliminar el conductor:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Finalizar todos los contratos activos</li>
              <li>• Liquidar todos los pagos pendientes</li>
              <li>• Asegurarse de que no tenga registros relacionados</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Entendido
          </button>
          {showConfirmButton && onConfirm && (
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Eliminar de todos modos
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 