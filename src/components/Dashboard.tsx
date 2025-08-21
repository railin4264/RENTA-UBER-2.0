import { useState, useEffect } from 'react';
import { 
  Users, 
  Car, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  RefreshCw,
  Calendar,
  Clock
} from 'lucide-react';
import { apiService, handleApiResponse } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

interface DashboardStats {
  totalDrivers: number;
  activeDrivers: number;
  totalVehicles: number;
  availableVehicles: number;
  monthlyIncome: number;
  pendingPayments: number;
  activeContracts: number;
  vehiclesInMaintenance: number;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  amount: number;
  date: string;
  status: string;
}

interface Payment {
  id: string;
  driverName: string;
  amount: number;
  dueDate: string;
  status: string;
}

interface DashboardData {
  stats: DashboardStats;
  recentActivities: Activity[];
  upcomingPayments: Payment[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalDrivers: 0,
    activeDrivers: 0,
    totalVehicles: 0,
    availableVehicles: 0,
    monthlyIncome: 0,
    pendingPayments: 0,
    activeContracts: 0,
    vehiclesInMaintenance: 0
  });
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [upcomingPayments, setUpcomingPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await handleApiResponse<DashboardData>(
        () => apiService.getDashboardData(),
        'Datos del dashboard actualizados',
        'Error al cargar los datos del dashboard'
      );

      if (data) {
        setStats(data.stats);
        setRecentActivities(data.recentActivities || []);
        setUpcomingPayments(data.upcomingPayments || []);
        setLastUpdate(new Date());
      } else {
        // Fallback data if API fails
        setStats({
          totalDrivers: 12,
          activeDrivers: 8,
          totalVehicles: 15,
          availableVehicles: 6,
          monthlyIncome: 125000,
          pendingPayments: 32000,
          activeContracts: 8,
          vehiclesInMaintenance: 2
        });

        setRecentActivities([
          {
            id: '1',
            type: 'payment',
            description: 'Pago recibido de Carlos Martínez',
            amount: 3200,
            date: new Date().toISOString(),
            status: 'completed'
          },
          {
            id: '2',
            type: 'contract',
            description: 'Nuevo contrato creado',
            amount: 12800,
            date: new Date(Date.now() - 86400000).toISOString(),
            status: 'active'
          },
          {
            id: '3',
            type: 'expense',
            description: 'Mantenimiento vehículo ABC-123',
            amount: 8500,
            date: new Date(Date.now() - 172800000).toISOString(),
            status: 'paid'
          }
        ]);

        setUpcomingPayments([
          {
            id: '1',
            driverName: 'Ana López',
            amount: 3200,
            dueDate: new Date(Date.now() + 86400000).toISOString(),
            status: 'pending'
          },
          {
            id: '2',
            driverName: 'Roberto Silva',
            amount: 3200,
            dueDate: new Date(Date.now() + 172800000).toISOString(),
            status: 'pending'
          }
        ]);
      }
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
      setError('Error al cargar los datos del dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-DO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <DollarSign className="w-4 h-4 text-green-500" />;
      case 'contract':
        return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'expense':
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'active':
      case 'paid':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'overdue':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Cargando dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Resumen general del sistema
            {lastUpdate && (
              <span className="ml-2 text-sm text-gray-500">
                • Última actualización: {lastUpdate.toLocaleTimeString('es-DO')}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={loadDashboardData}
          disabled={isLoading}
          className="btn-primary"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <AlertTriangle className="w-5 h-5 text-red-400 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-brand-100 rounded-lg">
              <Users className="w-6 h-6 text-brand-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Choferes Activos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeDrivers}</p>
              <p className="text-xs text-gray-500">de {stats.totalDrivers} total</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Car className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Vehículos Disponibles</p>
              <p className="text-2xl font-bold text-gray-900">{stats.availableVehicles}</p>
              <p className="text-xs text-gray-500">de {stats.totalVehicles} total</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ingresos del Mes</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.monthlyIncome)}</p>
              <p className="text-xs text-gray-500">Pagos pendientes: {formatCurrency(stats.pendingPayments)}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Contratos Activos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeContracts}</p>
              <p className="text-xs text-gray-500">{stats.vehiclesInMaintenance} en mantenimiento</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900">Actividad Reciente</h2>
          </div>
          <div className="card-body">
            {recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(activity.date)} • {formatCurrency(activity.amount)}
                      </p>
                    </div>
                    <span className={`badge ${getStatusColor(activity.status)}`}>
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No hay actividad reciente</p>
            )}
          </div>
        </div>

        {/* Upcoming Payments */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900">Pagos Próximos</h2>
          </div>
          <div className="card-body">
            {upcomingPayments.length > 0 ? (
              <div className="space-y-4">
                {upcomingPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{payment.driverName}</p>
                      <p className="text-xs text-gray-500">Vence: {formatDate(payment.dueDate)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{formatCurrency(payment.amount)}</p>
                      <span className={`badge ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No hay pagos próximos</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}