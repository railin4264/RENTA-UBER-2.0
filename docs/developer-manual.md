# 👨‍💻 Manual del Desarrollador - Renta Uber Mobile

## 🏗️ Arquitectura del Sistema

### Estructura del Proyecto
```
mobile-app/
├── src/
│   ├── components/          # Componentes reutilizables
│   ├── screens/            # Pantallas de la aplicación
│   ├── navigation/         # Configuración de navegación
│   ├── contexts/           # Contextos de React (Auth, etc.)
│   ├── hooks/              # Hooks personalizados
│   ├── services/           # Servicios (API, Notifications, etc.)
│   ├── config/             # Configuración y variables de entorno
│   ├── types/              # Definiciones de TypeScript
│   ├── utils/              # Utilidades y helpers
│   └── __tests__/          # Tests automatizados
├── android/                # Código nativo Android
├── ios/                    # Código nativo iOS
├── assets/                 # Recursos estáticos
└── docs/                   # Documentación
```

### Stack Tecnológico
- **Frontend**: React Native 0.72.6
- **Lenguaje**: TypeScript 4.8.4
- **Navegación**: React Navigation 6.x
- **Estado**: React Context + Hooks
- **UI Components**: React Native Paper
- **Iconos**: React Native Vector Icons (Feather)
- **Gráficos**: React Native Chart Kit
- **Almacenamiento**: AsyncStorage
- **Networking**: Fetch API + Axios
- **Testing**: Jest + React Native Testing Library

## 🚀 Configuración del Entorno de Desarrollo

### Requisitos Previos
- **Node.js**: Versión 18.x o superior
- **npm**: Versión 9.x o superior
- **React Native CLI**: `npm install -g @react-native-community/cli`
- **Android Studio**: Para desarrollo Android
- **Xcode**: Para desarrollo iOS (solo macOS)
- **Metro**: Bundler de React Native

### Instalación
```bash
# Clonar repositorio
git clone https://github.com/your-org/renta-uber-mobile.git
cd renta-uber-mobile

# Instalar dependencias
npm install

# iOS (solo macOS)
cd ios && pod install && cd ..

# Verificar instalación
npx react-native doctor
```

### Variables de Entorno
```bash
# .env.development
API_BASE_URL=http://localhost:3001/api
LOG_LEVEL=debug
ENABLE_ANALYTICS=false

# .env.production
API_BASE_URL=https://api.renta-uber.com/api
LOG_LEVEL=warn
ENABLE_ANALYTICS=true
```

## 🧩 Componentes del Sistema

### 1. Sistema de Autenticación (AuthContext)

#### Estructura
```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isOnline: boolean;
  accessToken: string | null;
  refreshToken: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  updateUser: (userData: Partial<User>) => void;
}
```

#### Uso
```typescript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginScreen />;
  }
  
  return <Dashboard user={user} />;
}
```

### 2. Servicio de API (ApiService)

#### Características
- **Caché Inteligente**: Almacenamiento local con expiración
- **Manejo Offline**: Funcionalidad sin conexión
- **Retry Automático**: Reintentos en caso de fallo
- **Interceptores**: Transformación de requests/responses

#### Uso
```typescript
import { apiService } from '../services/api';

// GET request con caché
const drivers = await apiService.get('/drivers', true);

// POST request
const newDriver = await apiService.post('/drivers', driverData);

// PUT request
const updatedDriver = await apiService.put(`/drivers/${id}`, updates);

// DELETE request
await apiService.delete(`/drivers/${id}`);
```

### 3. Hooks Personalizados

#### useApi Hook
```typescript
const [driversState, refreshDrivers] = useApi('/drivers');

// driversState: { data, loading, error }
// refreshDrivers: función para refrescar datos
```

#### useApiMutation Hook
```typescript
const [createDriverState, createDriver] = useApiMutation(
  (data) => apiService.post('/drivers', data)
);

// createDriverState: { data, loading, error }
// createDriver: función para crear conductor
```

#### useRealtimeSync Hook
```typescript
const [dashboardState, refreshDashboard] = useRealtimeSync('/dashboard', 30000);

// Sincroniza cada 30 segundos automáticamente
```

### 4. Sistema de Notificaciones

#### Configuración
```typescript
import NotificationService from '../services/NotificationService';

const notificationService = NotificationService.getInstance();

// Enviar notificación local
await notificationService.sendLocalNotification({
  title: 'Nuevo Conductor',
  message: 'Se ha registrado un nuevo conductor',
  type: 'success',
  priority: 'high'
});
```

#### Configuración de Usuario
```typescript
await notificationService.updateSettings({
  enabled: true,
  sound: true,
  vibration: true,
  quietHours: {
    enabled: true,
    start: '22:00',
    end: '08:00'
  }
});
```

### 5. Modo Offline

#### Funcionalidades
- **Almacenamiento Local**: Datos guardados en AsyncStorage
- **Cola de Acciones**: Operaciones pendientes de sincronización
- **Sincronización Automática**: Al recuperar conexión
- **Indicadores Visuales**: Estado de conexión y sincronización

#### Uso
```typescript
import OfflineService from '../services/OfflineService';

const offlineService = OfflineService.getInstance();

// Guardar datos offline
await offlineService.saveOfflineData('drivers', driverId, driverData);

// Agregar acción pendiente
await offlineService.addOfflineAction({
  type: 'CREATE',
  entity: 'drivers',
  data: driverData
});

// Suscribirse a cambios de estado
const unsubscribe = offlineService.subscribe((status) => {
  console.log('Estado offline:', status);
});
```

## 📱 Desarrollo de Pantallas

### Estructura de una Pantalla
```typescript
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApi } from '../hooks/useApi';
import { LoadingSpinner, ErrorMessage } from '../components';

interface ScreenProps {
  navigation: any;
  route: any;
}

export default function MyScreen({ navigation, route }: ScreenProps) {
  const [data, setData] = useState(null);
  const [apiState, refreshData] = useApi('/endpoint');

  useEffect(() => {
    if (apiState.data) {
      setData(apiState.data);
    }
  }, [apiState.data]);

  if (apiState.loading) return <LoadingSpinner />;
  if (apiState.error) return <ErrorMessage error={apiState.error} />;

  return (
    <SafeAreaView style={styles.container}>
      {/* Contenido de la pantalla */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
});
```

### Componentes Reutilizables

#### DriverCard
```typescript
interface DriverCardProps {
  driver: Driver;
  onEdit: (driver: Driver) => void;
  onDelete: (id: string) => void;
}

<DriverCard
  driver={driver}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

#### VirtualizedList
```typescript
<VirtualizedList
  data={drivers}
  renderItem={(driver) => <DriverCard driver={driver} />}
  keyExtractor={(driver) => driver.id.toString()}
  searchFields={['name', 'email', 'licenseNumber']}
  filterOptions={[
    { label: 'Todos', value: 'all' },
    { label: 'Activos', value: 'active' },
    { label: 'Inactivos', value: 'inactive' }
  ]}
  onRefresh={refreshDrivers}
  onLoadMore={loadMoreDrivers}
  hasMore={hasMoreDrivers}
/>
```

## 🧪 Testing

### Configuración de Jest
```javascript
// jest.config.js
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### Tests de Componentes
```typescript
import { render, fireEvent } from '@testing-library/react-native';
import DriverCard from '../components/DriverCard';

describe('DriverCard Component', () => {
  it('renders driver information correctly', () => {
    const { getByText } = render(
      <DriverCard driver={mockDriver} onEdit={jest.fn()} onDelete={jest.fn()} />
    );
    
    expect(getByText('Juan Pérez')).toBeTruthy();
    expect(getByText('juan@example.com')).toBeTruthy();
  });

  it('calls onEdit when edit button is pressed', () => {
    const mockOnEdit = jest.fn();
    const { getByTestId } = render(
      <DriverCard driver={mockDriver} onEdit={mockOnEdit} onDelete={jest.fn()} />
    );
    
    fireEvent.press(getByTestId('edit-button'));
    expect(mockOnEdit).toHaveBeenCalledWith(mockDriver);
  });
});
```

### Tests de Hooks
```typescript
import { renderHook, act } from '@testing-library/react-native';
import { useApi } from '../hooks/useApi';

describe('useApi Hook', () => {
  it('should return initial state', () => {
    const { result } = renderHook(() => useApi('/test'));
    
    expect(result.current[0].data).toBeNull();
    expect(result.current[0].loading).toBe(false);
    expect(result.current[0].error).toBeNull();
  });
});
```

## 🔧 Build y Despliegue

### Scripts de Build
```bash
# Build para Android
npm run android:release

# Build para iOS
npm run ios:release

# Build de desarrollo
npm run android:debug
npm run ios:debug
```

### Configuración de Producción
```typescript
// src/config/environment.ts
const productionConfig: EnvironmentConfig = {
  API_BASE_URL: 'https://api.renta-uber.com/api',
  API_TIMEOUT: 20000,
  CACHE_EXPIRY: 15 * 60 * 1000,
  SYNC_INTERVAL: 2 * 60 * 1000,
  LOG_LEVEL: 'warn',
  FEATURES: {
    PUSH_NOTIFICATIONS: true,
    OFFLINE_MODE: true,
    REAL_TIME_SYNC: true,
    ANALYTICS: true,
    CRASH_REPORTING: true,
  },
};
```

### CI/CD Pipeline
```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm test
```

## 📊 Performance y Optimización

### Lazy Loading
```typescript
import { lazy, Suspense } from 'react';

const DashboardScreen = lazy(() => import('../screens/DashboardScreen'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DashboardScreen />
    </Suspense>
  );
}
```

### Memoización
```typescript
import { useMemo, useCallback } from 'react';

const filteredDrivers = useMemo(() => {
  return drivers.filter(driver => 
    driver.status === selectedStatus && 
    driver.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
}, [drivers, selectedStatus, searchQuery]);

const handleDriverPress = useCallback((driver: Driver) => {
  navigation.navigate('DriverDetail', { driverId: driver.id });
}, [navigation]);
```

### Virtualización
```typescript
import { FlatList } from 'react-native';

<FlatList
  data={largeDataSet}
  renderItem={renderItem}
  keyExtractor={keyExtractor}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={10}
  initialNumToRender={10}
  getItemLayout={(data, index) => ({
    length: 100,
    offset: 100 * index,
    index,
  })}
/>
```

## 🔒 Seguridad

### Autenticación JWT
```typescript
// Interceptor de API para agregar token
private async getAuthHeaders(): Promise<Record<string, string>> {
  const token = await AsyncStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}
```

### Validación de Datos
```typescript
import { z } from 'zod';

const DriverSchema = z.object({
  name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().regex(/^\+?[\d\s-]+$/, 'Teléfono inválido'),
  licenseNumber: z.string().min(5, 'Número de licencia inválido'),
});

// Validar datos antes de enviar
const validatedData = DriverSchema.parse(driverData);
```

## 🐛 Debugging y Troubleshooting

### Herramientas de Debug
- **React Native Debugger**: Para debugging avanzado
- **Flipper**: Para inspección de red y estado
- **Metro**: Para debugging del bundler
- **Chrome DevTools**: Para debugging de JavaScript

### Logs y Monitoreo
```typescript
import { logConfig } from '../config/environment';

if (logConfig.enabled) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

// Logs estructurados
console.log('API Request', {
  endpoint: '/drivers',
  method: 'GET',
  timestamp: Date.now(),
  userId: user?.id
});
```

### Errores Comunes

#### Metro Bundler Issues
```bash
# Limpiar caché de Metro
npx react-native start --reset-cache

# Limpiar watchman
watchman watch-del-all
```

#### Dependencias Nativas
```bash
# Android
cd android && ./gradlew clean && cd ..

# iOS
cd ios && pod deintegrate && pod install && cd ..
```

## 📚 Recursos y Referencias

### Documentación Oficial
- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Herramientas de Desarrollo
- [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
- [Flipper](https://fbflipper.com/)
- [Metro](https://facebook.github.io/metro/)
- [Jest](https://jestjs.io/)

### Comunidad y Soporte
- [React Native Community](https://github.com/react-native-community)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/react-native)
- [Discord Reactiflux](https://discord.gg/reactiflux)

---

**Versión del Manual**: 1.0.0  
**Última Actualización**: Agosto 2024  
**Compatibilidad**: Renta Uber Mobile v1.0.0+