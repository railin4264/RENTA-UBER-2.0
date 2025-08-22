import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useDashboard, useRealtimeSync } from '../hooks/useApi';
import { useAuth } from '../contexts/AuthContext';
import MetricCard from '../components/MetricCard';

const screenWidth = Dimensions.get('window').width;

interface DashboardData {
  stats: {
    activeDrivers: number;
    totalVehicles: number;
    monthlyIncome: number;
    pendingDebts: number;
    activeContracts: number;
    vehiclesInMaintenance: number;
    incomeGrowth: number;
    pendingCases: number;
  };
  recentActivities: Array<{
    id: string;
    type: string;
    description: string;
    amount?: number;
    timestamp: string;
  }>;
  upcomingPayments: Array<{
    id: string;
    driverName: string;
    amount: number;
    dueDate: string;
  }>;
}

export default function DashboardScreen() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Usar hook de API para dashboard con sincronización en tiempo real
  const [dashboardState, refreshDashboard] = useRealtimeSync<DashboardData>('/dashboard', 30000); // 30 segundos

  // Actualizar datos locales cuando cambie el estado de la API
  useEffect(() => {
    if (dashboardState.data) {
      setDashboardData(dashboardState.data);
    }
  }, [dashboardState.data]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshDashboard();
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleMetricPress = (metric: string) => {
    Alert.alert('Métrica', `Has seleccionado: ${metric}`);
  };

  const handleActivityPress = (activity: any) => {
    Alert.alert('Actividad', activity.description);
  };

  const handlePaymentPress = (payment: any) => {
    Alert.alert('Pago Próximo', `${payment.driverName}: $${payment.amount}`);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'payment': return '#10B981';
      case 'contract': return '#3B82F6';
      case 'maintenance': return '#F59E0B';
      case 'expense': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'payment': return 'credit-card';
      case 'contract': return 'file-text';
      case 'maintenance': return 'wrench';
      case 'expense': return 'receipt';
      default: return 'circle';
    }
  };

  const getMonthlyData = () => {
    if (!dashboardData) return [];
    
    // Simular datos mensuales basados en los stats
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
    const baseIncome = dashboardData.stats.monthlyIncome;
    
    return months.map((month, index) => ({
      month,
      income: baseIncome + (Math.random() - 0.5) * 5000,
    }));
  };

  const getDriversData = () => {
    if (!dashboardData) return [];
    
    return [
      { label: 'Activos', value: dashboardData.stats.activeDrivers, color: '#10B981' },
      { label: 'Inactivos', value: dashboardData.stats.totalVehicles - dashboardData.stats.activeDrivers, color: '#EF4444' },
    ];
  };

  if (dashboardState.loading && !dashboardData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Icon name="loader" size={40} color="#3B82F6" />
          <Text style={styles.loadingText}>Cargando dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (dashboardState.error && !dashboardData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={40} color="#EF4444" />
          <Text style={styles.errorText}>Error al cargar el dashboard</Text>
          <Text style={styles.errorSubtext}>{dashboardState.error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refreshDashboard}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!dashboardData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="database" size={40} color="#6B7280" />
          <Text style={styles.errorText}>No hay datos disponibles</Text>
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
            <Text style={styles.welcomeText}>¡Bienvenido de vuelta!</Text>
            <Text style={styles.userName}>{user?.firstName || 'Usuario'}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.notificationButton}>
              <Icon name="bell" size={24} color="#6B7280" />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Métricas principales */}
        <View style={styles.metricsContainer}>
          <Text style={styles.sectionTitle}>Resumen General</Text>
          <View style={styles.metricsGrid}>
            <MetricCard
              title="Conductores Activos"
              value={dashboardData.stats.activeDrivers.toString()}
              icon="users"
              color="#10B981"
              onPress={() => handleMetricPress('Conductores Activos')}
            />
            <MetricCard
              title="Vehículos Totales"
              value={dashboardData.stats.totalVehicles.toString()}
              icon="car"
              color="#3B82F6"
              onPress={() => handleMetricPress('Vehículos Totales')}
            />
            <MetricCard
              title="Ingresos Mensuales"
              value={`$${dashboardData.stats.monthlyIncome.toLocaleString()}`}
              icon="dollar-sign"
              color="#10B981"
              onPress={() => handleMetricPress('Ingresos Mensuales')}
            />
            <MetricCard
              title="Deudas Pendientes"
              value={`$${dashboardData.stats.pendingDebts.toLocaleString()}`}
              icon="alert-triangle"
              color="#F59E0B"
              onPress={() => handleMetricPress('Deudas Pendientes')}
            />
            <MetricCard
              title="Contratos Activos"
              value={dashboardData.stats.activeContracts.toString()}
              icon="file-text"
              color="#8B5CF6"
              onPress={() => handleMetricPress('Contratos Activos')}
            />
            <MetricCard
              title="En Mantenimiento"
              value={dashboardData.stats.vehiclesInMaintenance.toString()}
              icon="wrench"
              color="#F59E0B"
              onPress={() => handleMetricPress('En Mantenimiento')}
            />
          </View>
        </View>

        {/* Gráficos */}
        <View style={styles.chartsContainer}>
          <Text style={styles.sectionTitle}>Tendencias</Text>
          
          {/* Gráfico de ingresos mensuales */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Ingresos Mensuales</Text>
            <LineChart
              data={{
                labels: getMonthlyData().map(d => d.month),
                datasets: [{
                  data: getMonthlyData().map(d => d.income),
                }]
              }}
              width={screenWidth - 48}
              height={200}
              chartConfig={{
                backgroundColor: '#FFFFFF',
                backgroundGradientFrom: '#FFFFFF',
                backgroundGradientTo: '#FFFFFF',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#3B82F6',
                },
              }}
              bezier
              style={styles.chart}
            />
          </View>

          {/* Gráfico de distribución de conductores */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Distribución de Conductores</Text>
            <BarChart
              data={{
                labels: getDriversData().map(d => d.label),
                datasets: [{
                  data: getDriversData().map(d => d.value),
                }]
              }}
              width={screenWidth - 48}
              height={200}
              chartConfig={{
                backgroundColor: '#FFFFFF',
                backgroundGradientFrom: '#FFFFFF',
                backgroundGradientTo: '#FFFFFF',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              style={styles.chart}
            />
          </View>
        </View>

        {/* Actividades recientes */}
        <View style={styles.activitiesContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Actividades Recientes</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          
          {dashboardData.recentActivities.map((activity, index) => (
            <TouchableOpacity
              key={activity.id}
              style={styles.activityItem}
              onPress={() => handleActivityPress(activity)}
            >
              <View style={[styles.activityIcon, { backgroundColor: getStatusColor(activity.type) + '20' }]}>
                <Icon name={getStatusIcon(activity.type) as any} size={20} color={getStatusColor(activity.type)} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityDescription}>{activity.description}</Text>
                <Text style={styles.activityTime}>
                  {new Date(activity.timestamp).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              </View>
              {activity.amount && (
                <Text style={styles.activityAmount}>${activity.amount.toLocaleString()}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Pagos próximos */}
        <View style={styles.paymentsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pagos Próximos</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          
          {dashboardData.upcomingPayments.map((payment, index) => (
            <TouchableOpacity
              key={payment.id}
              style={styles.paymentItem}
              onPress={() => handlePaymentPress(payment)}
            >
              <View style={styles.paymentIcon}>
                <Icon name="calendar" size={20} color="#3B82F6" />
              </View>
              <View style={styles.paymentContent}>
                <Text style={styles.paymentDriver}>{payment.driverName}</Text>
                <Text style={styles.paymentDate}>
                  Vence: {new Date(payment.dueDate).toLocaleDateString('es-ES')}
                </Text>
              </View>
              <Text style={styles.paymentAmount}>${payment.amount.toLocaleString()}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Acciones rápidas */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickActionButton}>
              <Icon name="user-plus" size={24} color="#3B82F6" />
              <Text style={styles.quickActionText}>Nuevo Conductor</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton}>
              <Icon name="car" size={24} color="#10B981" />
              <Text style={styles.quickActionText}>Nuevo Vehículo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton}>
              <Icon name="file-text" size={24} color="#8B5CF6" />
              <Text style={styles.quickActionText}>Nuevo Contrato</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton}>
              <Icon name="credit-card" size={24} color="#F59E0B" />
              <Text style={styles.quickActionText}>Nuevo Pago</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  errorSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  welcomeText: {
    fontSize: 14,
    color: '#6B7280',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  metricsContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  chartsContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  activitiesContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '500',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  activityAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  paymentsContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  paymentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  paymentContent: {
    flex: 1,
  },
  paymentDriver: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  paymentDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  paymentAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F59E0B',
  },
  quickActionsContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
});