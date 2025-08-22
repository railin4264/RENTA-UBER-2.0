import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import {
  Receipt,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
  MapPin,
  Shield,
  Users,
  Car,
  Clock,
  TrendingUp,
  Calculator,
  DollarSign,
  CreditCard,
  Banknote,
  Wrench,
  Fuel,
  Gauge
} from 'lucide-react';

interface Expense {
  id: string;
  vehicleId: string;
  category: 'maintenance' | 'fuel' | 'insurance' | 'repairs' | 'tires' | 'other';
  amount: number;
  description: string;
  date: string;
  vendor: string;
  invoiceNumber: string;
  paymentMethod: 'cash' | 'bank_transfer' | 'credit_card' | 'debit_card';
  status: 'pending' | 'paid' | 'cancelled';
  notes: string;
  vehicle: {
    id: string;
    brand: string;
    model: string;
    plate: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface ExpenseFormData {
  vehicleId: string;
  category: 'maintenance' | 'fuel' | 'insurance' | 'repairs' | 'tires' | 'other';
  amount: number;
  description: string;
  date: string;
  vendor: string;
  invoiceNumber: string;
  paymentMethod: 'cash' | 'bank_transfer' | 'credit_card' | 'debit_card';
  status: 'pending' | 'paid' | 'cancelled';
  notes: string;
}

interface ValidationErrors {
  [key: string]: string;
}

export default function ExpenseManagement() {
  const { getAuthHeaders } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [formData, setFormData] = useState<ExpenseFormData>({
    vehicleId: '',
    category: 'maintenance',
    amount: 0,
    description: '',
    date: '',
    vendor: '',
    invoiceNumber: '',
    paymentMethod: 'cash',
    status: 'pending',
    notes: ''
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Cargar gastos
      const api = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const expensesResponse = await fetch(`${api}/expenses`, { headers: getAuthHeaders() });
      if (expensesResponse.ok) {
        const result = await expensesResponse.json();
        // El backend devuelve { success: true, data: [...], count: number }
        const expensesData = result.success && Array.isArray(result.data) ? result.data : [];
        setExpenses(expensesData);
      } else { setExpenses([]); toast.error('No se pudieron cargar los gastos'); }

      // Cargar vehículos
      const vehiclesResponse = await fetch(`${api}/vehicles`, { headers: getAuthHeaders() });
      if (vehiclesResponse.ok) {
        const result = await vehiclesResponse.json();
        const vehiclesData = result.success && Array.isArray(result.data) ? result.data : [];
        setVehicles(vehiclesData);
      } else { setVehicles([]); }
    } catch (error) {
      console.error('Error cargando datos:', error);
      // En caso de error, establecer arrays vacíos
      setExpenses([]);
      setVehicles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Validaciones requeridas
    if (!formData.vehicleId) {
      newErrors.vehicleId = 'El vehículo es requerido';
    }

    if (formData.amount <= 0) {
      newErrors.amount = 'El monto debe ser mayor a 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (!formData.date) {
      newErrors.date = 'La fecha es requerida';
    }

    if (!formData.vendor.trim()) {
      newErrors.vendor = 'El proveedor es requerido';
    }

    // Validación de fecha futura
    if (formData.date) {
      const expenseDate = new Date(formData.date);
      const today = new Date();
      if (expenseDate > today) {
        newErrors.date = 'La fecha no puede ser futura';
      }
    }

    // Validación de número de factura único
    if (formData.invoiceNumber.trim()) {
      const existingExpense = expenses.find(expense => 
        expense.invoiceNumber === formData.invoiceNumber && 
        expense.id !== editingExpense?.id
      );
      if (existingExpense) {
        newErrors.invoiceNumber = 'El número de factura ya existe';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const api = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const url = editingExpense 
        ? `${api}/expenses/${editingExpense.id}`
        : `${api}/expenses`;
      
      const method = editingExpense ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowForm(false);
        setEditingExpense(null);
        resetForm();
        loadData();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Error al guardar el gasto');
      }
    } catch (error) {
      console.error('Error guardando gasto:', error);
      toast.error('Error al guardar el gasto');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setFormData({
      vehicleId: expense.vehicleId,
      category: expense.category,
      amount: expense.amount,
      description: expense.description,
      date: expense.date,
      vendor: expense.vendor,
      invoiceNumber: expense.invoiceNumber,
      paymentMethod: expense.paymentMethod,
      status: expense.status,
      notes: expense.notes
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este gasto?')) {
      return;
    }

    try {
      const api = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${api}/expenses/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        loadData();
        toast.success('Gasto eliminado');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Error al eliminar el gasto');
      }
    } catch (error) {
      console.error('Error eliminando gasto:', error);
      toast.error('Error al eliminar el gasto');
    }
  };

  const resetForm = () => {
    setFormData({
      vehicleId: '',
      category: 'maintenance',
      amount: 0,
      description: '',
      date: '',
      vendor: '',
      invoiceNumber: '',
      paymentMethod: 'cash',
      status: 'pending',
      notes: ''
    });
    setErrors({});
  };

  const filteredExpenses = Array.isArray(expenses) ? expenses.filter(expense => {
    const matchesSearch = 
      (expense.description && expense.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (expense.vendor && expense.vendor.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (expense.invoiceNumber && expense.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (expense.vehicle?.plate && expense.vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || expense.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  }) : [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'maintenance':
        return 'bg-blue-100 text-blue-800';
      case 'fuel':
        return 'bg-orange-100 text-orange-800';
      case 'insurance':
        return 'bg-purple-100 text-purple-800';
      case 'repairs':
        return 'bg-red-100 text-red-800';
      case 'tires':
        return 'bg-gray-100 text-gray-800';
      case 'other':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'maintenance':
        return <Wrench className="w-4 h-4" />;
      case 'fuel':
        return <Fuel className="w-4 h-4" />;
      case 'insurance':
        return <Shield className="w-4 h-4" />;
      case 'repairs':
        return <Gauge className="w-4 h-4" />;
      case 'tires':
        return <Car className="w-4 h-4" />;
      case 'other':
        return <Receipt className="w-4 h-4" />;
      default:
        return <Receipt className="w-4 h-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'maintenance':
        return 'Mantenimiento';
      case 'fuel':
        return 'Combustible';
      case 'insurance':
        return 'Seguro';
      case 'repairs':
        return 'Reparaciones';
      case 'tires':
        return 'Neumáticos';
      case 'other':
        return 'Otros';
      default:
        return category;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Pagado';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'cash':
        return 'Efectivo';
      case 'bank_transfer':
        return 'Transferencia';
      case 'credit_card':
        return 'Tarjeta Crédito';
      case 'debit_card':
        return 'Tarjeta Débito';
      default:
        return method;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Cargando gastos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestión de Gastos</h1>
          <p className="text-gray-600 mt-1">Administra todos los gastos de la flota</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
              setEditingExpense(null);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Gasto</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar gastos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos los estados</option>
            <option value="paid">Pagado</option>
            <option value="pending">Pendiente</option>
            <option value="cancelled">Cancelado</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todas las categorías</option>
            <option value="maintenance">Mantenimiento</option>
            <option value="fuel">Combustible</option>
            <option value="insurance">Seguro</option>
            <option value="repairs">Reparaciones</option>
            <option value="tires">Neumáticos</option>
            <option value="other">Otros</option>
          </select>
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gasto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehículo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proveedor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                        <Receipt className="w-5 h-5 text-white" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {expense.invoiceNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(expense.date)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {expense.vehicle.brand} {expense.vehicle.model}
                    </div>
                    <div className="text-sm text-gray-500">
                      {expense.vehicle.plate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(expense.category)}
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(expense.category)}`}>
                        {getCategoryLabel(expense.category)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(expense.amount)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {getPaymentMethodLabel(expense.paymentMethod)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{expense.vendor}</div>
                    <div className="text-sm text-gray-500">{expense.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(expense.status)}`}>
                      {getStatusLabel(expense.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingExpense ? 'Editar Gasto' : 'Nuevo Gasto'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Vehicle and Category Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehículo *
                  </label>
                  <select
                    value={formData.vehicleId}
                    onChange={(e) => setFormData({...formData, vehicleId: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.vehicleId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Seleccionar vehículo</option>
                    {vehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.brand} {vehicle.model} - {vehicle.plate}
                      </option>
                    ))}
                  </select>
                  {errors.vehicleId && (
                    <p className="text-red-500 text-sm mt-1">{errors.vehicleId}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="maintenance">Mantenimiento</option>
                    <option value="fuel">Combustible</option>
                    <option value="insurance">Seguro</option>
                    <option value="repairs">Reparaciones</option>
                    <option value="tires">Neumáticos</option>
                    <option value="other">Otros</option>
                  </select>
                </div>
              </div>

              {/* Amount and Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monto (RD$) *
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.amount ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="8500"
                    min="0"
                    step="0.01"
                  />
                  {errors.amount && (
                    <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.date ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.date && (
                    <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                  )}
                </div>
              </div>

              {/* Description and Vendor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción *
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Cambio de aceite y filtros"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proveedor *
                  </label>
                  <input
                    type="text"
                    value={formData.vendor}
                    onChange={(e) => setFormData({...formData, vendor: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.vendor ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Taller Mecánico ABC"
                  />
                  {errors.vendor && (
                    <p className="text-red-500 text-sm mt-1">{errors.vendor}</p>
                  )}
                </div>
              </div>

              {/* Invoice Number and Payment Method */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Factura
                  </label>
                  <input
                    type="text"
                    value={formData.invoiceNumber}
                    onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.invoiceNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="INV-001"
                  />
                  {errors.invoiceNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.invoiceNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Método de Pago
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({...formData, paymentMethod: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="cash">Efectivo</option>
                    <option value="bank_transfer">Transferencia Bancaria</option>
                    <option value="credit_card">Tarjeta de Crédito</option>
                    <option value="debit_card">Tarjeta de Débito</option>
                  </select>
                </div>
              </div>

              {/* Status and Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Pendiente</option>
                    <option value="paid">Pagado</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notas Adicionales
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Información adicional sobre el gasto..."
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Guardando...' : (editingExpense ? 'Actualizar' : 'Crear')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}