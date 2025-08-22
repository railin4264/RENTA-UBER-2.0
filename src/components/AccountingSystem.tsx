import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  BarChart3, 
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Calculator,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Car,
  FileText
} from 'lucide-react';

interface FinancialData {
  income: number;
  expenses: number;
  profit: number;
  profitMargin: number;
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  cashFlow: number;
  accountsReceivable: number;
  accountsPayable: number;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  driverId?: string;
  vehicleId?: string;
  status: 'pending' | 'completed' | 'cancelled';
  paymentMethod: string;
}

interface CashFlow {
  period: string;
  income: number;
  expenses: number;
  netFlow: number;
  cumulative: number;
}

export default function AccountingSystem() {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'reports' | 'cashflow'>('overview');
  const [financialData, setFinancialData] = useState<FinancialData>({
    income: 0,
    expenses: 0,
    profit: 0,
    profitMargin: 0,
    totalAssets: 0,
    totalLiabilities: 0,
    netWorth: 0,
    cashFlow: 0,
    accountsReceivable: 0,
    accountsPayable: 0
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cashFlowData, setCashFlowData] = useState<CashFlow[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [isLoading, setIsLoading] = useState(true);
  const { getAuthHeaders } = useAuth();

  useEffect(() => {
    loadFinancialData();
  }, [selectedPeriod]);

  const loadFinancialData = async () => {
    try {
      setIsLoading(true);
      // Cargar datos reales desde reportes backend
      const api = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const [financialRes, paymentRes, expenseRes] = await Promise.all([
        fetch(`${api}/reports/financial?startDate=` + encodeURIComponent(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()) + '&endDate=' + encodeURIComponent(new Date().toISOString()), { headers: getAuthHeaders() }),
        fetch(`${api}/payments`, { headers: getAuthHeaders() }),
        fetch(`${api}/expenses`, { headers: getAuthHeaders() })
      ]);

      const financialJson = await financialRes.json().catch(() => ({}));
      const paymentsJson = await paymentRes.json().catch(() => ({}));
      const expensesJson = await expenseRes.json().catch(() => ({}));

      if (financialRes.ok && financialJson.success) {
        const r = financialJson.data;
        setFinancialData({
          income: r.income.total || 0,
          expenses: r.expenses.total || 0,
          profit: r.profit.net || 0,
          profitMargin: r.profit.margin || 0,
          totalAssets: 0,
          totalLiabilities: 0,
          netWorth: 0,
          cashFlow: (r.income.total || 0) - (r.expenses.total || 0),
          accountsReceivable: 0,
          accountsPayable: 0
        });
      } else {
        toast.error(financialJson.message || 'No se pudo cargar el reporte financiero');
      }

      const tx: Transaction[] = [];
      if (paymentRes.ok && paymentsJson.success && Array.isArray(paymentsJson.data)) {
        for (const p of paymentsJson.data) {
          tx.push({
            id: p.id,
            date: p.date,
            description: `Pago ${p.type} - ${p.driver?.firstName || ''} ${p.driver?.lastName || ''}`.trim(),
            amount: p.amount,
            type: 'income',
            category: 'Rentas',
            driverId: p.driverId,
            status: p.status || 'completed',
            paymentMethod: p.method || 'cash'
          });
        }
      }
      if (expenseRes.ok && expensesJson.success && Array.isArray(expensesJson.data)) {
        for (const ex of expensesJson.data) {
          tx.push({
            id: ex.id,
            date: ex.date,
            description: ex.description || 'Gasto',
            amount: ex.amount,
            type: 'expense',
            category: ex.category,
            vehicleId: ex.vehicleId,
            status: ex.status || 'paid',
            paymentMethod: ex.paymentMethod || 'cash'
          });
        }
      }
      tx.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setTransactions(tx.slice(0, 50));

      // Flujo de caja simple por periodos semanales del mes actual
      const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const weeks = [0, 7, 14, 21, 28];
      const cf: CashFlow[] = weeks.map((offset, i) => {
        const from = new Date(start.getTime() + offset * 24 * 3600 * 1000);
        const to = new Date(start.getTime() + (weeks[i + 1] || 31) * 24 * 3600 * 1000);
        const win = tx.filter(t => new Date(t.date) >= from && new Date(t.date) < to);
        const income = win.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        const expenses = win.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
        const netFlow = income - expenses;
        return { period: from.toLocaleDateString('es-ES') + ' - ' + to.toLocaleDateString('es-ES'), income, expenses, netFlow, cumulative: 0 };
      });
      let cumulative = 0;
      for (const item of cf) { cumulative += item.netFlow; item.cumulative = cumulative; }
      setCashFlowData(cf);
    } catch (error) {
      console.error('Error cargando datos financieros:', error);
      toast.error('Error de conexión al cargar contabilidad');
    } finally {
      setIsLoading(false);
    }
  };

  const getProfitColor = (margin: number) => {
    if (margin >= 50) return 'text-green-600';
    if (margin >= 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCashFlowColor = (flow: number) => {
    return flow >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP'
    }).format(amount);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Rentas': 'bg-green-100 text-green-800',
      'Mantenimiento': 'bg-orange-100 text-orange-800',
      'Combustible': 'bg-blue-100 text-blue-800',
      'Seguros': 'bg-purple-100 text-purple-800',
      'Impuestos': 'bg-red-100 text-red-800',
      'Otros': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Cargando datos financieros...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Sistema Contable</h1>
          <p className="text-gray-600 mt-1">Gestión financiera y análisis de rentabilidad</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
            <option value="quarter">Este trimestre</option>
            <option value="year">Este año</option>
          </select>
          <button
            onClick={loadFinancialData}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Actualizar datos"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Resumen', icon: BarChart3 },
              { id: 'transactions', label: 'Transacciones', icon: FileText },
              { id: 'reports', label: 'Reportes', icon: PieChart },
              { id: 'cashflow', label: 'Flujo de Caja', icon: TrendingUp }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
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
                      <p className="text-sm font-medium text-gray-600">Ingresos</p>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(financialData.income)}</p>
                      <p className="text-xs text-gray-500">+12.5% vs período anterior</p>
                    </div>
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Gastos</p>
                      <p className="text-2xl font-bold text-red-600">{formatCurrency(financialData.expenses)}</p>
                      <p className="text-xs text-gray-500">+8.3% vs período anterior</p>
                    </div>
                    <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                      <TrendingDown className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Beneficio</p>
                      <p className={`text-2xl font-bold ${getProfitColor(financialData.profitMargin)}`}>
                        {formatCurrency(financialData.profit)}
                      </p>
                      <p className="text-xs text-gray-500">{financialData.profitMargin}% margen</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Flujo de Caja</p>
                      <p className={`text-2xl font-bold ${getCashFlowColor(financialData.cashFlow)}`}>
                        {formatCurrency(financialData.cashFlow)}
                      </p>
                      <p className="text-xs text-gray-500">Neto disponible</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                      <Calculator className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Balance Sheet */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Balance General</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Activos Totales</span>
                      <span className="font-semibold text-green-600">{formatCurrency(financialData.totalAssets)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Pasivos Totales</span>
                      <span className="font-semibold text-red-600">{formatCurrency(financialData.totalLiabilities)}</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-900 font-semibold">Patrimonio Neto</span>
                        <span className="font-bold text-blue-600">{formatCurrency(financialData.netWorth)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Cuentas por Cobrar/Pagar</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Cuentas por Cobrar</span>
                      <span className="font-semibold text-green-600">{formatCurrency(financialData.accountsReceivable)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Cuentas por Pagar</span>
                      <span className="font-semibold text-red-600">{formatCurrency(financialData.accountsPayable)}</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-900 font-semibold">Diferencia</span>
                        <span className={`font-bold ${financialData.accountsReceivable - financialData.accountsPayable >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(financialData.accountsReceivable - financialData.accountsPayable)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Transacciones Recientes</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Download className="w-4 h-4 mr-2 inline" />
                  Exportar
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descripción
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoría
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Monto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Método
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(transaction.date).toLocaleDateString('es-ES')}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {transaction.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(transaction.category)}`}>
                            {transaction.category}
                          </span>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                            transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {transaction.status === 'completed' ? 'Completado' :
                             transaction.status === 'pending' ? 'Pendiente' : 'Cancelado'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.paymentMethod}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Análisis de Gastos</h3>
                  <div className="space-y-3">
                    {[
                      { category: 'Mantenimiento', amount: 85000, percentage: 36.2 },
                      { category: 'Combustible', amount: 65000, percentage: 27.7 },
                      { category: 'Seguros', amount: 45000, percentage: 19.2 },
                      { category: 'Impuestos', amount: 25000, percentage: 10.6 },
                      { category: 'Otros', amount: 14800, percentage: 6.3 }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            index === 0 ? 'bg-orange-500' :
                            index === 1 ? 'bg-blue-500' :
                            index === 2 ? 'bg-purple-500' :
                            index === 3 ? 'bg-red-500' : 'bg-gray-500'
                          }`}></div>
                          <span className="text-sm text-gray-700">{item.category}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-gray-900">{formatCurrency(item.amount)}</div>
                          <div className="text-xs text-gray-500">{item.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Métricas de Rentabilidad</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Margen de Beneficio</span>
                      <span className="font-semibold text-green-600">{financialData.profitMargin}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">ROI Mensual</span>
                      <span className="font-semibold text-blue-600">8.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Ratio de Liquidez</span>
                      <span className="font-semibold text-purple-600">2.3</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Deuda/Capital</span>
                      <span className="font-semibold text-orange-600">0.34</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cashflow' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Flujo de Caja</h3>
                <div className="space-y-4">
                  {cashFlowData.map((period, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{period.period}</span>
                          <span className={`font-semibold ${getCashFlowColor(period.netFlow)}`}>
                            {formatCurrency(period.netFlow)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>Ingresos: {formatCurrency(period.income)}</span>
                          <span>Gastos: {formatCurrency(period.expenses)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 