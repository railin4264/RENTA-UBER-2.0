import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { api } from '../services/api';
import { DashboardData, RecentActivity, UpcomingPayment } from '../types';

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/dashboard');
      
      if (response.success && response.data) {
        setDashboardData(response.data);
      } else {
        Alert.alert('Error', response.message || 'Error al cargar el dashboard');
      }
    } catch (error: any) {
      console.error('Error loading dashboard:', error);
      Alert.alert('Error', 'No se pudo cargar el dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboardData();
    setIsRefreshing(false);
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

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'vigente':
        return '#10b981';
      case 'pending':
      case 'pendiente':
        return '#f59e0b';
      case 'failed':
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const handleActivityPress = (activity: RecentActivity) => {
    if (activity.type === 'payment') {
      // Navegar a detalles del pago
      // navigation.navigate('PaymentDetail', { paymentId: activity.id });
    } else if (activity.type === 'contract') {
      // Navegar a detalles del contrato
      // navigation.navigate('ContractDetail', { contractId: activity.id });
    }
  };

  const handlePaymentPress = (payment: UpcomingPayment) => {
    // Navegar a detalles del pago
    // navigation.navigate('PaymentDetail', { paymentId: payment.id });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Cargando dashboard...</Text>
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
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Text style={styles.headerSubtitle}>
            {new Date().toLocaleDateString('es-CO', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        {/* Stats Cards */}
        {dashboardData && (
          <View style={styles.statsContainer}>
            <View style={styles.statsRow}>
              {/* Total Drivers */}
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{dashboardData.stats.totalDrivers}</Text>
                <Text style={styles.statLabel}>Total Choferes</Text>
                <View style={[styles.statusIndicator, { backgroundColor: '#3b82f6' }]} />
              </View>

              {/* Active Drivers */}
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{dashboardData.stats.activeDrivers}</Text>
                <Text style={styles.statLabel}>Choferes Activos</Text>
                <View style={[styles.statusIndicator, { backgroundColor: '#10b981' }]} />
              </View>
            </View>

            <View style={styles.statsRow}>
              {/* Total Vehicles */}
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{dashboardData.stats.totalVehicles}</Text>
                <Text style={styles.statLabel}>Total Vehículos</Text>
                <View style={[styles.statusIndicator, { backgroundColor: '#8b5cf6' }]} />
              </View>

              {/* Available Vehicles */}
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{dashboardData.stats.availableVehicles}</Text>
                <Text style={styles.statLabel}>Vehículos Disponibles</Text>
                <View style={[styles.statusIndicator, { backgroundColor: '#10b981' }]} />
              </View>
            </View>

            <View style={styles.statsRow}>
              {/* Monthly Income */}
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>
                  {formatCurrency(dashboardData.stats.monthlyIncome)}
                </Text>
                <Text style={styles.statLabel}>Ingresos del Mes</Text>
                <View style={[styles.statusIndicator, { backgroundColor: '#059669' }]} />
              </View>

              {/* Pending Payments */}
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>
                  {formatCurrency(dashboardData.stats.pendingPayments)}
                </Text>
                <Text style={styles.statLabel}>Pagos Pendientes</Text>
                <View style={[styles.statusIndicator, { backgroundColor: '#f59e0b' }]} />
              </View>
            </View>

            <View style={styles.statsRow}>
              {/* Active Contracts */}
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{dashboardData.stats.activeContracts}</Text>
                <Text style={styles.statLabel}>Contratos Activos</Text>
                <View style={[styles.statusIndicator, { backgroundColor: '#f59e0b' }]} />
              </View>

              {/* Vehicles in Maintenance */}
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{dashboardData.stats.vehiclesInMaintenance}</Text>
                <Text style={styles.statLabel}>En Mantenimiento</Text>
                <View style={[styles.statusIndicator, { backgroundColor: '#ef4444' }]} />
              </View>
            </View>
          </View>
        )}

        {/* Recent Activities */}
        {dashboardData && dashboardData.recentActivities.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Actividades Recientes</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>Ver todas</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.activitiesContainer}>
              {dashboardData.recentActivities.slice(0, 5).map((activity, index) => (
                <TouchableOpacity
                  key={activity.id}
                  style={styles.activityItem}
                  onPress={() => handleActivityPress(activity)}
                >
                  <View style={styles.activityIcon}>
                    <Text style={styles.activityIconText}>
                      {activity.type === 'payment' ? '💰' : '📋'}
                    </Text>
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityDescription} numberOfLines={2}>
                      {activity.description}
                    </Text>
                    <Text style={styles.activityDate}>
                      {formatDate(activity.date)}
                    </Text>
                  </View>
                  <View style={styles.activityRight}>
                    <Text style={styles.activityAmount}>
                      {formatCurrency(activity.amount)}
                    </Text>
                    <View
                      style={[
                        styles.activityStatus,
                        { backgroundColor: getStatusColor(activity.status) },
                      ]}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Upcoming Payments */}
        {dashboardData && dashboardData.upcomingPayments.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Pagos Próximos</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>Ver todos</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.paymentsContainer}>
              {dashboardData.upcomingPayments.slice(0, 5).map((payment, index) => (
                <TouchableOpacity
                  key={payment.id}
                  style={styles.paymentItem}
                  onPress={() => handlePaymentPress(payment)}
                >
                  <View style={styles.paymentIcon}>
                    <Text style={styles.paymentIconText}>⏰</Text>
                  </View>
                  <View style={styles.paymentContent}>
                    <Text style={styles.paymentDriverName} numberOfLines={1}>
                      {payment.driverName}
                    </Text>
                    <Text style={styles.paymentDate}>
                      Vence: {formatDate(payment.dueDate)}
                    </Text>
                  </View>
                  <View style={styles.paymentRight}>
                    <Text style={styles.paymentAmount}>
                      {formatCurrency(payment.amount)}
                    </Text>
                    <View
                      style={[
                        styles.paymentStatus,
                        { backgroundColor: getStatusColor(payment.status) },
                      ]}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('AddDriver' as never)}
            >
              <Text style={styles.quickActionIcon}>👤</Text>
              <Text style={styles.quickActionText}>Agregar Chofer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('AddVehicle' as never)}
            >
              <Text style={styles.quickActionIcon}>🚗</Text>
              <Text style={styles.quickActionText}>Agregar Vehículo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('AddPayment' as never)}
            >
              <Text style={styles.quickActionIcon}>💳</Text>
              <Text style={styles.quickActionText}>Registrar Pago</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('AddExpense' as never)}
            >
              <Text style={styles.quickActionIcon}>📊</Text>
              <Text style={styles.quickActionText}>Registrar Gasto</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textTransform: 'capitalize',
  },
  statsContainer: {
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    alignSelf: 'flex-end',
  },
  section: {
    padding: 20,
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  seeAllText: {
    fontSize: 14,
    color: '#3b82f6',
    textDecorationLine: 'underline',
  },
  activitiesContainer: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityIconText: {
    fontSize: 18,
  },
  activityContent: {
    flex: 1,
  },
  activityDescription: {
    fontSize: 14,
    color: '#1f2937',
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  activityRight: {
    alignItems: 'flex-end',
  },
  activityAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  activityStatus: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  paymentsContainer: {
    gap: 12,
  },
  paymentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fef3c7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentIconText: {
    fontSize: 18,
  },
  paymentContent: {
    flex: 1,
  },
  paymentDriverName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },
  paymentDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  paymentRight: {
    alignItems: 'flex-end',
  },
  paymentAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  paymentStatus: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionButton: {
    width: '48%',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#374151',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default DashboardScreen;