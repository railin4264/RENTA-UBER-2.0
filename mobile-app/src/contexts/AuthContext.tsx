import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isOnline: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  updateUser: (userData: Partial<User>) => void;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
  REFRESH_TOKEN: 'auth_refresh_token',
};

const API_BASE_URL = 'http://localhost:3001/api';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    isOnline: true,
  });

  // Verificar estado de conexión
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setAuthState(prev => ({ ...prev, isOnline: state.isConnected ?? false }));
    });

    return () => unsubscribe();
  }, []);

  // Verificar estado de autenticación al iniciar
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Verificar token expirado cada 5 minutos
  useEffect(() => {
    if (authState.token) {
      const interval = setInterval(() => {
        checkTokenExpiration();
      }, 5 * 60 * 1000); // 5 minutos

      return () => clearInterval(interval);
    }
  }, [authState.token]);

  const checkAuthStatus = async () => {
    try {
      const [token, userData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.USER),
      ]);

      if (token && userData) {
        const user = JSON.parse(userData);
        const isTokenValid = await validateToken(token);
        
        if (isTokenValid) {
          setAuthState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            isOnline: authState.isOnline,
          });
        } else {
          // Token expirado, intentar refresh
          const refreshed = await refreshToken();
          if (!refreshed) {
            await logout();
          }
        }
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const validateToken = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/validate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  };

  const checkTokenExpiration = async () => {
    if (!authState.token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/validate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authState.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const refreshed = await refreshToken();
        if (!refreshed) {
          await logout();
        }
      }
    } catch (error) {
      console.error('Error checking token expiration:', error);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      if (!authState.isOnline) {
        return { success: false, message: 'Sin conexión a internet. Verifica tu conexión.' };
      }

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const { token, user } = data.data;
        
        // Guardar en AsyncStorage
        await Promise.all([
          AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token),
          AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)),
        ]);

        setAuthState(prev => ({
          ...prev,
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        }));

        return { success: true, message: 'Inicio de sesión exitoso' };
      } else {
        return { success: false, message: data.error || 'Error en el inicio de sesión' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Error de conexión. Intenta nuevamente.' };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Llamar al endpoint de logout si hay conexión
      if (authState.token && authState.isOnline) {
        try {
          await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${authState.token}`,
              'Content-Type': 'application/json',
            },
          });
        } catch (error) {
          console.error('Error calling logout endpoint:', error);
        }
      }

      // Limpiar AsyncStorage
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.USER),
        AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
      ]);

      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        isOnline: authState.isOnline,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      
      if (!refreshToken) return false;

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        const { token, user } = data.data;

        await Promise.all([
          AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token),
          AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)),
        ]);

        setAuthState(prev => ({
          ...prev,
          user,
          token,
          isAuthenticated: true,
        }));

        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...userData };
      setAuthState(prev => ({ ...prev, user: updatedUser }));
      
      // Guardar en AsyncStorage
      AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    refreshToken,
    updateUser,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};