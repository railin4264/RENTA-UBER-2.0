import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Calendar,
  DollarSign,
  User,
  Car,
  CheckCircle,
  AlertCircle,
  Clock,
  Edit2,
  Trash2,
  Filter,
  Download
} from 'lucide-react';
import type { Payment, DebtRecord } from '../types';

export default function PaymentManagement() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [debts, setDebts] = useState<DebtRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'payments' | 'debts'>('debts');
  const [formData, setFormData] = useState({
    driverId: '',
    amount: 0,
    type: 'complete' as Payment['type'],
    dailySavings: 1600,
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPayment: Payment = {
      id: Date.now().toString(),
      ...formData,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    setPayments([...payments, newPayment]);
    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      driverId: '',
      amount: 0,
      type: 'complete',
      dailySavings: 1600,
      notes: '',
    });
  };

  // Mock debt data
  const mockDebts: DebtRecord[] = [
    {
      id: '1',
      driverId: 'Carlos Martínez',
      vehiclePlate: 'ABC-123',
      amount: 3200,
      dueDate: '2025-01-15',
      status: 'pending',
      notes: '',
      createdAt: '2025-01-01T00:00:00Z'
    },
    {
      id: '2',
      driverId: 'Ana López',
      vehiclePlate: 'DEF-456',
      amount: 1600,
      dueDate: '2025-01-16',
      status: 'pending',
      notes: '',
      createdAt: '2025-01-01T00:00:00Z'
    },
    {
      id: '3',
      driverId: 'Roberto Silva',
      vehiclePlate: 'GHI-789',
      amount: 4800,
      dueDate: '2025-01-17',
      status: 'pending',
      isVehicleInactive: true,
      notes: 'Vehículo fuera de servicio',
      createdAt: '2025-01-01T00:00:00Z'
    }
  ];

  const filteredDebts = mockDebts.filter(debt =>
    debt.driverId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    debt.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPayments = payments.filter(payment =>
    payment.driverId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPendingDebt = mockDebts
    .filter(debt => debt.status === 'pending')
    .reduce((sum, debt) => sum + debt.amount, 0);

  const monthlyPayments = payments
    .filter(payment => new Date(payment.date).getMonth() === new Date().getMonth())
    .reduce((sum, payment) => sum + payment.amount, 0);

  if (showForm) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Registrar Pago</h1>
            <p className="text-gray-600 mt-1">Registra pagos de choferes</p>
          </div>
          <button
            onClick={() => setShowForm(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancelar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Detalles del Pago
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chofer *
                </label>
                <input
                  type="text"
                  required
                  value={formData.driverId}
                  onChange={(e) => setFormData({...formData, driverId: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nombre del chofer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monto (RD$) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Pago *
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as Payment['type']})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="complete">Pago Completo</option>
                  <option value="partial">Pago Parcial</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ahorro Diario (RD$) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.dailySavings}
                  onChange={(e) => setFormData({...formData, dailySavings: parseFloat(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="1600.00"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Notas adicionales..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Registrar Pago
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sistema de Cobros</h1>
          <p className="text-gray-600 mt-1">Gestiona pagos y deudas pendientes</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Registrar Pago</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Deudas Pendientes</p>
              <p className="text-2xl font-bold text-red-600">RD${totalPendingDebt.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pagos Este Mes</p>
              <p className="text-2xl font-bold text-green-600">RD${monthlyPayments.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Pagos</p>
              <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('debts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'debts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Deudas Pendientes ({mockDebts.filter(d => d.status === 'pending').length})
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'payments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Historial de Pagos ({payments.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={activeTab === 'debts' ? "Buscar por chofer o placa..." : "Buscar por chofer..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {activeTab === 'debts' && (
            <div className="space-y-4">
              {filteredDebts.map((debt) => (
                <div key={debt.id} className={`border rounded-lg p-4 ${
                  debt.isVehicleInactive ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'
                } hover:shadow-md transition-shadow`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        debt.isVehicleInactive ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                        <User className={`w-6 h-6 ${
                          debt.isVehicleInactive ? 'text-red-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{debt.driverId}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Car className="w-4 h-4" />
                          <span>{debt.vehiclePlate}</span>
                        </div>
                        {debt.notes && (
                          <p className="text-sm text-red-600 mt-1">{debt.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">RD${debt.amount.toLocaleString()}</p>
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className={`${
                          new Date(debt.dueDate) < new Date() ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          Vence: {new Date(debt.dueDate).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                      <div className="flex space-x-2 mt-2">
                        <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors">
                          Pago Completo
                        </button>
                        <button className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors">
                          Pago Parcial
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Chofer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ahorro Diario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(payment.date).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {payment.driverId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          payment.type === 'complete' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {payment.type === 'complete' ? 'Completo' : 'Parcial'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        RD${payment.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        RD${payment.dailySavings.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-700">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {((activeTab === 'debts' && filteredDebts.length === 0) || 
            (activeTab === 'payments' && filteredPayments.length === 0)) && (
            <div className="text-center py-12">
              {activeTab === 'debts' ? (
                <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              ) : (
                <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              )}
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activeTab === 'debts' 
                  ? (searchTerm ? 'No se encontraron deudas' : 'No hay deudas pendientes')
                  : (searchTerm ? 'No se encontraron pagos' : 'No hay pagos registrados')
                }
              </h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? 'Intenta con otros términos de búsqueda'
                  : activeTab === 'debts' 
                    ? '¡Excelente! Todos los pagos están al día'
                    : 'Los pagos aparecerán aquí una vez registrados'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}