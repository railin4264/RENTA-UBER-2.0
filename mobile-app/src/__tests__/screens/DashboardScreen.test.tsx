import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import DashboardScreen from '../../screens/DashboardScreen';

// Mock de los hooks
jest.mock('../../hooks/useApi', () => ({
  useDashboard: () => ({
    data: {
      totalDrivers: 25,
      totalVehicles: 30,
      totalRevenue: 15000,
      monthlyGrowth: 12.5,
      recentActivities: [
        { id: 1, type: 'driver_added', message: 'Nuevo conductor registrado' },
        { id: 2, type: 'payment_received', message: 'Pago recibido' },
      ],
      upcomingPayments: [
        { id: 1, amount: 500, dueDate: '2024-02-01', driver: 'Juan Pérez' },
      ],
    },
    loading: false,
    error: null,
  }),
  useRealtimeSync: () => [{
    data: null,
    loading: false,
    error: null,
  }, jest.fn()],
}));

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 1, name: 'Admin', email: 'admin@example.com' },
    isAuthenticated: true,
    isLoading: false,
  }),
}));

describe('DashboardScreen Component', () => {
  it('renders dashboard metrics correctly', () => {
    const { getByText } = render(
      <SafeAreaProvider>
        <DashboardScreen />
      </SafeAreaProvider>
    );
    
    expect(getByText('25')).toBeTruthy(); // Total drivers
    expect(getByText('30')).toBeTruthy(); // Total vehicles
    expect(getByText('$15,000')).toBeTruthy(); // Total revenue
    expect(getByText('12.5%')).toBeTruthy(); // Monthly growth
  });

  it('displays recent activities', () => {
    const { getByText } = render(
      <SafeAreaProvider>
        <DashboardScreen />
      </SafeAreaProvider>
    );
    
    expect(getByText('Nuevo conductor registrado')).toBeTruthy();
    expect(getByText('Pago recibido')).toBeTruthy();
  });

  it('shows upcoming payments', () => {
    const { getByText } = render(
      <SafeAreaProvider>
        <DashboardScreen />
      </SafeAreaProvider>
    );
    
    expect(getByText('Juan Pérez')).toBeTruthy();
    expect(getByText('$500')).toBeTruthy();
    expect(getByText('01/02/2024')).toBeTruthy();
  });

  it('handles refresh correctly', async () => {
    const mockRefresh = jest.fn();
    const { getByTestId } = render(
      <SafeAreaProvider>
        <DashboardScreen />
      </SafeAreaProvider>
    );
    
    const scrollView = getByTestId('dashboard-scroll');
    fireEvent.scroll(scrollView, {
      nativeEvent: {
        contentOffset: { y: 0 },
        contentSize: { height: 1000, width: 400 },
        layoutMeasurement: { height: 800, width: 400 },
      },
    });
    
    await waitFor(() => {
      expect(mockRefresh).toHaveBeenCalled();
    });
  });
});