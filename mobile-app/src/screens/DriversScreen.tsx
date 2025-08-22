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
import DriverCard from '../components/DriverCard';

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  cedula: string;
  phone: string;
  email: string;
  license: string;
  licenseExpiry: string;
  status: string;
  photo?: string;
  startDate: string;
  salary: number;
  commission: number;
}

export default function DriversScreen() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadDrivers();
  }, []);

  useEffect(() => {
    filterDrivers();
  }, [drivers, searchTerm, statusFilter]);

  const loadDrivers = async () => {
    try {
      setIsLoading(true);
      
      // Simular carga de datos desde API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Datos de ejemplo
      const mockDrivers: Driver[] = [
        {
          id: '1',
          firstName: 'Juan',
          lastName: 'Pérez',
          cedula: '001-1234567-8',
          phone: '809-123-4567',
          email: 'juan.perez@email.com',
          license: 'DL-001234',
          licenseExpiry: '2025-12-31',
          status: 'Activo',
          startDate: '2023-01-15',
          salary: 25000,
          commission: 15,
        },
        {
          id: '2',
          firstName: 'María',
          lastName: 'González',
          cedula: '001-2345678-9',
          phone: '809-234-5678',
          email: 'maria.gonzalez@email.com',
          license: 'DL-002345',
          licenseExpiry: '2024-06-30',
          status: 'Activo',
          startDate: '2023-03-20',
          salary: 28000,
          commission: 18,
        },
        {
          id: '3',
          firstName: 'Carlos',
          lastName: 'Rodríguez',
          cedula: '001-3456789-0',
          phone: '809-345-6789',
          email: 'carlos.rodriguez@email.com',
          license: 'DL-003456',
          licenseExpiry: '2024-03-15',
          status: 'En Revisión',
          startDate: '2023-06-10',
          salary: 22000,
          commission: 12,
        },
        {
          id: '4',
          firstName: 'Ana',
          lastName: 'López',
          cedula: '001-4567890-1',
          phone: '809-456-7890',
          email: 'ana.lopez@email.com',
          license: 'DL-004567',
          licenseExpiry: '2024-09-30',
          status: 'Suspendido',
          startDate: '2023-02-28',
          salary: 24000,
          commission: 14,
        },
        {
          id: '5',
          firstName: 'Roberto',
          lastName: 'Silva',
          cedula: '001-5678901-2',
          phone: '809-567-8901',
          email: 'roberto.silva@email.com',
          license: 'DL-005678',
          licenseExpiry: '2025-01-15',
          status: 'Activo',
          startDate: '2023-04-12',
          salary: 26000,
          commission: 16,
        },
      ];
      
      setDrivers(mockDrivers);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los conductores');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDrivers();
    setIsRefreshing(false);
  };

  const filterDrivers = () => {
    let filtered = [...drivers];

    // Aplicar filtro de búsqueda
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(driver =>
        driver.firstName.toLowerCase().includes(searchLower) ||
        driver.lastName.toLowerCase().includes(searchLower) ||
        driver.cedula.includes(searchTerm) ||
        driver.phone.includes(searchTerm) ||
        driver.email.toLowerCase().includes(searchLower)
      );
    }

    // Aplicar filtro de estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(driver => driver.status === statusFilter);
    }

    setFilteredDrivers(filtered);
  };

  const handleDriverPress = (driver: Driver) => {
    Alert.alert(
      'Detalles del Conductor',
      `${driver.firstName} ${driver.lastName}\n\nCédula: ${driver.cedula}\nTeléfono: ${driver.phone}\nEmail: ${driver.email}\nLicencia: ${driver.license}\nEstado: ${driver.status}`,
      [
        { text: 'Editar', onPress: () => handleEditDriver(driver) },
        { text: 'Ver Detalles', onPress: () => console.log('Ver detalles') },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  const handleEditDriver = (driver: Driver) => {
    Alert.alert('Editar Conductor', `Editando: ${driver.firstName} ${driver.lastName}`);
  };

  const handleDeleteDriver = (driver: Driver) => {
    Alert.alert(
      'Eliminar Conductor',
      `¿Estás seguro de que quieres eliminar a ${driver.firstName} ${driver.lastName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => {
            setDrivers(prev => prev.filter(d => d.id !== driver.id));
            Alert.alert('Éxito', 'Conductor eliminado correctamente');
          }
        }
      ]
    );
  };

  const handleAddDriver = () => {
    Alert.alert('Nuevo Conductor', 'Funcionalidad de agregar conductor');
  };

  const getStatusCount = (status: string) => {
    return drivers.filter(driver => driver.status === status).length;
  };

  const getTotalDrivers = () => drivers.length;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Icon name="refresh-cw" size={48} color="#6b7280" style={styles.spinning} />
          <Text style={styles.loadingText}>Cargando conductores...</Text>
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
            <Text style={styles.title}>Conductores</Text>
            <Text style={styles.subtitle}>
              {getTotalDrivers()} conductor{getTotalDrivers() !== 1 ? 'es' : ''} en total
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddDriver}
          >
            <Icon name="plus" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Icon name="users" size={24} color="#10b981" />
            <Text style={styles.statNumber}>{getStatusCount('Activo')}</Text>
            <Text style={styles.statLabel}>Activos</Text>
          </View>
          
          <View style={styles.statCard}>
            <Icon name="clock" size={24} color="#3b82f6" />
            <Text style={styles.statNumber}>{getStatusCount('En Revisión')}</Text>
            <Text style={styles.statLabel}>En Revisión</Text>
          </View>
          
          <View style={styles.statCard}>
            <Icon name="alert-triangle" size={24} color="#f59e0b" />
            <Text style={styles.statNumber}>{getStatusCount('Suspendido')}</Text>
            <Text style={styles.statLabel}>Suspendidos</Text>
          </View>
          
          <View style={styles.statCard}>
            <Icon name="user-x" size={24} color="#6b7280" />
            <Text style={styles.statNumber}>{getStatusCount('Inactivo')}</Text>
            <Text style={styles.statLabel}>Inactivos</Text>
          </View>
        </View>

        {/* Search and Filters */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Icon name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar conductores..."
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
                  Todos ({getTotalDrivers()})
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
                  statusFilter === 'En Revisión' && styles.filterChipActive
                ]}
                onPress={() => setStatusFilter('En Revisión')}
              >
                <Text style={[
                  styles.filterChipText,
                  statusFilter === 'En Revisión' && styles.filterChipTextActive
                ]}>
                  En Revisión ({getStatusCount('En Revisión')})
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  statusFilter === 'Suspendido' && styles.filterChipActive
                ]}
                onPress={() => setStatusFilter('Suspendido')}
              >
                <Text style={[
                  styles.filterChipText,
                  statusFilter === 'Suspendido' && styles.filterChipTextActive
                ]}>
                  Suspendidos ({getStatusCount('Suspendido')})
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Results Count */}
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsText}>
            {filteredDrivers.length} conductor{filteredDrivers.length !== 1 ? 'es' : ''} encontrado{filteredDrivers.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Drivers List */}
        <View style={styles.driversContainer}>
          {filteredDrivers.length > 0 ? (
            filteredDrivers.map((driver) => (
              <DriverCard
                key={driver.id}
                driver={driver}
                onPress={() => handleDriverPress(driver)}
                onEdit={() => handleEditDriver(driver)}
                onDelete={() => handleDeleteDriver(driver)}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Icon name="users" size={48} color="#d1d5db" />
              <Text style={styles.emptyTitle}>No se encontraron conductores</Text>
              <Text style={styles.emptySubtitle}>
                {searchTerm || statusFilter !== 'all' 
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'No hay conductores registrados en el sistema'
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
  driversContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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