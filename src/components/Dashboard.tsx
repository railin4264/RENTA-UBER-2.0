import { useState, useEffect } from 'react';
import { 
  Users, 
  Car, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  RefreshCw,
  Calendar,
  Clock,
  TrendingDown,
  Activity,
  FileText,
  Shield,
  Wrench,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { apiService, handleApiResponse } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import { Card, Badge } from '../design-system/components';
import { useSystemNotifications } from '../hooks/useNotifications';

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

// Componente de métrica individual
const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue, 
  status, 
  onClick 
}: {
  title: string;
  value: string | number;
  icon: any;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  status?: 'success' | 'warning' | 'error' | 'info';
  onClick?: () => void;
}) => {
  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4" />;
    return null;
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success': return 'border-green-200 bg-green-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'error': return 'border-red-200 bg-red-50';
      case 'info': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-white';
    }
  };

  return (
    <Card
      className={`transition-all duration-200 hover:shadow-lg ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      padding="lg"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className={`p-2 rounded-lg ${getStatusColor()}`}>
              <Icon className="h-6 w-6 text-gray-600" />
            </div>
            <div className="flex items-center space-x-2">
              {trend && trendValue && (
                <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
                  {getTrendIcon()}
                  <span className="text-sm font-medium">{trendValue}</span>
                </div>
              )}
            </div>
          </div>
          
          <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </Card>
  );
};

// Componente de actividad reciente
const ActivityItem = ({ activity }: { activity: Activity }) => {
  const getStatusIcon = () => {
    switch (activity.status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (activity.status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex-shrink-0">
        {getStatusIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {activity.description}
        </p>
        <p className="text-sm text-gray-500">
          {new Date(activity.date).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <Badge variant="neutral" size="sm" className={getStatusColor()}>
          {activity.status}
        </Badge>
        {activity.amount > 0 && (
          <span className="text-sm font-medium text-gray-900">
            ${activity.amount.toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
};

// Componente de pagos próximos
const PaymentItem = ({ payment }: { payment: Payment }) => {
  const isOverdue = new Date(payment.dueDate) < new Date();
  const isDueSoon = new Date(payment.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const getStatusColor = () => {
    if (isOverdue) return 'bg-red-100 text-red-800 border-red-200';
    if (isDueSoon) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getStatusText = () => {
    if (isOverdue) return 'Vencido';
    if (isDueSoon) return 'Próximo a vencer';
    return 'Al día';
  };

  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <Users className="h-5 w-5 text-gray-400" />
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-900">{payment.driverName}</p>
          <p className="text-sm text-gray-500">
            Vence: {new Date(payment.dueDate).toLocaleDateString('es-ES')}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <Badge variant="neutral" size="sm" className={getStatusColor()}>
          {getStatusText()}
        </Badge>
        <span className="text-sm font-medium text-gray-900">
          ${payment.amount.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

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
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { showSuccess, showError } = useSystemNotifications();

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
        showSuccess('Dashboard', 'Datos actualizados correctamente');
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
            description: 'Pago recibido de Juan Pérez',
            amount: 15000,
            date: new Date().toISOString(),
            status: 'completed'
          },
          {
            id: '2',
            type: 'expense',
            description: 'Mantenimiento vehículo ABC-123',
            amount: 25000,
            date: new Date(Date.now() - 86400000).toISOString(),
            status: 'pending'
          }
        ]);

        setUpcomingPayments([
          {
            id: '1',
            driverName: 'María González',
            amount: 18000,
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'pending'
          }
        ]);

        setLastUpdate(new Date());
        showError('Dashboard', 'Usando datos de ejemplo - API no disponible');
      }
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
      showError('Dashboard', 'Error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboardData();
    setIsRefreshing(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar el dashboard</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button
          onClick={loadDashboardData}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header del Dashboard */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Resumen general del sistema
            {lastUpdate && (
              <span className="ml-2 text-sm text-gray-500">
                • Última actualización: {lastUpdate.toLocaleTimeString('es-ES')}
              </span>
            )}
          </p>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Conductores Activos"
          value={stats.activeDrivers}
          icon={Users}
          trend="up"
          trendValue="+12%"
          status="success"
        />
        
        <MetricCard
          title="Vehículos Disponibles"
          value={stats.availableVehicles}
          icon={Car}
          trend="down"
          trendValue="-5%"
          status="warning"
        />
        
        <MetricCard
          title="Ingresos Mensuales"
          value={`$${stats.monthlyIncome.toLocaleString()}`}
          icon={DollarSign}
          trend="up"
          trendValue="+8%"
          status="success"
        />
        
        <MetricCard
          title="Contratos Activos"
          value={stats.activeContracts}
          icon={FileText}
          trend="neutral"
          status="info"
        />
      </div>

      {/* Métricas secundarias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Total Conductores"
          value={stats.totalDrivers}
          icon={Users}
          status="info"
        />
        
        <MetricCard
          title="Vehículos en Mantenimiento"
          value={stats.vehiclesInMaintenance}
          icon={Wrench}
          status="warning"
        />
        
        <MetricCard
          title="Pagos Pendientes"
          value={`$${stats.pendingPayments.toLocaleString()}`}
          icon={AlertTriangle}
          status="error"
        />
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actividades Recientes */}
        <Card header={<h3 className="text-lg font-medium text-gray-900">Actividades Recientes</h3>}>
          <div className="space-y-1">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No hay actividades recientes</p>
              </div>
            )}
          </div>
        </Card>

        {/* Pagos Próximos */}
        <Card header={<h3 className="text-lg font-medium text-gray-900">Pagos Próximos</h3>}>
          <div className="space-y-1">
            {upcomingPayments.length > 0 ? (
              upcomingPayments.map((payment) => (
                <PaymentItem key={payment.id} payment={payment} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <DollarSign className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No hay pagos próximos</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Acciones rápidas */}
      <Card header={<h3 className="text-lg font-medium text-gray-900">Acciones Rápidas</h3>}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 text-center hover:bg-gray-50 rounded-lg transition-colors">
            <Users className="h-8 w-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Nuevo Conductor</span>
          </button>
          
          <button className="flex flex-col items-center p-4 text-center hover:bg-gray-50 rounded-lg transition-colors">
            <Car className="h-8 w-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Nuevo Vehículo</span>
          </button>
          
          <button className="flex flex-col items-center p-4 text-center hover:bg-gray-50 rounded-lg transition-colors">
            <FileText className="h-8 w-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Nuevo Contrato</span>
          </button>
          
          <button className="flex flex-col items-center p-4 text-center hover:bg-gray-50 rounded-lg transition-colors">
            <DollarSign className="h-8 w-8 text-yellow-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Registrar Pago</span>
          </button>
        </div>
      </Card>
    </div>
  );
}