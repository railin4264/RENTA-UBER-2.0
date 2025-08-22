import PushNotification, { Importance } from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

interface NotificationData {
  id: string;
  title: string;
  message: string;
  data?: any;
  type: 'info' | 'success' | 'warning' | 'error' | 'reminder';
  priority?: 'high' | 'default' | 'low';
  scheduled?: boolean;
  scheduledDate?: Date;
  read?: boolean;
  createdAt: Date;
}

interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  vibration: boolean;
  led: boolean;
  priority: 'high' | 'default' | 'low';
  quietHours: {
    enabled: boolean;
    start: string; // HH:mm
    end: string; // HH:mm
  };
  types: {
    drivers: boolean;
    vehicles: boolean;
    payments: boolean;
    expenses: boolean;
    contracts: boolean;
    reports: boolean;
    system: boolean;
  };
}

class NotificationService {
  private static instance: NotificationService;
  private notifications: NotificationData[] = [];
  private settings: NotificationSettings;
  private isInitialized = false;

  private constructor() {
    this.settings = this.getDefaultSettings();
    this.initializeService();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private getDefaultSettings(): NotificationSettings {
    return {
      enabled: true,
      sound: true,
      vibration: true,
      led: true,
      priority: 'default',
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '08:00',
      },
      types: {
        drivers: true,
        vehicles: true,
        payments: true,
        expenses: true,
        contracts: true,
        reports: true,
        system: true,
      },
    };
  }

  private async initializeService() {
    if (this.isInitialized) return;

    try {
      // Cargar configuraciones guardadas
      await this.loadSettings();
      
      // Configurar canal de notificaciones (Android)
      if (Platform.OS === 'android') {
        this.createNotificationChannel();
      }

      // Configurar handlers
      this.setupNotificationHandlers();
      
      // Cargar notificaciones existentes
      await this.loadNotifications();
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing notification service:', error);
    }
  }

  private createNotificationChannel() {
    PushNotification.createChannel(
      {
        channelId: 'renta-uber-default',
        channelName: 'Renta Uber Notifications',
        channelDescription: 'Notifications from Renta Uber app',
        playSound: this.settings.sound,
        soundName: 'default',
        importance: Importance.HIGH,
        vibrate: this.settings.vibration,
      },
      (created) => {
        if (created) {
          console.log('Notification channel created');
        }
      }
    );
  }

  private setupNotificationHandlers() {
    // Notificación recibida cuando la app está en foreground
    PushNotification.onNotification((notification) => {
      console.log('Notification received:', notification);
      
      // Agregar a la lista local
      this.addLocalNotification({
        id: notification.id || Date.now().toString(),
        title: notification.title || 'Notificación',
        message: notification.body || '',
        data: notification.data,
        type: 'info',
        createdAt: new Date(),
      });
    });

    // Notificación tocada/abierta
    PushNotification.onNotificationOpenedApp((notification) => {
      console.log('Notification opened app:', notification);
      this.handleNotificationTap(notification);
    });

    // Notificación recibida cuando la app estaba cerrada
    PushNotification.getInitialNotification().then((notification) => {
      if (notification) {
        console.log('Initial notification:', notification);
        this.handleNotificationTap(notification);
      }
    });
  }

  // Enviar notificación local
  async sendLocalNotification(notification: Omit<NotificationData, 'id' | 'createdAt'>) {
    if (!this.settings.enabled) return;

    // Verificar quiet hours
    if (this.isInQuietHours()) return;

    const fullNotification: NotificationData = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date(),
    };

    // Agregar a la lista local
    this.notifications.unshift(fullNotification);
    await this.saveNotifications();

    // Mostrar notificación del sistema
    PushNotification.localNotification({
      id: fullNotification.id,
      title: fullNotification.title,
      message: fullNotification.message,
      data: fullNotification.data,
      channelId: 'renta-uber-default',
      playSound: this.settings.sound,
      soundName: 'default',
      importance: this.getImportanceLevel(fullNotification.priority),
      vibrate: this.settings.vibration,
      vibration: 300,
      priority: this.getPriorityLevel(fullNotification.priority),
      autoCancel: true,
      largeIcon: 'ic_launcher',
      smallIcon: 'ic_notification',
      bigText: fullNotification.message,
      subText: fullNotification.type,
      color: this.getNotificationColor(fullNotification.type),
    });

    return fullNotification;
  }

  // Enviar notificación programada
  async scheduleNotification(notification: Omit<NotificationData, 'id' | 'createdAt'>, date: Date) {
    const fullNotification: NotificationData = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date(),
      scheduled: true,
      scheduledDate: date,
    };

    // Agregar a la lista local
    this.notifications.unshift(fullNotification);
    await this.saveNotifications();

    // Programar notificación del sistema
    PushNotification.localNotificationSchedule({
      id: fullNotification.id,
      title: fullNotification.title,
      message: fullNotification.message,
      data: fullNotification.data,
      date: date,
      channelId: 'renta-uber-default',
      playSound: this.settings.sound,
      soundName: 'default',
      importance: this.getImportanceLevel(fullNotification.priority),
      vibrate: this.settings.vibration,
      priority: this.getPriorityLevel(fullNotification.priority),
      autoCancel: true,
      largeIcon: 'ic_launcher',
      smallIcon: 'ic_notification',
      bigText: fullNotification.message,
      subText: fullNotification.type,
      color: this.getNotificationColor(fullNotification.type),
    });

    return fullNotification;
  }

  // Cancelar notificación
  async cancelNotification(id: string) {
    // Remover de la lista local
    this.notifications = this.notifications.filter(n => n.id !== id);
    await this.saveNotifications();

    // Cancelar notificación del sistema
    PushNotification.cancelLocalNotification({ id });
  }

  // Cancelar todas las notificaciones
  async cancelAllNotifications() {
    this.notifications = [];
    await this.saveNotifications();
    PushNotification.cancelAllLocalNotifications();
  }

  // Marcar notificación como leída
  async markAsRead(id: string) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      await this.saveNotifications();
    }
  }

  // Marcar todas como leídas
  async markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    await this.saveNotifications();
  }

  // Obtener notificaciones
  getNotifications(): NotificationData[] {
    return [...this.notifications];
  }

  // Obtener notificaciones no leídas
  getUnreadNotifications(): NotificationData[] {
    return this.notifications.filter(n => !n.read);
  }

  // Obtener configuración
  getSettings(): NotificationSettings {
    return { ...this.settings };
  }

  // Actualizar configuración
  async updateSettings(newSettings: Partial<NotificationSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    await this.saveSettings();
    
    // Recrear canal si es necesario
    if (Platform.OS === 'android') {
      this.createNotificationChannel();
    }
  }

  // Verificar si está en quiet hours
  private isInQuietHours(): boolean {
    if (!this.settings.quietHours.enabled) return false;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMinute] = this.settings.quietHours.start.split(':').map(Number);
    const [endHour, endMinute] = this.settings.quietHours.end.split(':').map(Number);
    
    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;

    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      // Caso especial: quiet hours cruzan la medianoche
      return currentTime >= startTime || currentTime <= endTime;
    }
  }

  private getImportanceLevel(priority?: string): Importance {
    switch (priority) {
      case 'high': return Importance.HIGH;
      case 'low': return Importance.LOW;
      default: return Importance.DEFAULT;
    }
  }

  private getPriorityLevel(priority?: string): string {
    switch (priority) {
      case 'high': return 'high';
      case 'low': return 'low';
      default: return 'default';
    }
  }

  private getNotificationColor(type: string): string {
    switch (type) {
      case 'success': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'error': return '#ef4444';
      case 'reminder': return '#8b5cf6';
      default: return '#3b82f6';
    }
  }

  private handleNotificationTap(notification: any) {
    // Aquí se implementaría la navegación basada en el tipo de notificación
    console.log('Handling notification tap:', notification);
  }

  private addLocalNotification(notification: NotificationData) {
    this.notifications.unshift(notification);
    this.saveNotifications();
  }

  private async loadSettings() {
    try {
      const saved = await AsyncStorage.getItem('notification_settings');
      if (saved) {
        this.settings = { ...this.settings, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  }

  private async saveSettings() {
    try {
      await AsyncStorage.setItem('notification_settings', JSON.stringify(this.settings));
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  }

  private async loadNotifications() {
    try {
      const saved = await AsyncStorage.getItem('notifications');
      if (saved) {
        this.notifications = JSON.parse(saved).map((n: any) => ({
          ...n,
          createdAt: new Date(n.createdAt),
          scheduledDate: n.scheduledDate ? new Date(n.scheduledDate) : undefined,
        }));
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }

  private async saveNotifications() {
    try {
      await AsyncStorage.setItem('notifications', JSON.stringify(this.notifications));
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  }
}

export default NotificationService;
export type { NotificationData, NotificationSettings };