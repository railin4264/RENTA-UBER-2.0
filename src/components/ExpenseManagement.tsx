import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Calendar,
  DollarSign,
  Camera,
  Edit2,
  Trash2,
  Filter,
  Download,
  Wrench,
  Palette,
  AlertTriangle,
  Settings
} from 'lucide-react';
import type { Expense } from '../types';

const expenseTypes = [
  { id: 'mechanical', label: 'Mecánica', icon: Wrench, color: 'bg-blue-500' },
  { id: 'paint', label: 'Pintura', icon: Palette, color: 'bg-purple-500' },
  { id: 'loss', label: 'Pérdida', icon: AlertTriangle, color: 'bg-red-500' },
  { id: 'maintenance', label: 'Mantenimiento', icon: Settings, color: 'bg-green-500' },
];

export default function ExpenseManagement() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [vehicles, setVehicles] = useState<{ id: string; plate: string; brand: string }[]>([]);
  const [formData, setFormData] = useState({
    id: '',
    vehicleId: '',
    date: new Date().toISOString().split('T')[0],
    place: '',
    type: 'mechanical' as Expense['type'],
    cost: 0,
    description: '',
    invoice: '',
  });
  const [invoicePreview, setInvoicePreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:3002/api/expenses')
      .then(res => res.json())
      .then(data => setExpenses(data))
      .catch(err => console.error('Error al cargar gastos:', err));
    fetch('http://localhost:3002/api/vehicles')
      .then(res => res.json())
      .then(data => setVehicles(data));
  }, []);

  const handleInvoiceChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setInvoicePreview(URL.createObjectURL(file));
      const formDataData = new FormData();
      formDataData.append('photo', file);
      try {
        const res = await fetch('http://localhost:3002/api/upload', {
          method: 'POST',
          body: formDataData,
        });
        const data = await res.json();
        setFormData(prev => ({ ...prev, invoice: data.filename ?? '' }));
      } catch (err) {
        alert('Error subiendo la factura');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newExpense: any = {
      amount: Number(formData.cost ?? 0),
      date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
      vehicleId: formData.vehicleId,
    };
    if (formData.description) newExpense.description = formData.description;
    if (formData.place) newExpense.place = formData.place;
    if (formData.type) newExpense.type = formData.type;
    if (formData.invoice) newExpense.invoice = formData.invoice;

    try {
      let res, data;
      if (editingId) {
        res = await fetch(`http://localhost:3002/api/expenses/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newExpense),
        });
      } else {
        res = await fetch('http://localhost:3002/api/expenses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newExpense),
        });
      }
      if (!res.ok) {
        const error = await res.json();
        alert(error.message || 'Error al guardar gasto');
        return;
      }
      data = await res.json();
      if (editingId) {
        setExpenses(expenses.map(e => e.id === editingId ? data : e));
      } else {
        setExpenses([...expenses, data]);
      }
      setShowForm(false);
      resetForm();
    } catch (err) {
      alert('Error al guardar gasto');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar este gasto?')) return;
    try {
      const res = await fetch(`http://localhost:3002/api/expenses/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        alert('Error al eliminar gasto');
        return;
      }
      setExpenses(expenses.filter(e => e.id !== id));
    } catch {
      alert('Error al eliminar gasto');
    }
  };

  const handleEdit = (expense: Expense) => {
    setShowForm(true);
    setEditingId(expense.id);
    setFormData({
      id: expense.id,
      vehicleId: expense.vehicleId ?? '',
      date: expense.date ? expense.date.slice(0, 10) : '',
      place: expense.place ?? '',
      type: expense.type ?? 'mechanical',
      cost: expense.amount ?? 0,
      description: expense.description ?? '',
      invoice: expense.invoice ?? '',
    });
    setInvoicePreview(expense.invoice ? `http://localhost:3002/uploads/${expense.invoice}` : null);
  };

  const resetForm = () => {
    setFormData({
      id: '',
      vehicleId: '',
      date: new Date().toISOString().split('T')[0],
      place: '',
      type: 'mechanical',
      cost: 0,
      description: '',
      invoice: '',
    });
    setInvoicePreview(null);
    setEditingId(null);
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = (expense.place?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (expense.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (expense.vehicleId?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || expense.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
  const monthlyExpenses = expenses
    .filter(expense => new Date(expense.date).getMonth() === new Date().getMonth())
    .reduce((sum, expense) => sum + (expense.amount || 0), 0);

  if (showForm) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{editingId ? 'Editar Gasto' : 'Registrar Gasto'}</h1>
            <p className="text-gray-600 mt-1">Registra gastos de mantenimiento y reparaciones</p>
          </div>
          <button
            onClick={() => { setShowForm(false); resetForm(); }}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancelar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Detalles del Gasto
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehículo *
                </label>
                <select
                  required
                  value={formData.vehicleId ?? ''}
                  onChange={(e) => setFormData({...formData, vehicleId: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecciona un vehículo</option>
                  {vehicles.map(vehicle => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.plate} - {vehicle.brand}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date ?? ''}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lugar *
                </label>
                <input
                  type="text"
                  required
                  value={formData.place ?? ''}
                  onChange={(e) => setFormData({...formData, place: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Taller Mecánico Central"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Reparación *
                </label>
                <select
                  required
                  value={formData.type ?? 'mechanical'}
                  onChange={(e) => setFormData({...formData, type: e.target.value as Expense['type']})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {expenseTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Costo (RD$) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.cost ?? 0}
                  onChange={(e) => setFormData({...formData, cost: parseFloat(e.target.value) || 0})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description ?? ''}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Detalles adicionales del gasto..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Factura
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Subir foto de la factura</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleInvoiceChange}
                    className="hidden"
                    id="invoice-upload"
                  />
                  <label htmlFor="invoice-upload">
                    <span className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                      Seleccionar Archivo
                    </span>
                  </label>
                  {invoicePreview && (
                    <img
                      src={invoicePreview}
                      alt="Factura"
                      className="mx-auto mt-4 w-32 h-32 object-cover rounded-lg border"
                    />
                  )}
                  {formData.invoice && (
                    <div className="mt-2 text-xs text-gray-500">
                      Archivo subido: {formData.invoice}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => { setShowForm(false); resetForm(); }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingId ? 'Actualizar Gasto' : 'Registrar Gasto'}
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
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Gastos</h1>
          <p className="text-gray-600 mt-1">Control de gastos de mantenimiento y reparaciones</p>
        </div>
        <button
          onClick={() => { setShowForm(true); resetForm(); }}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Gasto</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Gastos</p>
              <p className="text-2xl font-bold text-gray-900">RD${totalExpenses.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Este Mes</p>
              <p className="text-2xl font-bold text-gray-900">RD${monthlyExpenses.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Registros</p>
              <p className="text-2xl font-bold text-gray-900">{expenses.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por lugar, descripción o vehículo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos los tipos</option>
              {expenseTypes.map(type => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehículo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lugar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Costo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Factura
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExpenses.map((expense) => {
                const expenseType = expenseTypes.find(t => t.id === expense.type);
                const Icon = expenseType?.icon || Settings;
                return (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(expense.date).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {vehicles.find(v => v.id === expense.vehicleId)?.plate || expense.vehicleId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className={`w-8 h-8 ${expenseType?.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm text-gray-900">{expenseType?.label}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {expense.place}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      RD${(expense.amount || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {expense.invoice ? (
                        <a
                          href={`http://localhost:3002/uploads/${expense.invoice}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          Ver factura
                        </a>
                      ) : (
                        <span className="text-gray-400">No adjunta</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-700"
                          onClick={() => handleEdit(expense)}
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(expense.id)}
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredExpenses.length === 0 && (
        <div className="text-center py-12">
          <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || filterType !== 'all' ? 'No se encontraron gastos' : 'No hay gastos registrados'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || filterType !== 'all'
              ? 'Intenta con otros filtros de búsqueda' 
              : 'Comienza registrando tu primer gasto'
            }
          </p>
          {!searchTerm && filterType === 'all' && (
            <button
              onClick={() => { setShowForm(true); resetForm(); }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Registrar Primer Gasto</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}