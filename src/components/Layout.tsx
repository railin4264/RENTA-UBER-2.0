import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Users,
  Car,
  FileText,
  DollarSign,
  Receipt,
  Calculator,
  TrendingUp,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Bell,
  Search,
  FileText as LogsIcon
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import LogViewer from './LogViewer';
import NotificationCenter from './NotificationCenter';
import { useNotifications } from '../hooks/useNotifications';
import { Badge } from '../design-system/components';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logViewerOpen, setLogViewerOpen] = useState(false);
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);
  const [health, setHealth] = useState<'ok'|'error'|'idle'>('idle');
  const { state } = useApp();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const { unreadCount, hasUnread } = useNotifications();
  
  useEffect(() => {
    let mounted = true;
    const ping = async () => {
      try {
        const api = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
        const res = await fetch(`${api}/health`);
        if (!mounted) return;
        setHealth(res.ok ? 'ok' : 'error');
      } catch {
        if (!mounted) return;
        setHealth('error');
      }
    };
    ping();
    const id = setInterval(ping, 30000);
    return () => { mounted = false; clearInterval(id); };
  }, []);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Sesión cerrada correctamente');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/' },
    { id: 'drivers', label: 'Conductores', icon: Users, path: '/drivers' },
    { id: 'vehicles', label: 'Vehículos', icon: Car, path: '/vehicles' },
    { id: 'contracts', label: 'Contratos', icon: FileText, path: '/contracts' },
    { id: 'payments', label: 'Pagos', icon: DollarSign, path: '/payments' },
    { id: 'expenses', label: 'Gastos', icon: Receipt, path: '/expenses' },
    { id: 'accounting', label: 'Contabilidad', icon: Calculator, path: '/accounting' },
    { id: 'reports', label: 'Reportes', icon: TrendingUp, path: '/reports' },
    { id: 'settings', label: 'Configuración', icon: Settings, path: '/settings' }
  ];

  const currentPath = location.pathname;
  const currentMenuItem = menuItems.find(item => item.path === currentPath);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-card border-r border-gray-100 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:z-auto ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Renta Uber</h1>
              <p className="text-xs text-gray-500">Sistema de Gestión</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 border-r-2 border-brand-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-brand-600' : 'text-gray-400'}`} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-100 p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || 'Usuario'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || 'usuario@ejemplo.com'}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            {/* Left side - Mobile menu button and current page */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              <div className="hidden sm:block">
                <h2 className="text-xl font-semibold text-gray-900">
                  {currentMenuItem?.label || 'Dashboard'}
                </h2>
                <p className="text-sm text-gray-500">
                  {currentMenuItem?.description || 'Gestión del sistema'}
                </p>
              </div>
            </div>

            {/* Right side - Actions and user info */}
            <div className="flex items-center space-x-4">
              {/* Health Status */}
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  health === 'ok' ? 'bg-green-500' : 
                  health === 'error' ? 'bg-red-500' : 'bg-gray-400'
                }`} />
                <span className="text-xs text-gray-500 hidden sm:block">
                  {health === 'ok' ? 'Sistema OK' : 
                   health === 'error' ? 'Error de conexión' : 'Verificando...'}
                </span>
              </div>

              {/* Logs Button */}
              <button
                onClick={() => setLogViewerOpen(true)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                title="Ver logs del sistema"
              >
                <LogsIcon className="h-5 w-5" />
              </button>

              {/* Notifications Button */}
              <button
                onClick={() => setNotificationCenterOpen(true)}
                className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                title="Notificaciones"
              >
                <Bell className="h-5 w-5" />
                {hasUnread && (
                  <Badge
                    variant="error"
                    size="sm"
                    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-xs"
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Badge>
                )}
              </button>

              {/* Search Button */}
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors">
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Log Viewer Modal */}
      {logViewerOpen && (
        <LogViewer onClose={() => setLogViewerOpen(false)} />
      )}

      {/* Notification Center */}
      <NotificationCenter
        isOpen={notificationCenterOpen}
        onClose={() => setNotificationCenterOpen(false)}
      />
    </div>
  );
}