import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  X, 
  Trash2,
  Settings,
  Filter
} from 'lucide-react';
import { useNotifications, Notification } from '../hooks/useNotifications';
import { Button, Badge, Card } from '../design-system/components';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const {
    notifications,
    unreadCount,
    hasUnread,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll
  } = useNotifications();

  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'info' | 'success' | 'warning' | 'error'>('all');

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && !notification.read) ||
      (filter === 'read' && notification.read);
    
    const matchesType = selectedType === 'all' || notification.type === selectedType;
    
    return matchesFilter && matchesType;
  });

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'info': return <Info className="h-5 w-5 text-blue-500" />;
      default: return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'error': return 'bg-red-50 border-red-200';
      case 'info': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora mismo';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)}h`;
    return date.toLocaleDateString('es-ES');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Bell className="h-6 w-6 text-gray-600" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Notificaciones</h2>
                {hasUnread && (
                  <Badge variant="primary" size="sm">
                    {unreadCount} sin leer
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={markAllAsRead}
                disabled={!hasUnread}
              >
                Marcar todas como leídas
              </Button>
              
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-2 mb-3">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filtros</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {/* Filter by read status */}
              <div className="flex space-x-1">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    filter === 'all' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Todas
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    filter === 'unread' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Sin leer
                </button>
                <button
                  onClick={() => setFilter('read')}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    filter === 'read' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Leídas
                </button>
              </div>
              
              {/* Filter by type */}
              <div className="flex space-x-1">
                <button
                  onClick={() => setSelectedType('all')}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    selectedType === 'all' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Todas
                </button>
                <button
                  onClick={() => setSelectedType('info')}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    selectedType === 'info' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Info
                </button>
                <button
                  onClick={() => setSelectedType('success')}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    selectedType === 'success' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Éxito
                </button>
                <button
                  onClick={() => setSelectedType('warning')}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    selectedType === 'warning' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Advertencia
                </button>
                <button
                  onClick={() => setSelectedType('error')}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    selectedType === 'error' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Error
                </button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {filteredNotifications.length > 0 ? (
              <div className="p-4 space-y-3">
                {filteredNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`transition-all duration-200 ${
                      notification.read ? 'opacity-75' : 'opacity-100'
                    }`}
                    padding="md"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getTypeIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className="text-sm font-medium text-gray-900 mb-1">
                            {notification.title}
                          </h4>
                          
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">
                              {formatTime(notification.timestamp)}
                            </span>
                            
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">
                          {notification.message}
                        </p>
                        
                        {notification.action && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={notification.action.onClick}
                          >
                            {notification.action.label}
                          </Button>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            title="Marcar como leída"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => removeNotification(notification.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Eliminar notificación"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Bell className="h-12 w-12 mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">No hay notificaciones</p>
                <p className="text-sm text-center">
                  {filter === 'all' 
                    ? 'No tienes notificaciones en este momento'
                    : filter === 'unread'
                    ? 'No tienes notificaciones sin leer'
                    : 'No tienes notificaciones leídas'
                  }
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {filteredNotifications.length} notificación{filteredNotifications.length !== 1 ? 'es' : ''}
              </span>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={clearAll}
                  disabled={notifications.length === 0}
                >
                  Limpiar todas
                </Button>
                
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onClose}
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}