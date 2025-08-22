import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import {
  Car,
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
  FileText,
  Wrench,
  Fuel,
  Gauge,
  Settings
} from 'lucide-react';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  plate: string;
  year: number;
  color: string;
  vin: string;
  engine: string;
  transmission: string;
  fuelType: string;
  mileage: number;
  lastMaintenance: string;
  nextMaintenance: string;
  insuranceExpiry: string;
  registrationExpiry: string;
  status: { id: string; name: string };
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  notes: string;
  documents: string[];
  createdAt: string;
  updatedAt: string;
}

interface VehicleFormData {
  brand: string;
  model: string;
  plate: string;
  year: number;
  color: string;
  vin: string;
  engine: string;
  transmission: string;
  fuelType: string;
  mileage: number;
  lastMaintenance: string;
  nextMaintenance: string;
  insuranceExpiry: string;
  registrationExpiry: string;
  statusId: string;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  notes: string;
  generalPhoto?: File;
  currentConditionPhotos?: File[];
}

interface ValidationErrors {
  [key: string]: string;
}

export default function VehicleManagement() {
  const { getAuthHeaders } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState<VehicleFormData>({
    brand: '',
    model: '',
    plate: '',
    year: new Date().getFullYear(),
    color: '',
    vin: '',
    engine: '',
    transmission: 'Manual',
    fuelType: 'Gasolina',
    mileage: 0,
    lastMaintenance: '',
    nextMaintenance: '',
    insuranceExpiry: '',
    registrationExpiry: '',
    statusId: '1',
    purchaseDate: '',
    purchasePrice: 0,
    currentValue: 0,
    notes: '',
    generalPhoto: undefined,
    currentConditionPhotos: []
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      setIsLoading(true);
      const api = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${api}/vehicles`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const result = await response.json();
        // El backend devuelve { success: true, data: [...], count: number }
        const vehiclesData = result.success && Array.isArray(result.data) ? result.data : [];
        setVehicles(vehiclesData);
      } else {
        setVehicles([]);
        toast.error('No se pudieron cargar los vehículos');
      }
    } catch (error) {
      console.error('Error cargando vehículos:', error);
      setVehicles([]);
      toast.error('Error de conexión al cargar vehículos');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Validaciones requeridas
    if (!formData.brand.trim()) {
      newErrors.brand = 'La marca es requerida';
    }

    if (!formData.model.trim()) {
      newErrors.model = 'El modelo es requerido';
    }

    // Validación de placa
    if (!formData.plate.trim()) {
      newErrors.plate = 'La placa es requerida';
    } else if (!/^[A-Z]{3}-\d{3}$/.test(formData.plate)) {
      newErrors.plate = 'La placa debe tener el formato ABC-123';
    }

    // Validación de año
    const currentYear = new Date().getFullYear();
    if (formData.year < 1990 || formData.year > currentYear + 1) {
      newErrors.year = `El año debe estar entre 1990 y ${currentYear + 1}`;
    }

    // Validación de color
    if (!formData.color.trim()) {
      newErrors.color = 'El color es requerido';
    }

    // Validación de VIN
    if (!formData.vin.trim()) {
      newErrors.vin = 'El VIN es requerido';
    } else if (formData.vin.length !== 17) {
      newErrors.vin = 'El VIN debe tener 17 caracteres';
    }

    // Validación de motor
    if (!formData.engine.trim()) {
      newErrors.engine = 'El motor es requerido';
    }

    // Validación de kilometraje
    if (formData.mileage < 0) {
      newErrors.mileage = 'El kilometraje no puede ser negativo';
    }

    // Validación de fechas
    if (formData.lastMaintenance && formData.nextMaintenance) {
      const lastMaintenance = new Date(formData.lastMaintenance);
      const nextMaintenance = new Date(formData.nextMaintenance);
      if (nextMaintenance <= lastMaintenance) {
        newErrors.nextMaintenance = 'La próxima mantenimiento debe ser después del último';
      }
    }

    // Validación de seguro
    if (formData.insuranceExpiry) {
      const insuranceExpiry = new Date(formData.insuranceExpiry);
      const today = new Date();
      if (insuranceExpiry <= today) {
        newErrors.insuranceExpiry = 'El seguro no puede estar vencido';
      }
    }

    // Validación de registro
    if (formData.registrationExpiry) {
      const registrationExpiry = new Date(formData.registrationExpiry);
      const today = new Date();
      if (registrationExpiry <= today) {
        newErrors.registrationExpiry = 'El registro no puede estar vencido';
      }
    }

    // Validación de precio
    if (formData.purchasePrice <= 0) {
      newErrors.purchasePrice = 'El precio de compra debe ser mayor a 0';
    }

    if (formData.currentValue < 0) {
      newErrors.currentValue = 'El valor actual no puede ser negativo';
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
      const url = editingVehicle 
        ? `${api}/vehicles/${editingVehicle.id}`
        : `${api}/vehicles`;
      
      const method = editingVehicle ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result?.data?.id) {
        const vehicleId = result.data.id;

        // Upload general photo
        if (formData.generalPhoto) {
          const fd = new FormData();
          fd.append('photo', formData.generalPhoto);
          try {
            const api = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
            const uploadRes = await fetch(`${api}/vehicles/${vehicleId}/photo`, {
              method: 'POST',
              headers: {
                ...(getAuthHeaders().Authorization ? { Authorization: getAuthHeaders().Authorization } : {})
              },
              body: fd
            });
            if (!uploadRes.ok) {
              const err = await uploadRes.json().catch(() => ({}));
              toast.error(err?.message || 'Error al subir la foto del vehículo');
            }
          } catch (err) {
            toast.error('Error de conexión al subir la foto del vehículo');
          }
        }

        setShowForm(false);
        setEditingVehicle(null);
        resetForm();
        loadVehicles();
        toast.success(editingVehicle ? 'Vehículo actualizado' : 'Vehículo creado');
      } else {
        toast.error(result?.error || result?.message || 'Error al guardar el vehículo');
      }
    } catch (error) {
      console.error('Error guardando vehículo:', error);
      toast.error('Error al guardar el vehículo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      brand: vehicle.brand,
      model: vehicle.model,
      plate: vehicle.plate,
      year: vehicle.year,
      color: vehicle.color,
      vin: vehicle.vin,
      engine: vehicle.engine,
      transmission: vehicle.transmission,
      fuelType: vehicle.fuelType,
      mileage: vehicle.mileage,
      lastMaintenance: vehicle.lastMaintenance,
      nextMaintenance: vehicle.nextMaintenance,
      insuranceExpiry: vehicle.insuranceExpiry,
      registrationExpiry: vehicle.registrationExpiry,
      statusId: vehicle.status.id,
      purchaseDate: vehicle.purchaseDate,
      purchasePrice: vehicle.purchasePrice,
      currentValue: vehicle.currentValue,
      notes: vehicle.notes
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este vehículo?')) {
      return;
    }

    try {
      const api = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${api}/vehicles/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        loadVehicles();
        toast.success('Vehículo eliminado');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Error al eliminar el vehículo');
      }
    } catch (error) {
      console.error('Error eliminando vehículo:', error);
      toast.error('Error al eliminar el vehículo');
    }
  };

  const resetForm = () => {
    setFormData({
      brand: '',
      model: '',
      plate: '',
      year: new Date().getFullYear(),
      color: '',
      vin: '',
      engine: '',
      transmission: 'Manual',
      fuelType: 'Gasolina',
      mileage: 0,
      lastMaintenance: '',
      nextMaintenance: '',
      insuranceExpiry: '',
      registrationExpiry: '',
      statusId: '1',
      purchaseDate: '',
      purchasePrice: 0,
      currentValue: 0,
      notes: '',
      generalPhoto: undefined,
      currentConditionPhotos: []
    });
    setErrors({});
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'general' | 'condition') => {
    const files = e.target.files;
    if (!files) return;

    if (type === 'general') {
      setFormData({ ...formData, generalPhoto: files[0] });
    } else {
      const fileArray = Array.from(files);
      setFormData({ ...formData, currentConditionPhotos: fileArray });
    }
  };

  const removePhoto = (type: 'general' | 'condition', index?: number) => {
    if (type === 'general') {
      setFormData({ ...formData, generalPhoto: undefined });
    } else if (index !== undefined) {
      const newPhotos = formData.currentConditionPhotos?.filter((_, i) => i !== index) || [];
      setFormData({ ...formData, currentConditionPhotos: newPhotos });
    }
  };

  const filteredVehicles = Array.isArray(vehicles) ? vehicles.filter(vehicle => {
    const matchesSearch = 
      (vehicle.brand && vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (vehicle.model && vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (vehicle.plate && vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (vehicle.color && vehicle.color.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || (vehicle.status && vehicle.status.name === statusFilter);
    
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

  const formatMileage = (mileage: number) => {
    return mileage.toLocaleString('es-DO') + ' km';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disponible':
        return 'bg-green-100 text-green-800';
      case 'En Uso':
        return 'bg-blue-100 text-blue-800';
      case 'Mantenimiento':
        return 'bg-orange-100 text-orange-800';
      case 'Fuera de Servicio':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Cargando vehículos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestión de Vehículos</h1>
          <p className="text-gray-600 mt-1">Administra la flota de vehículos</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
              setEditingVehicle(null);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Vehículo</span>
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
                placeholder="Buscar vehículos..."
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
            <option value="Disponible">Disponible</option>
            <option value="En Uso">En Uso</option>
            <option value="Mantenimiento">Mantenimiento</option>
            <option value="Fuera de Servicio">Fuera de Servicio</option>
          </select>
        </div>
      </div>

      {/* Vehicles List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehículo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Especificaciones
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mantenimiento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
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
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                        <Car className="w-5 h-5 text-white" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {vehicle.brand} {vehicle.model}
                        </div>
                        <div className="text-sm text-gray-500">
                          Placa: {vehicle.plate}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{vehicle.year} - {vehicle.color}</div>
                    <div className="text-sm text-gray-500">{vehicle.engine}</div>
                    <div className="text-sm text-gray-500">{formatMileage(vehicle.mileage)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      Último: {vehicle.lastMaintenance ? formatDate(vehicle.lastMaintenance) : 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      Próximo: {vehicle.nextMaintenance ? formatDate(vehicle.nextMaintenance) : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(vehicle.currentValue)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Compra: {formatCurrency(vehicle.purchasePrice)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vehicle.status.name)}`}>
                      {vehicle.status.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(vehicle)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(vehicle.id)}
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
                {editingVehicle ? 'Editar Vehículo' : 'Nuevo Vehículo'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marca *
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.brand ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Toyota"
                  />
                  {errors.brand && (
                    <p className="text-red-500 text-sm mt-1">{errors.brand}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modelo *
                  </label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({...formData, model: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.model ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Corolla"
                  />
                  {errors.model && (
                    <p className="text-red-500 text-sm mt-1">{errors.model}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Placa *
                  </label>
                  <input
                    type="text"
                    value={formData.plate}
                    onChange={(e) => setFormData({...formData, plate: e.target.value.toUpperCase()})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.plate ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="ABC-123"
                    maxLength={7}
                  />
                  {errors.plate && (
                    <p className="text-red-500 text-sm mt-1">{errors.plate}</p>
                  )}
                </div>
              </div>

              {/* Vehicle Details */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Año *
                  </label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: Number(e.target.value)})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.year ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="2020"
                    min="1990"
                    max={new Date().getFullYear() + 1}
                  />
                  {errors.year && (
                    <p className="text-red-500 text-sm mt-1">{errors.year}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color *
                  </label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.color ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Blanco"
                  />
                  {errors.color && (
                    <p className="text-red-500 text-sm mt-1">{errors.color}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    VIN *
                  </label>
                  <input
                    type="text"
                    value={formData.vin}
                    onChange={(e) => setFormData({...formData, vin: e.target.value.toUpperCase()})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.vin ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="1HGBH41JXMN109186"
                    maxLength={17}
                  />
                  {errors.vin && (
                    <p className="text-red-500 text-sm mt-1">{errors.vin}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kilometraje
                  </label>
                  <input
                    type="number"
                    value={formData.mileage}
                    onChange={(e) => setFormData({...formData, mileage: Number(e.target.value)})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.mileage ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="45000"
                    min="0"
                  />
                  {errors.mileage && (
                    <p className="text-red-500 text-sm mt-1">{errors.mileage}</p>
                  )}
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motor *
                  </label>
                  <input
                    type="text"
                    value={formData.engine}
                    onChange={(e) => setFormData({...formData, engine: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.engine ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="1.8L 4-Cylinder"
                  />
                  {errors.engine && (
                    <p className="text-red-500 text-sm mt-1">{errors.engine}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transmisión
                  </label>
                  <select
                    value={formData.transmission}
                    onChange={(e) => setFormData({...formData, transmission: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Manual">Manual</option>
                    <option value="Automático">Automático</option>
                    <option value="CVT">CVT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Combustible
                  </label>
                  <select
                    value={formData.fuelType}
                    onChange={(e) => setFormData({...formData, fuelType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Gasolina">Gasolina</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Híbrido">Híbrido</option>
                    <option value="Eléctrico">Eléctrico</option>
                  </select>
                </div>
              </div>

              {/* Maintenance Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Último Mantenimiento
                  </label>
                  <input
                    type="date"
                    value={formData.lastMaintenance}
                    onChange={(e) => setFormData({...formData, lastMaintenance: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Próximo Mantenimiento
                  </label>
                  <input
                    type="date"
                    value={formData.nextMaintenance}
                    onChange={(e) => setFormData({...formData, nextMaintenance: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.nextMaintenance ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.nextMaintenance && (
                    <p className="text-red-500 text-sm mt-1">{errors.nextMaintenance}</p>
                  )}
                </div>
              </div>

              {/* Expiry Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vencimiento Seguro
                  </label>
                  <input
                    type="date"
                    value={formData.insuranceExpiry}
                    onChange={(e) => setFormData({...formData, insuranceExpiry: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.insuranceExpiry ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.insuranceExpiry && (
                    <p className="text-red-500 text-sm mt-1">{errors.insuranceExpiry}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vencimiento Registro
                  </label>
                  <input
                    type="date"
                    value={formData.registrationExpiry}
                    onChange={(e) => setFormData({...formData, registrationExpiry: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.registrationExpiry ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.registrationExpiry && (
                    <p className="text-red-500 text-sm mt-1">{errors.registrationExpiry}</p>
                  )}
                </div>
              </div>

              {/* Financial Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Compra
                  </label>
                  <input
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio de Compra (RD$) *
                  </label>
                  <input
                    type="number"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({...formData, purchasePrice: Number(e.target.value)})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.purchasePrice ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="850000"
                    min="0"
                  />
                  {errors.purchasePrice && (
                    <p className="text-red-500 text-sm mt-1">{errors.purchasePrice}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor Actual (RD$)
                  </label>
                  <input
                    type="number"
                    value={formData.currentValue}
                    onChange={(e) => setFormData({...formData, currentValue: Number(e.target.value)})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.currentValue ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="650000"
                    min="0"
                  />
                  {errors.currentValue && (
                    <p className="text-red-500 text-sm mt-1">{errors.currentValue}</p>
                  )}
                </div>
              </div>

              {/* Status and Notes */}
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
                    <option value="1">Disponible</option>
                    <option value="2">En Uso</option>
                    <option value="3">Mantenimiento</option>
                    <option value="4">Fuera de Servicio</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notas
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Información adicional sobre el vehículo..."
                  />
                </div>
              </div>

              {/* Photo Upload Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Fotos del Vehículo</h3>
                
                {/* General Photo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto General del Vehículo
                  </label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e, 'general')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {formData.generalPhoto && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{formData.generalPhoto.name}</span>
                        <button
                          type="button"
                          onClick={() => removePhoto('general')}
                          className="text-red-600 hover:text-red-800"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Condition Photos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fotos del Estado Actual (Múltiples)
                  </label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handlePhotoUpload(e, 'condition')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {formData.currentConditionPhotos && formData.currentConditionPhotos.length > 0 && (
                      <div className="space-y-2">
                        {formData.currentConditionPhotos.map((photo, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">{photo.name}</span>
                            <button
                              type="button"
                              onClick={() => removePhoto('condition', index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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
                  {isSubmitting ? 'Guardando...' : (editingVehicle ? 'Actualizar' : 'Crear')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}