interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  speed?: number;
  heading?: number;
  altitude?: number;
}

interface VehicleLocation {
  vehicleId: string;
  driverId: string;
  location: LocationData;
  status: 'active' | 'inactive' | 'maintenance';
  lastUpdate: Date;
}

class GPSService {
  private watchId: number | null = null;
  private isTracking = false;
  private updateInterval: number = 30000; // 30 segundos
  private apiUrl: string;

  constructor() {
    this.apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  }

  // Iniciar seguimiento GPS
  async startTracking(vehicleId: string, driverId: string): Promise<boolean> {
    if (!navigator.geolocation) {
      console.error('Geolocation no está soportado');
      return false;
    }

    if (this.isTracking) {
      console.warn('GPS tracking ya está activo');
      return true;
    }

    try {
      this.watchId = navigator.geolocation.watchPosition(
        (position) => this.handleLocationUpdate(position, vehicleId, driverId),
        (error) => this.handleLocationError(error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000,
        }
      );

      this.isTracking = true;
      console.log('GPS tracking iniciado');
      return true;
    } catch (error) {
      console.error('Error iniciando GPS tracking:', error);
      return false;
    }
  }

  // Detener seguimiento GPS
  stopTracking(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.isTracking = false;
    console.log('GPS tracking detenido');
  }

  // Manejar actualización de ubicación
  private async handleLocationUpdate(
    position: GeolocationPosition,
    vehicleId: string,
    driverId: string
  ): Promise<void> {
    const locationData: LocationData = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: position.timestamp,
      speed: position.coords.speed || undefined,
      heading: position.coords.heading || undefined,
      altitude: position.coords.altitude || undefined,
    };

    const vehicleLocation: VehicleLocation = {
      vehicleId,
      driverId,
      location: locationData,
      status: 'active',
      lastUpdate: new Date(),
    };

    // Enviar ubicación al servidor
    await this.sendLocationToServer(vehicleLocation);
  }

  // Manejar errores de ubicación
  private handleLocationError(error: GeolocationPositionError): void {
    console.error('Error de GPS:', error);
    
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.error('Permiso de ubicación denegado');
        break;
      case error.POSITION_UNAVAILABLE:
        console.error('Información de ubicación no disponible');
        break;
      case error.TIMEOUT:
        console.error('Timeout al obtener ubicación');
        break;
      default:
        console.error('Error desconocido de GPS');
    }
  }

  // Enviar ubicación al servidor
  private async sendLocationToServer(location: VehicleLocation): Promise<void> {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${this.apiUrl}/gps/location`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(location),
      });

      if (!response.ok) {
        throw new Error('Error enviando ubicación al servidor');
      }

      console.log('Ubicación enviada exitosamente');
    } catch (error) {
      console.error('Error enviando ubicación:', error);
    }
  }

  // Obtener ubicación actual una vez
  async getCurrentLocation(): Promise<LocationData | null> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation no está soportado'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
            speed: position.coords.speed || undefined,
            heading: position.coords.heading || undefined,
            altitude: position.coords.altitude || undefined,
          };
          resolve(locationData);
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    });
  }

  // Calcular distancia entre dos puntos
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distancia en km
    return distance;
  }

  // Convertir grados a radianes
  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  // Verificar si el GPS está activo
  isTracking(): boolean {
    return this.isTracking;
  }

  // Obtener estado del GPS
  getGPSStatus(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(false);
        return;
      }

      navigator.permissions
        ?.query({ name: 'geolocation' })
        .then((permissionStatus) => {
          resolve(permissionStatus.state === 'granted');
        })
        .catch(() => {
          resolve(false);
        });
    });
  }
}

// Hook para usar GPS en componentes
export const useGPS = () => {
  const gpsService = new GPSService();

  const startTracking = async (vehicleId: string, driverId: string) => {
    return await gpsService.startTracking(vehicleId, driverId);
  };

  const stopTracking = () => {
    gpsService.stopTracking();
  };

  const getCurrentLocation = async () => {
    return await gpsService.getCurrentLocation();
  };

  const getGPSStatus = async () => {
    return await gpsService.getGPSStatus();
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    return gpsService.calculateDistance(lat1, lon1, lat2, lon2);
  };

  return {
    startTracking,
    stopTracking,
    getCurrentLocation,
    getGPSStatus,
    calculateDistance,
    isTracking: gpsService.isTracking(),
  };
};

export default GPSService; 