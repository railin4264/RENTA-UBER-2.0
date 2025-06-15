import React from 'react';
import { 
  Users, 
  Car, 
  DollarSign, 
  AlertTriangle,
  TrendingUp,
  Calendar,
  Clock,
  MapPin
} from 'lucide-react';

export default function Dashboard() {
  const stats = [
    {
      label: 'Choferes Activos',
      value: '24',
      icon: Users,
      color: 'bg-blue-500',
      change: '+2 este mes'
    },
    {
      label: 'Vehículos',
      value: '18',
      icon: Car,
      color: 'bg-emerald-500',
      change: '3 en mantenimiento'
    },
    {
      label: 'Ingresos Mensuales',
      value: 'RD$485,600',
      icon: DollarSign,
      color: 'bg-green-500',
      change: '+12% vs mes anterior'
    },
    {
      label: 'Deudas Pendientes',
      value: 'RD$28,400',
      icon: AlertTriangle,
      color: 'bg-orange-500',
      change: '5 casos pendientes'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Resumen general del sistema</p>
        </div>
        <div className="flex items-center space-x-3 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>Última actualización: {new Date().toLocaleDateString('es-ES')}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-2">{stat.change}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
          <div className="space-y-4">
            {[
              {
                type: 'payment',
                message: 'Pago recibido de Juan Pérez - RD$1,600',
                time: 'Hace 2 horas',
                color: 'text-green-600'
              },
              {
                type: 'expense',
                message: 'Gasto registrado: Mantenimiento ABC-123',
                time: 'Hace 4 horas',
                color: 'text-orange-600'
              },
              {
                type: 'driver',
                message: 'Nuevo chofer registrado: María González',
                time: 'Ayer',
                color: 'text-blue-600'
              },
              {
                type: 'vehicle',
                message: 'Vehículo DEF-456 fuera de servicio',
                time: 'Hace 2 días',
                color: 'text-red-600'
              }
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                <div className="w-2 h-2 rounded-full bg-gray-400 mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximos Vencimientos</h3>
          <div className="space-y-4">
            {[
              {
                driver: 'Carlos Martínez',
                plate: 'ABC-123',
                amount: 'RD$3,200',
                dueDate: '2025-01-15',
                status: 'warning'
              },
              {
                driver: 'Ana López',
                plate: 'DEF-456',
                amount: 'RD$1,600',
                dueDate: '2025-01-16',
                status: 'normal'
              },
              {
                driver: 'Roberto Silva',
                plate: 'GHI-789',
                amount: 'RD$4,800',
                dueDate: '2025-01-17',
                status: 'overdue'
              }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">{item.driver}</p>
                  <p className="text-sm text-gray-500">{item.plate}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{item.amount}</p>
                  <p className={`text-xs ${
                    item.status === 'overdue' ? 'text-red-600' :
                    item.status === 'warning' ? 'text-orange-600' : 'text-gray-500'
                  }`}>
                    {new Date(item.dueDate).toLocaleDateString('es-ES')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}