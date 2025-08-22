import { useApp } from '../context/AppContext';

interface NotificationData {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, string | number | boolean>;
  actions?: NotificationAction[];
  requireInteraction?: boolean;
  silent?: boolean;
}

interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

class NotificationService {
  private isSupported: boolean;
  private permission: NotificationPermission = 'default';

  constructor() {
    this.isSupported = 'Notification' in window;
    this.permission = this.isSupported ? Notification.permission : 'denied';
  }

  async requestPermission(): Promise<boolean> {
    if (!this.isSupported) {
      console.warn('Notifications not supported');
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    if (this.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    this.permission = permission;
    return permission === 'granted';
  }

  async sendNotification(data: NotificationData): Promise<void> {
    if (!this.isSupported || this.permission !== 'granted') {
      return;
    }

    const notification = new Notification(data.title, {
      body: data.body,
      icon: data.icon || '/favicon.ico',
      badge: data.badge,
      tag: data.tag,
      data: data.data,
      requireInteraction: data.requireInteraction || false,
      silent: data.silent || false,
    });

    // Manejar clics en la notificación
    notification.onclick = (event) => {
      event.preventDefault();
      window.focus();
      notification.close();
      
      // Navegar a la página correspondiente
      if (data.data?.url) {
        window.location.href = data.data.url;
      }
    };

    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
      notification.close();
    }, 5000);
  }

  // Notificaciones específicas del sistema
  async sendPaymentReminder(driverName: string, amount: number, dueDate: string): Promise<void> {
    await this.sendNotification({
      title: 'Recordatorio de Pago',
      body: `${driverName} tiene un pago pendiente de RD$${amount} vence ${dueDate}`,
      tag: 'payment-reminder',
      data: { url: '/payments' },
      requireInteraction: true,
    });
  }

  async sendVehicleMaintenance(vehiclePlate: string, maintenanceType: string): Promise<void> {
    await this.sendNotification({
      title: 'Mantenimiento de Vehículo',
      body: `El vehículo ${vehiclePlate} requiere ${maintenanceType}`,
      tag: 'vehicle-maintenance',
      data: { url: '/vehicles' },
    });
  }

  async sendNewDriverNotification(driverName: string): Promise<void> {
    await this.sendNotification({
      title: 'Nuevo Chofer Registrado',
      body: `${driverName} ha sido registrado en el sistema`,
      tag: 'new-driver',
      data: { url: '/drivers' },
    });
  }

  async sendExpenseAlert(amount: number, description: string): Promise<void> {
    await this.sendNotification({
      title: 'Nuevo Gasto Registrado',
      body: `Se registró un gasto de RD$${amount} - ${description}`,
      tag: 'expense-alert',
      data: { url: '/expenses' },
    });
  }

  async sendContractExpiration(contractId: string, daysLeft: number): Promise<void> {
    await this.sendNotification({
      title: 'Contrato por Vencer',
      body: `El contrato ${contractId} vence en ${daysLeft} días`,
      tag: 'contract-expiration',
      data: { url: '/contracts' },
      requireInteraction: true,
    });
  }

  async sendSystemAlert(message: string, type: 'info' | 'warning' | 'error' = 'info'): Promise<void> {
    await this.sendNotification({
      title: 'Alerta del Sistema',
      body: message,
      tag: 'system-alert',
      requireInteraction: type === 'error',
    });
  }
}

// Hook para usar notificaciones en componentes
export const useNotifications = () => {
  const { addNotification } = useApp();
  const notificationService = new NotificationService();

  const sendNotification = async (data: NotificationData) => {
    try {
      await notificationService.sendNotification(data);
      addNotification({
        type: 'success',
        message: 'Notificación enviada',
        duration: 3000,
      });
    } catch {
      addNotification({
        type: 'error',
        message: 'Error al enviar notificación',
        duration: 5000,
      });
    }
  };

  const requestPermission = async () => {
    const granted = await notificationService.requestPermission();
    if (granted) {
      addNotification({
        type: 'success',
        message: 'Notificaciones activadas',
        duration: 3000,
      });
    } else {
      addNotification({
        type: 'warning',
        message: 'Las notificaciones están desactivadas',
        duration: 5000,
      });
    }
    return granted;
  };

  return {
    sendNotification,
    requestPermission,
    notificationService,
  };
};

export default NotificationService; 