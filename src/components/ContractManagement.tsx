import React, { useState, useEffect } from 'react';
import { 
  FileText,
  Download,
  Printer,
  Plus,
  Search,
  Calendar,
  Car,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

interface Status {
  id: string;
  name: string;
  color?: string;
}

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  status?: Status;
}

interface Vehicle {
  id: string;
  plate: string;
  model?: string;
  status?: Status;
}

interface Contract {
  id: string;
  driverId: string;
  driverName: string;
  vehicleId: string;
  vehiclePlate?: string;
  startDate: string;
  endDate?: string;
  status?: Status;
  statusId?: string;
  type: 'rental' | 'employment';
  createdAt: string;
}

interface Receipt {
  id: string;
  driverId: string;
  driverName: string;
  amount: number;
  date: string;
  type: 'payment' | 'expense';
  description: string;
  createdAt: string;
}

export default function ContractManagement() {
  const [activeTab, setActiveTab] = useState<'contracts' | 'receipts'>('contracts');
  const [searchTerm, setSearchTerm] = useState('');
  const [showContractForm, setShowContractForm] = useState(false);
  const [contractStatuses, setContractStatuses] = useState<Status[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [formData, setFormData] = useState<Partial<Contract>>({
    driverId: '',
    vehicleId: '',
    startDate: '',
    endDate: '',
    statusId: '',
    type: 'rental',
  });

  // Mock receipts (puedes reemplazar por fetch real)
  const receipts: Receipt[] = [
    {
      id: '1',
      driverId: '1',
      driverName: 'Carlos Martínez',
      amount: 3200,
      date: '2025-01-10',
      type: 'payment',
      description: 'Pago semanal - Vehículo ABC-123',
      createdAt: '2025-01-10T00:00:00Z'
    }
  ];

  // Cargar statuses de contratos desde el backend
  useEffect(() => {
    fetch('http://localhost:3002/api/statuses/contract')
      .then(res => res.json())
      .then(setContractStatuses);
  }, []);

  // Cargar contratos desde el backend
  useEffect(() => {
    fetch('http://localhost:3002/api/contracts')
      .then(res => res.json())
      .then(setContracts);
  }, []);

  // Cargar choferes desde el backend
  useEffect(() => {
    fetch('http://localhost:3002/api/drivers')
      .then(res => res.json())
      .then(setDrivers);
  }, []);

  // Cargar vehículos desde el backend
  useEffect(() => {
    fetch('http://localhost:3002/api/vehicles')
      .then(res => res.json())
      .then(setVehicles);
  }, []);

  const filteredContracts = contracts.filter(contract =>
    (contract.driverName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contract.vehiclePlate || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredReceipts = receipts.filter(receipt =>
    receipt.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receipt.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Acciones de contrato
  const handleViewContract = (contractId: string) => {
    alert(`Visualizar contrato: ${contractId}`);
    // Aquí puedes abrir un modal o navegar a la vista de detalle
  };

  const handleDownloadContract = (contractId: string) => {
    alert(`Descargar contrato: ${contractId}`);
    // Aquí puedes implementar la descarga del PDF
  };

  const handleEditContract = (contractId: string) => {
    alert(`Editar contrato: ${contractId}`);
    // Aquí puedes abrir el formulario de edición
  };

  const handleDeleteContract = async (contractId: string) => {
    if (window.confirm('¿Seguro que deseas eliminar este contrato?')) {
      const res = await fetch(`http://localhost:3002/api/contracts/${contractId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setContracts(prev => prev.filter(c => c.id !== contractId));
      } else {
        alert('Error al eliminar contrato');
      }
    }
  };

  const printReceipt = (receiptId: string) => {
    alert(`Imprimir recibo: ${receiptId}`);
    // Aquí puedes implementar la impresión del recibo
  };

  // Manejar envío del formulario de contrato
  const handleContractFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Buscar el nombre del chofer seleccionado
    const selectedDriver = drivers.find(d => d.id === formData.driverId);
    const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId);
    const payload = {
      ...formData,
      driverName: selectedDriver ? `${selectedDriver.firstName} ${selectedDriver.lastName}` : '',
      vehiclePlate: selectedVehicle ? selectedVehicle.plate : '',
    };
    const res = await fetch('http://localhost:3002/api/contracts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const newContract = await res.json();
      setContracts(prev => [...prev, newContract]);
      setShowContractForm(false);
      setFormData({
        driverId: '',
        vehicleId: '',
        startDate: '',
        endDate: '',
        statusId: '',
        type: 'rental',
      });
    } else {
      alert('Error al crear contrato');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contratos y Documentos</h1>
          <p className="text-gray-600 mt-1">Gestiona contratos, recibos y documentos legales</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowContractForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Nuevo Contrato</span>
          </button>
        </div>
      </div>

      {/* Formulario para nuevo contrato */}
      {showContractForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Registrar Contrato</h2>
          <form className="space-y-6" onSubmit={handleContractFormSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chofer *</label>
                <select
                  required
                  value={formData.driverId || ''}
                  onChange={e => setFormData({ ...formData, driverId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecciona un chofer</option>
                  {drivers.map(driver => (
                    <option key={driver.id} value={driver.id}>
                      {driver.firstName} {driver.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vehículo *</label>
                <select
                  required
                  value={formData.vehicleId || ''}
                  onChange={e => setFormData({ ...formData, vehicleId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecciona un vehículo</option>
                  {vehicles.map(vehicle => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.plate} {vehicle.model ? `- ${vehicle.model}` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de inicio *</label>
                <input
                  type="date"
                  required
                  value={formData.startDate || ''}
                  onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de fin</label>
                <input
                  type="date"
                  value={formData.endDate || ''}
                  onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de contrato *</label>
                <select
                  required
                  value={formData.type || 'rental'}
                  onChange={e => setFormData({ ...formData, type: e.target.value as 'rental' | 'employment' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="rental">Renta</option>
                  <option value="employment">Empleo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado *</label>
                <select
                  required
                  value={formData.statusId || ''}
                  onChange={e => setFormData({ ...formData, statusId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecciona un estado</option>
                  {contractStatuses.map(status => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex space-x-4 mt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={() => setShowContractForm(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Contratos Activos</p>
              <p className="text-2xl font-bold text-green-600">
                {contracts.filter(c => c.status?.name === 'Activo').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Por Vencer</p>
              <p className="text-2xl font-bold text-yellow-600">
                {contracts.filter(c => c.status?.name === 'Pendiente').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vencidos</p>
              <p className="text-2xl font-bold text-red-600">
                {contracts.filter(c => c.status?.name === 'Vencido' || c.status?.name === 'Finalizado').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Recibos Este Mes</p>
              <p className="text-2xl font-bold text-blue-600">{receipts.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('contracts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'contracts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Contratos ({contracts.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('receipts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'receipts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Printer className="w-4 h-4" />
                <span>Recibos ({receipts.length})</span>
              </div>
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
                placeholder={activeTab === 'contracts' ? "Buscar contratos..." : "Buscar recibos..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {activeTab === 'contracts' && (
            <div className="space-y-4">
              {filteredContracts.map((contract) => (
                <div key={contract.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{contract.driverName}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Car className="w-4 h-4" />
                            <span>{contract.vehiclePlate}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Desde: {new Date(contract.startDate).toLocaleDateString('es-ES')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                        style={{
                          backgroundColor: contract.status?.color || '#e5e7eb',
                          color: contract.status?.color ? '#222' : '#555'
                        }}
                      >
                        {contract.status?.name || 'Sin estado'}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewContract(contract.id)}
                          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Visualizar contrato"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadContract(contract.id)}
                          className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                          title="Descargar contrato"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditContract(contract.id)}
                          className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                          title="Editar contrato"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteContract(contract.id)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Borrar contrato"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'receipts' && (
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
                      Descripción
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReceipts.map((receipt) => (
                    <tr key={receipt.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(receipt.date).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {receipt.driverName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          receipt.type === 'payment' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {receipt.type === 'payment' ? 'Pago' : 'Gasto'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {receipt.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        RD${receipt.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => printReceipt(receipt.id)}
                            className="text-blue-600 hover:text-blue-700"
                            title="Ver recibo"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => printReceipt(receipt.id)}
                            className="text-green-600 hover:text-green-700"
                            title="Descargar recibo"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => printReceipt(receipt.id)}
                            className="text-purple-600 hover:text-purple-700"
                            title="Imprimir recibo"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-700">
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

          {((activeTab === 'contracts' && filteredContracts.length === 0) || 
            (activeTab === 'receipts' && filteredReceipts.length === 0)) && (
            <div className="text-center py-12">
              {activeTab === 'contracts' ? (
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              ) : (
                <Printer className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              )}
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activeTab === 'contracts' 
                  ? (searchTerm ? 'No se encontraron contratos' : 'No hay contratos registrados')
                  : (searchTerm ? 'No se encontraron recibos' : 'No hay recibos registrados')
                }
              </h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? 'Intenta con otros términos de búsqueda'
                  : activeTab === 'contracts' 
                    ? 'Los contratos aparecerán aquí una vez creados'
                    : 'Los recibos aparecerán aquí una vez generados'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 text-left transition-colors">
            <FileText className="w-8 h-8 mb-2" />
            <h4 className="font-medium">Generar Contrato</h4>
            <p className="text-sm text-blue-100">Crear nuevo contrato de renta</p>
          </button>
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 text-left transition-colors">
            <Printer className="w-8 h-8 mb-2" />
            <h4 className="font-medium">Imprimir Recibo</h4>
            <p className="text-sm text-blue-100">Generar recibo de pago</p>
          </button>
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 text-left transition-colors">
            <Download className="w-8 h-8 mb-2" />
            <h4 className="font-medium">Exportar Documentos</h4>
            <p className="text-sm text-blue-100">Descargar todos los documentos</p>
          </button>
        </div>+
      </div>
    </div>
  );
}