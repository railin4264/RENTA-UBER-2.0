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
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

interface Payment {
  id: string;
  driverId: string;
  driverName: string;
  vehicleId: string;
  vehiclePlate: string;
  amount: number;
  currency: string;
  status: string;
  type: string;
  dueDate: string;
  paidDate?: string;
  method: string;
  reference: string;
  description: string;
  lateFees?: number;
  totalAmount: number;
}

export default function PaymentsScreen() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    loadPayments();
  }, []);

  useEffect(() => {
    filterPayments();
  }, [payments, searchTerm, statusFilter, typeFilter]);

  const loadPayments = async () => {
    try {
      setIsLoading(true);
      
      // Simular carga de datos desde API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Datos de ejemplo
      const mockPayments: Payment[] = [
        {
          id: '1',
          driverId: '1',
          driverName: 'Carlos Mendoza',
          vehicleId: '1',
          vehiclePlate: 'ABC-123',
          amount: 150.00,
          currency: 'USD',
          status: 'Pagado',
          type: 'Renta Mensual',
          dueDate: '2024-01-15',
          paidDate: '2024-01-14',
          method: 'Transferencia Bancaria',
          reference: 'TRX-001234',
          description: 'Renta mensual enero 2024',
          totalAmount: 150.00,
        },
        {
          id: '2',
          driverId: '2',
          driverName: 'Ana Rodríguez',
          vehicleId: '2',
          vehiclePlate: 'XYZ-789',
          amount: 180.00,
          currency: 'USD',
          status: 'Pendiente',
          type: 'Renta Mensual',
          dueDate: '2024-02-15',
          method: 'Efectivo',
          reference: 'CASH-002',
          description: 'Renta mensual febrero 2024',
          totalAmount: 180.00,
        },
        {
          id: '3',
          driverId: '3',
          driverName: 'Luis García',
          vehicleId: '3',
          vehiclePlate: 'DEF-456',
          amount: 160.00,
          currency: 'USD',
          status: 'Vencido',
          type: 'Renta Mensual',
          dueDate: '2024-01-15',
          method: 'Tarjeta de Crédito',
          reference: 'CC-003456',
          description: 'Renta mensual enero 2024',
          lateFees: 15.00,
          totalAmount: 175.00,
        },
        {
          id: '4',
          driverId: '4',
          driverName: 'María López',
          vehicleId: '4',
          vehiclePlate: 'GHI-789',
          amount: 140.00,
          currency: 'USD',
          status: 'Pagado',
          type: 'Renta Mensual',
          dueDate: '2024-01-15',
          paidDate: '2024-01-12',
          method: 'PayPal',
          reference: 'PP-004567',
          description: 'Renta mensual enero 2024',
          totalAmount: 140.00,
        },
        {
          id: '5',
          driverId: '5',
          driverName: 'Roberto Silva',
          vehicleId: '5',
          vehiclePlate: 'JKL-012',
          amount: 200.00,
          currency: 'USD',
          status: 'Pendiente',
          type: 'Servicio Adicional',
          dueDate: '2024-02-20',
          method: 'Transferencia Bancaria',
          reference: 'TRX-005678',
          description: 'Servicio de mantenimiento premium',
          totalAmount: 200.00,
        },
        {
          id: '6',
          driverId: '1',
          driverName: 'Carlos Mendoza',
          vehicleId: '1',
          vehiclePlate: 'ABC-123',
          amount: 150.00,
          currency: 'USD',
          status: 'Pendiente',
          type: 'Renta Mensual',
          dueDate: '2024-02-15',
          method: 'Efectivo',
          reference: 'CASH-006',
          description: 'Renta mensual febrero 2024',
          totalAmount: 150.00,
        },
      ];
      
      setPayments(mockPayments);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los pagos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadPayments();
    setIsRefreshing(false);
  };

  const filterPayments = () => {
    let filtered = [...payments];

    // Aplicar filtro de búsqueda
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(payment =>
        payment.driverName.toLowerCase().includes(searchLower) ||
        payment.vehiclePlate.toLowerCase().includes(searchLower) ||
        payment.reference.toLowerCase().includes(searchLower) ||
        payment.description.toLowerCase().includes(searchLower)
      );
    }

    // Aplicar filtro de estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }

    // Aplicar filtro de tipo
    if (typeFilter !== 'all') {
      filtered = filtered.filter(payment => payment.type === typeFilter);
    }

    setFilteredPayments(filtered);
  };

  const handlePaymentPress = (payment: Payment) => {
    Alert.alert(
      'Detalles del Pago',
      `${payment.type}\n\nConductor: ${payment.driverName}\nVehículo: ${payment.vehiclePlate}\nMonto: $${payment.amount.toFixed(2)} ${payment.currency}\nEstado: ${payment.status}\nVencimiento: ${payment.dueDate}\nMétodo: ${payment.method}`,
      [
        { text: 'Marcar como Pagado', onPress: () => handleMarkAsPaid(payment) },
        { text: 'Ver Detalles', onPress: () => console.log('Ver detalles') },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  const handleMarkAsPaid = (payment: Payment) => {
    if (payment.status === 'Pagado') {
      Alert.alert('Ya Pagado', 'Este pago ya fue marcado como pagado');
      return;
    }

    setPayments(prev => prev.map(p => 
      p.id === payment.id 
        ? { ...p, status: 'Pagado', paidDate: new Date().toISOString().split('T')[0] }
        : p
    ));
    Alert.alert('Éxito', 'Pago marcado como pagado correctamente');
  };

  const handleDeletePayment = (payment: Payment) => {
    Alert.alert(
      'Eliminar Pago',
      `¿Estás seguro de que quieres eliminar este pago de ${payment.driverName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => {
            setPayments(prev => prev.filter(p => p.id !== payment.id));
            Alert.alert('Éxito', 'Pago eliminado correctamente');
          }
        }
      ]
    );
  };

  const handleAddPayment = () => {
    Alert.alert('Nuevo Pago', 'Funcionalidad de agregar pago');
  };

  const getStatusCount = (status: string) => {
    return payments.filter(payment => payment.status === status).length;
  };

  const getTypeCount = (type: string) => {
    return payments.filter(payment => payment.type === type).length;
  };

  const getTotalPayments = () => payments.length;

  const getTotalAmount = () => {
    return payments.reduce((total, payment) => total + payment.amount, 0);
  };

  const getTotalCollected = () => {
    return payments
      .filter(payment => payment.status === 'Pagado')
      .reduce((total, payment) => total + payment.amount, 0);
  };

  const getTotalPending = () => {
    return payments
      .filter(payment => payment.status === 'Pendiente')
      .reduce((total, payment) => total + payment.amount, 0);
  };

  const getTotalOverdue = () => {
    return payments
      .filter(payment => payment.status === 'Vencido')
      .reduce((total, payment) => total + payment.totalAmount, 0);
  };

  const getMonthlyData = () => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
    const data = months.map((_, index) => {
      const monthPayments = payments.filter(payment => {
        const paymentMonth = new Date(payment.dueDate).getMonth();
        return paymentMonth === index && payment.status === 'Pagado';
      });
      return paymentMonth.reduce((total, payment) => total + payment.amount, 0);
    });
    return data;
  };

  const getStatusData = () => {
    const statuses = ['Pagado', 'Pendiente', 'Vencido'];
    const data = statuses.map(status => getStatusCount(status));
    return data;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Icon name="refresh-cw" size={48} color="#6b7280" style={styles.spinning} />
          <Text style={styles.loadingText}>Cargando pagos...</Text>
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
            <Text style={styles.title}>Pagos</Text>
            <Text style={styles.subtitle}>
              {getTotalPayments()} pago{getTotalPayments() !== 1 ? 's' : ''} en total
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddPayment}
          >
            <Icon name="plus" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Icon name="check-circle" size={24} color="#10b981" />
            <Text style={styles.statNumber}>${getTotalCollected().toFixed(0)}</Text>
            <Text style={styles.statLabel}>Cobrado</Text>
          </View>
          
          <View style={styles.statCard}>
            <Icon name="clock" size={24} color="#3b82f6" />
            <Text style={styles.statNumber}>${getTotalPending().toFixed(0)}</Text>
            <Text style={styles.statLabel}>Pendiente</Text>
          </View>
          
          <View style={styles.statCard}>
            <Icon name="alert-triangle" size={24} color="#f59e0b" />
            <Text style={styles.statNumber}>${getTotalOverdue().toFixed(0)}</Text>
            <Text style={styles.statLabel}>Vencido</Text>
          </View>
          
          <View style={styles.statCard}>
            <Icon name="dollar-sign" size={24} color="#8b5cf6" />
            <Text style={styles.statNumber}>${(getTotalAmount() / 1000).toFixed(1)}k</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>

        {/* Charts */}
        <View style={styles.chartsContainer}>
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Ingresos Mensuales</Text>
            <LineChart
              data={{
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                datasets: [{
                  data: getMonthlyData()
                }]
              }}
              width={screenWidth - 80}
              height={180}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#3b82f6'
                }
              }}
              bezier
              style={styles.chart}
            />
          </View>

          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Estado de Pagos</Text>
            <BarChart
              data={{
                labels: ['Pagado', 'Pendiente', 'Vencido'],
                datasets: [{
                  data: getStatusData()
                }]
              }}
              width={screenWidth - 80}
              height={180}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                style: {
                  borderRadius: 16
                }
              }}
              style={styles.chart}
            />
          </View>
        </View>

        {/* Search and Filters */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Icon name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar pagos..."
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
            <Text style={styles.filtersTitle}>Filtros:</Text>
            
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Estado:</Text>
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
                    Todos ({getTotalPayments()})
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    statusFilter === 'Pagado' && styles.filterChipActive
                  ]}
                  onPress={() => setStatusFilter('Pagado')}
                >
                  <Text style={[
                    styles.filterChipText,
                    statusFilter === 'Pagado' && styles.filterChipTextActive
                  ]}>
                    Pagados ({getStatusCount('Pagado')})
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

            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Tipo:</Text>
              <View style={styles.filterChips}>
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    typeFilter === 'all' && styles.filterChipActive
                  ]}
                  onPress={() => setTypeFilter('all')}
                >
                  <Text style={[
                    styles.filterChipText,
                    typeFilter === 'all' && styles.filterChipTextActive
                  ]}>
                    Todos ({getTotalPayments()})
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    typeFilter === 'Renta Mensual' && styles.filterChipActive
                  ]}
                  onPress={() => setTypeFilter('Renta Mensual')}
                >
                  <Text style={[
                    styles.filterChipText,
                    typeFilter === 'Renta Mensual' && styles.filterChipTextActive
                  ]}>
                    Renta ({getTypeCount('Renta Mensual')})
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    typeFilter === 'Servicio Adicional' && styles.filterChipActive
                  ]}
                  onPress={() => setTypeFilter('Servicio Adicional')}
                >
                  <Text style={[
                    styles.filterChipText,
                    typeFilter === 'Servicio Adicional' && styles.filterChipTextActive
                  ]}>
                    Servicios ({getTypeCount('Servicio Adicional')})
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Results Count */}
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsText}>
            {filteredPayments.length} pago{filteredPayments.length !== 1 ? 's' : ''} encontrado{filteredPayments.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Payments List */}
        <View style={styles.paymentsContainer}>
          {filteredPayments.length > 0 ? (
            filteredPayments.map((payment) => (
              <View key={payment.id} style={styles.paymentCard}>
                <View style={styles.paymentHeader}>
                  <View style={styles.paymentInfo}>
                    <Text style={styles.paymentType}>{payment.type}</Text>
                    <Text style={styles.paymentDriver}>{payment.driverName}</Text>
                    <Text style={styles.paymentVehicle}>{payment.vehiclePlate}</Text>
                  </View>
                  
                  <View style={styles.paymentAmount}>
                    <Text style={styles.amountText}>
                      ${payment.totalAmount.toFixed(2)} {payment.currency}
                    </Text>
                    <View style={[
                      styles.statusBadge,
                      payment.status === 'Pagado' && styles.statusPaid,
                      payment.status === 'Pendiente' && styles.statusPending,
                      payment.status === 'Vencido' && styles.statusOverdue,
                    ]}>
                      <Text style={[
                        styles.statusText,
                        payment.status === 'Pagado' && styles.statusTextPaid,
                        payment.status === 'Pendiente' && styles.statusTextPending,
                        payment.status === 'Vencido' && styles.statusTextOverdue,
                      ]}>
                        {payment.status}
                      </Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.paymentDetails}>
                  <View style={styles.detailRow}>
                    <Icon name="calendar" size={16} color="#6b7280" />
                    <Text style={styles.detailText}>
                      Vencimiento: {payment.dueDate}
                    </Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Icon name="credit-card" size={16} color="#6b7280" />
                    <Text style={styles.detailText}>
                      {payment.method}
                    </Text>
                  </View>
                  
                  {payment.lateFees && (
                    <View style={styles.detailRow}>
                      <Icon name="alert-triangle" size={16} color="#f59e0b" />
                      <Text style={styles.detailText}>
                        Cargos por retraso: ${payment.lateFees.toFixed(2)}
                      </Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.paymentActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handlePaymentPress(payment)}
                  >
                    <Icon name="eye" size={16} color="#3b82f6" />
                    <Text style={styles.actionButtonText}>Ver</Text>
                  </TouchableOpacity>
                  
                  {payment.status !== 'Pagado' && (
                    <TouchableOpacity
                      style={[styles.actionButton, styles.markPaidButton]}
                      onPress={() => handleMarkAsPaid(payment)}
                    >
                      <Icon name="check" size={16} color="#10b981" />
                      <Text style={[styles.actionButtonText, styles.markPaidText]}>Marcar Pagado</Text>
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeletePayment(payment)}
                  >
                    <Icon name="trash-2" size={16} color="#ef4444" />
                    <Text style={[styles.actionButtonText, styles.deleteText]}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Icon name="credit-card" size={48} color="#d1d5db" />
              <Text style={styles.emptyTitle}>No se encontraron pagos</Text>
              <Text style={styles.emptySubtitle}>
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'No hay pagos registrados en el sistema'
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
    fontSize: 20,
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
  chartsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 16,
  },
  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
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
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
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
  paymentsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  paymentCard: {
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
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  paymentDriver: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 2,
  },
  paymentVehicle: {
    fontSize: 12,
    color: '#6b7280',
  },
  paymentAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  statusPaid: {
    backgroundColor: '#d1fae5',
  },
  statusPending: {
    backgroundColor: '#dbeafe',
  },
  statusOverdue: {
    backgroundColor: '#fef3c7',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6b7280',
  },
  statusTextPaid: {
    color: '#065f46',
  },
  statusTextPending: {
    color: '#1e40af',
  },
  statusTextOverdue: {
    color: '#92400e',
  },
  paymentDetails: {
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
  paymentActions: {
    flexDirection: 'row',
    gap: 12,
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
  markPaidButton: {
    backgroundColor: '#d1fae5',
  },
  deleteButton: {
    backgroundColor: '#fee2e2',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  markPaidText: {
    color: '#065f46',
  },
  deleteText: {
    color: '#dc2626',
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