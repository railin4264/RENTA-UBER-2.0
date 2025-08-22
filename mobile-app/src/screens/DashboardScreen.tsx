import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import MetricCard from '../components/MetricCard';

const { width } = Dimensions.get('window');

interface DashboardStats {
  totalDrivers: number;
  activeDrivers: number;
  totalVehicles: number;
  availableVehicles: number;
  monthlyIncome: number;
  pendingPayments: number;
  activeContracts: number;
  vehiclesInMaintenance: number;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  amount: number;
  date: string;
  status: string;
}

interface Payment {
  id: string;
  driverName: string;
  amount: number;
  dueDate: string;
  status: string;
}

export default function DashboardScreen() {
  const [stats, setStats] = useState<DashboardStats>({
    totalDrivers: 0,
    activeDrivers: 0,
    totalVehicles: 0,
    availableVehicles: 0,
    monthlyIncome: 0,
    pendingPayments: 0,
    activeContracts: 0,
    vehiclesInMaintenance: 0
  });
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [upcomingPayments, setUpcomingPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Simular carga de datos desde API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Datos de ejemplo
      setStats({
        totalDrivers: 12,
        activeDrivers: 8,
        totalVehicles: 15,
        availableVehicles: 6,
        monthlyIncome: 125000,
        pendingPayments: 32000,
        activeContracts: 8,
        vehiclesInMaintenance: 2
      });

      setRecentActivities([
        {
          id: '1',
          type: 'payment',
          description: 'Pago recibido de Juan Pérez',
          amount: 15000,
          date: new Date().toISOString(),
          status: 'completed'
        },
        {
          id: '2',
          type: 'expense',
          description: 'Mantenimiento vehículo ABC-123',
          amount: 25000,
          date: new Date(Date.now() - 86400000).toISOString(),
          status: 'pending'
        },
        {
          id: '3',
          type: 'contract',
          description: 'Nuevo contrato firmado',
          amount: 18000,
          date: new Date(Date.now() - 172800000).toISOString(),
          status: 'active'
        }
      ]);

      setUpcomingPayments([
        {
          id: '1',
          driverName: 'María González',
          amount: 18000,
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending'
        },
        {
          id: '2',
          driverName: 'Carlos Rodríguez',
          amount: 22000,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending'
        }
      ]);

      setLastUpdate(new Date());
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los datos del dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboardData();
    setIsRefreshing(false);
  };

  const handleMetricPress = (metricName: string) => {
    Alert.alert('Métrica', `Has tocado: ${metricName}`);
  };

  const handleActivityPress = (activity: Activity) => {
    Alert.alert('Actividad', activity.description);
  };

  const handlePaymentPress = (payment: Payment) => {
    Alert.alert('Pago', `${payment.driverName} - $${payment.amount.toLocaleString()}`);
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#3b82f6',
    },
  };

  const incomeData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        data: [98000, 105000, 125000, 118000, 132000, 125000],
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const driversData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        data: [8, 9, 10, 11, 12, 12],
      },
    ],
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Icon name="refresh-cw" size={48} color="#6b7280" style={styles.spinning} />
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
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Dashboard</Text>
            <Text style={styles.subtitle}>
              Resumen general del sistema
              {lastUpdate && (
                <Text style={styles.lastUpdate}>
                  {' • Última actualización: '}
                  {lastUpdate.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              )}
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefresh}
            disabled={isRefreshing}
          >
            <Icon 
              name="refresh-cw" 
              size={20} 
              color="#6b7280"
              style={isRefreshing ? styles.spinning : undefined}
            />
          </TouchableOpacity>
        </View>

        {/* Métricas principales */}
        <View style={styles.metricsGrid}>
          <MetricCard
            title="Conductores Activos"
            value={stats.activeDrivers}
            icon="users"
            trend="up"
            trendValue="+12%"
            status="success"
            onPress={() => handleMetricPress('Conductores Activos')}
          />
          
          <MetricCard
            title="Vehículos Disponibles"
            value={stats.availableVehicles}
            icon="truck"
            trend="down"
            trendValue="-5%"
            status="warning"
            onPress={() => handleMetricPress('Vehículos Disponibles')}
          />
          
          <MetricCard
            title="Ingresos Mensuales"
            value={`$${stats.monthlyIncome.toLocaleString()}`}
            icon="dollar-sign"
            trend="up"
            trendValue="+8%"
            status="success"
            onPress={() => handleMetricPress('Ingresos Mensuales')}
          />
          
          <MetricCard
            title="Contratos Activos"
            value={stats.activeContracts}
            icon="file-text"
            status="info"
            onPress={() => handleMetricPress('Contratos Activos')}
          />
        </View>

        {/* Métricas secundarias */}
        <View style={styles.secondaryMetrics}>
          <MetricCard
            title="Total Conductores"
            value={stats.totalDrivers}
            icon="users"
            status="info"
          />
          
          <MetricCard
            title="Vehículos en Mantenimiento"
            value={stats.vehiclesInMaintenance}
            icon="tool"
            status="warning"
          />
          
          <MetricCard
            title="Pagos Pendientes"
            value={`$${stats.pendingPayments.toLocaleString()}`}
            icon="alert-triangle"
            status="error"
          />
        </View>

        {/* Gráficos */}
        <View style={styles.chartsContainer}>
          <Text style={styles.sectionTitle}>Tendencias</Text>
          
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Ingresos Mensuales</Text>
            <LineChart
              data={incomeData}
              width={width - 48}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </View>
          
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Conductores Activos</Text>
            <BarChart
              data={driversData}
              width={width - 48}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
              showBarTops
              showValuesOnTopOfBars
            />
          </View>
        </View>

        {/* Actividades Recientes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Actividades Recientes</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.activitiesContainer}>
            {recentActivities.map((activity, index) => (
              <TouchableOpacity
                key={activity.id}
                style={styles.activityItem}
                onPress={() => handleActivityPress(activity)}
                activeOpacity={0.7}
              >
                <View style={styles.activityIcon}>
                  <Icon 
                    name={activity.type === 'payment' ? 'dollar-sign' : 'file-text'} 
                    size={20} 
                    color="#6b7280" 
                  />
                </View>
                
                <View style={styles.activityContent}>
                  <Text style={styles.activityDescription} numberOfLines={2}>
                    {activity.description}
                  </Text>
                  <Text style={styles.activityDate}>
                    {new Date(activity.date).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                </View>
                
                <View style={styles.activityRight}>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: activity.status === 'completed' ? '#dcfce7' : '#fef3c7' }
                  ]}>
                    <Text style={[
                      styles.statusText,
                      { color: activity.status === 'completed' ? '#166534' : '#92400e' }
                    ]}>
                      {activity.status === 'completed' ? 'Completado' : 'Pendiente'}
                    </Text>
                  </View>
                  
                  {activity.amount > 0 && (
                    <Text style={styles.activityAmount}>
                      ${activity.amount.toLocaleString()}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Pagos Próximos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pagos Próximos</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.paymentsContainer}>
            {upcomingPayments.map((payment) => (
              <TouchableOpacity
                key={payment.id}
                style={styles.paymentItem}
                onPress={() => handlePaymentPress(payment)}
                activeOpacity={0.7}
              >
                <View style={styles.paymentIcon}>
                  <Icon name="users" size={20} color="#6b7280" />
                </View>
                
                <View style={styles.paymentContent}>
                  <Text style={styles.paymentName}>{payment.driverName}</Text>
                  <Text style={styles.paymentDueDate}>
                    Vence: {new Date(payment.dueDate).toLocaleDateString('es-ES')}
                  </Text>
                </View>
                
                <View style={styles.paymentRight}>
                  <View style={styles.paymentStatusBadge}>
                    <Text style={styles.paymentStatusText}>Próximo a vencer</Text>
                  </View>
                  
                  <Text style={styles.paymentAmount}>
                    ${payment.amount.toLocaleString()}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Acciones Rápidas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickActionButton}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#dbeafe' }]}>
                <Icon name="users" size={24} color="#2563eb" />
              </View>
              <Text style={styles.quickActionText}>Nuevo Conductor</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#dcfce7' }]}>
                <Icon name="truck" size={24} color="#16a34a" />
              </View>
              <Text style={styles.quickActionText}>Nuevo Vehículo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#f3e8ff' }]}>
                <Icon name="file-text" size={24} color="#9333ea" />
              </View>
              <Text style={styles.quickActionText}>Nuevo Contrato</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#fef3c7' }]}>
                <Icon name="dollar-sign" size={24} color="#d97706" />
              </View>
              <Text style={styles.quickActionText}>Registrar Pago</Text>
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
  lastUpdate: {
    fontSize: 14,
    color: '#9ca3af',
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  secondaryMetrics: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 12,
    gap: 12,
  },
  chartsContainer: {
    padding: 20,
    paddingTop: 32,
  },
  section: {
    padding: 20,
    paddingTop: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  seeAllText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 16,
  },
  activitiesContainer: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
  activityContent: {
    flex: 1,
    justifyContent: 'center',
  },
  activityDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  activityRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  activityAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  paymentsContainer: {
    gap: 12,
  },
  paymentItem: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentContent: {
    flex: 1,
    justifyContent: 'center',
  },
  paymentName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  paymentDueDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  paymentRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  paymentStatusBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 4,
  },
  paymentStatusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#92400e',
    textTransform: 'uppercase',
  },
  paymentAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionButton: {
    width: (width - 52) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    textAlign: 'center',
  },
});