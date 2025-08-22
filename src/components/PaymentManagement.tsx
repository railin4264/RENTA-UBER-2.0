import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import {
  DollarSign,
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
  Receipt,
  CreditCard,
  Banknote
} from 'lucide-react';

interface Payment {
  id: string;
  contractId: string;
  driverId: string;
  amount: number;
  type: 'payment' | 'deposit' | 'penalty' | 'refund';
  method: 'cash' | 'bank_transfer' | 'credit_card' | 'debit_card' | 'mobile_payment';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  date: string;
  dueDate: string;
  description: string;
  reference: string;
  notes: string;
  driver: {
    id: string;
    firstName: string;
    lastName: string;
    cedula: string;
  };
  contract: {
    id: string;
    startDate: string;
    endDate: string;
    rate: number;
    rateType: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface PaymentFormData {
  contractId: string;
  driverId: string;
  amount: number;
  type: 'payment' | 'deposit' | 'penalty' | 'refund';
  method: 'cash' | 'bank_transfer' | 'credit_card' | 'debit_card' | 'mobile_payment';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  date: string;
  dueDate: string;
  description: string;
  reference: string;
  notes: string;
}

interface ValidationErrors {
  [key: string]: string;
}

export default function PaymentManagement() {
  const { getAuthHeaders } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [formData, setFormData] = useState<PaymentFormData>({
    contractId: '',
    driverId: '',
    amount: 0,
    type: 'payment',
    method: 'cash',
    status: 'pending',
    date: '',
    dueDate: '',
    description: '',
    reference: '',
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
      
      const api = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      // Cargar pagos
      const paymentsResponse = await fetch(`${api}/payments`, { headers: getAuthHeaders() });
      if (paymentsResponse.ok) {
        const result = await paymentsResponse.json();
        const paymentsData = result.success && Array.isArray(result.data) ? result.data : [];
        setPayments(paymentsData);
        if (result.meta && typeof result.meta.total === 'number') {
          // setTotal(result.meta.total); // This line was removed from the new_code, so it's removed here.
        }
      } else { setPayments([]); toast.error('No se pudieron cargar los pagos'); }

      // Cargar conductores
      const driversResponse = await fetch(`${api}/drivers`, { headers: getAuthHeaders() });
      if (driversResponse.ok) {
        const result = await driversResponse.json();
        const driversData = result.success && Array.isArray(result.data) ? result.data : [];
        setDrivers(driversData);
      } else { setDrivers([]); }

      // Cargar contratos
      const contractsResponse = await fetch(`${api}/contracts`, { headers: getAuthHeaders() });
      if (contractsResponse.ok) {
        const result = await contractsResponse.json();
        const contractsData = result.success && Array.isArray(result.data) ? result.data : [];
        setContracts(contractsData);
      } else { setContracts([]); }
    } catch (error) {
      console.error('Error cargando pagos:', error);
      toast.error('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Validaciones requeridas
    if (!formData.contractId) {
      newErrors.contractId = 'El contrato es requerido';
    }

    if (!formData.driverId) {
      newErrors.driverId = 'El conductor es requerido';
    }

    if (formData.amount <= 0) {
      newErrors.amount = 'El monto debe ser mayor a 0';
    }

    if (!formData.date) {
      newErrors.date = 'La fecha es requerida';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    // Validación de fecha de vencimiento
    if (formData.dueDate && formData.date) {
      const dueDate = new Date(formData.dueDate);
      const paymentDate = new Date(formData.date);
      if (paymentDate > dueDate && formData.status === 'completed') {
        newErrors.date = 'No se puede registrar un pago completado después de la fecha de vencimiento';
      }
    }

    // Validación de referencia única
    if (formData.reference.trim()) {
      const existingPayment = payments.find(payment => 
        payment.reference === formData.reference && 
        payment.id !== editingPayment?.id
      );
      if (existingPayment) {
        newErrors.reference = 'La referencia ya existe';
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
      const url = editingPayment 
        ? `${api}/payments/${editingPayment.id}`
        : `${api}/payments`;
      
      const method = editingPayment ? 'PUT' : 'POST';

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
        setEditingPayment(null);
        resetForm();
        loadData();
        toast.success(editingPayment ? 'Pago actualizado' : 'Pago creado');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Error al guardar el pago');
      }
    } catch (error) {
      console.error('Error guardando pago:', error);
      toast.error('Error al guardar el pago');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (payment: Payment) => {
    setEditingPayment(payment);
    setFormData({
      contractId: payment.contractId,
      driverId: payment.driverId,
      amount: payment.amount,
      type: payment.type,
      method: payment.method,
      status: payment.status,
      date: payment.date,
      dueDate: payment.dueDate,
      description: payment.description,
      reference: payment.reference,
      notes: payment.notes
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este pago?')) {
      return;
    }

    try {
      const api = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${api}/payments/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        loadData();
        toast.success('Pago eliminado');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Error al eliminar el pago');
      }
    } catch (error) {
      console.error('Error eliminando pago:', error);
      toast.error('Error al eliminar el pago');
    }
  };

  const resetForm = () => {
    setFormData({
      contractId: '',
      driverId: '',
      amount: 0,
      type: 'payment',
      method: 'cash',
      status: 'pending',
      date: '',
      dueDate: '',
      description: '',
      reference: '',
      notes: ''
    });
    setErrors({});
  };

  const filteredPayments = Array.isArray(payments) ? payments.filter(payment => {
    const matchesSearch = 
      (payment.driver?.firstName && payment.driver.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (payment.driver?.lastName && payment.driver.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (payment.description && payment.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (payment.reference && payment.reference.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesType = typeFilter === 'all' || payment.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
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
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'payment':
        return 'bg-blue-100 text-blue-800';
      case 'deposit':
        return 'bg-green-100 text-green-800';
      case 'penalty':
        return 'bg-red-100 text-red-800';
      case 'refund':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'cash':
        return <Banknote className="w-4 h-4" />;
      case 'bank_transfer':
        return <Shield className="w-4 h-4" />;
      case 'credit_card':
      case 'debit_card':
        return <CreditCard className="w-4 h-4" />;
      case 'mobile_payment':
        return <Receipt className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'cash':
        return 'Efectivo';
      case 'bank_transfer':
        return 'Transferencia';
      case 'credit_card':
        return 'Tarjeta Crédito';
      case 'debit_card':
        return 'Tarjeta Débito';
      case 'mobile_payment':
        return 'Pago Móvil';
      default:
        return method;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'payment':
        return 'Pago';
      case 'deposit':
        return 'Depósito';
      case 'penalty':
        return 'Penalización';
      case 'refund':
        return 'Reembolso';
      default:
        return type;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'pending':
        return 'Pendiente';
      case 'failed':
        return 'Fallido';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Cargando pagos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestión de Pagos</h1>
          <p className="text-gray-600 mt-1">Administra todos los pagos y transacciones</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
              setEditingPayment(null);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Pago</span>
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
                placeholder="Buscar pagos..."
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
            <option value="completed">Completado</option>
            <option value="pending">Pendiente</option>
            <option value="failed">Fallido</option>
            <option value="cancelled">Cancelado</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos los tipos</option>
            <option value="payment">Pago</option>
            <option value="deposit">Depósito</option>
            <option value="penalty">Penalización</option>
            <option value="refund">Reembolso</option>
          </select>
        </div>
      </div>

      {/* Payments List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pago
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conductor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Método
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
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-white" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {payment.reference}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(payment.date)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {payment.driver.firstName} {payment.driver.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {payment.driver.cedula}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(payment.amount)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {getTypeLabel(payment.type)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getMethodIcon(payment.method)}
                      <span className="text-sm text-gray-900">
                        {getMethodLabel(payment.method)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {getStatusLabel(payment.status)}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(payment.type)}`}>
                        {getTypeLabel(payment.type)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(payment)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(payment.id)}
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
                {editingPayment ? 'Editar Pago' : 'Nuevo Pago'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contract and Driver Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contrato *
                  </label>
                  <select
                    value={formData.contractId}
                    onChange={(e) => setFormData({...formData, contractId: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.contractId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Seleccionar contrato</option>
                    {contracts.map((contract) => (
                      <option key={contract.id} value={contract.id}>
                        Contrato #{contract.id} - {contract.rate} RD$/{contract.rateType}
                      </option>
                    ))}
                  </select>
                  {errors.contractId && (
                    <p className="text-red-500 text-sm mt-1">{errors.contractId}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Conductor *
                  </label>
                  <select
                    value={formData.driverId}
                    onChange={(e) => setFormData({...formData, driverId: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.driverId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Seleccionar conductor</option>
                    {drivers.map((driver) => (
                      <option key={driver.id} value={driver.id}>
                        {driver.firstName} {driver.lastName} - {driver.cedula}
                      </option>
                    ))}
                  </select>
                  {errors.driverId && (
                    <p className="text-red-500 text-sm mt-1">{errors.driverId}</p>
                  )}
                </div>
              </div>

              {/* Payment Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    placeholder="3200"
                    min="0"
                    step="0.01"
                  />
                  {errors.amount && (
                    <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Pago
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="payment">Pago</option>
                    <option value="deposit">Depósito</option>
                    <option value="penalty">Penalización</option>
                    <option value="refund">Reembolso</option>
                  </select>
                </div>

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
                    <option value="completed">Completado</option>
                    <option value="failed">Fallido</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>
              </div>

              {/* Payment Method and Dates */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Método de Pago
                  </label>
                  <select
                    value={formData.method}
                    onChange={(e) => setFormData({...formData, method: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="cash">Efectivo</option>
                    <option value="bank_transfer">Transferencia Bancaria</option>
                    <option value="credit_card">Tarjeta de Crédito</option>
                    <option value="debit_card">Tarjeta de Débito</option>
                    <option value="mobile_payment">Pago Móvil</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Pago *
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Vencimiento
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Description and Reference */}
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
                    placeholder="Pago semanal de renta"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Referencia
                  </label>
                  <input
                    type="text"
                    value={formData.reference}
                    onChange={(e) => setFormData({...formData, reference: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.reference ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="REF-001"
                  />
                  {errors.reference && (
                    <p className="text-red-500 text-sm mt-1">{errors.reference}</p>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas Adicionales
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Información adicional sobre el pago..."
                />
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
                  {isSubmitting ? 'Guardando...' : (editingPayment ? 'Actualizar' : 'Crear')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}