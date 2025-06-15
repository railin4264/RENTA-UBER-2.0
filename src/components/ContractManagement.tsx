import React, { useState } from 'react';
import { 
  FileText,
  Download,
  Printer,
  Plus,
  Search,
  Calendar,
  User,
  Car,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

interface Contract {
  id: string;
  driverId: string;
  driverName: string;
  vehiclePlate: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'expired' | 'terminated';
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
  const [showReceiptForm, setShowReceiptForm] = useState(false);

  // Mock data
  const contracts: Contract[] = [
    {
      id: '1',
      driverId: '1',
      driverName: 'Carlos Martínez',
      vehiclePlate: 'ABC-123',
      startDate: '2024-01-15',
      status: 'active',
      type: 'rental',
      createdAt: '2024-01-15T00:00:00Z'
    },
    {
      id: '2',
      driverId: '2',
      driverName: 'Ana López',
      vehiclePlate: 'DEF-456',
      startDate: '2024-02-01',
      status: 'active',
      type: 'rental',
      createdAt: '2024-02-01T00:00:00Z'
    },
    {
      id: '3',
      driverId: '3',
      driverName: 'Roberto Silva',
      vehiclePlate: 'GHI-789',
      startDate: '2023-12-01',
      endDate: '2024-12-31',
      status: 'terminated',
      type: 'rental',
      createdAt: '2023-12-01T00:00:00Z'
    }
  ];

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
    },
    {
      id: '2',
      driverId: '2',
      driverName: 'Ana López',
      amount: 1600,
      date: '2025-01-12',
      type: 'payment',
      description: 'Pago semanal - Vehículo DEF-456',
      createdAt: '2025-01-12T00:00:00Z'
    },
    {
      id: '3',
      driverId: '1',
      driverName: 'Carlos Martínez',
      amount: 2500,
      date: '2025-01-08',
      type: 'expense',
      description: 'Mantenimiento preventivo - ABC-123',
      createdAt: '2025-01-08T00:00:00Z'
    }
  ];

  const filteredContracts = contracts.filter(contract =>
    contract.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredReceipts = receipts.filter(receipt =>
    receipt.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receipt.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateContract = (contractId: string) => {
    console.log(`Generating contract for ID: ${contractId}`);
    // Mock contract generation
  };

  const printReceipt = (receiptId: string) => {
    console.log(`Printing receipt for ID: ${receiptId}`);
    // Mock receipt printing
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
          <button
            onClick={() => setShowReceiptForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Nuevo Recibo</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Contratos Activos</p>
              <p className="text-2xl font-bold text-green-600">
                {contracts.filter(c => c.status === 'active').length}
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
              <p className="text-2xl font-bold text-yellow-600">2</p>
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
                {contracts.filter(c => c.status === 'expired').length}
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
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        contract.status === 'active' ? 'bg-green-100 text-green-800' :
                        contract.status === 'expired' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {contract.status === 'active' ? 'Activo' :
                         contract.status === 'expired' ? 'Vencido' : 'Terminado'}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => generateContract(contract.id)}
                          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Ver contrato"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => generateContract(contract.id)}
                          className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                          title="Descargar contrato"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => generateContract(contract.id)}
                          className="p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Imprimir contrato"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
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
        </div>
      </div>
    </div>
  );
}