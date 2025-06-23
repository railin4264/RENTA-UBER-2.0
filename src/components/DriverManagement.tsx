import { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Phone,
  MapPin,
  Calendar,
  Car,
  User,
  Users,
  ExternalLink,
  Edit2,
  Trash2,
  Eye
} from 'lucide-react';
import type { Driver, Vehicle } from '../types';

type Guarantor = {
  firstName: string;
  lastName: string;
  cedula: string;
  address: string;
  googleMapsLink: string;
  workplace: string;
  phone: string;
  photo: string;
  cedulaPhoto: string;
};

type DriverWithGuarantors = Driver & {
  guarantors?: Guarantor[];
};

type FormErrors = {
  [key: string]: string;
};

export default function DriverManagement() {
  const [drivers, setDrivers] = useState<DriverWithGuarantors[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    cedula: '',
    license: '',
    startDate: '',
    address: '',
    googleMapsLink: '',
    phone: '',
    workplace: '',
    vehicleId: '',
    photo: '',
    cedulaPhoto: '',
    licensePhoto: '',
  });

  const [showGuarantor, setShowGuarantor] = useState(false);
  const [guarantorData, setGuarantorData] = useState({
    firstName: '',
    lastName: '',
    cedula: '',
    address: '',
    googleMapsLink: '',
    workplace: '',
    phone: '',
    photo: '',
    cedulaPhoto: '',
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [selectedDriver, setSelectedDriver] = useState<DriverWithGuarantors | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:3002/api/drivers')
      .then(res => res.json())
      .then(data => {
        setDrivers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    fetch('http://localhost:3002/api/vehicles')
      .then(res => res.json())
      .then(data => setVehicles(data));
  }, []);

  useEffect(() => {
    if (formData.photo) {
      setPhotoPreview(`http://localhost:3002/uploads/${formData.photo}`);
    } else {
      setPhotoPreview(null);
    }
  }, [formData.photo]);

  // Subida automática de imagen al backend con Multer
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoPreview(URL.createObjectURL(file));
      // Subir la imagen al backend
      const formDataData = new FormData();
      formDataData.append('photo', file);
      try {
        const res = await fetch('http://localhost:3002/api/upload', {
          method: 'POST',
          body: formDataData,
        });
        const data = await res.json();
        setFormData(prev => ({ ...prev, photo: data.filename }));
      } catch (err) {
        alert('Error subiendo la imagen');
      }
    }
  };

  // Validaciones
  const validateForm = () => {
    const errors: FormErrors = {};
    if (!formData.firstName.trim()) errors.firstName = 'El nombre es requerido';
    if (!formData.lastName.trim()) errors.lastName = 'El apellido es requerido';
    if (!/^\d{11,}$/.test(formData.cedula)) errors.cedula = 'Cédula inválida';
    if (!formData.license.trim()) errors.license = 'Licencia requerida';
    if (!formData.startDate) errors.startDate = 'Fecha requerida';
    if (!formData.address.trim()) errors.address = 'Dirección requerida';
    if (!/^\d{10,}$/.test(formData.phone)) errors.phone = 'Teléfono inválido';
    if (showGuarantor || (editingId && guarantorData.firstName)) {
      if (!guarantorData.firstName.trim()) errors.guarantorFirstName = 'Nombre garante requerido';
      if (!guarantorData.lastName.trim()) errors.guarantorLastName = 'Apellido garante requerido';
      if (!/^\d{11,}$/.test(guarantorData.cedula)) errors.guarantorCedula = 'Cédula garante inválida';
      if (!guarantorData.address.trim()) errors.guarantorAddress = 'Dirección garante requerida';
      if (!/^\d{10,}$/.test(guarantorData.phone)) errors.guarantorPhone = 'Teléfono garante inválido';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const driverPayload: any = {
      ...formData,
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
      ...(showGuarantor && guarantorData.firstName
        ? { guarantors: [{ ...guarantorData, photo: '', cedulaPhoto: '' }] }
        : {}),
    };

    try {
      if (editingId) {
        const res = await fetch(`http://localhost:3002/api/drivers/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(driverPayload),
        });
        if (!res.ok) {
          alert('Error actualizando chofer');
          return;
        }
        const data = await res.json();
        setDrivers(drivers.map(d => d.id === editingId ? data : d));
      } else {
        const res = await fetch('http://localhost:3002/api/drivers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(driverPayload),
        });
        if (!res.ok) {
          alert('Error creando chofer');
          return;
        }
        const data = await res.json();
        setDrivers([...drivers, data]);
      }
      setShowForm(false);
      resetForm();
    } catch (err) {
      alert('Error en la petición');
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      cedula: '',
      license: '',
      startDate: '',
      address: '',
      googleMapsLink: '',
      phone: '',
      workplace: '',
      vehicleId: '',
      photo: '',
      cedulaPhoto: '',
      licensePhoto: '',
    });
    setGuarantorData({
      firstName: '',
      lastName: '',
      cedula: '',
      address: '',
      googleMapsLink: '',
      workplace: '',
      phone: '',
      photo: '',
      cedulaPhoto: '',
    });
    setPhotoPreview(null);
    setShowGuarantor(false);
    setEditingId(null);
    setFormErrors({});
  };

  const filteredDrivers = drivers.filter(driver =>
    (driver.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (driver.lastName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (driver.license?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar este chofer?')) return;
    await fetch(`http://localhost:3002/api/drivers/${id}`, { method: 'DELETE' });
    setDrivers(drivers.filter(d => d.id !== id));
  };

  const handleEdit = (driver: DriverWithGuarantors) => {
    setEditingId(driver.id);
    setShowForm(true);
    setFormData({
      firstName: driver.firstName || '',
      lastName: driver.lastName || '',
      cedula: driver.cedula || '',
      license: driver.license || '',
      startDate: driver.startDate ? driver.startDate.slice(0, 10) : '',
      address: driver.address || '',
      googleMapsLink: driver.googleMapsLink || '',
      phone: driver.phone || '',
      workplace: driver.workplace || '',
      vehicleId: driver.vehicleId || '',
      photo: driver.photo || '',
      cedulaPhoto: driver.cedulaPhoto || '',
      licensePhoto: driver.licensePhoto || '',
    });

    if (driver.guarantors && driver.guarantors.length > 0) {
      setShowGuarantor(true);
      setGuarantorData({
        firstName: driver.guarantors[0].firstName || '',
        lastName: driver.guarantors[0].lastName || '',
        cedula: driver.guarantors[0].cedula || '',
        address: driver.guarantors[0].address || '',
        googleMapsLink: driver.guarantors[0].googleMapsLink || '',
        workplace: driver.guarantors[0].workplace || '',
        phone: driver.guarantors[0].phone || '',
        photo: driver.guarantors[0].photo || '',
        cedulaPhoto: driver.guarantors[0].cedulaPhoto || '',
      });
    } else {
      setShowGuarantor(false);
      setGuarantorData({
        firstName: '',
        lastName: '',
        cedula: '',
        address: '',
        googleMapsLink: '',
        workplace: '',
        phone: '',
        photo: '',
        cedulaPhoto: '',
      });
    }
  };

  // --- FORMULARIO ---
  if (showForm) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {editingId ? 'Editar Chofer' : 'Registrar Chofer'}
            </h1>
            <p className="text-gray-600 mt-1">Complete todos los datos del chofer y garante</p>
          </div>
          <button
            onClick={() => { setShowForm(false); resetForm(); }}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancelar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                required
              />
              {formErrors.firstName && <p className="text-red-500 text-xs">{formErrors.firstName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Apellido</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                required
              />
              {formErrors.lastName && <p className="text-red-500 text-xs">{formErrors.lastName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cédula</label>
              <input
                type="text"
                value={formData.cedula}
                onChange={e => setFormData({ ...formData, cedula: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                required
                maxLength={13}
              />
              {formErrors.cedula && <p className="text-red-500 text-xs">{formErrors.cedula}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Licencia</label>
              <input
                type="text"
                value={formData.license}
                onChange={e => setFormData({ ...formData, license: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                required
              />
              {formErrors.license && <p className="text-red-500 text-xs">{formErrors.license}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Fecha de inicio</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                required
              />
              {formErrors.startDate && <p className="text-red-500 text-xs">{formErrors.startDate}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Dirección</label>
              <input
                type="text"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                required
              />
              {formErrors.address && <p className="text-red-500 text-xs">{formErrors.address}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Google Maps</label>
              <input
                type="text"
                value={formData.googleMapsLink}
                onChange={e => setFormData({ ...formData, googleMapsLink: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Teléfono</label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                required
                maxLength={12}
              />
              {formErrors.phone && <p className="text-red-500 text-xs">{formErrors.phone}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Trabajo</label>
              <input
                type="text"
                value={formData.workplace}
                onChange={e => setFormData({ ...formData, workplace: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Vehículo</label>
              <select
                value={formData.vehicleId}
                onChange={e => setFormData({ ...formData, vehicleId: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              >
                <option value="">Sin vehículo</option>
                {vehicles.map(vehicle => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.plate} - {vehicle.brand}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Foto</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="mt-1 block w-full"
              />
              {photoPreview && (
                <img
                  src={photoPreview}
                  alt="Vista previa"
                  className="mt-2 w-24 h-24 object-cover rounded-full border"
                />
              )}
            </div>
          </div>

          {/* Garante */}
          {(showGuarantor || (editingId && guarantorData.firstName)) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6 mt-6">
              <div className="col-span-2 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Datos del Garante</h2>
                {guarantorData.firstName && (
                  <button
                    type="button"
                    className="text-red-600 text-sm"
                    onClick={() => {
                      setGuarantorData({
                        firstName: '',
                        lastName: '',
                        cedula: '',
                        address: '',
                        googleMapsLink: '',
                        workplace: '',
                        phone: '',
                        photo: '',
                        cedulaPhoto: '',
                      });
                      setShowGuarantor(false);
                    }}
                  >
                    Quitar garante
                  </button>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre Garante</label>
                <input
                  type="text"
                  value={guarantorData.firstName}
                  onChange={e => setGuarantorData({ ...guarantorData, firstName: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                />
                {formErrors.guarantorFirstName && <p className="text-red-500 text-xs">{formErrors.guarantorFirstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Apellido Garante</label>
                <input
                  type="text"
                  value={guarantorData.lastName}
                  onChange={e => setGuarantorData({ ...guarantorData, lastName: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                />
                {formErrors.guarantorLastName && <p className="text-red-500 text-xs">{formErrors.guarantorLastName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cédula Garante</label>
                <input
                  type="text"
                  value={guarantorData.cedula}
                  onChange={e => setGuarantorData({ ...guarantorData, cedula: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                  maxLength={13}
                />
                {formErrors.guarantorCedula && <p className="text-red-500 text-xs">{formErrors.guarantorCedula}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Dirección Garante</label>
                <input
                  type="text"
                  value={guarantorData.address}
                  onChange={e => setGuarantorData({ ...guarantorData, address: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                />
                {formErrors.guarantorAddress && <p className="text-red-500 text-xs">{formErrors.guarantorAddress}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Google Maps Garante</label>
                <input
                  type="text"
                  value={guarantorData.googleMapsLink}
                  onChange={e => setGuarantorData({ ...guarantorData, googleMapsLink: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Teléfono Garante</label>
                <input
                  type="text"
                  value={guarantorData.phone}
                  onChange={e => setGuarantorData({ ...guarantorData, phone: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                  maxLength={12}
                />
                {formErrors.guarantorPhone && <p className="text-red-500 text-xs">{formErrors.guarantorPhone}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Trabajo Garante</label>
                <input
                  type="text"
                  value={guarantorData.workplace}
                  onChange={e => setGuarantorData({ ...guarantorData, workplace: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                />
              </div>
            </div>
          )}

          {/* Checkbox solo si no hay garante */}
          {!guarantorData.firstName && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="show-guarantor"
                checked={showGuarantor}
                onChange={() => setShowGuarantor(!showGuarantor)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="show-guarantor" className="text-sm font-medium text-gray-700">
                Agregar garante
              </label>
            </div>
          )}

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
              {editingId ? 'Actualizar Chofer' : 'Registrar Chofer'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Modal de información completa */}
      {selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
              onClick={() => setSelectedDriver(null)}
            >
              ✕
            </button>
            <div className="flex items-center space-x-4 mb-4">
              {selectedDriver.photo ? (
                <img
                  src={`http://localhost:3002/uploads/${selectedDriver.photo}`}
                  alt="Foto"
                  className="w-20 h-20 rounded-full object-cover border"
                />
              ) : (
                <User className="w-20 h-20 text-gray-300" />
              )}
              <div>
                <h2 className="text-2xl font-bold">{selectedDriver.firstName} {selectedDriver.lastName}</h2>
                <p className="text-gray-500">Cédula: {selectedDriver.cedula}</p>
                <p className="text-gray-500">Teléfono: {selectedDriver.phone}</p>
              </div>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Dirección:</span> {selectedDriver.address}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Licencia:</span> {selectedDriver.license}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Fecha de inicio:</span> {new Date(selectedDriver.startDate).toLocaleDateString('es-ES')}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Trabajo:</span> {selectedDriver.workplace}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Vehículo:</span> {selectedDriver.vehicleId ? 'Asignado' : 'Sin asignar'}
            </div>
            {selectedDriver.guarantors && selectedDriver.guarantors.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <h3 className="font-semibold mb-2">Garante</h3>
                <div className="mb-1"><span className="font-semibold">Nombre:</span> {selectedDriver.guarantors[0].firstName} {selectedDriver.guarantors[0].lastName}</div>
                <div className="mb-1"><span className="font-semibold">Cédula:</span> {selectedDriver.guarantors[0].cedula}</div>
                <div className="mb-1"><span className="font-semibold">Teléfono:</span> {selectedDriver.guarantors[0].phone}</div>
                <div className="mb-1"><span className="font-semibold">Dirección:</span> {selectedDriver.guarantors[0].address}</div>
                <div className="mb-1"><span className="font-semibold">Trabajo:</span> {selectedDriver.guarantors[0].workplace}</div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Choferes</h1>
          <p className="text-gray-600 mt-1">Administra todos los choferes y garantes</p>
        </div>
        <button
          onClick={() => { setShowForm(true); resetForm(); }}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          <span>Registrar Primer Chofer</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nombre, cédula o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDrivers.map((driver) => (
          <div key={driver.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {driver.photo ? (
                  <img
                    src={`http://localhost:3002/uploads/${driver.photo}`}
                    alt="Foto"
                    className="w-12 h-12 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-400" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {driver.firstName} {driver.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">Cédula: {driver.cedula}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  onClick={() => handleEdit(driver)}
                  title="Editar"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  onClick={() => handleDelete(driver.id)}
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                  onClick={() => setSelectedDriver(driver)}
                  title="Ver más"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{driver.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Desde: {new Date(driver.startDate).toLocaleDateString('es-ES')}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="truncate">{driver.address}</span>
                {driver.googleMapsLink && (
                  <a
                    href={driver.googleMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              {driver.vehicleId && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <Car className="w-4 h-4" />
                  <span>Vehículo asignado</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  Registrado: {new Date(driver.createdAt).toLocaleDateString('es-ES')}
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Activo
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDrivers.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No se encontraron choferes' : 'No hay choferes registrados'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm
              ? 'Intenta con otros términos de búsqueda'
              : 'Comienza registrando tu primer chofer'
            }
          </p>
          {!searchTerm && (
            <button
              onClick={() => { setShowForm(true); resetForm(); }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              <span>Registrar Primer Chofer</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}