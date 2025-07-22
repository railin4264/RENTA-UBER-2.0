import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Car,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle,
  Eye,
  Camera
} from 'lucide-react';
import type { Vehicle } from '../types';

const API = 'http://localhost:3002';

export default function VehicleManagement() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDetails, setShowDetails] = useState<Vehicle | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    model: '',
    year: new Date().getFullYear(),
    color: '',
    plate: '',
    driverId: '',
    photoFront: '',
    photoRear: '',
    photoLeft: '',
    photoRight: '',
    photoInterior: '',
    photoEngine: '',
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetch(`${API}/api/vehicles`)
      .then(res => res.json())
      .then(data => setVehicles(data))
      .catch(err => console.error('Error al cargar vehículos:', err));
  }, []);

  // Subida de fotos
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    const data = new FormData();
    data.append('photo', file);
    try {
      const res = await fetch(`${API}/api/upload`, {
        method: 'POST',
        body: data,
      });
      const result = await res.json();
      setFormData(prev => ({ ...prev, [field]: result.filename }));
      setPreview(prev => ({ ...prev, [field]: URL.createObjectURL(file) }));
    } catch {
      alert('Error subiendo la foto');
    }
  };

  // Crear vehículo
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/api/vehicles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const error = await res.json();
        alert(error.message || 'Error al registrar vehículo');
        return;
      }
      const newVehicle = await res.json();
      setVehicles([...vehicles, newVehicle]);
      setShowForm(false);
      resetForm();
    } catch (err) {
      alert('Error al registrar vehículo');
    }
  };

  // Editar vehículo
  const handleEdit = (vehicle: Vehicle) => {
    setEditId(vehicle.id);
    setFormData({
      model: vehicle.model,
      year: vehicle.year,
      color: vehicle.color,
      plate: vehicle.plate,
      driverId: vehicle.driverId || '',
      photoFront: vehicle.photoFront || '',
      photoRear: vehicle.photoRear || '',
      photoLeft: vehicle.photoLeft || '',
      photoRight: vehicle.photoRight || '',
      photoInterior: vehicle.photoInterior || '',
      photoEngine: vehicle.photoEngine || '',
    });
    setPreview({});
    setShowEditForm(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    try {
      const res = await fetch(`${API}/api/vehicles/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const error = await res.json();
        alert(error.message || 'Error al actualizar vehículo');
        return;
      }
      const updatedVehicle = await res.json();
      setVehicles(vehicles.map(v => v.id === editId ? updatedVehicle : v));
      setShowEditForm(false);
      setEditId(null);
      resetForm();
    } catch (err) {
      alert('Error al actualizar vehículo');
    }
  };

  // Eliminar vehículo
  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar este vehículo?')) return;
    try {
      const res = await fetch(`${API}/api/vehicles/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        alert('Error al eliminar vehículo');
        return;
      }
      setVehicles(vehicles.filter(v => v.id !== id));
    } catch {
      alert('Error al eliminar vehículo');
    }
  };

  // Visualizar detalles
  const handleView = (vehicle: Vehicle) => {
    setShowDetails(vehicle);
  };

  const resetForm = () => {
    setFormData({
      model: '',
      year: new Date().getFullYear(),
      color: '',
      plate: '',
      driverId: '',
      photoFront: '',
      photoRear: '',
      photoLeft: '',
      photoRight: '',
      photoInterior: '',
      photoEngine: '',
    });
    setPreview({});
  };

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (vehicle.color || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Formulario de registro y edición (comparten diseño)
  const renderForm = (isEdit = false) => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{isEdit ? 'Editar Vehículo' : 'Registrar Vehículo'}</h1>
          <p className="text-gray-600 mt-1">{isEdit ? 'Modifica los datos y fotos del vehículo' : 'Complete todos los datos y fotos del vehículo'}</p>
        </div>
        <button
          onClick={() => { isEdit ? (setShowEditForm(false), setEditId(null)) : setShowForm(false); resetForm(); }}
          className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          Cancelar
        </button>
      </div>

      <form onSubmit={isEdit ? handleUpdate : handleSubmit} className="space-y-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Car className="w-5 h-5 mr-2" />
            Datos del Vehículo
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modelo *
              </label>
              <input
                type="text"
                required
                value={formData.model}
                onChange={(e) => setFormData({...formData, model: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Toyota Corolla"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Año *
              </label>
              <input
                type="number"
                required
                min="1990"
                max={new Date().getFullYear() + 1}
                value={formData.year}
                onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color *
              </label>
              <input
                type="text"
                required
                value={formData.color}
                onChange={(e) => setFormData({...formData, color: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Blanco"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Placa *
              </label>
              <input
                type="text"
                required
                value={formData.plate}
                onChange={(e) => setFormData({...formData, plate: e.target.value.toUpperCase()})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: ABC-123"
              />
            </div>
          </div>

          {/* Fotos en cuadrícula */}
          <div>
            <h3 className="text-lg font-semibold mb-4 mt-8">Fotos del Vehículo</h3>
            <div className="grid grid-cols-3 gap-6">
              {/* Frontal */}
              <div className="border-2 border-dashed rounded-lg flex flex-col items-center justify-center py-4">
                <label className="flex flex-col items-center cursor-pointer">
                  <Camera className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="font-medium">Frontal</span>
                  <span className="text-xs text-blue-600 mt-1">Subir Foto</span>
                  <input type="file" accept="image/*" className="hidden"
                    onChange={e => handlePhotoUpload(e, 'photoFront')}
                  />
                  {preview.photoFront || formData.photoFront ? (
                    <img src={preview.photoFront || `${API}/uploads/${formData.photoFront}`} alt="Frontal" className="mt-2 w-24 h-16 object-cover rounded border" />
                  ) : null}
                </label>
              </div>
              {/* Trasera */}
              <div className="border-2 border-dashed rounded-lg flex flex-col items-center justify-center py-4">
                <label className="flex flex-col items-center cursor-pointer">
                  <Camera className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="font-medium">Trasera</span>
                  <span className="text-xs text-blue-600 mt-1">Subir Foto</span>
                  <input type="file" accept="image/*" className="hidden"
                    onChange={e => handlePhotoUpload(e, 'photoRear')}
                  />
                  {preview.photoRear || formData.photoRear ? (
                    <img src={preview.photoRear || `${API}/uploads/${formData.photoRear}`} alt="Trasera" className="mt-2 w-24 h-16 object-cover rounded border" />
                  ) : null}
                </label>
              </div>
              {/* Lado Izquierdo */}
              <div className="border-2 border-dashed rounded-lg flex flex-col items-center justify-center py-4">
                <label className="flex flex-col items-center cursor-pointer">
                  <Camera className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="font-medium">Lado Izquierdo</span>
                  <span className="text-xs text-blue-600 mt-1">Subir Foto</span>
                  <input type="file" accept="image/*" className="hidden"
                    onChange={e => handlePhotoUpload(e, 'photoLeft')}
                  />
                  {preview.photoLeft || formData.photoLeft ? (
                    <img src={preview.photoLeft || `${API}/uploads/${formData.photoLeft}`} alt="Lado Izquierdo" className="mt-2 w-24 h-16 object-cover rounded border" />
                  ) : null}
                </label>
              </div>
              {/* Lado Derecho */}
              <div className="border-2 border-dashed rounded-lg flex flex-col items-center justify-center py-4">
                <label className="flex flex-col items-center cursor-pointer">
                  <Camera className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="font-medium">Lado Derecho</span>
                  <span className="text-xs text-blue-600 mt-1">Subir Foto</span>
                  <input type="file" accept="image/*" className="hidden"
                    onChange={e => handlePhotoUpload(e, 'photoRight')}
                  />
                  {preview.photoRight || formData.photoRight ? (
                    <img src={preview.photoRight || `${API}/uploads/${formData.photoRight}`} alt="Lado Derecho" className="mt-2 w-24 h-16 object-cover rounded border" />
                  ) : null}
                </label>
              </div>
              {/* Interior */}
              <div className="border-2 border-dashed rounded-lg flex flex-col items-center justify-center py-4">
                <label className="flex flex-col items-center cursor-pointer">
                  <Camera className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="font-medium">Interior</span>
                  <span className="text-xs text-blue-600 mt-1">Subir Foto</span>
                  <input type="file" accept="image/*" className="hidden"
                    onChange={e => handlePhotoUpload(e, 'photoInterior')}
                  />
                  {preview.photoInterior || formData.photoInterior ? (
                    <img src={preview.photoInterior || `${API}/uploads/${formData.photoInterior}`} alt="Interior" className="mt-2 w-24 h-16 object-cover rounded border" />
                  ) : null}
                </label>
              </div>
              {/* Motor */}
              <div className="border-2 border-dashed rounded-lg flex flex-col items-center justify-center py-4">
                <label className="flex flex-col items-center cursor-pointer">
                  <Camera className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="font-medium">Motor</span>
                  <span className="text-xs text-blue-600 mt-1">Subir Foto</span>
                  <input type="file" accept="image/*" className="hidden"
                    onChange={e => handlePhotoUpload(e, 'photoEngine')}
                  />
                  {preview.photoEngine || formData.photoEngine ? (
                    <img src={preview.photoEngine || `${API}/uploads/${formData.photoEngine}`} alt="Motor" className="mt-2 w-24 h-16 object-cover rounded border" />
                  ) : null}
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => { isEdit ? (setShowEditForm(false), setEditId(null)) : setShowForm(false); resetForm(); }}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isEdit ? 'Guardar Cambios' : 'Registrar Vehículo'}
          </button>
        </div>
      </form>
    </div>
  );

  if (showForm) return renderForm(false);
  if (showEditForm) return renderForm(true);

  // Visualizar detalles
  if (showDetails) {
    const vehicle = showDetails;
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Detalles del Vehículo</h1>
            <p className="text-gray-600 mt-1">Información completa del vehículo</p>
          </div>
          <button
            onClick={() => setShowDetails(null)}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Volver
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Car className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{vehicle.model} {vehicle.year}</h2>
              <p className="text-gray-500">Placa: {vehicle.plate}</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div><strong>Color:</strong> {vehicle.color}</div>
            <div>
              <strong>Estado:</strong>{' '}
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                vehicle.driverId 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {vehicle.driverId ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Asignado
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Disponible
                  </>
                )}
              </span>
            </div>
            <div>
              <strong>Registrado:</strong> {new Date(vehicle.createdAt).toLocaleDateString('es-ES')}
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {vehicle.photoFront && (
                <div className="relative w-32 h-20 border rounded-lg overflow-hidden bg-gray-50">
                  <img src={`${API}/uploads/${vehicle.photoFront}`} alt="Frontal" className="object-cover w-full h-full" />
                  <span className="absolute bottom-1 left-1 bg-white bg-opacity-80 text-xs px-2 py-0.5 rounded">Frontal</span>
                </div>
              )}
              {vehicle.photoRear && (
                <div className="relative w-32 h-20 border rounded-lg overflow-hidden bg-gray-50">
                  <img src={`${API}/uploads/${vehicle.photoRear}`} alt="Trasera" className="object-cover w-full h-full" />
                  <span className="absolute bottom-1 left-1 bg-white bg-opacity-80 text-xs px-2 py-0.5 rounded">Trasera</span>
                </div>
              )}
              {vehicle.photoLeft && (
                <div className="relative w-32 h-20 border rounded-lg overflow-hidden bg-gray-50">
                  <img src={`${API}/uploads/${vehicle.photoLeft}`} alt="Lado Izquierdo" className="object-cover w-full h-full" />
                  <span className="absolute bottom-1 left-1 bg-white bg-opacity-80 text-xs px-2 py-0.5 rounded">Lado Izquierdo</span>
                </div>
              )}
              {vehicle.photoRight && (
                <div className="relative w-32 h-20 border rounded-lg overflow-hidden bg-gray-50">
                  <img src={`${API}/uploads/${vehicle.photoRight}`} alt="Lado Derecho" className="object-cover w-full h-full" />
                  <span className="absolute bottom-1 left-1 bg-white bg-opacity-80 text-xs px-2 py-0.5 rounded">Lado Derecho</span>
                </div>
              )}
              {vehicle.photoInterior && (
                <div className="relative w-32 h-20 border rounded-lg overflow-hidden bg-gray-50">
                  <img src={`${API}/uploads/${vehicle.photoInterior}`} alt="Interior" className="object-cover w-full h-full" />
                  <span className="absolute bottom-1 left-1 bg-white bg-opacity-80 text-xs px-2 py-0.5 rounded">Interior</span>
                </div>
              )}
              {vehicle.photoEngine && (
                <div className="relative w-32 h-20 border rounded-lg overflow-hidden bg-gray-50">
                  <img src={`${API}/uploads/${vehicle.photoEngine}`} alt="Motor" className="object-cover w-full h-full" />
                  <span className="absolute bottom-1 left-1 bg-white bg-opacity-80 text-xs px-2 py-0.5 rounded">Motor</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista principal
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Vehículos</h1>
          <p className="text-gray-600 mt-1">Administra todos los vehículos de la flota</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Vehículo</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por modelo, placa o color..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Car className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {vehicle.model} {vehicle.year}
                  </h3>
                  <p className="text-sm text-gray-500">Placa: {vehicle.plate}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors" onClick={() => handleView(vehicle)}>
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors" onClick={() => handleEdit(vehicle)}>
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-red-600 transition-colors" onClick={() => handleDelete(vehicle.id)}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex gap-2 mt-2">
              {vehicle.photoFront && (
                <img src={`${API}/uploads/${vehicle.photoFront}`} alt="Frontal" className="w-14 h-10 object-cover rounded border" />
              )}
              {vehicle.photoRear && (
                <img src={`${API}/uploads/${vehicle.photoRear}`} alt="Trasera" className="w-14 h-10 object-cover rounded border" />
              )}
              {vehicle.photoLeft && (
                <img src={`${API}/uploads/${vehicle.photoLeft}`} alt="Lado Izquierdo" className="w-14 h-10 object-cover rounded border" />
              )}
              {vehicle.photoRight && (
                <img src={`${API}/uploads/${vehicle.photoRight}`} alt="Lado Derecho" className="w-14 h-10 object-cover rounded border" />
              )}
              {vehicle.photoInterior && (
                <img src={`${API}/uploads/${vehicle.photoInterior}`} alt="Interior" className="w-14 h-10 object-cover rounded border" />
              )}
              {vehicle.photoEngine && (
                <img src={`${API}/uploads/${vehicle.photoEngine}`} alt="Motor" className="w-14 h-10 object-cover rounded border" />
              )}
            </div>

            <div className="space-y-2 text-sm mt-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Color:</span>
                <span className="font-medium">{vehicle.color}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Estado:</span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  vehicle.driverId 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {vehicle.driverId ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Asignado
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Disponible
                    </>
                  )}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  Registrado: {new Date(vehicle.createdAt).toLocaleDateString('es-ES')}
                </span>
                <button className="text-xs ttext-blue-600 hover:text-blue-700 font-medium" onClick={() => handleView(vehicle)}>
                  Ver Detalles
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <div className="text-center py-12">
          <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No se encontraron vehículos' : 'No hay vehículos registrados'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm 
              ? 'Intenta con otros términos de búsqueda' 
              : 'Comienza registrando tu primer vehículo'
            }
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Registrar Primer Vehículo</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}