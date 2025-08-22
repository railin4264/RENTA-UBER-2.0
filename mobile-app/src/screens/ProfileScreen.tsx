import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

interface UserStats {
  totalDrivers: number;
  totalVehicles: number;
  totalPayments: number;
  totalRevenue: number;
  activeContracts: number;
  pendingPayments: number;
}

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  status: string;
}

export default function ProfileScreen() {
  const [userStats, setUserStats] = useState<UserStats>({
    totalDrivers: 0,
    totalVehicles: 0,
    totalPayments: 0,
    totalRevenue: 0,
    activeContracts: 0,
    pendingPayments: 0,
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setIsLoading(true);
      
      // Simular carga de datos desde API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Datos de ejemplo
      setUserStats({
        totalDrivers: 24,
        totalVehicles: 18,
        totalPayments: 156,
        totalRevenue: 45600,
        activeContracts: 22,
        pendingPayments: 8,
      });

      setRecentActivities([
        {
          id: '1',
          type: 'Pago',
          description: 'Carlos Mendoza realizó pago de $150.00',
          timestamp: '2024-02-15 14:30',
          status: 'completed',
        },
        {
          id: '2',
          type: 'Contrato',
          description: 'Nuevo contrato firmado con Ana Rodríguez',
          timestamp: '2024-02-15 12:15',
          status: 'completed',
        },
        {
          id: '3',
          type: 'Mantenimiento',
          description: 'Vehículo ABC-123 enviado a mantenimiento',
          timestamp: '2024-02-15 10:45',
          status: 'pending',
        },
        {
          id: '4',
          type: 'Pago',
          description: 'Luis García pago vencido de $175.00',
          timestamp: '2024-02-15 09:20',
          status: 'overdue',
        },
        {
          id: '5',
          type: 'Conductor',
          description: 'Nuevo conductor registrado: Roberto Silva',
          timestamp: '2024-02-14 16:30',
          status: 'completed',
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los datos del perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadProfileData();
    setIsRefreshing(false);
  };

  const handleEditProfile = () => {
    Alert.alert('Editar Perfil', 'Funcionalidad de edición de perfil');
  };

  const handleViewStats = () => {
    Alert.alert('Ver Estadísticas', 'Funcionalidad de estadísticas detalladas');
  };

  const handleViewActivities = () => {
    Alert.alert('Ver Actividades', 'Funcionalidad de historial de actividades');
  };

  const handleContactSupport = () => {
    Alert.alert('Soporte', 'Funcionalidad de contacto con soporte');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'overdue':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return 'check-circle';
      case 'pending':
        return 'clock';
      case 'overdue':
        return 'alert-triangle';
      default:
        return 'circle';
    }
  };

  const getMonthlyRevenueData = () => {
    // Datos de ejemplo para los últimos 6 meses
    return [3200, 3800, 4200, 3900, 4500, 4560];
  };

  const getRevenueDistributionData = () => {
    return [
      {
        name: 'Rentas',
        population: userStats.totalRevenue * 0.7,
        color: '#3b82f6',
        legendFontColor: '#374151',
        legendFontSize: 12,
      },
      {
        name: 'Servicios',
        population: userStats.totalRevenue * 0.2,
        color: '#10b981',
        legendFontColor: '#374151',
        legendFontSize: 12,
      },
      {
        name: 'Otros',
        population: userStats.totalRevenue * 0.1,
        color: '#f59e0b',
        legendFontColor: '#374151',
        legendFontSize: 12,
      },
    ];
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Icon name="refresh-cw" size={48} color="#6b7280" style={styles.spinning} />
          <Text style={styles.loadingText}>Cargando perfil...</Text>
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
        {/* Header with Profile Picture */}
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' }}
              style={styles.profileImage}
              // defaultSource={require('../../assets/default-avatar.png')}
            />
            <TouchableOpacity style={styles.editImageButton}>
              <Icon name="camera" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>Carlos Mendoza</Text>
            <Text style={styles.userRole}>Administrador</Text>
            <Text style={styles.userCompany}>Renta Uber Inc.</Text>
          </View>
          
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={handleEditProfile}
          >
            <Icon name="edit-3" size={20} color="#3b82f6" />
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStatsContainer}>
          <View style={styles.quickStatCard}>
            <Icon name="users" size={24} color="#3b82f6" />
            <Text style={styles.quickStatNumber}>{userStats.totalDrivers}</Text>
            <Text style={styles.quickStatLabel}>Conductores</Text>
          </View>
          
          <View style={styles.quickStatCard}>
            <Icon name="truck" size={24} color="#10b981" />
            <Text style={styles.quickStatNumber}>{userStats.totalVehicles}</Text>
            <Text style={styles.quickStatLabel}>Vehículos</Text>
          </View>
          
          <View style={styles.quickStatCard}>
            <Icon name="dollar-sign" size={24} color="#f59e0b" />
            <Text style={styles.quickStatNumber}>${(userStats.totalRevenue / 1000).toFixed(1)}k</Text>
            <Text style={styles.quickStatLabel}>Ingresos</Text>
          </View>
          
          <View style={styles.quickStatCard}>
            <Icon name="file-text" size={24} color="#8b5cf6" />
            <Text style={styles.quickStatNumber}>{userStats.activeContracts}</Text>
            <Text style={styles.quickStatLabel}>Contratos</Text>
          </View>
        </View>

        {/* Revenue Chart */}
        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Ingresos Mensuales</Text>
            <TouchableOpacity onPress={handleViewStats}>
              <Text style={styles.viewAllText}>Ver Todo</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.chartCard}>
            <LineChart
              data={{
                labels: ['Sep', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb'],
                datasets: [{
                  data: getMonthlyRevenueData()
                }]
              }}
              width={screenWidth - 80}
              height={200}
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
        </View>

        {/* Revenue Distribution */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Distribución de Ingresos</Text>
          <View style={styles.chartCard}>
            <PieChart
              data={getRevenueDistributionData()}
              width={screenWidth - 80}
              height={180}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        </View>

        {/* Detailed Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsTitle}>Estadísticas Detalladas</Text>
            <TouchableOpacity onPress={handleViewStats}>
              <Text style={styles.viewAllText}>Ver Todo</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Icon name="credit-card" size={20} color="#3b82f6" />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>Total de Pagos</Text>
                <Text style={styles.statValue}>{userStats.totalPayments}</Text>
                <Text style={styles.statChange}>+12% este mes</Text>
              </View>
            </View>
            
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Icon name="clock" size={20} color="#f59e0b" />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>Pagos Pendientes</Text>
                <Text style={styles.statValue}>{userStats.pendingPayments}</Text>
                <Text style={styles.statChange}>-3% este mes</Text>
              </View>
            </View>
            
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Icon name="trending-up" size={20} color="#10b981" />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>Ingresos Totales</Text>
                <Text style={styles.statValue}>${userStats.totalRevenue.toLocaleString()}</Text>
                <Text style={styles.statChange}>+8% este mes</Text>
              </View>
            </View>
            
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Icon name="file-text" size={20} color="#8b5cf6" />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>Contratos Activos</Text>
                <Text style={styles.statValue}>{userStats.activeContracts}</Text>
                <Text style={styles.statChange}>+2 este mes</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Recent Activities */}
        <View style={styles.activitiesContainer}>
          <View style={styles.activitiesHeader}>
            <Text style={styles.activitiesTitle}>Actividades Recientes</Text>
            <TouchableOpacity onPress={handleViewActivities}>
              <Text style={styles.viewAllText}>Ver Todo</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.activitiesCard}>
            {recentActivities.map((activity) => (
              <View key={activity.id} style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Icon 
                    name={getStatusIcon(activity.status)} 
                    size={16} 
                    color={getStatusColor(activity.status)} 
                  />
                </View>
                
                <View style={styles.activityContent}>
                  <Text style={styles.activityType}>{activity.type}</Text>
                  <Text style={styles.activityDescription}>{activity.description}</Text>
                  <Text style={styles.activityTimestamp}>{activity.timestamp}</Text>
                </View>
                
                <View style={[
                  styles.activityStatus,
                  { backgroundColor: getStatusColor(activity.status) + '20' }
                ]}>
                  <Text style={[
                    styles.activityStatusText,
                    { color: getStatusColor(activity.status) }
                  ]}>
                    {activity.status === 'completed' ? 'Completado' : 
                     activity.status === 'pending' ? 'Pendiente' : 'Vencido'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.actionsTitle}>Acciones Rápidas</Text>
          
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionButton} onPress={handleContactSupport}>
              <View style={styles.actionIconContainer}>
                <Icon name="help-circle" size={24} color="#3b82f6" />
              </View>
              <Text style={styles.actionText}>Soporte</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={handleViewStats}>
              <View style={styles.actionIconContainer}>
                <Icon name="bar-chart-2" size={24} color="#10b981" />
              </View>
              <Text style={styles.actionText}>Reportes</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={handleEditProfile}>
              <View style={styles.actionIconContainer}>
                <Icon name="settings" size={24} color="#f59e0b" />
              </View>
              <Text style={styles.actionText}>Configuración</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={handleViewActivities}>
              <View style={styles.actionIconContainer}>
                <Icon name="activity" size={24} color="#8b5cf6" />
              </View>
              <Text style={styles.actionText}>Actividad</Text>
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
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3b82f6',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    color: '#3b82f6',
    marginBottom: 2,
  },
  userCompany: {
    fontSize: 14,
    color: '#6b7280',
  },
  editProfileButton: {
    padding: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
  },
  quickStatsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  quickStatCard: {
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
  quickStatNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  quickStatLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  chartContainer: {
    marginBottom: 24,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  viewAllText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
  chartCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  statsContainer: {
    marginBottom: 24,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  statsGrid: {
    paddingHorizontal: 20,
    gap: 12,
  },
  statItem: {
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
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statChange: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '500',
  },
  activitiesContainer: {
    marginBottom: 24,
  },
  activitiesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  activitiesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  activitiesCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
    marginRight: 12,
  },
  activityType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 4,
    lineHeight: 18,
  },
  activityTimestamp: {
    fontSize: 11,
    color: '#9ca3af',
  },
  activityStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activityStatusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  actionsContainer: {
    marginBottom: 24,
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  actionButton: {
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
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
});