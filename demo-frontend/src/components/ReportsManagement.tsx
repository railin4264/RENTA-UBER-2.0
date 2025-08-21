import React, { useState } from 'react';
import { 
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Download,
  Filter,
  BarChart3,
  PieChart,
  FileText,
  Users,
  Car,
  AlertTriangle
} from 'lucide-react';

export default function ReportsManagement() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [reportType, setReportType] = useState<'monthly' | 'driver' | 'vehicle'>('monthly');

  // Mock data for reports
  const monthlyData = {
    income: 485600,
    expenses: 125400,
    profit: 360200,
    drivers: 24,
    activeVehicles: 18,
    payments: 156,
    pendingDebts: 28400
  };

  const driverReports = [
    {
      name: 'Carlos Martínez',
      plate: 'ABC-123',
      totalPayments: 48000,
      pendingDebt: 3200,
      lastPayment: '2025-01-10',
      status: 'warning'
    },
    {
      name: 'Ana López',
      plate: 'DEF-456',
      totalPayments: 32000,
      pendingDebt: 1600,
      lastPayment: '2025-01-12',
      status: 'good'
    },
    {
      name: 'Roberto Silva',
      plate: 'GHI-789',
      totalPayments: 0,
      pendingDebt: 4800,
      lastPayment: null,
      status: 'critical'
    }
  ];

  const vehicleReports = [
    {
      plate: 'ABC-123',
      model: 'Toyota Corolla 2020',
      driver: 'Carlos Martínez',
      totalExpenses: 15600,
      lastMaintenance: '2024-12-15',
      status: 'active'
    },
    {
      plate: 'DEF-456',
      model: 'Nissan Sentra 2019',
      driver: 'Ana López',
      totalExpenses: 8900,
      lastMaintenance: '2024-12-20',
      status: 'active'
    },
    {
      plate: 'GHI-789',
      model: 'Honda Civic 2021',
      driver: 'Roberto Silva',
      totalExpenses: 25400,
      lastMaintenance: '2024-11-30',
      status: 'maintenance'
    }
  ];

  const exportReport = (type: string) => {
    // Mock export functionality
    console.log(`Exporting ${type} report for ${selectedMonth}`);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reportes y Estados de Cuenta</h1>
          <p className="text-gray-600 mt-1">Análisis detallado de ingresos, gastos y rendimiento</p>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={() => exportReport('complete')}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setReportType('monthly')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                reportType === 'monthly'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Reporte Mensual</span>
              </div>
            </button>
            <button
              onClick={() => setReportType('driver')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                reportType === 'driver'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Por Chofer</span>
              </div>
            </button>
            <button
              onClick={() => setReportType('vehicle')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                reportType === 'vehicle'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Car className="w-4 h-4" />
                <span>Por Vehículo</span>
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {reportType === 'monthly' && (
            <div className="space-y-8">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Ingresos Totales</p>
                      <p className="text-2xl font-bold">RD${monthlyData.income.toLocaleString()}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100">Gastos Totales</p>
                      <p className="text-2xl font-bold">RD${monthlyData.expenses.toLocaleString()}</p>
                    </div>
                    <TrendingDown className="w-8 h-8 text-red-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Ganancia Neta</p>
                      <p className="text-2xl font-bold">RD${monthlyData.profit.toLocaleString()}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-blue-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100">Deudas Pendientes</p>
                      <p className="text-2xl font-bold">RD${monthlyData.pendingDebts.toLocaleString()}</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-orange-200" />
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Ingresos vs Gastos
                  </h3>
                  <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500">Gráfico de barras - Ingresos vs Gastos</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <PieChart className="w-5 h-5 mr-2" />
                    Distribución de Gastos
                  </h3>
                  <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500">Gráfico circular - Tipos de gastos</p>
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Desglose Detallado</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Users className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{monthlyData.drivers}</p>
                    <p className="text-sm text-gray-600">Choferes Activos</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Car className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{monthlyData.activeVehicles}</p>
                    <p className="text-sm text-gray-600">Vehículos Activos</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <FileText className="w-8 h-8 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{monthlyData.payments}</p>
                    <p className="text-sm text-gray-600">Pagos Procesados</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {reportType === 'driver' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Reporte por Chofer</h3>
                <button
                  onClick={() => exportReport('drivers')}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Exportar</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Chofer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vehículo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Pagos
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Deuda Pendiente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Último Pago
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {driverReports.map((driver, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {driver.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {driver.plate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                          RD${driver.totalPayments.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">
                          RD${driver.pendingDebt.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {driver.lastPayment ? new Date(driver.lastPayment).toLocaleDateString('es-ES') : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            driver.status === 'good' ? 'bg-green-100 text-green-800' :
                            driver.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {driver.status === 'good' ? 'Al día' :
                             driver.status === 'warning' ? 'Atención' : 'Crítico'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {reportType === 'vehicle' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Reporte por Vehículo</h3>
                <button
                  onClick={() => exportReport('vehicles')}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Exportar</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Placa
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Modelo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Chofer Asignado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gastos Totales
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Último Mantenimiento
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {vehicleReports.map((vehicle, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {vehicle.plate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {vehicle.model}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {vehicle.driver}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">
                          RD${vehicle.totalExpenses.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(vehicle.lastMaintenance).toLocaleDateString('es-ES')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            vehicle.status === 'active' ? 'bg-green-100 text-green-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {vehicle.status === 'active' ? 'Activo' : 'Mantenimiento'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}