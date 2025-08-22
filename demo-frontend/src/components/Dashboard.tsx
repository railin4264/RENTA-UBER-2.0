import { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  Car, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  RefreshCw,
  Calendar,
  Clock,
  Activity
} from 'lucide-react';
import { apiService } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import { toast } from 'react-hot-toast';

interface DashboardStats {
  activeDrivers: number;
  totalVehicles: number;
  monthlyIncome: number;
  pendingDebts: number;
  activeContracts: number;
  vehiclesInMaintenance: number;
  incomeGrowth: number;
  pendingCases: number;
}

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  amount?: number;
  timestamp: string;
}

interface UpcomingPayment {
  id: string;
  driverName: string;
  amount: number;
  dueDate: string;
}

interface DashboardData {
  stats: DashboardStats;
  recentActivities: RecentActivity[];
  upcomingPayments: UpcomingPayment[];
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const loadDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getDashboardData();
      
      if (response.success && response.data) {
        setData(response.data);
        setLastRefresh(new Date());
      } else {
        toast.error(response.error || 'Error al cargar datos del dashboard');
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('Error de conexión al cargar el dashboard');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleRefresh = () => {
    loadDashboardData();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-DO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading && !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar datos</h3>
          <p className="text-gray-600 mb-4">No se pudieron cargar los datos del dashboard</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Resumen general del sistema</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            Última actualización: {formatDate(lastRefresh.toISOString())}
          </span>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conductores Activos</p>
              <p className="text-2xl font-bold text-gray-900">{data.stats.activeDrivers}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Vehículos</p>
              <p className="text-2xl font-bold text-gray-900">{data.stats.totalVehicles}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Car className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos Mensuales</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.stats.monthlyIncome)}</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-500">+{data.stats.incomeGrowth}%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Deudas Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.stats.pendingDebts)}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Actividades Recientes</h2>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          
          {data.recentActivities.length > 0 ? (
            <div className="space-y-4">
              {data.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'payment' ? 'bg-green-100' :
                    activity.type === 'contract' ? 'bg-blue-100' :
                    'bg-orange-100'
                  }`}>
                    {activity.type === 'payment' && <DollarSign className="w-4 h-4 text-green-600" />}
                    {activity.type === 'contract' && <Users className="w-4 h-4 text-blue-600" />}
                    {activity.type === 'maintenance' && <Car className="w-4 h-4 text-orange-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500">{formatDate(activity.timestamp)}</p>
                  </div>
                  {activity.amount && (
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(activity.amount)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hay actividades recientes</p>
            </div>
          )}
        </div>

        {/* Upcoming Payments */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Pagos Próximos</h2>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          
          {data.upcomingPayments.length > 0 ? (
            <div className="space-y-4">
              {data.upcomingPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{payment.driverName}</p>
                    <p className="text-xs text-gray-500">{formatDate(payment.dueDate)}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(payment.amount)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hay pagos próximos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}