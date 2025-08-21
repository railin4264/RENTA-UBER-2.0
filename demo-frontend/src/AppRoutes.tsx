import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import DriverManagement from './components/DriverManagement';
import VehicleManagement from './components/VehicleManagement';
import ContractManagement from './components/ContractManagement';
import PaymentManagement from './components/PaymentManagement';
import ExpenseManagement from './components/ExpenseManagement';
import AccountingSystem from './components/AccountingSystem';
import AdvancedReports from './components/AdvancedReports';
import NotificationSystem from './components/NotificationSystem';
import LoadingSpinner from './components/LoadingSpinner';
import { useAuth } from './context/AuthContext';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

function AppRoutes() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, login, user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const handleLoginSuccess = (token: string) => {
    // Extraer información del usuario del token o hacer una petición adicional
    login(token, { email: 'admin@renta-uber.com', name: 'Administrador' });
    navigate('/');
    // Add welcome notification
    addNotification({
      type: 'success',
      title: 'Bienvenido',
      message: 'Has iniciado sesión correctamente',
      timestamp: new Date(),
      read: false
    });
  };

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const handleNotificationAction = (notification: Notification) => {
    // Handle notification actions
    console.log('Notification action:', notification);
  };

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, mostrar login
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={
          <Layout>
            <Dashboard />
          </Layout>
        } />
        <Route path="/drivers" element={
          <Layout>
            <DriverManagement />
          </Layout>
        } />
        <Route path="/vehicles" element={
          <Layout>
            <VehicleManagement />
          </Layout>
        } />
        <Route path="/contracts" element={
          <Layout>
            <ContractManagement />
          </Layout>
        } />
        <Route path="/payments" element={
          <Layout>
            <PaymentManagement />
          </Layout>
        } />
        <Route path="/expenses" element={
          <Layout>
            <ExpenseManagement />
          </Layout>
        } />
        <Route path="/accounting" element={
          <Layout>
            <AccountingSystem />
          </Layout>
        } />
        <Route path="/reports" element={
          <Layout>
            <AdvancedReports />
          </Layout>
        } />
        <Route path="/settings" element={
          <Layout>
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Configuración</h1>
                <p className="text-gray-600 mt-1">Configuración del sistema</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <p className="text-gray-600">Configuración en desarrollo...</p>
              </div>
            </div>
          </Layout>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {/* Notification System */}
      <NotificationSystem 
        notifications={notifications}
        onMarkAsRead={markAsRead}
        onDelete={deleteNotification}
        onClearAll={clearAllNotifications}
        onAction={handleNotificationAction}
      />
    </div>
  );
}

export default AppRoutes; 