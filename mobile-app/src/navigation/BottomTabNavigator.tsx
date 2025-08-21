import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import DashboardScreen from '../screens/DashboardScreen';
import DriversScreen from '../screens/DriversScreen';
import VehiclesScreen from '../screens/VehiclesScreen';
import PaymentsScreen from '../screens/PaymentsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;
          let label: string;

          if (route.name === 'Dashboard') {
            iconName = '📊';
            label = 'Dashboard';
          } else if (route.name === 'Drivers') {
            iconName = '👥';
            label = 'Choferes';
          } else if (route.name === 'Vehicles') {
            iconName = '🚗';
            label = 'Vehículos';
          } else if (route.name === 'Payments') {
            iconName = '💰';
            label = 'Pagos';
          } else if (route.name === 'Profile') {
            iconName = '👤';
            label = 'Perfil';
          }

          return (
            <View style={styles.tabItem}>
              <Text style={[styles.tabIcon, { fontSize: size, color }]}>
                {iconName}
              </Text>
              <Text style={[styles.tabLabel, { color, fontSize: 12 }]}>
                {label}
              </Text>
            </View>
          );
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          paddingBottom: 8,
          paddingTop: 8,
          height: 80,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          title: 'Dashboard',
        }}
      />
      <Tab.Screen 
        name="Drivers" 
        component={DriversScreen}
        options={{
          title: 'Choferes',
        }}
      />
      <Tab.Screen 
        name="Vehicles" 
        component={VehiclesScreen}
        options={{
          title: 'Vehículos',
        }}
      />
      <Tab.Screen 
        name="Payments" 
        component={PaymentsScreen}
        options={{
          title: 'Pagos',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: 'Perfil',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    marginBottom: 4,
  },
  tabLabel: {
    fontWeight: '500',
  },
});

export default TabNavigator;