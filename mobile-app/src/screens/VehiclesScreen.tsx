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
import VehicleCard from '../components/VehicleCard';

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
  status: string;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  photo?: string;
}

export default function VehiclesScreen() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadVehicles();
  }, []);

  useEffect(() => {
    filterVehicles();
  }, [vehicles, searchTerm, statusFilter]);

  const loadVehicles = async () => {
    try {
      setIsLoading(true);
      
      // Simular carga de datos desde API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Datos de ejemplo
      const mockVehicles: Vehicle[] = [
        {
          id: '1',
          brand: 'Toyota',
          model: 'Corolla',
          plate: 'ABC-123',
          year: 2022,
          color: 'Blanco',
          vin: '1HGBH41JXMN109186',
          engine: '2.0L 4-Cylinder',
          transmission: 'Automático',
          fuelType: 'Gasolina',
          mileage: 45000,
          lastMaintenance: '2024-01-15',
          nextMaintenance: '2024-04-15',
          insuranceExpiry: '2024-12-31',
          registrationExpiry: '2025-06-30',
          status: 'Disponible',
          purchaseDate: '2022-03-15',
          purchasePrice: 25000,
          currentValue: 22000,
        },
        {
          id: '2',
          brand: 'Honda',
          model: 'Civic',
          plate: 'XYZ-789',
          year: 2021,
          color: 'Negro',
          vin: '2T1BURHE0JC123456',
          engine: '1.8L 4-Cylinder',
          transmission: 'Automático',
          fuelType: 'Gasolina',
          mileage: 68000,
          lastMaintenance: '2024-02-20',
          nextMaintenance: '2024-05-20',
          insuranceExpiry: '2024-11-30',
          registrationExpiry: '2025-03-15',
          status: 'En Uso',
          purchaseDate: '2021-08-20',
          purchasePrice: 23000,
          currentValue: 19500,
        },
        {
          id: '3',
          brand: 'Nissan',
          model: 'Sentra',
          plate: 'DEF-456',
          year: 2023,
          color: 'Azul',
          vin: '3N1AB6AP7BL123456',
          engine: '2.0L 4-Cylinder',
          transmission: 'CVT',
          fuelType: 'Gasolina',
          mileage: 22000,
          lastMaintenance: '2024-01-30',
          nextMaintenance: '2024-04-30',
          insuranceExpiry: '2025-01-31',
          registrationExpiry: '2026-01-15',
          status: 'Disponible',
          purchaseDate: '2023-02-10',
          purchasePrice: 27000,
          currentValue: 25000,
        },
        {
          id: '4',
          brand: 'Hyundai',
          model: 'Elantra',
          plate: 'GHI-789',
          year: 2020,
          color: 'Rojo',
          vin: '5NPE34AF5FH123456',
          engine: '2.0L 4-Cylinder',
          transmission: 'Automático',
          fuelType: 'Gasolina',
          mileage: 85000,
          lastMaintenance: '2024-03-10',
          nextMaintenance: '2024-06-10',
          insuranceExpiry: '2024-08-31',
          registrationExpiry: '2024-12-15',
          status: 'En Mantenimiento',
          purchaseDate: '2020-06-15',
          purchasePrice: 21000,
          currentValue: 16500,
        },
        {
          id: '5',
          brand: 'Kia',
          model: 'Forte',
          plate: 'JKL-012',
          year: 2022,
          color: 'Gris',
          vin: '3KPFL4A7XNE123456',
          engine: '2.0L 4-Cylinder',
          transmission: 'Automático',
          fuelType: 'Gasolina',
          mileage: 38000,
          lastMaintenance: '2024-02-15',
          nextMaintenance: '2024-05-15',
          insuranceExpiry: '2024-10-31',
          registrationExpiry: '2025-04-30',
          status: 'Reservado',
          purchaseDate: '2022-05-20',
          purchasePrice: 24000,
          currentValue: 21000,
        },
      ];
      
      setVehicles(mockVehicles);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los vehículos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadVehicles();
    setIsRefreshing(false);
  };

  const filterVehicles = () => {
    let filtered = [...vehicles];

    // Aplicar filtro de búsqueda
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(vehicle =>
        vehicle.brand.toLowerCase().includes(searchLower) ||
        vehicle.model.toLowerCase().includes(searchLower) ||
        vehicle.plate.toLowerCase().includes(searchLower) ||
        vehicle.color.toLowerCase().includes(searchLower) ||
        vehicle.vin.toLowerCase().includes(searchLower)
      );
    }

    // Aplicar filtro de estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.status === statusFilter);
    }

    setFilteredVehicles(filtered);
  };

  const handleVehiclePress = (vehicle: Vehicle) => {
    Alert.alert(
      'Detalles del Vehículo',
      `${vehicle.brand} ${vehicle.model}\n\nPlaca: ${vehicle.plate}\nAño: ${vehicle.year}\nColor: ${vehicle.color}\nVIN: ${vehicle.vin}\nEstado: ${vehicle.status}\nKilometraje: ${vehicle.mileage.toLocaleString()} km`,
      [
        { text: 'Editar', onPress: () => handleEditVehicle(vehicle) },
        { text: 'Ver Detalles', onPress: () => console.log('Ver detalles') },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    Alert.alert('Editar Vehículo', `Editando: ${vehicle.brand} ${vehicle.model}`);
  };

  const handleDeleteVehicle = (vehicle: Vehicle) => {
    Alert.alert(
      'Eliminar Vehículo',
      `¿Estás seguro de que quieres eliminar ${vehicle.brand} ${vehicle.model} (${vehicle.plate})?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => {
            setVehicles(prev => prev.filter(v => v.id !== vehicle.id));
            Alert.alert('Éxito', 'Vehículo eliminado correctamente');
          }
        }
      ]
    );
  };

  const handleAddVehicle = () => {
    Alert.alert('Nuevo Vehículo', 'Funcionalidad de agregar vehículo');
  };

  const getStatusCount = (status: string) => {
    return vehicles.filter(vehicle => vehicle.status === status).length;
  };

  const getTotalVehicles = () => vehicles.length;

  const getTotalValue = () => {
    return vehicles.reduce((total, vehicle) => total + vehicle.currentValue, 0);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Icon name="refresh-cw" size={48} color="#6b7280" style={styles.spinning} />
          <Text style={styles.loadingText}>Cargando vehículos...</Text>
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
            <Text style={styles.title}>Vehículos</Text>
            <Text style={styles.subtitle}>
              {getTotalVehicles()} vehículo{getTotalVehicles() !== 1 ? 's' : ''} en total
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddVehicle}
          >
            <Icon name="plus" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Icon name="truck" size={24} color="#10b981" />
            <Text style={styles.statNumber}>{getStatusCount('Disponible')}</Text>
            <Text style={styles.statLabel}>Disponibles</Text>
          </View>
          
          <View style={styles.statCard}>
            <Icon name="activity" size={24} color="#3b82f6" />
            <Text style={styles.statNumber}>{getStatusCount('En Uso')}</Text>
            <Text style={styles.statLabel}>En Uso</Text>
          </View>
          
          <View style={styles.statCard}>
            <Icon name="wrench" size={24} color="#f59e0b" />
            <Text style={styles.statNumber}>{getStatusCount('En Mantenimiento')}</Text>
            <Text style={styles.statLabel}>En Mantenimiento</Text>
          </View>
          
          <View style={styles.statCard}>
            <Icon name="dollar-sign" size={24} color="#8b5cf6" />
            <Text style={styles.statNumber}>${(getTotalValue() / 1000).toFixed(0)}k</Text>
            <Text style={styles.statLabel}>Valor Total</Text>
          </View>
        </View>

        {/* Search and Filters */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Icon name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar vehículos..."
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
                  Todos ({getTotalVehicles()})
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  statusFilter === 'Disponible' && styles.filterChipActive
                ]}
                onPress={() => setStatusFilter('Disponible')}
              >
                <Text style={[
                  styles.filterChipText,
                  statusFilter === 'Disponible' && styles.filterChipTextActive
                ]}>
                  Disponibles ({getStatusCount('Disponible')})
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  statusFilter === 'En Uso' && styles.filterChipActive
                ]}
                onPress={() => setStatusFilter('En Uso')}
              >
                <Text style={[
                  styles.filterChipText,
                  statusFilter === 'En Uso' && styles.filterChipTextActive
                ]}>
                  En Uso ({getStatusCount('En Uso')})
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  statusFilter === 'En Mantenimiento' && styles.filterChipActive
                ]}
                onPress={() => setStatusFilter('En Mantenimiento')}
              >
                <Text style={[
                  styles.filterChipText,
                  statusFilter === 'En Mantenimiento' && styles.filterChipTextActive
                ]}>
                  En Mantenimiento ({getStatusCount('En Mantenimiento')})
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  statusFilter === 'Reservado' && styles.filterChipActive
                ]}
                onPress={() => setStatusFilter('Reservado')}
              >
                <Text style={[
                  styles.filterChipText,
                  statusFilter === 'Reservado' && styles.filterChipTextActive
                ]}>
                  Reservados ({getStatusCount('Reservado')})
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Results Count */}
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsText}>
            {filteredVehicles.length} vehículo{filteredVehicles.length !== 1 ? 's' : ''} encontrado{filteredVehicles.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Vehicles List */}
        <View style={styles.vehiclesContainer}>
          {filteredVehicles.length > 0 ? (
            filteredVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onPress={() => handleVehiclePress(vehicle)}
                onEdit={() => handleEditVehicle(vehicle)}
                onDelete={() => handleDeleteVehicle(vehicle)}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Icon name="truck" size={48} color="#d1d5db" />
              <Text style={styles.emptyTitle}>No se encontraron vehículos</Text>
              <Text style={styles.emptySubtitle}>
                {searchTerm || statusFilter !== 'all' 
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'No hay vehículos registrados en el sistema'
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
  vehiclesContainer: {
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