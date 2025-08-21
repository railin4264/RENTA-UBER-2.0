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
import { Payment, PaymentFilters } from '../types';

const PaymentsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);

  useEffect(() => {
    loadPayments();
  }, []);

  useEffect(() => {
    filterPayments();
  }, [searchQuery, payments]);

  const loadPayments = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/payments');
      
      if (response.success && response.data) {
        setPayments(response.data);
      } else {
        Alert.alert('Error', response.message || 'Error al cargar pagos');
      }
    } catch (error: any) {
      console.error('Error loading payments:', error);
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
    if (!searchQuery.trim()) {
      setFilteredPayments(payments);
      return;
    }

    const filtered = payments.filter(payment => 
      payment.driver?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.driver?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.vehicle?.plate?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.contract?.id?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredPayments(filtered);
  };

  const handlePaymentPress = (payment: Payment) => {
    // Navegar a detalles del pago
    // navigation.navigate('PaymentDetail', { paymentId: payment.id });
    Alert.alert('Detalles del Pago', `Pago de ${payment.driver?.firstName} ${payment.driver?.lastName}`);
  };

  const handleAddPayment = () => {
    // Navegar a pantalla de agregar pago
    // navigation.navigate('AddPayment');
    Alert.alert('Agregar Pago', 'Funcionalidad en desarrollo');
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getStatusColor = (statusName?: string): string => {
    switch (statusName?.toLowerCase()) {
      case 'pagado':
        return '#10b981';
      case 'pendiente':
        return '#f59e0b';
      case 'vencido':
        return '#ef4444';
      case 'cancelado':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const getPaymentTypeIcon = (type?: string): string => {
    switch (type?.toLowerCase()) {
      case 'renta':
        return '💰';
      case 'comisión':
        return '💸';
      case 'multa':
        return '🚨';
      case 'otros':
        return '📋';
      default:
        return '💰';
    }
  };

  const renderPaymentItem = ({ item }: { item: Payment }) => (
    <TouchableOpacity
      style={styles.paymentCard}
      onPress={() => handlePaymentPress(item)}
    >
      <View style={styles.paymentHeader}>
        <View style={styles.paymentInfo}>
          <Text style={styles.paymentType}>
            {getPaymentTypeIcon(item.type)} {item.type}
          </Text>
          <Text style={styles.paymentAmount}>
            {formatCurrency(item.amount)}
          </Text>
        </View>
        <View style={styles.paymentStatus}>
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

      <View style={styles.paymentDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Chofer:</Text>
          <Text style={styles.detailValue}>
            {item.driver ? `${item.driver.firstName} ${item.driver.lastName}` : 'N/A'}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Vehículo:</Text>
          <Text style={styles.detailValue}>
            {item.vehicle ? `${item.vehicle.brand} ${item.vehicle.model} - ${item.vehicle.plate}` : 'N/A'}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Contrato:</Text>
          <Text style={styles.detailValue}>
            {item.contract?.id || 'N/A'}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Fecha:</Text>
          <Text style={styles.detailValue}>
            {item.date ? formatDate(item.date) : 'N/A'}
          </Text>
        </View>

        {item.dueDate && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Vencimiento:</Text>
            <Text style={styles.detailValue}>
              {formatDate(item.dueDate)}
            </Text>
          </View>
        )}

        {item.description && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Descripción:</Text>
            <Text style={styles.detailValue} numberOfLines={2}>
              {item.description}
            </Text>
          </View>
        )}

        {item.notes && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Notas:</Text>
            <Text style={styles.detailValue} numberOfLines={2}>
              {item.notes}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.paymentActions}>
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
      <Text style={styles.emptyIcon}>💰</Text>
      <Text style={styles.emptyTitle}>No hay pagos</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery ? 'No se encontraron pagos con esa búsqueda' : 'Agrega tu primer pago para comenzar'}
      </Text>
      {!searchQuery && (
        <TouchableOpacity
          style={styles.addFirstButton}
          onPress={handleAddPayment}
        >
          <Text style={styles.addFirstButtonText}>Agregar Pago</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Cargando pagos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pagos</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddPayment}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar pagos..."
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Text style={styles.searchIcon}>🔍</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{payments.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {payments.filter(p => p.status?.name === 'Pagado').length}
          </Text>
          <Text style={styles.statLabel}>Pagados</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {payments.filter(p => p.status?.name === 'Pendiente').length}
          </Text>
          <Text style={styles.statLabel}>Pendientes</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {formatCurrency(payments.reduce((sum, p) => sum + (p.amount || 0), 0))}
          </Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      {/* Payments List */}
      <FlatList
        data={filteredPayments}
        renderItem={renderPaymentItem}
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  listContainer: {
    padding: 20,
    flexGrow: 1,
  },
  paymentCard: {
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
    color: '#1f2937',
    marginBottom: 4,
  },
  paymentAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10b981',
  },
  paymentStatus: {
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
  paymentDetails: {
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
    width: 100,
  },
  detailValue: {
    fontSize: 14,
    color: '#1f2937',
    flex: 1,
  },
  paymentActions: {
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

export default PaymentsScreen;