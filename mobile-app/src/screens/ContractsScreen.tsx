import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';

interface Contract {
  id: string;
  driverName: string;
  vehiclePlate: string;
  startDate: string;
  endDate: string;
  monthlyRate: number;
  status: string;
  type: string;
  vehicleBrand: string;
  vehicleModel: string;
  driverPhone: string;
  driverEmail: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
}

export default function ContractsScreen() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadContracts();
  }, []);

  useEffect(() => {
    filterContracts();
  }, [contracts, searchTerm, statusFilter]);

  const loadContracts = async () => {
    try {
      setIsLoading(true);
      
      // Simular carga de datos desde API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Datos de ejemplo
      const mockContracts: Contract[] = [
        {
          id: '1',
          driverName: 'Carlos Mendoza',
          vehiclePlate: 'ABC-123',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          monthlyRate: 150.00,
          status: 'Activo',
          type: 'Renta Mensual',
          vehicleBrand: 'Toyota',
          vehicleModel: 'Corolla',
          driverPhone: '+1 (555) 123-4567',
          driverEmail: 'carlos.mendoza@email.com',
          totalAmount: 1800.00,
          paidAmount: 300.00,
          remainingAmount: 1500.00,
        },
        {
          id: '2',
          driverName: 'Ana Rodríguez',
          vehiclePlate: 'XYZ-789',
          startDate: '2024-02-01',
          endDate: '2025-01-31',
          monthlyRate: 180.00,
          status: 'Activo',
          type: 'Renta Mensual',
          vehicleBrand: 'Honda',
          vehicleModel: 'Civic',
          driverPhone: '+1 (555) 234-5678',
          driverEmail: 'ana.rodriguez@email.com',
          totalAmount: 2160.00,
          paidAmount: 180.00,
          remainingAmount: 1980.00,
        },
        {
          id: '3',
          driverName: 'Luis García',
          vehiclePlate: 'DEF-456',
          startDate: '2023-12-01',
          endDate: '2024-11-30',
          monthlyRate: 160.00,
          status: 'Vencido',
          type: 'Renta Mensual',
          vehicleBrand: 'Nissan',
          vehicleModel: 'Sentra',
          driverPhone: '+1 (555) 345-6789',
          driverEmail: 'luis.garcia@email.com',
          totalAmount: 1920.00,
          paidAmount: 1280.00,
          remainingAmount: 640.00,
        },
        {
          id: '4',
          driverName: 'María López',
          vehiclePlate: 'GHI-789',
          startDate: '2024-01-15',
          endDate: '2024-12-14',
          monthlyRate: 140.00,
          status: 'Activo',
          type: 'Renta Mensual',
          vehicleBrand: 'Hyundai',
          vehicleModel: 'Elantra',
          driverPhone: '+1 (555) 456-7890',
          driverEmail: 'maria.lopez@email.com',
          totalAmount: 1680.00,
          paidAmount: 280.00,
          remainingAmount: 1400.00,
        },
        {
          id: '5',
          driverName: 'Roberto Silva',
          vehiclePlate: 'JKL-012',
          startDate: '2024-03-01',
          endDate: '2025-02-28',
          monthlyRate: 200.00,
          status: 'Pendiente',
          type: 'Renta Mensual',
          vehicleBrand: 'Kia',
          vehicleModel: 'Forte',
          driverPhone: '+1 (555) 567-8901',
          driverEmail: 'roberto.silva@email.com',
          totalAmount: 2400.00,
          paidAmount: 0.00,
          remainingAmount: 2400.00,
        },
      ];
      
      setContracts(mockContracts);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los contratos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadContracts();
    setIsRefreshing(false);
  };

  const filterContracts = () => {
    let filtered = [...contracts];

    // Aplicar filtro de búsqueda
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(contract =>
        contract.driverName.toLowerCase().includes(searchLower) ||
        contract.vehiclePlate.toLowerCase().includes(searchLower) ||
        contract.vehicleBrand.toLowerCase().includes(searchLower) ||
        contract.vehicleModel.toLowerCase().includes(searchLower)
      );
    }

    // Aplicar filtro de estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(contract => contract.status === statusFilter);
    }

    setFilteredContracts(filtered);
  };

  const handleContractPress = (contract: Contract) => {
    Alert.alert(
      'Detalles del Contrato',
      `${contract.type}\n\nConductor: ${contract.driverName}\nVehículo: ${contract.vehicleBrand} ${contract.vehicleModel}\nPlaca: ${contract.vehiclePlate}\nInicio: ${contract.startDate}\nFin: ${contract.endDate}\nTarifa Mensual: $${contract.monthlyRate.toFixed(2)}\nEstado: ${contract.status}`,
      [
        { text: 'Editar', onPress: () => handleEditContract(contract) },
        { text: 'Ver Detalles', onPress: () => console.log('Ver detalles') },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  const handleEditContract = (contract: Contract) => {
    Alert.alert('Editar Contrato', `Editando contrato de ${contract.driverName}`);
  };

  const handleRenewContract = (contract: Contract) => {
    Alert.alert(
      'Renovar Contrato',
      `¿Renovar contrato de ${contract.driverName} por otro año?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Renovar', 
          onPress: () => {
            Alert.alert('Éxito', 'Contrato renovado correctamente');
          }
        }
      ]
    );
  };

  const handleTerminateContract = (contract: Contract) => {
    Alert.alert(
      'Terminar Contrato',
      `¿Estás seguro de que quieres terminar el contrato de ${contract.driverName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Terminar', 
          style: 'destructive',
          onPress: () => {
            setContracts(prev => prev.map(c => 
              c.id === contract.id ? { ...c, status: 'Terminado' } : c
            ));
            Alert.alert('Éxito', 'Contrato terminado correctamente');
          }
        }
      ]
    );
  };

  const handleAddContract = () => {
    Alert.alert('Nuevo Contrato', 'Funcionalidad de agregar contrato');
  };

  const getStatusCount = (status: string) => {
    return contracts.filter(contract => contract.status === status).length;
  };

  const getTotalContracts = () => contracts.length;

  const getTotalRevenue = () => {
    return contracts.reduce((total, contract) => total + contract.totalAmount, 0);
  };

  const getTotalCollected = () => {
    return contracts.reduce((total, contract) => total + contract.paidAmount, 0);
  };

  const getTotalPending = () => {
    return contracts.reduce((total, contract) => total + contract.remainingAmount, 0);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Icon name="refresh-cw" size={48} color="#6b7280" style={styles.spinning} />
          <Text style={styles.loadingText}>Cargando contratos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Contratos</Text>
            <Text style={styles.subtitle}>
              {getTotalContracts()} contrato{getTotalContracts() !== 1 ? 's' : ''} en total
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddContract}
          >
            <Icon name="plus" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Icon name="file-text" size={24} color="#10b981" />
            <Text style={styles.statNumber}>{getStatusCount('Activo')}</Text>
            <Text style={styles.statLabel}>Activos</Text>
          </View>
          
          <View style={styles.statCard}>
            <Icon name="clock" size={24} color="#3b82f6" />
            <Text style={styles.statNumber}>{getStatusCount('Pendiente')}</Text>
            <Text style={styles.statLabel}>Pendientes</Text>
          </View>
          
          <View style={styles.statCard}>
            <Icon name="alert-triangle" size={24} color="#f59e0b" />
            <Text style={styles.statNumber}>{getStatusCount('Vencido')}</Text>
            <Text style={styles.statLabel}>Vencidos</Text>
          </View>
          
          <View style={styles.statCard}>
            <Icon name="dollar-sign" size={24} color="#8b5cf6" />
            <Text style={styles.statNumber}>${(getTotalRevenue() / 1000).toFixed(1)}k</Text>
            <Text style={styles.statLabel}>Valor Total</Text>
          </View>
        </View>

        {/* Financial Summary */}
        <View style={styles.financialContainer}>
          <Text style={styles.financialTitle}>Resumen Financiero</Text>
          <View style={styles.financialGrid}>
            <View style={styles.financialItem}>
              <Text style={styles.financialLabel}>Total Cobrado</Text>
              <Text style={styles.financialValue}>${getTotalCollected().toFixed(0)}</Text>
              <Text style={styles.financialChange}>+15% este mes</Text>
            </View>
            
            <View style={styles.financialItem}>
              <Text style={styles.financialLabel}>Pendiente</Text>
              <Text style={styles.financialValue}>${getTotalPending().toFixed(0)}</Text>
              <Text style={styles.financialChange}>-8% este mes</Text>
            </View>
          </View>
        </View>

        {/* Search and Filters */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Icon name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar contratos..."
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholderTextColor="#9ca3af"
            />
            {searchTerm.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchTerm('')}
                style={styles.clearButton}
              >
                <Icon name="x" size={16} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>
          
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Icon name="filter" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Filters */}
        {showFilters && (
          <View style={styles.filtersContainer}>
            <Text style={styles.filtersTitle}>Filtrar por estado:</Text>
            <View style={styles.filterChips}>
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  statusFilter === 'all' && styles.filterChipActive
                ]}
                onPress={() => setStatusFilter('all')}
              >
                <Text style={[
                  styles.filterChipText,
                  statusFilter === 'all' && styles.filterChipTextActive
                ]}>
                  Todos ({getTotalContracts()})
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  statusFilter === 'Activo' && styles.filterChipActive
                ]}
                onPress={() => setStatusFilter('Activo')}
              >
                <Text style={[
                  styles.filterChipText,
                  statusFilter === 'Activo' && styles.filterChipTextActive
                ]}>
                  Activos ({getStatusCount('Activo')})
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  statusFilter === 'Pendiente' && styles.filterChipActive
                ]}
                onPress={() => setStatusFilter('Pendiente')}
              >
                <Text style={[
                  styles.filterChipText,
                  statusFilter === 'Pendiente' && styles.filterChipTextActive
                ]}>
                  Pendientes ({getStatusCount('Pendiente')})
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  statusFilter === 'Vencido' && styles.filterChipActive
                ]}
                onPress={() => setStatusFilter('Vencido')}
              >
                <Text style={[
                  styles.filterChipText,
                  statusFilter === 'Vencido' && styles.filterChipTextActive
                ]}>
                  Vencidos ({getStatusCount('Vencido')})
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Results Count */}
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsText}>
            {filteredContracts.length} contrato{filteredContracts.length !== 1 ? 's' : ''} encontrado{filteredContracts.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Contracts List */}
        <View style={styles.contractsContainer}>
          {filteredContracts.length > 0 ? (
            filteredContracts.map((contract) => (
              <View key={contract.id} style={styles.contractCard}>
                <View style={styles.contractHeader}>
                  <View style={styles.contractInfo}>
                    <Text style={styles.contractType}>{contract.type}</Text>
                    <Text style={styles.contractDriver}>{contract.driverName}</Text>
                    <Text style={styles.contractVehicle}>
                      {contract.vehicleBrand} {contract.vehicleModel} - {contract.vehiclePlate}
                    </Text>
                  </View>
                  
                  <View style={styles.contractStatus}>
                    <View style={[
                      styles.statusBadge,
                      contract.status === 'Activo' && styles.statusActive,
                      contract.status === 'Pendiente' && styles.statusPending,
                      contract.status === 'Vencido' && styles.statusExpired,
                    ]}>
                      <Text style={[
                        styles.statusText,
                        contract.status === 'Activo' && styles.statusTextActive,
                        contract.status === 'Pendiente' && styles.statusTextPending,
                        contract.status === 'Vencido' && styles.statusTextExpired,
                      ]}>
                        {contract.status}
                      </Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.contractDetails}>
                  <View style={styles.detailRow}>
                    <Icon name="calendar" size={16} color="#6b7280" />
                    <Text style={styles.detailText}>
                      {contract.startDate} - {contract.endDate}
                    </Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Icon name="dollar-sign" size={16} color="#6b7280" />
                    <Text style={styles.detailText}>
                      Tarifa Mensual: ${contract.monthlyRate.toFixed(2)}
                    </Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Icon name="credit-card" size={16} color="#6b7280" />
                    <Text style={styles.detailText}>
                      Pagado: ${contract.paidAmount.toFixed(2)} / ${contract.totalAmount.toFixed(2)}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.contractActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleContractPress(contract)}
                  >
                    <Icon name="eye" size={16} color="#3b82f6" />
                    <Text style={styles.actionButtonText}>Ver</Text>
                  </TouchableOpacity>
                  
                  {contract.status === 'Activo' && (
                    <TouchableOpacity
                      style={[styles.actionButton, styles.renewButton]}
                      onPress={() => handleRenewContract(contract)}
                    >
                      <Icon name="refresh-cw" size={16} color="#10b981" />
                      <Text style={[styles.actionButtonText, styles.renewText]}>Renovar</Text>
                    </TouchableOpacity>
                  )}
                  
                  {contract.status === 'Activo' && (
                    <TouchableOpacity
                      style={[styles.actionButton, styles.terminateButton]}
                      onPress={() => handleTerminateContract(contract)}
                    >
                      <Icon name="x-circle" size={16} color="#ef4444" />
                      <Text style={[styles.actionButtonText, styles.terminateText]}>Terminar</Text>
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => handleEditContract(contract)}
                  >
                    <Icon name="edit-3" size={16} color="#f59e0b" />
                    <Text style={[styles.actionButtonText, styles.editText]}>Editar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Icon name="file-text" size={48} color="#d1d5db" />
              <Text style={styles.emptyTitle}>No se encontraron contratos</Text>
              <Text style={styles.emptySubtitle}>
                {searchTerm || statusFilter !== 'all' 
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'No hay contratos registrados en el sistema'
                }
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 16,
  },
  spinning: {
    transform: [{ rotate: '360deg' }],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  financialContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  financialTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  financialGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  financialItem: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  financialLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  financialValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  financialChange: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: '50%',
    marginTop: -10,
    zIndex: 1,
  },
  searchInput: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 44,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    top: '50%',
    marginTop: -8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filtersTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterChipActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  filterChipText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  resultsContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 14,
    color: '#6b7280',
  },
  contractsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  contractCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  contractHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  contractInfo: {
    flex: 1,
  },
  contractType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  contractDriver: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 2,
  },
  contractVehicle: {
    fontSize: 12,
    color: '#6b7280',
  },
  contractStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  statusActive: {
    backgroundColor: '#d1fae5',
  },
  statusPending: {
    backgroundColor: '#dbeafe',
  },
  statusExpired: {
    backgroundColor: '#fef3c7',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6b7280',
  },
  statusTextActive: {
    color: '#065f46',
  },
  statusTextPending: {
    color: '#1e40af',
  },
  statusTextExpired: {
    color: '#92400e',
  },
  contractDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 8,
  },
  contractActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    gap: 6,
  },
  renewButton: {
    backgroundColor: '#d1fae5',
  },
  terminateButton: {
    backgroundColor: '#fee2e2',
  },
  editButton: {
    backgroundColor: '#fef3c7',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  renewText: {
    color: '#065f46',
  },
  terminateText: {
    color: '#dc2626',
  },
  editText: {
    color: '#92400e',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
  },
});