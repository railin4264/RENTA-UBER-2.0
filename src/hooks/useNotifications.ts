import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-hot-toast';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  autoClose?: boolean;
  duration?: number;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  unreadCount: number;
  hasUnread: boolean;
}

export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const autoCloseTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Actualizar contador de no leídos
  useEffect(() => {
    const count = notifications.filter(n => !n.read).length;
    setUnreadCount(count);
  }, [notifications]);

  // Función para agregar notificación
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Mostrar toast
    const toastOptions = {
      duration: notification.duration || 4000,
      position: 'top-right' as const,
    };

    switch (notification.type) {
      case 'success':
        toast.success(notification.message, toastOptions);
        break;
      case 'error':
        toast.error(notification.message, toastOptions);
        break;
      case 'warning':
        toast(notification.message, { ...toastOptions, icon: '⚠️' });
        break;
      case 'info':
        toast(notification.message, { ...toastOptions, icon: 'ℹ️' });
        break;
    }

    // Auto-close si está habilitado
    if (notification.autoClose !== false) {
      const timeout = setTimeout(() => {
        removeNotification(newNotification.id);
      }, notification.duration || 4000);
      
      autoCloseTimeoutsRef.current.set(newNotification.id, timeout);
    }
  }, []);

  // Función para remover notificación
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    
    // Limpiar timeout si existe
    const timeout = autoCloseTimeoutsRef.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      autoCloseTimeoutsRef.current.delete(id);
    }
  }, []);

  // Función para marcar como leída
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  // Función para marcar todas como leídas
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  }, []);

  // Función para limpiar todas
  const clearAll = useCallback(() => {
    setNotifications([]);
    
    // Limpiar todos los timeouts
    autoCloseTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    autoCloseTimeoutsRef.current.clear();
  }, []);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      autoCloseTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      autoCloseTimeoutsRef.current.clear();
    };
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    unreadCount,
    hasUnread: unreadCount > 0,
  };
}

// Hook para notificaciones del sistema
export function useSystemNotifications() {
  const { addNotification } = useNotifications();

  const showSuccess = useCallback((title: string, message: string) => {
    addNotification({
      type: 'success',
      title,
      message,
      autoClose: true,
      duration: 3000,
    });
  }, [addNotification]);

  const showError = useCallback((title: string, message: string) => {
    addNotification({
      type: 'error',
      title,
      message,
      autoClose: false, // Los errores no se cierran automáticamente
    });
  }, [addNotification]);

  const showWarning = useCallback((title: string, message: string) => {
    addNotification({
      type: 'warning',
      title,
      message,
      autoClose: true,
      duration: 5000,
    });
  }, [addNotification]);

  const showInfo = useCallback((title: string, message: string) => {
    addNotification({
      type: 'info',
      title,
      message,
      autoClose: true,
      duration: 4000,
    });
  }, [addNotification]);

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}