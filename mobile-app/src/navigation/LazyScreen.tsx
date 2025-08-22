import React, { Suspense, lazy } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

interface LazyScreenProps {
  screenName: string;
  fallback?: React.ReactNode;
}

const LazyScreen: React.FC<LazyScreenProps> = ({ 
  screenName, 
  fallback 
}) => {
  const ScreenComponent = lazy(() => {
    return new Promise((resolve) => {
      // Simular delay de carga para demostrar lazy loading
      setTimeout(() => {
        switch (screenName) {
          case 'Dashboard':
            resolve(import('../screens/DashboardScreen'));
            break;
          case 'Drivers':
            resolve(import('../screens/DriversScreen'));
            break;
          case 'Vehicles':
            resolve(import('../screens/VehiclesScreen'));
            break;
          case 'Payments':
            resolve(import('../screens/PaymentsScreen'));
            break;
          case 'Expenses':
            resolve(import('../screens/ExpensesScreen'));
            break;
          case 'Contracts':
            resolve(import('../screens/ContractsScreen'));
            break;
          case 'Reports':
            resolve(import('../screens/ReportsScreen'));
            break;
          case 'Profile':
            resolve(import('../screens/ProfileScreen'));
            break;
          case 'Settings':
            resolve(import('../screens/SettingsScreen'));
            break;
          default:
            resolve(import('../screens/DashboardScreen'));
        }
      }, 100);
    });
  });

  const defaultFallback = (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#3b82f6" />
      <Text style={styles.loadingText}>Cargando {screenName}...</Text>
    </View>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      <ScreenComponent />
    </Suspense>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
  },
});

export default LazyScreen;