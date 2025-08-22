import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Filter,
  RefreshCw,
  Eye,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Users,
  Car,
  Clock
} from 'lucide-react';

interface ReportData {
  id: string;
  title: string;
  type: 'financial' | 'operational' | 'analytical' | 'predictive';
  description: string;
  lastGenerated: Date;
  status: 'ready' | 'generating' | 'error';
  data?: {
    totalIncome?: number;
    totalExpenses?: number;
    profitMargin?: number;
    activeDrivers?: number;
    totalTrips?: number;
    inService?: number;
    maintenance?: number;
    outOfService?: number;
    nextMonthProjection?: number;
    confidenceLevel?: number;
    [key: string]: string | number | undefined;
  };
  filters: Record<string, string | number | boolean>;
}

export default function AdvancedReports() {
  const { getAuthHeaders } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'financial' | 'operational' | 'analytical'>('overview');
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dateRange, setDateRange] = useState('month');
  const [showFilters, setShowFilters] = useState(false);

  const fetchDashboardReport = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:3001/api/reports/dashboard', {
        headers: getAuthHeaders()
      });
      const json = await res.json();
      if (res.ok && json.success) {
        // dashboardData is available for future use
        console.log('Dashboard data loaded:', json.data);
      } else {
        toast.error(json.message || 'No se pudo cargar el reporte de dashboard');
      }
    } catch {
      toast.error('Error de conexión al cargar reportes');
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    fetchDashboardReport();
  }, [fetchDashboardReport]);

  const reports: ReportData[] = [
    {
      id: '1',
      title: 'Reporte de Rentabilidad',
      type: 'financial',
      description: 'Análisis detallado de ingresos, gastos y márgenes de beneficio',
      lastGenerated: new Date(),
      status: 'ready',
      data: {
        totalIncome: 485600,
        totalExpenses: 234800,
        profitMargin: 51.7,
        growthRate: 12.5
      },
      filters: { period: 'month', category: 'all' }
    },
    {
      id: '2',
      title: 'Análisis de Conductores',
      type: 'operational',
      description: 'Rendimiento y estadísticas de conductores activos',
      lastGenerated: new Date(Date.now() - 86400000),
      status: 'ready',
      data: {
        activeDrivers: 24,
        totalTrips: 1250,
        averageRating: 4.8,
        topPerformer: 'Carlos Martínez'
      },
      filters: { driverStatus: 'active', period: 'month' }
    },
    {
      id: '3',
      title: 'Estado de Vehículos',
      type: 'operational',
      description: 'Mantenimiento y disponibilidad de la flota',
      lastGenerated: new Date(Date.now() - 172800000),
      status: 'ready',
      data: {
        totalVehicles: 18,
        inService: 15,
        maintenance: 2,
        outOfService: 1
      },
      filters: { vehicleStatus: 'all', maintenanceType: 'all' }
    },
    {
      id: '4',
      title: 'Proyección de Ingresos',
      type: 'predictive',
      description: 'Análisis predictivo basado en datos históricos',
      lastGenerated: new Date(Date.now() - 259200000),
      status: 'ready',
      data: {
        nextMonthProjection: 520000,
        confidenceLevel: 85,
        growthTrend: 'positive',
        riskFactors: ['seasonal_variation', 'market_competition']
      },
      filters: { predictionPeriod: '3months', confidenceLevel: 85 }
    }
  ];

  const generateReport = async () => {
    setIsGenerating(true);
    // Simular generación de reporte
    setTimeout(() => {
      setIsGenerating(false);
      toast.success('Reporte generado exitosamente');
    }, 2000);
  };

  const exportReport = (report: ReportData, format: 'pdf' | 'excel' | 'csv') => {
    console.log(`Exportando reporte ${report.title} en formato ${format}`);
    // Aquí implementarías la lógica de exportación
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'text-green-600 bg-green-100';
      case 'generating':
        return 'text-yellow-600 bg-yellow-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="w-4 h-4" />;
      case 'generating':
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Reportes Avanzados</h1>
          <p className="text-gray-600 mt-1">Análisis detallado y proyecciones del negocio</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
            <option value="quarter">Este trimestre</option>
            <option value="year">Este año</option>
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Filtros"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Resumen', icon: BarChart3 },
              { id: 'financial', label: 'Financieros', icon: DollarSign },
              { id: 'operational', label: 'Operacionales', icon: Users },
              { id: 'analytical', label: 'Analíticos', icon: TrendingUp }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'overview' | 'financial' | 'operational' | 'analytical')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(485600)}</p>
                      <p className="text-xs text-gray-500">+12.5% vs período anterior</p>
                    </div>
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Conductores Activos</p>
                      <p className="text-2xl font-bold text-blue-600">24</p>
                      <p className="text-xs text-gray-500">+2 este mes</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Vehículos en Servicio</p>
                      <p className="text-2xl font-bold text-emerald-600">15/18</p>
                      <p className="text-xs text-gray-500">83% disponibilidad</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center">
                      <Car className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Margen de Beneficio</p>
                      <p className="text-2xl font-bold text-purple-600">51.7%</p>
                      <p className="text-xs text-gray-500">+2.3% vs mes anterior</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Reports Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {reports.map((report) => (
                  <div key={report.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                      </div>
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {getStatusIcon(report.status)}
                        <span>
                          {report.status === 'ready' ? 'Listo' :
                           report.status === 'generating' ? 'Generando' : 'Error'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      {report.type === 'financial' && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Ingresos</p>
                            <p className="text-sm font-semibold text-green-600">{formatCurrency(report.data?.totalIncome || 0)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Margen</p>
                            <p className="text-sm font-semibold text-blue-600">{report.data?.profitMargin || 0}%</p>
                          </div>
                        </div>
                      )}

                      {report.type === 'operational' && report.id === '2' && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Conductores</p>
                            <p className="text-sm font-semibold text-blue-600">{report.data?.activeDrivers || 0}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Viajes</p>
                            <p className="text-sm font-semibold text-green-600">{report.data?.totalTrips || 0}</p>
                          </div>
                        </div>
                      )}

                      {report.type === 'operational' && report.id === '3' && (
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">En Servicio</p>
                            <p className="text-sm font-semibold text-green-600">{report.data?.inService || 0}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Mantenimiento</p>
                            <p className="text-sm font-semibold text-orange-600">{report.data?.maintenance || 0}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Fuera de Servicio</p>
                            <p className="text-sm font-semibold text-red-600">{report.data?.outOfService || 0}</p>
                          </div>
                        </div>
                      )}

                      {report.type === 'predictive' && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Proyección</p>
                            <p className="text-sm font-semibold text-purple-600">{formatCurrency(report.data?.nextMonthProjection || 0)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Confianza</p>
                            <p className="text-sm font-semibold text-blue-600">{report.data?.confidenceLevel || 0}%</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Última actualización: {report.lastGenerated.toLocaleDateString('es-ES')}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => generateReport()}
                          disabled={isGenerating}
                          className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
                          title="Generar reporte"
                        >
                          <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                          onClick={() => exportReport(report, 'pdf')}
                          className="p-1 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded transition-colors"
                          title="Exportar PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'financial' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Reportes Financieros</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Análisis de Ingresos</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Ingresos por Rentas</span>
                      <span className="font-semibold text-green-600">{formatCurrency(485600)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Otros Ingresos</span>
                      <span className="font-semibold text-blue-600">{formatCurrency(25000)}</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">Total Ingresos</span>
                        <span className="font-bold text-green-600">{formatCurrency(510600)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Análisis de Gastos</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Mantenimiento</span>
                      <span className="font-semibold text-red-600">{formatCurrency(85000)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Combustible</span>
                      <span className="font-semibold text-red-600">{formatCurrency(65000)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Seguros</span>
                      <span className="font-semibold text-red-600">{formatCurrency(45000)}</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">Total Gastos</span>
                        <span className="font-bold text-red-600">{formatCurrency(234800)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'operational' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Reportes Operacionales</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Rendimiento de Conductores</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Conductores Activos</span>
                      <span className="font-semibold text-blue-600">24</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Promedio de Viajes</span>
                      <span className="font-semibold text-green-600">52.1</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Calificación Promedio</span>
                      <span className="font-semibold text-yellow-600">4.8/5.0</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Estado de Vehículos</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">En Servicio</span>
                      <span className="font-semibold text-green-600">15</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">En Mantenimiento</span>
                      <span className="font-semibold text-orange-600">2</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Fuera de Servicio</span>
                      <span className="font-semibold text-red-600">1</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">Disponibilidad</span>
                        <span className="font-bold text-blue-600">83.3%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytical' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Reportes Analíticos</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Tendencias de Crecimiento</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Crecimiento Mensual</span>
                      <span className="font-semibold text-green-600">+12.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Proyección Trimestral</span>
                      <span className="font-semibold text-blue-600">+8.3%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">ROI Promedio</span>
                      <span className="font-semibold text-purple-600">15.2%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Análisis Predictivo</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Próximo Mes</span>
                      <span className="font-semibold text-green-600">{formatCurrency(520000)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Nivel de Confianza</span>
                      <span className="font-semibold text-blue-600">85%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Tendencia</span>
                      <span className="font-semibold text-green-600">Positiva</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">{selectedReport.title}</h2>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalles del Reporte</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Tipo:</span>
                      <span className="ml-2 text-sm text-gray-900 capitalize">{selectedReport.type}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Descripción:</span>
                      <p className="mt-1 text-sm text-gray-900">{selectedReport.description}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Última generación:</span>
                      <span className="ml-2 text-sm text-gray-900">
                        {selectedReport.lastGenerated.toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => generateReport()}
                      disabled={isGenerating}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                      <span>Generar Reporte</span>
                    </button>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => exportReport(selectedReport, 'pdf')}
                        className="flex items-center justify-center space-x-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span className="text-xs">PDF</span>
                      </button>
                      <button
                        onClick={() => exportReport(selectedReport, 'excel')}
                        className="flex items-center justify-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span className="text-xs">Excel</span>
                      </button>
                      <button
                        onClick={() => exportReport(selectedReport, 'csv')}
                        className="flex items-center justify-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span className="text-xs">CSV</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Datos del Reporte</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="text-sm text-gray-700 overflow-x-auto">
                    {JSON.stringify(selectedReport.data, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 