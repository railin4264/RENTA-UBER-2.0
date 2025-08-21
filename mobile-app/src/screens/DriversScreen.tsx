import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { api } from '../services/api';
import { Driver, DriverFilters } from '../types';

const DriversScreen: React.FC = () => {
  const navigation = useNavigation();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);

  useEffect(() => {
    loadDrivers();
  }, []);

  useEffect(() => {
    filterDrivers();
  }, [searchQuery, drivers]);

  const loadDrivers = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/drivers');
      
      if (response.success && response.data) {
        setDrivers(response.data);
      } else {
        Alert.alert('Error', response.message || 'Error al cargar choferes');
      }
    } catch (error: any) {
      console.error('Error loading drivers:', error);
      Alert.alert('Error', 'No se pudieron cargar los choferes');
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
    if (!searchQuery.trim()) {
      setFilteredDrivers(drivers);
      return;
    }

    const filtered = drivers.filter(driver => 
      driver.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.cedula.includes(searchQuery) ||
      driver.phone.includes(searchQuery) ||
      (driver.email && driver.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    setFilteredDrivers(filtered);
  };

  const handleDriverPress = (driver: Driver) => {
    // Navegar a detalles del chofer
    // navigation.navigate('DriverDetail', { driverId: driver.id });
    Alert.alert('Detalles del Chofer', `${driver.firstName} ${driver.lastName}`);
  };

  const handleAddDriver = () => {
    // Navegar a pantalla de agregar chofer
    // navigation.navigate('AddDriver');
    Alert.alert('Agregar Chofer', 'Funcionalidad en desarrollo');
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (statusName?: string): string => {
    switch (statusName?.toLowerCase()) {
      case 'activo':
        return '#10b981';
      case 'inactivo':
        return '#6b7280';
      case 'suspendido':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const renderDriverItem = ({ item }: { item: Driver }) => (
    <TouchableOpacity
      style={styles.driverCard}
      onPress={() => handleDriverPress(item)}
    >
      <View style={styles.driverHeader}>
        <View style={styles.driverInfo}>
          <Text style={styles.driverName}>
            {item.firstName} {item.lastName}
          </Text>
          <Text style={styles.driverCedula}>Cédula: {item.cedula}</Text>
          <Text style={styles.driverLicense}>Licencia: {item.license}</Text>
        </View>
        <View style={styles.driverStatus}>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: getStatusColor(item.status?.name) },
            ]}
          />
          <Text style={styles.statusText}>
            {item.status?.name || 'Sin Estado'}
          </Text>
        </View>
      </View>

      <View style={styles.driverDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Teléfono:</Text>
          <Text style={styles.detailValue}>{item.phone}</Text>
        </View>
        
        {item.email && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Email:</Text>
            <Text style={styles.detailValue}>{item.email}</Text>
          </View>
        )}

        {item.salary && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Salario:</Text>
            <Text style={styles.detailValue}>
              {formatCurrency(item.salary)}
            </Text>
          </View>
        )}

        {item.commission && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Comisión:</Text>
            <Text style={styles.detailValue}>{item.commission}%</Text>
          </View>
        )}

        {item.address && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Dirección:</Text>
            <Text style={styles.detailValue} numberOfLines={2}>
              {item.address}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.driverActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => Alert.alert('Editar', 'Funcionalidad en desarrollo')}
        >
          <Text style={styles.actionButtonText}>Editar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.viewButton]}
          onPress={() => Alert.alert('Ver', 'Funcionalidad en desarrollo')}
        >
          <Text style={styles.actionButtonText}>Ver</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>👥</Text>
      <Text style={styles.emptyTitle}>No hay choferes</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery ? 'No se encontraron choferes con esa búsqueda' : 'Agrega tu primer chofer para comenzar'}
      </Text>
      {!searchQuery && (
        <TouchableOpacity
          style={styles.addFirstButton}
          onPress={handleAddDriver}
        >
          <Text style={styles.addFirstButtonText}>Agregar Chofer</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Cargando choferes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Choferes</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddDriver}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar choferes..."
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Text style={styles.searchIcon}>🔍</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{drivers.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {drivers.filter(d => d.status?.name === 'Activo').length}
          </Text>
          <Text style={styles.statLabel}>Activos</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {drivers.filter(d => d.status?.name === 'Inactivo').length}
          </Text>
          <Text style={styles.statLabel}>Inactivos</Text>
        </View>
      </View>

      {/* Drivers List */}
      <FlatList
        data={filteredDrivers}
        renderItem={renderDriverItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={renderEmptyList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchContainer: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#ffffff',
    paddingRight: 50,
  },
  searchIcon: {
    position: 'absolute',
    right: 35,
    top: 35,
    fontSize: 18,
    color: '#9ca3af',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  listContainer: {
    padding: 20,
    flexGrow: 1,
  },
  driverCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  driverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  driverCedula: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  driverLicense: {
    fontSize: 14,
    color: '#6b7280',
  },
  driverStatus: {
    alignItems: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#6b7280',
    textTransform: 'capitalize',
  },
  driverDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    width: 80,
  },
  detailValue: {
    fontSize: 14,
    color: '#1f2937',
    flex: 1,
  },
  driverActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#3b82f6',
  },
  viewButton: {
    backgroundColor: '#10b981',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 40,
  },
  addFirstButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  addFirstButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DriversScreen;