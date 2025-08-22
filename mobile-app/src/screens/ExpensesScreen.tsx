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

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  status: string;
  vehicleId?: string;
  vehiclePlate?: string;
  driverId?: string;
  driverName?: string;
  receipt?: string;
  notes?: string;
  recurring: boolean;
  frequency?: string;
}

export default function ExpensesScreen() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    loadExpenses();
  }, []);

  useEffect(() => {
    filterExpenses();
  }, [expenses, searchTerm, categoryFilter, statusFilter]);

  const loadExpenses = async () => {
    try {
      setIsLoading(true);
      
      // Simular carga de datos desde API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Datos de ejemplo
      const mockExpenses: Expense[] = [
        {
          id: '1',
          description: 'Mantenimiento preventivo Toyota Corolla',
          amount: 120.00,
          category: 'Mantenimiento',
          date: '2024-02-15',
          status: 'Pagado',
          vehicleId: '1',
          vehiclePlate: 'ABC-123',
          driverId: '1',
          driverName: 'Carlos Mendoza',
          notes: 'Cambio de aceite y filtros',
          recurring: false,
        },
        {
          id: '2',
          description: 'Seguro vehicular Honda Civic',
          amount: 450.00,
          category: 'Seguros',
          date: '2024-02-10',
          status: 'Pagado',
          vehicleId: '2',
          vehiclePlate: 'XYZ-789',
          driverId: '2',
          driverName: 'Ana Rodríguez',
          notes: 'Renovación anual de seguro',
          recurring: true,
          frequency: 'Anual',
        },
        {
          id: '3',
          description: 'Gasolina Nissan Sentra',
          amount: 85.50,
          category: 'Combustible',
          date: '2024-02-14',
          status: 'Pagado',
          vehicleId: '3',
          vehiclePlate: 'DEF-456',
          driverId: '3',
          driverName: 'Luis García',
          notes: 'Llenado completo de tanque',
          recurring: false,
        },
        {
          id: '4',
          description: 'Limpieza interior Hyundai Elantra',
          amount: 35.00,
          category: 'Limpieza',
          date: '2024-02-13',
          status: 'Pendiente',
          vehicleId: '4',
          vehiclePlate: 'GHI-789',
          driverId: '4',
          driverName: 'María López',
          notes: 'Limpieza profunda del interior',
          recurring: false,
        },
        {
          id: '5',
          description: 'Reparación sistema de frenos Kia Forte',
          amount: 280.00,
          category: 'Reparaciones',
          date: '2024-02-12',
          status: 'Pagado',
          vehicleId: '5',
          vehiclePlate: 'JKL-012',
          driverId: '5',
          driverName: 'Roberto Silva',
          notes: 'Cambio de pastillas y discos de freno',
          recurring: false,
        },
        {
          id: '6',
          description: 'Licencia comercial conductor',
          amount: 75.00,
          category: 'Licencias',
          date: '2024-02-08',
          status: 'Pagado',
          driverId: '1',
          driverName: 'Carlos Mendoza',
          notes: 'Renovación de licencia comercial',
          recurring: true,
          frequency: 'Bienal',
        },
      ];
      
      setExpenses(mockExpenses);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los gastos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadExpenses();
    setIsRefreshing(false);
  };

  const filterExpenses = () => {
    let filtered = [...expenses];

    // Aplicar filtro de búsqueda
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(expense =>
        expense.description.toLowerCase().includes(searchLower) ||
        expense.category.toLowerCase().includes(searchLower) ||
        (expense.driverName && expense.driverName.toLowerCase().includes(searchLower)) ||
        (expense.vehiclePlate && expense.vehiclePlate.toLowerCase().includes(searchLower))
      );
    }

    // Aplicar filtro de categoría
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(expense => expense.category === categoryFilter);
    }

    // Aplicar filtro de estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(expense => expense.status === statusFilter);
    }

    setFilteredExpenses(filtered);
  };

  const handleExpensePress = (expense: Expense) => {
    Alert.alert(
      'Detalles del Gasto',
      `${expense.description}\n\nCategoría: ${expense.category}\nMonto: $${expense.amount.toFixed(2)}\nFecha: ${expense.date}\nEstado: ${expense.status}${expense.notes ? `\nNotas: ${expense.notes}` : ''}`,
      [
        { text: 'Editar', onPress: () => handleEditExpense(expense) },
        { text: 'Ver Detalles', onPress: () => console.log('Ver detalles') },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  const handleEditExpense = (expense: Expense) => {
    Alert.alert('Editar Gasto', `Editando: ${expense.description}`);
  };

  const handleDeleteExpense = (expense: Expense) => {
    Alert.alert(
      'Eliminar Gasto',
      `¿Estás seguro de que quieres eliminar este gasto?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => {
            setExpenses(prev => prev.filter(e => e.id !== expense.id));
            Alert.alert('Éxito', 'Gasto eliminado correctamente');
          }
        }
      ]
    );
  };

  const handleAddExpense = () => {
    Alert.alert('Nuevo Gasto', 'Funcionalidad de agregar gasto');
  };

  const getCategoryCount = (category: string) => {
    return expenses.filter(expense => expense.category === category).length;
  };

  const getStatusCount = (status: string) => {
    return expenses.filter(expense => expense.status === status).length;
  };

  const getTotalExpenses = () => expenses.length;

  const getTotalAmount = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const getTotalPaid = () => {
    return expenses
      .filter(expense => expense.status === 'Pagado')
      .reduce((total, expense) => total + expense.amount, 0);
  };

  const getTotalPending = () => {
    return expenses
      .filter(expense => expense.status === 'Pendiente')
      .reduce((total, expense) => total + expense.amount, 0);
  };

  const getMonthlyData = () => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
    const data = months.map((_, index) => {
      const monthExpenses = expenses.filter(expense => {
        const expenseMonth = new Date(expense.date).getMonth();
        return expenseMonth === index;
      });
      return monthExpenses.reduce((total, expense) => total + expense.amount, 0);
    });
    return data;
  };

  const getCategoryData = () => {
    const categories = ['Mantenimiento', 'Seguros', 'Combustible', 'Limpieza', 'Reparaciones', 'Licencias'];
    const data = categories.map(category => {
      const categoryExpenses = expenses.filter(expense => expense.category === category);
      return categoryExpenses.reduce((total, expense) => total + expense.amount, 0);
    });
    return data;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Icon name="refresh-cw" size={48} color="#6b7280" style={styles.spinning} />
          <Text style={styles.loadingText}>Cargando gastos...</Text>
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
            <Text style={styles.title}>Gastos</Text>
            <Text style={styles.subtitle}>
              {getTotalExpenses()} gasto{getTotalExpenses() !== 1 ? 's' : ''} en total
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddExpense}
          >
            <Icon name="plus" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Icon name="check-circle" size={24} color="#10b981" />
            <Text style={styles.statNumber}>${getTotalPaid().toFixed(0)}</Text>
            <Text style={styles.statLabel}>Pagados</Text>
          </View>
          
          <View style={styles.statCard}>
            <Icon name="clock" size={24} color="#f59e0b" />
            <Text style={styles.statNumber}>${getTotalPending().toFixed(0)}</Text>
            <Text style={styles.statLabel}>Pendientes</Text>
          </View>
          
          <View style={styles.statCard}>
            <Icon name="trending-down" size={24} color="#ef4444" />
            <Text style={styles.statNumber}>${(getTotalAmount() / 1000).toFixed(1)}k</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          
          <View style={styles.statCard}>
            <Icon name="repeat" size={24} color="#8b5cf6" />
            <Text style={styles.statNumber}>
              {expenses.filter(e => e.recurring).length}
            </Text>
            <Text style={styles.statLabel}>Recurrentes</Text>
          </View>
        </View>

        {/* Charts */}
        <View style={styles.chartsContainer}>
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Gastos Mensuales</Text>
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
                color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#ef4444'
                }
              }}
              bezier
              style={styles.chart}
            />
          </View>

          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Gastos por Categoría</Text>
            <BarChart
              data={{
                labels: ['Mant.', 'Seg.', 'Comb.', 'Limp.', 'Rep.', 'Lic.'],
                datasets: [{
                  data: getCategoryData()
                }]
              }}
              width={screenWidth - 80}
              height={180}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
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
              placeholder="Buscar gastos..."
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
              <Text style={styles.filterSectionTitle}>Categoría:</Text>
              <View style={styles.filterChips}>
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    categoryFilter === 'all' && styles.filterChipActive
                  ]}
                  onPress={() => setCategoryFilter('all')}
                >
                  <Text style={[
                    styles.filterChipText,
                    categoryFilter === 'all' && styles.filterChipTextActive
                  ]}>
                    Todas ({getTotalExpenses()})
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    categoryFilter === 'Mantenimiento' && styles.filterChipActive
                  ]}
                  onPress={() => setCategoryFilter('Mantenimiento')}
                >
                  <Text style={[
                    styles.filterChipText,
                    categoryFilter === 'Mantenimiento' && styles.filterChipTextActive
                  ]}>
                    Mantenimiento ({getCategoryCount('Mantenimiento')})
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    categoryFilter === 'Seguros' && styles.filterChipActive
                  ]}
                  onPress={() => setCategoryFilter('Seguros')}
                >
                  <Text style={[
                    styles.filterChipText,
                    categoryFilter === 'Seguros' && styles.filterChipTextActive
                  ]}>
                    Seguros ({getCategoryCount('Seguros')})
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    categoryFilter === 'Combustible' && styles.filterChipActive
                  ]}
                  onPress={() => setCategoryFilter('Combustible')}
                >
                  <Text style={[
                    styles.filterChipText,
                    categoryFilter === 'Combustible' && styles.filterChipTextActive
                  ]}>
                    Combustible ({getCategoryCount('Combustible')})
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

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
                    Todos ({getTotalExpenses()})
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
              </View>
            </View>
          </View>
        )}

        {/* Results Count */}
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsText}>
            {filteredExpenses.length} gasto{filteredExpenses.length !== 1 ? 's' : ''} encontrado{filteredExpenses.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Expenses List */}
        <View style={styles.expensesContainer}>
          {filteredExpenses.length > 0 ? (
            filteredExpenses.map((expense) => (
              <View key={expense.id} style={styles.expenseCard}>
                <View style={styles.expenseHeader}>
                  <View style={styles.expenseInfo}>
                    <Text style={styles.expenseDescription}>{expense.description}</Text>
                    <Text style={styles.expenseCategory}>{expense.category}</Text>
                    {expense.driverName && (
                      <Text style={styles.expenseDriver}>
                        Conductor: {expense.driverName}
                      </Text>
                    )}
                    {expense.vehiclePlate && (
                      <Text style={styles.expenseVehicle}>
                        Vehículo: {expense.vehiclePlate}
                      </Text>
                    )}
                  </View>
                  
                  <View style={styles.expenseAmount}>
                    <Text style={styles.amountText}>
                      ${expense.amount.toFixed(2)}
                    </Text>
                    <View style={[
                      styles.statusBadge,
                      expense.status === 'Pagado' && styles.statusPaid,
                      expense.status === 'Pendiente' && styles.statusPending,
                    ]}>
                      <Text style={[
                        styles.statusText,
                        expense.status === 'Pagado' && styles.statusTextPaid,
                        expense.status === 'Pendiente' && styles.statusTextPending,
                      ]}>
                        {expense.status}
                      </Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.expenseDetails}>
                  <View style={styles.detailRow}>
                    <Icon name="calendar" size={16} color="#6b7280" />
                    <Text style={styles.detailText}>
                      Fecha: {expense.date}
                    </Text>
                  </View>
                  
                  {expense.recurring && (
                    <View style={styles.detailRow}>
                      <Icon name="repeat" size={16} color="#8b5cf6" />
                      <Text style={styles.detailText}>
                        Recurrente: {expense.frequency}
                      </Text>
                    </View>
                  )}
                  
                  {expense.notes && (
                    <View style={styles.detailRow}>
                      <Icon name="file-text" size={16} color="#6b7280" />
                      <Text style={styles.detailText}>
                        {expense.notes}
                      </Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.expenseActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleExpensePress(expense)}
                  >
                    <Icon name="eye" size={16} color="#3b82f6" />
                    <Text style={styles.actionButtonText}>Ver</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => handleEditExpense(expense)}
                  >
                    <Icon name="edit-3" size={16} color="#f59e0b" />
                    <Text style={[styles.actionButtonText, styles.editText]}>Editar</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteExpense(expense)}
                  >
                    <Icon name="trash-2" size={16} color="#ef4444" />
                    <Text style={[styles.actionButtonText, styles.deleteText]}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Icon name="trending-down" size={48} color="#d1d5db" />
              <Text style={styles.emptyTitle}>No se encontraron gastos</Text>
              <Text style={styles.emptySubtitle}>
                {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'No hay gastos registrados en el sistema'
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
  expensesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  expenseCard: {
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
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  expenseInfo: {
    flex: 1,
    marginRight: 16,
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  expenseCategory: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
    marginBottom: 2,
  },
  expenseDriver: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  expenseVehicle: {
    fontSize: 12,
    color: '#6b7280',
  },
  expenseAmount: {
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
    color: '#92400e',
  },
  expenseDetails: {
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
    flex: 1,
  },
  expenseActions: {
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
  editButton: {
    backgroundColor: '#fef3c7',
  },
  deleteButton: {
    backgroundColor: '#fee2e2',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  editText: {
    color: '#92400e',
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