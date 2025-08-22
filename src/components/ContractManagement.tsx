import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FileText,
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
  DollarSign,
  Clock,
  TrendingUp,
  Calculator
} from 'lucide-react';

interface Contract {
  id: string;
  driverId: string;
  vehicleId: string;
  startDate: string;
  endDate: string;
  rate: number;
  rateType: 'daily' | 'weekly' | 'monthly';
  deposit: number;
  status: { id: string; name: string };
  terms: string;
  notes: string;
  driver: {
    id: string;
    firstName: string;
    lastName: string;
    cedula: string;
    phone: string;
  };
  vehicle: {
    id: string;
    brand: string;
    model: string;
    plate: string;
    year: number;
  };
  payments: Array<{
    id: string;
    amount: number;
    date: string;
    type: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface ContractFormData {
  driverId: string;
  vehicleId: string;
  startDate: string;
  endDate: string;
  rate: number;
  rateType: 'daily' | 'weekly' | 'monthly';
  deposit: number;
  statusId: string;
  terms: string;
  notes: string;
}

interface ValidationErrors {
  [key: string]: string;
}

export default function ContractManagement() {
  const { getAuthHeaders } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const schema = z.object({
    driverId: z.string().min(1, 'El conductor es requerido'),
    vehicleId: z.string().min(1, 'El vehículo es requerido'),
    startDate: z.string().min(1, 'La fecha de inicio es requerida'),
    endDate: z.string().min(1, 'La fecha de fin es requerida'),
    rate: z.number().positive('La tarifa debe ser mayor a 0'),
    rateType: z.enum(['daily', 'weekly', 'monthly']),
    deposit: z.number().min(0),
    statusId: z.string().optional(),
    terms: z.string().optional(),
    notes: z.string().optional()
  });

  type FormValues = z.infer<typeof schema>;

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { driverId: '', vehicleId: '', startDate: '', endDate: '', rate: 0, rateType: 'daily', deposit: 0 }
  });

  // Data fetching via React Query
  const fetchContracts = async ({ queryKey }: any) => {
    const [_key, { page, limit, q }] = queryKey;
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(limit));
    if (q) params.set('q', q);
    const res = await apiService.getContracts(params.toString());
    return res;
  };

  const contractsQuery = useQuery(['contracts', { page, limit, q: searchTerm }], fetchContracts, { keepPreviousData: true });

  const driversQuery = useQuery(['drivers'], async () => {
    const res = await apiService.getDrivers();
    return res;
  });

  const vehiclesQuery = useQuery(['vehicles'], async () => {
    const res = await apiService.getVehicles();
    return res;
  });

  // Mutations
  const createOrUpdateMutation = useMutation(async (data: any) => {
    const url = editingContract ? `http://localhost:3001/api/contracts/${editingContract.id}` : 'http://localhost:3001/api/contracts';
    const method = editingContract ? 'PUT' : 'POST';
    const res = await apiService.createOrUpdateContract(url, method, data);
    if (!res.success) throw new Error('Error saving contract');
    return res;
  }, {
    onSuccess: () => queryClient.invalidateQueries(['contracts'])
  });

  const deleteMutation = useMutation(async (id: string) => {
    const res = await apiService.deleteContract(id);
    if (!res.success) throw new Error('Error deleting');
    return res;
  }, { onSuccess: () => queryClient.invalidateQueries(['contracts']) });

  const onSubmit = async (values: FormValues) => {
    try {
      await createOrUpdateMutation.mutateAsync(values);
      toast.success('Contrato guardado');
      reset();
      setShowForm(false);
      setEditingContract(null);
    } catch (err: any) {
      toast.error(err.message || 'Error al guardar');
    }
  };

  useEffect(() => { /* no-op: react-query handles fetches */ }, []);
  const triggerLoadData = (delay = 300) => {
    if (searchDebounce.current) window.clearTimeout(searchDebounce.current);
    // debounce search/filter changes
    searchDebounce.current = window.setTimeout(() => {
      loadData();
    }, delay) as unknown as number;
  };
  triggerRef.current = triggerLoadData;

  useEffect(() => {
    // whenever page/limit/searchTerm/statusFilter changes, fetch
    triggerRef.current(300);
  }, [page, limit, searchTerm, statusFilter]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Cargar contratos
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', String(limit));
      if (searchTerm) params.set('q', searchTerm);
      // statusFilter is name-based in UI; server expects statusId. We keep server-side pagination by q/page/limit
      const url = `http://localhost:3001/api/contracts?${params.toString()}`;
      const contractsResponse = await apiService.getContracts(params.toString());
      if (contractsResponse.success && Array.isArray(contractsResponse.data)) {
        setContracts(contractsResponse.data as Contract[]);
        if (contractsResponse.meta && typeof contractsResponse.meta.total === 'number') {
          setTotal(contractsResponse.meta.total);
        }
      } else { setContracts([]); toast.error('No se pudieron cargar los contratos'); }

      // Cargar conductores
      const driversResponse = await apiService.getDrivers();
      if (driversResponse.success && Array.isArray(driversResponse.data)) {
        setDrivers(driversResponse.data);
      } else { setDrivers([]); }

      // Cargar vehículos
      const vehiclesResponse = await apiService.getVehicles();
      if (vehiclesResponse.success && Array.isArray(vehiclesResponse.data)) {
        setVehicles(vehiclesResponse.data);
      } else { setVehicles([]); }
    } catch (error) {
      console.error('Error cargando datos:', error);
      // En caso de error, establecer arrays vacíos
      setContracts([]);
      setDrivers([]);
      setVehicles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Validaciones requeridas
    if (!formData.driverId) {
      newErrors.driverId = 'El conductor es requerido';
    }

    if (!formData.vehicleId) {
      newErrors.vehicleId = 'El vehículo es requerido';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'La fecha de inicio es requerida';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'La fecha de fin es requerida';
    }

    // Validación de fechas
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const today = new Date();

      if (startDate < today) {
        newErrors.startDate = 'La fecha de inicio no puede ser anterior a hoy';
      }

      if (endDate <= startDate) {
        newErrors.endDate = 'La fecha de fin debe ser posterior a la fecha de inicio';
      }
    }

    // Validación de tarifa
    if (formData.rate <= 0) {
      newErrors.rate = 'La tarifa debe ser mayor a 0';
    }

    // Validación de depósito
    if (formData.deposit < 0) {
      newErrors.deposit = 'El depósito no puede ser negativo';
    }

    // Validación de disponibilidad del conductor
    if (formData.driverId) {
      const driverHasActiveContract = contracts.some(contract => 
        contract.driverId === formData.driverId && 
        contract.status.name === 'Activo' &&
        contract.id !== editingContract?.id
      );
      
      if (driverHasActiveContract) {
        newErrors.driverId = 'El conductor ya tiene un contrato activo';
      }
    }

    // Validación de disponibilidad del vehículo
    if (formData.vehicleId) {
      const vehicleHasActiveContract = contracts.some(contract => 
        contract.vehicleId === formData.vehicleId && 
        contract.status.name === 'Activo' &&
        contract.id !== editingContract?.id
      );
      
      if (vehicleHasActiveContract) {
        newErrors.vehicleId = 'El vehículo ya está en uso';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateContractValue = () => {
    if (!formData.startDate || !formData.endDate || !formData.rate) {
      return 0;
    }

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    let multiplier = 1;
    switch (formData.rateType) {
      case 'weekly':
        multiplier = 7;
        break;
      case 'monthly':
        multiplier = 30;
        break;
      default:
        multiplier = 1;
    }

    const periods = Math.ceil(daysDiff / multiplier);
    return periods * formData.rate;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = editingContract ?
        await apiService.updateContract(editingContract.id, formData) :
        await apiService.createContract(formData);

      if (result.success && result.data) {
        setShowForm(false);
        setEditingContract(null);
        resetForm();
        loadData();
      } else {
        const errorData = result.error || 'Error al guardar el contrato';
        toast.error(errorData || 'Error al guardar el contrato');
      }
    } catch (error) {
      console.error('Error guardando contrato:', error);
      toast.error('Error al guardar el contrato');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (contract: Contract) => {
    setEditingContract(contract);
    setFormData({
      driverId: contract.driverId,
      vehicleId: contract.vehicleId,
      startDate: contract.startDate,
      endDate: contract.endDate,
      rate: contract.rate,
      rateType: contract.rateType,
      deposit: contract.deposit,
      statusId: contract.status.id,
      terms: contract.terms,
      notes: contract.notes
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este contrato?')) {
      return;
    }
    // optimistic update
    const previous = contracts;
    setContracts(prev => prev.filter(c => c.id !== id));
    try {
      const res = await apiService.deleteContract(id);
      if (res.success) {
        loadData();
        toast.success('Contrato eliminado');
      } else {
        setContracts(previous);
        toast.error(res.error || 'Error al eliminar el contrato');
      }
    } catch (error) {
      console.error('Error eliminando contrato:', error);
      setContracts(previous);
      toast.error('Error al eliminar el contrato');
    }
  };

  const resetForm = () => {
    setFormData({
      driverId: '',
      vehicleId: '',
      startDate: '',
      endDate: '',
      rate: 0,
      rateType: 'daily',
      deposit: 0,
      statusId: '1',
      terms: '',
      notes: ''
    });
    setErrors({});
  };

  const filteredContracts = Array.isArray(contracts) ? contracts.filter(contract => {
    const matchesSearch = 
      (contract.driver?.firstName && contract.driver.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contract.driver?.lastName && contract.driver.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contract.vehicle?.plate && contract.vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contract.vehicle?.brand && contract.vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || (contract.status && contract.status.name === statusFilter);
    
    return matchesSearch && matchesStatus;
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
      case 'Activo':
        return 'bg-green-100 text-green-800';
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelado':
        return 'bg-red-100 text-red-800';
      case 'Terminado':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Cargando contratos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestión de Contratos</h1>
          <p className="text-gray-600 mt-1">Administra todos los contratos de renta</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
              setEditingContract(null);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Contrato</span>
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
                placeholder="Buscar contratos..."
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
            <option value="Activo">Activo</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Cancelado">Cancelado</option>
            <option value="Terminado">Terminado</option>
          </select>
        </div>
      </div>

      {/* Contracts List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contrato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conductor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehículo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Período
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarifa
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
              {filteredContracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          Contrato #{contract.id}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(contract.createdAt)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {contract.driver.firstName} {contract.driver.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {contract.driver.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {contract.vehicle.brand} {contract.vehicle.model}
                    </div>
                    <div className="text-sm text-gray-500">
                      {contract.vehicle.plate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(contract.rate)}/{contract.rateType}
                    </div>
                    <div className="text-sm text-gray-500">
                      Depósito: {formatCurrency(contract.deposit)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contract.status.name)}`}>
                      {contract.status.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(contract)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(contract.id)}
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
                {editingContract ? 'Editar Contrato' : 'Nuevo Contrato'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* Contract Parties */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                {/* Paginator */}
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-600">Mostrando página {page} — {contracts.length} items en esta página</div>
                  <div className="flex items-center space-x-2">
                    <button
                      className="px-3 py-1 bg-gray-100 rounded"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page <= 1}
                    >Anterior</button>
                    <button
                      className="px-3 py-1 bg-gray-100 rounded"
                      onClick={() => setPage(p => p + 1)}
                      disabled={contracts.length < limit}
                    >Siguiente</button>
                    <select value={limit} onChange={(e) => { setLimit(parseInt(e.target.value, 10)); setPage(1); }} className="border rounded p-1">
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>

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
              </div>

              {/* Contract Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Inicio *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.startDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Fin *
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.endDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
                  )}
                </div>
              </div>

              {/* Financial Terms */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tarifa (RD$) *
                  </label>
                  <input
                    type="number"
                    value={formData.rate}
                    onChange={(e) => setFormData({...formData, rate: Number(e.target.value)})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.rate ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="3200"
                    min="0"
                  />
                  {errors.rate && (
                    <p className="text-red-500 text-sm mt-1">{errors.rate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Tarifa
                  </label>
                  <select
                    value={formData.rateType}
                    onChange={(e) => setFormData({...formData, rateType: e.target.value as 'daily' | 'weekly' | 'monthly'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="daily">Diaria</option>
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Depósito (RD$)
                  </label>
                  <input
                    type="number"
                    value={formData.deposit}
                    onChange={(e) => setFormData({...formData, deposit: Number(e.target.value)})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.deposit ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="5000"
                    min="0"
                  />
                  {errors.deposit && (
                    <p className="text-red-500 text-sm mt-1">{errors.deposit}</p>
                  )}
                </div>
              </div>

              {/* Contract Value Calculation */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-blue-900">Valor Total del Contrato</h3>
                    <p className="text-xs text-blue-700">
                      Calculado automáticamente basado en las fechas y tarifa
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-900">
                      {formatCurrency(calculateContractValue())}
                    </div>
                    <div className="text-xs text-blue-700">
                      {formData.rateType === 'daily' ? 'por día' : 
                       formData.rateType === 'weekly' ? 'por semana' : 'por mes'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contract Terms and Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    value={formData.statusId}
                    onChange={(e) => setFormData({...formData, statusId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1">Activo</option>
                    <option value="2">Pendiente</option>
                    <option value="3">Cancelado</option>
                    <option value="4">Terminado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duración del Contrato
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                    <span className="text-sm text-gray-900">
                      {formData.startDate && formData.endDate ? (
                        (() => {
                          const start = new Date(formData.startDate);
                          const end = new Date(formData.endDate);
                          const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
                          return `${days} días`;
                        })()
                      ) : 'Selecciona las fechas'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Terms and Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Términos del Contrato
                  </label>
                  <textarea
                    value={formData.terms}
                    onChange={(e) => setFormData({...formData, terms: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Términos y condiciones del contrato..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notas Adicionales
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Información adicional sobre el contrato..."
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
                  {isSubmitting ? 'Guardando...' : (editingContract ? 'Actualizar' : 'Crear')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}