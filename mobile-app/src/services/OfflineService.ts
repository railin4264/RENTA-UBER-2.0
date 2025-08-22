import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Platform } from 'react-native';

interface OfflineAction {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  entity: string;
  data: any;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
}

interface OfflineData {
  [entity: string]: {
    [id: string]: any;
  };
}

interface SyncStatus {
  isOnline: boolean;
  lastSync: number;
  pendingActions: number;
  syncInProgress: boolean;
}

class OfflineService {
  private static instance: OfflineService;
  private offlineActions: OfflineAction[] = [];
  private offlineData: OfflineData = {};
  private syncStatus: SyncStatus = {
    isOnline: true,
    lastSync: Date.now(),
    pendingActions: 0,
    syncInProgress: false,
  };
  private listeners: ((status: SyncStatus) => void)[] = [];
  private syncInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.initializeService();
  }

  static getInstance(): OfflineService {
    if (!OfflineService.instance) {
      OfflineService.instance = new OfflineService();
    }
    return OfflineService.instance;
  }

  private async initializeService() {
    // Cargar datos offline guardados
    await this.loadOfflineData();
    await this.loadOfflineActions();
    
    // Configurar listener de conectividad
    this.setupConnectivityListener();
    
    // Iniciar sincronización automática
    this.startAutoSync();
  }

  private setupConnectivityListener() {
    NetInfo.addEventListener((state) => {
      const wasOnline = this.syncStatus.isOnline;
      this.syncStatus.isOnline = state.isConnected ?? false;
      
      // Si pasamos de offline a online, sincronizar
      if (!wasOnline && this.syncStatus.isOnline) {
        this.syncPendingActions();
      }
      
      this.notifyListeners();
    });
  }

  private startAutoSync() {
    // Sincronizar cada 5 minutos si hay conexión
    this.syncInterval = setInterval(() => {
      if (this.syncStatus.isOnline && this.offlineActions.length > 0) {
        this.syncPendingActions();
      }
    }, 5 * 60 * 1000);
  }

  // Guardar datos offline
  async saveOfflineData(entity: string, id: string, data: any) {
    if (!this.offlineData[entity]) {
      this.offlineData[entity] = {};
    }
    
    this.offlineData[entity][id] = {
      ...data,
      _offline: true,
      _lastModified: Date.now(),
    };
    
    await this.saveOfflineDataToStorage();
  }

  // Obtener datos offline
  getOfflineData(entity: string, id?: string): any {
    if (!this.offlineData[entity]) return null;
    
    if (id) {
      return this.offlineData[entity][id];
    }
    
    return Object.values(this.offlineData[entity]);
  }

  // Agregar acción offline
  async addOfflineAction(action: Omit<OfflineAction, 'id' | 'timestamp' | 'retryCount'>) {
    const offlineAction: OfflineAction = {
      ...action,
      id: `${action.type}_${action.entity}_${Date.now()}_${Math.random()}`,
      timestamp: Date.now(),
      retryCount: 0,
      maxRetries: 3,
    };
    
    this.offlineActions.push(offlineAction);
    this.syncStatus.pendingActions = this.offlineActions.length;
    
    await this.saveOfflineActionsToStorage();
    this.notifyListeners();
    
    // Intentar sincronizar si hay conexión
    if (this.syncStatus.isOnline) {
      this.syncPendingActions();
    }
  }

  // Sincronizar acciones pendientes
  async syncPendingActions() {
    if (this.syncStatus.syncInProgress || !this.syncStatus.isOnline) {
      return;
    }
    
    this.syncStatus.syncInProgress = true;
    this.notifyListeners();
    
    try {
      const actionsToSync = [...this.offlineActions];
      
      for (const action of actionsToSync) {
        try {
          await this.executeAction(action);
          
          // Remover acción exitosa
          this.offlineActions = this.offlineActions.filter(a => a.id !== action.id);
          
        } catch (error) {
          console.error(`Error syncing action ${action.id}:`, error);
          
          // Incrementar contador de reintentos
          action.retryCount++;
          
          // Si excedió reintentos, remover la acción
          if (action.retryCount >= action.maxRetries) {
            this.offlineActions = this.offlineActions.filter(a => a.id !== action.id);
            console.warn(`Action ${action.id} exceeded max retries, removing`);
          }
        }
      }
      
      this.syncStatus.pendingActions = this.offlineActions.length;
      this.syncStatus.lastSync = Date.now();
      
    } catch (error) {
      console.error('Error during sync:', error);
    } finally {
      this.syncStatus.syncInProgress = false;
      this.notifyListeners();
    }
  }

  // Ejecutar acción individual
  private async executeAction(action: OfflineAction): Promise<void> {
    // Aquí se implementaría la lógica real de sincronización con el backend
    // Por ahora simulamos la ejecución
    
    switch (action.type) {
      case 'CREATE':
        console.log(`Creating ${action.entity}:`, action.data);
        break;
      case 'UPDATE':
        console.log(`Updating ${action.entity}:`, action.data);
        break;
      case 'DELETE':
        console.log(`Deleting ${action.entity}:`, action.data);
        break;
    }
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Verificar si un dato está disponible offline
  isDataAvailableOffline(entity: string, id: string): boolean {
    return !!(this.offlineData[entity] && this.offlineData[entity][id]);
  }

  // Obtener estado de sincronización
  getSyncStatus(): SyncStatus {
    return { ...this.syncStatus };
  }

  // Suscribirse a cambios de estado
  subscribe(listener: (status: SyncStatus) => void): () => void {
    this.listeners.push(listener);
    
    // Retornar función de desuscripción
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notificar a los listeners
  private notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener(this.getSyncStatus());
      } catch (error) {
        console.error('Error in sync status listener:', error);
      }
    });
  }

  // Limpiar datos offline
  async clearOfflineData(entity?: string) {
    if (entity) {
      delete this.offlineData[entity];
    } else {
      this.offlineData = {};
    }
    
    await this.saveOfflineDataToStorage();
  }

  // Limpiar acciones offline
  async clearOfflineActions() {
    this.offlineActions = [];
    this.syncStatus.pendingActions = 0;
    await this.saveOfflineActionsToStorage();
    this.notifyListeners();
  }

  // Obtener estadísticas offline
  getOfflineStats() {
    const entityStats = Object.keys(this.offlineData).map(entity => ({
      entity,
      count: Object.keys(this.offlineData[entity]).length,
    }));
    
    return {
      totalEntities: Object.keys(this.offlineData).length,
      totalRecords: Object.values(this.offlineData).reduce((sum, entity) => sum + Object.keys(entity).length, 0),
      pendingActions: this.offlineActions.length,
      entityStats,
    };
  }

  // Guardar datos offline en storage
  private async saveOfflineDataToStorage() {
    try {
      await AsyncStorage.setItem('offline_data', JSON.stringify(this.offlineData));
    } catch (error) {
      console.error('Error saving offline data:', error);
    }
  }

  // Cargar datos offline desde storage
  private async loadOfflineData() {
    try {
      const saved = await AsyncStorage.getItem('offline_data');
      if (saved) {
        this.offlineData = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading offline data:', error);
    }
  }

  // Guardar acciones offline en storage
  private async saveOfflineActionsToStorage() {
    try {
      await AsyncStorage.setItem('offline_actions', JSON.stringify(this.offlineActions));
    } catch (error) {
      console.error('Error saving offline actions:', error);
    }
  }

  // Cargar acciones offline desde storage
  private async loadOfflineActions() {
    try {
      const saved = await AsyncStorage.getItem('offline_actions');
      if (saved) {
        this.offlineActions = JSON.parse(saved);
        this.syncStatus.pendingActions = this.offlineActions.length;
      }
    } catch (error) {
      console.error('Error loading offline actions:', error);
    }
  }

  // Limpiar recursos
  destroy() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    
    this.listeners = [];
  }
}

export default OfflineService;
export type { OfflineAction, OfflineData, SyncStatus };