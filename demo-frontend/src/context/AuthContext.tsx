import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  avatar?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  user: User | null;
  login: (token: string, user?: User) => void;
  logout: () => void;
  getAuthHeaders: () => { [key: string]: string };
  checkAuthStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkAuthStatus = useCallback(async (): Promise<boolean> => {
    const storedToken = localStorage.getItem('authToken');
    
    if (!storedToken) {
      setIsLoading(false);
      return false;
    }

    try {
      // Verificar si el token es válido haciendo una petición al backend
      const response = await fetch('http://localhost:3001/api/auth/validate', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${storedToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setToken(storedToken);
          setUser(data.user);
          setIsAuthenticated(true);
          setIsLoading(false);
          return true;
        } else {
          // Token inválido, limpiar
          logout();
          return false;
        }
      } else {
        // Token inválido, limpiar
        logout();
        return false;
      }
    } catch (error) {
      console.error('Error verificando token:', error);
      logout();
      return false;
    }
  }, []);

  const login = (newToken: string, userData?: User) => {
    setToken(newToken);
    setUser(userData || null);
    setIsAuthenticated(true);
    localStorage.setItem('authToken', newToken);
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  };

  const getAuthHeaders = () => {
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  };

  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuthStatus();
    };

    initializeAuth();
  }, [checkAuthStatus]);

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    token,
    user,
    login,
    logout,
    getAuthHeaders,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 