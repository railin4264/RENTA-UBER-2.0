import React, { useState, useEffect } from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Optional SplashScreen guard
let SplashScreen: { hide: () => void } | null = null;
try { SplashScreen = require('react-native-splash-screen'); } catch {}

// Screens
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import DriversScreen from './src/screens/DriversScreen';
import VehiclesScreen from './src/screens/VehiclesScreen';
import PaymentsScreen from './src/screens/PaymentsScreen';
import ExpensesScreen from './src/screens/ExpensesScreen';
import ReportsScreen from './src/screens/ReportsScreen';
import ContractsScreen from './src/screens/ContractsScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// Components
import { Icon } from './src/components/Icon';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Theme
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2563eb',
    accent: '#1e40af',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#1f2937',
    placeholder: '#9ca3af',
  },
};

// Main Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Dashboard':
              iconName = 'home';
              break;
            case 'Drivers':
              iconName = 'users';
              break;
            case 'Vehicles':
              iconName = 'car';
              break;
            case 'Payments':
              iconName = 'credit-card';
              break;
            case 'Expenses':
              iconName = 'receipt';
              break;
            case 'Reports':
              iconName = 'bar-chart-3';
              break;
            case 'Contracts':
              iconName = 'file-text';
              break;
            case 'Profile':
              iconName = 'user';
              break;
            default:
              iconName = 'circle';
          }

          return <Icon name={iconName} size={size} color={color} focused={focused} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.placeholder,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: '#e5e7eb',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen 
        name="Drivers" 
        component={DriversScreen}
        options={{ title: 'Choferes' }}
      />
      <Tab.Screen 
        name="Vehicles" 
        component={VehiclesScreen}
        options={{ title: 'Vehículos' }}
      />
      <Tab.Screen 
        name="Payments" 
        component={PaymentsScreen}
        options={{ title: 'Pagos' }}
      />
      <Tab.Screen 
        name="Expenses" 
        component={ExpensesScreen}
        options={{ title: 'Gastos' }}
      />
      <Tab.Screen 
        name="Reports" 
        component={ReportsScreen}
        options={{ title: 'Reportes' }}
      />
      <Tab.Screen 
        name="Contracts" 
        component={ContractsScreen}
        options={{ title: 'Contratos' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}

// Main App Component
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        // Verificar token con el backend
        const isValid = await verifyToken(token);
        setIsAuthenticated(isValid);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
      try { SplashScreen?.hide?.(); } catch {}
    }
  };

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return null; // Splash screen will be shown
  }

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isAuthenticated ? (
            <Stack.Screen name="Main" component={MainTabs} />
          ) : (
            <Stack.Screen name="Login">
              {(props) => (
                <LoginScreen 
                  {...props} 
                  onLoginSuccess={handleLoginSuccess}
                />
              )}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App; 