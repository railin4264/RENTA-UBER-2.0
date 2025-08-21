import React, { useState, useEffect } from 'react';
import {
  Users,
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
  Phone,
  Mail,
  IdCard,
  Car,
  Calendar,
  MapPin,
  Shield,
  FileText,
  X
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import DeleteConfirmationModal from './DeleteConfirmationModal';

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  cedula: string;
  phone: string;
  email: string;
  license: string;
  licenseExpiry: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  status: { id: string; name: string };
  startDate: string;
  salary: number;
  commission: number;
  notes: string;
  documents: string[];
  createdAt: string;
  updatedAt: string;
}

interface DriverFormData {
  firstName: string;
  lastName: string;
  cedula: string;
  phone: string;
  email: string;
  license: string;
  licenseExpiry: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  statusId: string;
  startDate: string;
  salary: number;
  commission: number;
  notes: string;
  photo?: File;
  cedulaPhoto?: File;
  licensePhoto?: File;
  guarantors?: Array<{
    firstName: string;
    lastName: string;
    cedula: string;
    address: string;
    phone: string;
    workplace?: string;
    googleMapsLink?: string;
  }>;
}

interface ValidationErrors {
  [key: string]: string;
}

export default function DriverManagement() {
  const { getAuthHeaders } = useAuth();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState<DriverFormData>({
    firstName: '',
    lastName: '',
    cedula: '',
    phone: '',
    email: '',
    license: '',
    licenseExpiry: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    statusId: '1',
    startDate: '',
    salary: 0,
    commission: 0,
    notes: '',
    photo: undefined,
    cedulaPhoto: undefined,
    licensePhoto: undefined
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [includeGuarantor, setIncludeGuarantor] = useState(false);
  const [guarantor, setGuarantor] = useState({
    firstName: '',
    lastName: '',
    cedula: '',
    address: '',
    phone: '',
    workplace: '',
    googleMapsLink: ''
  });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    driverId: string | null;
    message: string;
    details: any[];
  }>({
    isOpen: false,
    driverId: null,
    message: '',
    details: []
  });

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3001/api/drivers', {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const result = await response.json();
        // El backend devuelve { success: true, data: [...], count: number }
        const driversData = result.success && Array.isArray(result.data) ? result.data : [];
        setDrivers(driversData);
      } else {
        setDrivers([]);
        toast.error('No se pudieron cargar los conductores');
      }
    } catch (error) {
      console.error('Error cargando conductores:', error);
      // En caso de error, establecer un array vacío
      setDrivers([]);
      toast.error('Error de conexión al cargar conductores');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Validaciones requeridas
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'El apellido debe tener al menos 2 caracteres';
    }

    // Validación de cédula
    if (!formData.cedula.trim()) {
      newErrors.cedula = 'La cédula es requerida';
    } else if (!/^\d{11}$/.test(formData.cedula)) {
      newErrors.cedula = 'La cédula debe tener 11 dígitos';
    }

    // Validación de teléfono
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!/^\d{3}-\d{3}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = 'El teléfono debe tener el formato 809-123-4567';
    }

    // Validación de email
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email debe tener un formato válido';
    }

    // Validación de licencia
    if (!formData.license.trim()) {
      newErrors.license = 'La licencia es requerida';
    } else if (formData.license.length < 6) {
      newErrors.license = 'La licencia debe tener al menos 6 caracteres';
    }

    // Validación de fecha de vencimiento
    if (!formData.licenseExpiry) {
      newErrors.licenseExpiry = 'La fecha de vencimiento es requerida';
    } else {
      const expiryDate = new Date(formData.licenseExpiry);
      const today = new Date();
      if (expiryDate <= today) {
        newErrors.licenseExpiry = 'La licencia no puede estar vencida';
      }
    }

    // Validación de dirección
    if (!formData.address?.trim()) {
      newErrors.address = 'La dirección es requerida';
    }

    // Validación de contacto de emergencia
    if (!formData.emergencyContact?.trim()) {
      newErrors.emergencyContact = 'El contacto de emergencia es requerido';
    }

    if (!formData.emergencyPhone?.trim()) {
      newErrors.emergencyPhone = 'El teléfono de emergencia es requerido';
    } else if (!/^\d{3}-\d{3}-\d{4}$/.test(formData.emergencyPhone)) {
      newErrors.emergencyPhone = 'El teléfono debe tener el formato 809-123-4567';
    }

    // Validación de salario
    if (formData.salary <= 0) {
      newErrors.salary = 'El salario debe ser mayor a 0';
    }

    // Validación de comisión
    if (formData.commission < 0 || formData.commission > 100) {
      newErrors.commission = 'La comisión debe estar entre 0 y 100%';
    }

    // Validación de fecha de inicio
    if (!formData.startDate) {
      newErrors.startDate = 'La fecha de inicio es requerida';
    }

    // Validación de garante si está habilitado
    if (includeGuarantor) {
      if (!guarantor.firstName.trim()) newErrors['guarantor.firstName'] = 'Nombre del garante requerido';
      if (!guarantor.lastName.trim()) newErrors['guarantor.lastName'] = 'Apellido del garante requerido';
      if (!/^\d{11}$/.test(guarantor.cedula || '')) newErrors['guarantor.cedula'] = 'Cédula del garante inválida';
      if (!guarantor.address.trim()) newErrors['guarantor.address'] = 'Dirección del garante requerida';
      if (!/^\d{3}-\d{3}-\d{4}$/.test(guarantor.phone || '')) newErrors['guarantor.phone'] = 'Teléfono del garante inválido';
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
      const url = editingDriver 
        ? `http://localhost:3001/api/drivers/${editingDriver.id}`
        : 'http://localhost:3001/api/drivers';
      
      const method = editingDriver ? 'PUT' : 'POST';

      const bodyPayload: any = {
        ...formData,
        ...(includeGuarantor ? { guarantors: [guarantor] } : {})
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(bodyPayload),
      });

      const result = await response.json();

      if (response.ok && result?.data?.id) {
        const driverId = result.data.id;

        // Upload profile photo if provided
        if (formData.photo) {
          const fd = new FormData();
          fd.append('photo', formData.photo);
          try {
            const uploadRes = await fetch(`http://localhost:3001/api/drivers/${driverId}/photo`, {
              method: 'POST',
              headers: {
                // Authorization must be sent, but NOT content-type for FormData
                ...(getAuthHeaders().Authorization ? { Authorization: getAuthHeaders().Authorization } : {})
              },
              body: fd
            });
            if (!uploadRes.ok) {
              const err = await uploadRes.json().catch(() => ({}));
              toast.error(err?.message || 'Error al subir la foto de perfil');
            }
          } catch (err) {
            toast.error('Error de conexión al subir la foto de perfil');
          }
        }

        setShowForm(false);
        setEditingDriver(null);
        resetForm();
        loadDrivers();
        toast.success(editingDriver ? 'Conductor actualizado' : 'Conductor creado');
      } else {
        toast.error(result?.error || result?.message || 'Error al guardar el conductor');
      }
    } catch (error) {
      console.error('Error guardando conductor:', error);
      toast.error('Error al guardar el conductor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (driver: Driver) => {
    setEditingDriver(driver);
    setFormData({
      firstName: driver.firstName,
      lastName: driver.lastName,
      cedula: driver.cedula,
      phone: driver.phone,
      email: driver.email,
      license: driver.license || '',
      licenseExpiry: driver.licenseExpiry || '',
      address: driver.address || '',
      emergencyContact: driver.emergencyContact || '',
      emergencyPhone: driver.emergencyPhone || '',
      statusId: driver.status ? driver.status.id : '',
      startDate: driver.startDate,
      salary: driver.salary,
      commission: driver.commission,
      notes: driver.notes
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este conductor?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/drivers/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Conductor eliminado exitosamente');
        loadDrivers();
      } else {
        // Mostrar modal con detalles del error
        setDeleteModal({
          isOpen: true,
          driverId: id,
          message: result.message,
          details: result.details || []
        });
      }
    } catch (error) {
      console.error('Error eliminando conductor:', error);
      toast.error('Error de conexión al eliminar el conductor');
    }
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      driverId: null,
      message: '',
      details: []
    });
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      cedula: '',
      phone: '',
      email: '',
      license: '',
      licenseExpiry: '',
      address: '',
      emergencyContact: '',
      emergencyPhone: '',
      statusId: '1',
      startDate: '',
      salary: 0,
      commission: 0,
      notes: '',
      photo: undefined,
      cedulaPhoto: undefined,
      licensePhoto: undefined
    });
    setErrors({});
    setIncludeGuarantor(false);
    setGuarantor({ firstName: '', lastName: '', cedula: '', address: '', phone: '', workplace: '', googleMapsLink: '' });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'cedula' | 'license') => {
    const files = e.target.files;
    if (!files) return;

    setFormData({ ...formData, [type]: files[0] });
  };

  const removePhoto = (type: 'photo' | 'cedula' | 'license') => {
    setFormData({ ...formData, [type]: undefined });
  };

  const filteredDrivers = Array.isArray(drivers) ? drivers.filter(driver => {
    const matchesSearch = 
      (driver.firstName && driver.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (driver.lastName && driver.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (driver.cedula && driver.cedula.includes(searchTerm)) ||
      (driver.phone && driver.phone.includes(searchTerm));
    
    const matchesStatus = statusFilter === 'all' || (driver.status && driver.status.name === statusFilter);
    
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Cargando conductores...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestión de Conductores</h1>
          <p className="text-gray-600 mt-1">Administra la información de todos los conductores</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
              setEditingDriver(null);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Conductor</span>
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
                placeholder="Buscar conductores..."
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
            <option value="Inactivo">Inactivo</option>
            <option value="Suspendido">Suspendido</option>
          </select>
        </div>
      </div>

      {/* Drivers List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conductor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Licencia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salario
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
              {filteredDrivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {driver.firstName || 'N/A'} {driver.lastName || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          Cédula: {driver.cedula || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{driver.phone || 'N/A'}</div>
                    <div className="text-sm text-gray-500">{driver.email || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{driver.license || 'N/A'}</div>
                    <div className="text-sm text-gray-500">
                      Vence: {driver.licenseExpiry ? formatDate(driver.licenseExpiry) : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {driver.salary ? formatCurrency(driver.salary) : 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {driver.commission ? `${driver.commission}% comisión` : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      driver.status?.name === 'Activo' ? 'bg-green-100 text-green-800' :
                      driver.status?.name === 'Inactivo' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {driver.status?.name || 'Sin estado'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(driver)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(driver.id || '')}
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
                {editingDriver ? 'Editar Conductor' : 'Nuevo Conductor'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName || ''}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Carlos"
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName || ''}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Martínez"
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cédula *
                  </label>
                  <input
                    type="text"
                    value={formData.cedula || ''}
                    onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.cedula ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="12345678901"
                    maxLength={11}
                  />
                  {errors.cedula && <p className="text-red-500 text-sm mt-1">{errors.cedula}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="809-123-4567"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="carlos@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección *
                  </label>
                  <input
                    type="text"
                    value={formData.address || ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Calle Principal #123"
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>
              </div>

              {/* License Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Licencia *
                  </label>
                  <input
                    type="text"
                    value={formData.license || ''}
                    onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.license ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="ABC123456"
                  />
                  {errors.license && <p className="text-red-500 text-sm mt-1">{errors.license}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Vencimiento *
                  </label>
                  <input
                    type="date"
                    value={formData.licenseExpiry || ''}
                    onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.licenseExpiry ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.licenseExpiry && <p className="text-red-500 text-sm mt-1">{errors.licenseExpiry}</p>}
                </div>
              </div>

              {/* Photos Upload */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Foto de Perfil</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      setFormData({ ...formData, photo: file });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.photo && (
                    <p className="text-xs text-gray-500 mt-1">{formData.photo.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Foto Cédula</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      setFormData({ ...formData, cedulaPhoto: file });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.cedulaPhoto && (
                    <p className="text-xs text-gray-500 mt-1">{formData.cedulaPhoto.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Foto Licencia</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      setFormData({ ...formData, licensePhoto: file });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.licensePhoto && (
                    <p className="text-xs text-gray-500 mt-1">{formData.licensePhoto.name}</p>
                  )}
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contacto de Emergencia *
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyContact || ''}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.emergencyContact ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="María Martínez"
                  />
                  {errors.emergencyContact && <p className="text-red-500 text-sm mt-1">{errors.emergencyContact}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono de Emergencia *
                  </label>
                  <input
                    type="tel"
                    value={formData.emergencyPhone || ''}
                    onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.emergencyPhone ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="809-987-6543"
                  />
                  {errors.emergencyPhone && <p className="text-red-500 text-sm mt-1">{errors.emergencyPhone}</p>}
                </div>
              </div>

              {/* Employment Information */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Inicio *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate || ''}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.startDate ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                </div>

            {/* Guarantor (optional) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Agregar Garante (opcional)</label>
                <button
                  type="button"
                  onClick={() => setIncludeGuarantor(!includeGuarantor)}
                  className={`px-3 py-1 rounded-lg text-sm ${includeGuarantor ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}
                >
                  {includeGuarantor ? 'Quitar garante' : 'Agregar garante'}
                </button>
              </div>
              {includeGuarantor && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border rounded-lg p-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                    <input
                      type="text"
                      value={guarantor.firstName}
                      onChange={(e) => setGuarantor({ ...guarantor, firstName: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors['guarantor.firstName'] ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors['guarantor.firstName'] && <p className="text-red-500 text-sm mt-1">{errors['guarantor.firstName']}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Apellido *</label>
                    <input
                      type="text"
                      value={guarantor.lastName}
                      onChange={(e) => setGuarantor({ ...guarantor, lastName: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors['guarantor.lastName'] ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors['guarantor.lastName'] && <p className="text-red-500 text-sm mt-1">{errors['guarantor.lastName']}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cédula *</label>
                    <input
                      type="text"
                      value={guarantor.cedula}
                      onChange={(e) => setGuarantor({ ...guarantor, cedula: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors['guarantor.cedula'] ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="12345678901"
                      maxLength={11}
                    />
                    {errors['guarantor.cedula'] && <p className="text-red-500 text-sm mt-1">{errors['guarantor.cedula']}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono *</label>
                    <input
                      type="tel"
                      value={guarantor.phone}
                      onChange={(e) => setGuarantor({ ...guarantor, phone: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors['guarantor.phone'] ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="809-123-4567"
                    />
                    {errors['guarantor.phone'] && <p className="text-red-500 text-sm mt-1">{errors['guarantor.phone']}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dirección *</label>
                    <input
                      type="text"
                      value={guarantor.address}
                      onChange={(e) => setGuarantor({ ...guarantor, address: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors['guarantor.address'] ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Calle..."
                    />
                    {errors['guarantor.address'] && <p className="text-red-500 text-sm mt-1">{errors['guarantor.address']}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trabajo (opcional)</label>
                    <input
                      type="text"
                      value={guarantor.workplace}
                      onChange={(e) => setGuarantor({ ...guarantor, workplace: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 border-gray-300"
                      placeholder="Empresa / Ocupación"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Google Maps (opcional)</label>
                    <input
                      type="url"
                      value={guarantor.googleMapsLink}
                      onChange={(e) => setGuarantor({ ...guarantor, googleMapsLink: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 border-gray-300"
                      placeholder="https://maps.google.com/..."
                    />
                  </div>
                </div>
              )}
            </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salario (RD$) *
                  </label>
                  <input
                    type="number"
                    value={formData.salary || ''}
                    onChange={(e) => setFormData({ ...formData, salary: parseFloat(e.target.value) || 0 })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.salary ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="25000"
                    min="0"
                  />
                  {errors.salary && <p className="text-red-500 text-sm mt-1">{errors.salary}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comisión (%) *
                  </label>
                  <input
                    type="number"
                    value={formData.commission || ''}
                    onChange={(e) => setFormData({ ...formData, commission: parseFloat(e.target.value) || 0 })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.commission ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="15"
                    min="0"
                    max="100"
                  />
                  {errors.commission && <p className="text-red-500 text-sm mt-1">{errors.commission}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    value={formData.statusId || ''}
                    onChange={(e) => setFormData({ ...formData, statusId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="1">Activo</option>
                    <option value="2">Inactivo</option>
                    <option value="3">Suspendido</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas
                </label>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Información adicional sobre el conductor..."
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
                  {isSubmitting ? 'Guardando...' : (editingDriver ? 'Actualizar' : 'Crear')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        title="No se puede eliminar el conductor"
        message={deleteModal.message}
        details={deleteModal.details}
      />
    </div>
  );
}