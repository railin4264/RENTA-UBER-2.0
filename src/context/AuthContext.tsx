import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  user: any | null;
  login: (token: string, user?: any) => void;
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
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkAuthStatus = async (): Promise<boolean> => {
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
        setToken(storedToken);
        setUser(data.user || null);
        setIsAuthenticated(true);
        setIsLoading(false);
        return true;
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
  };

  const login = (newToken: string, userData?: any) => {
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
  }, []);

  // Refresco automático del token cada 14 minutos
  useEffect(() => {
    if (!token) return;

    const refreshInterval = setInterval(async () => {
      try {
        const res = await fetch('http://localhost:3001/api/auth/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken: token })
        });

        if (res.ok) {
          const data = await res.json();
          if (data?.data?.accessToken) {
            login(data.data.accessToken, data.data.user);
          }
        } else {
          console.warn('Fallo al refrescar token, cerrando sesión');
          logout();
        }
      } catch (err) {
        console.error('Error refrescando token', err);
        logout();
      }
    }, 14 * 60 * 1000); // 14 minutos

    return () => clearInterval(refreshInterval);
  }, [token]);

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