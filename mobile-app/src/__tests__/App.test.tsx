import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AuthProvider } from '../contexts/AuthContext';
import App from '../App';

// Mock de las dependencias nativas
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: any) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(),
  fetch: jest.fn(() => Promise.resolve({ isConnected: true })),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

describe('App Component', () => {
  it('renders without crashing', () => {
    const { getByText } = render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );
    
    expect(getByText('Renta Uber')).toBeTruthy();
  });

  it('shows login screen when not authenticated', () => {
    const { getByPlaceholderText, getByText } = render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );
    
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Iniciar Sesión')).toBeTruthy();
  });
});