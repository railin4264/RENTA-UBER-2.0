import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface LogViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

const LogViewer: React.FC<LogViewerProps> = ({ isOpen, onClose }) => {
  const { getAuthHeaders } = useAuth();
  const [appLogs, setAppLogs] = useState<string[]>([]);
  const [errorLogs, setErrorLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'app' | 'errors'>('app');
  const [loading, setLoading] = useState(false);

  const fetchLogs = async (type: 'app' | 'errors') => {
    setLoading(true);
    try {
      const api = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${api}/logs/${type}`, {
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        if (type === 'app') {
          setAppLogs(data.data || []);
        } else {
          setErrorLogs(data.data || []);
        }
      } else {
        toast.error('Error al cargar los logs');
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast.error('Error de conexión al cargar los logs');
    } finally {
      setLoading(false);
    }
  };

  const clearLogs = async () => {
    try {
      const api = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${api}/logs/clear`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        toast.success('Logs limpiados exitosamente');
        fetchLogs('app');
        fetchLogs('errors');
      } else {
        toast.error('Error al limpiar los logs');
      }
    } catch (error) {
      console.error('Error clearing logs:', error);
      toast.error('Error de conexión al limpiar los logs');
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLogs('app');
      fetchLogs('errors');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-11/12 h-5/6 max-w-6xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Visor de Logs del Backend</h2>
          <div className="flex gap-2">
            <button
              onClick={() => fetchLogs(activeTab)}
              disabled={loading}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Cargando...' : 'Actualizar'}
            </button>
            <button
              onClick={clearLogs}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Limpiar Logs
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cerrar
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab('app')}
              className={`px-4 py-2 rounded ${
                activeTab === 'app'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Logs de Aplicación ({appLogs.length})
            </button>
            <button
              onClick={() => setActiveTab('errors')}
              className={`px-4 py-2 rounded ${
                activeTab === 'errors'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Logs de Errores ({errorLogs.length})
            </button>
          </div>

          <div className="bg-gray-900 text-green-400 p-4 rounded h-96 overflow-y-auto font-mono text-sm">
            {activeTab === 'app' ? (
              appLogs.length > 0 ? (
                appLogs.map((log, index) => (
                  <div key={index} className="mb-1">
                    {log}
                  </div>
                ))
              ) : (
                <div className="text-gray-400">No hay logs de aplicación disponibles</div>
              )
            ) : (
              errorLogs.length > 0 ? (
                errorLogs.map((log, index) => (
                  <div key={index} className="mb-1 text-red-400">
                    {log}
                  </div>
                ))
              ) : (
                <div className="text-gray-400">No hay errores registrados</div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogViewer; 