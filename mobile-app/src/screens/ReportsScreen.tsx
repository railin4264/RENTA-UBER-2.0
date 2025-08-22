import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

interface ReportData {
  id: string;
  title: string;
  description: string;
  type: string;
  lastGenerated: string;
  status: string;
  icon: string;
  color: string;
}

export default function ReportsScreen() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('month');

  const screenWidth = Dimensions.get('window').width;

  const reports: ReportData[] = [
    {
      id: '1',
      title: 'Reporte Financiero',
      description: 'Ingresos, gastos y rentabilidad del negocio',
      type: 'financial',
      lastGenerated: '2024-02-15',
      status: 'Disponible',
      icon: 'dollar-sign',
      color: '#10b981',
    },
    {
      id: '2',
      title: 'Reporte de Conductores',
      description: 'Estado y rendimiento de conductores',
      type: 'drivers',
      lastGenerated: '2024-02-14',
      status: 'Disponible',
      icon: 'users',
      color: '#3b82f6',
    },
    {
      id: '3',
      title: 'Reporte de Vehículos',
      description: 'Estado y mantenimiento de la flota',
      type: 'vehicles',
      lastGenerated: '2024-02-13',
      status: 'Disponible',
      icon: 'truck',
      color: '#f59e0b',
    },
    {
      id: '4',
      title: 'Reporte de Pagos',
      description: 'Estado de pagos y cobranzas',
      type: 'payments',
      lastGenerated: '2024-02-12',
      status: 'Disponible',
      icon: 'credit-card',
      color: '#8b5cf6',
    },
    {
      id: '5',
      title: 'Reporte de Contratos',
      description: 'Estado y vencimientos de contratos',
      type: 'contracts',
      lastGenerated: '2024-02-11',
      status: 'Disponible',
      icon: 'file-text',
      color: '#ef4444',
    },
    {
      id: '6',
      title: 'Reporte de Gastos',
      description: 'Análisis de gastos operativos',
      type: 'expenses',
      lastGenerated: '2024-02-10',
      status: 'Disponible',
      icon: 'trending-down',
      color: '#06b6d4',
    },
  ];

  const handleGenerateReport = (report: ReportData) => {
    Alert.alert(
      'Generar Reporte',
      `¿Generar reporte de ${report.title}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Generar', 
          onPress: () => {
            setSelectedReport(report.id);
            setTimeout(() => {
              Alert.alert('Éxito', 'Reporte generado correctamente');
              setSelectedReport(null);
            }, 2000);
          }
        }
      ]
    );
  };

  const handleExportReport = (report: ReportData) => {
    Alert.alert(
      'Exportar Reporte',
      `¿Exportar reporte de ${report.title}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Exportar', 
          onPress: () => {
            Alert.alert('Éxito', 'Reporte exportado correctamente');
          }
        }
      ]
    );
  };

  const handleScheduleReport = (report: ReportData) => {
    Alert.alert(
      'Programar Reporte',
      `¿Programar generación automática del reporte de ${report.title}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Programar', 
          onPress: () => {
            Alert.alert('Éxito', 'Reporte programado correctamente');
          }
        }
      ]
    );
  };

  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
  };

  const getFinancialData = () => {
    return [3200, 3800, 4200, 3900, 4500, 4560];
  };

  const getDriversData = () => {
    return [18, 20, 22, 21, 24, 24];
  };

  const getVehiclesData = () => {
    return [15, 16, 17, 16, 18, 18];
  };

  const getPaymentsData = () => {
    return [120, 135, 142, 138, 156, 156];
  };

  const getRevenueDistribution = () => {
    return [
      {
        name: 'Rentas',
        population: 45600 * 0.7,
        color: '#3b82f6',
        legendFontColor: '#374151',
        legendFontSize: 12,
      },
      {
        name: 'Servicios',
        population: 45600 * 0.2,
        color: '#10b981',
        legendFontColor: '#374151',
        legendFontSize: 12,
      },
      {
        name: 'Otros',
        population: 45600 * 0.1,
        color: '#f59e0b',
        legendFontColor: '#374151',
        legendFontSize: 12,
      },
    ];
  };

  const renderReportCard = (report: ReportData) => (
    <View key={report.id} style={styles.reportCard}>
      <View style={styles.reportHeader}>
        <View style={styles.reportIconContainer}>
          <Icon name={report.icon as any} size={24} color={report.color} />
        </View>
        
        <View style={styles.reportInfo}>
          <Text style={styles.reportTitle}>{report.title}</Text>
          <Text style={styles.reportDescription}>{report.description}</Text>
          <Text style={styles.reportLastGenerated}>
            Último: {report.lastGenerated}
          </Text>
        </View>
        
        <View style={styles.reportStatus}>
          <View style={[styles.statusBadge, { backgroundColor: report.color + '20' }]}>
            <Text style={[styles.statusText, { color: report.color }]}>
              {report.status}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.reportActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.generateButton]}
          onPress={() => handleGenerateReport(report)}
          disabled={selectedReport === report.id}
        >
          {selectedReport === report.id ? (
            <Icon name="refresh-cw" size={16} color="#ffffff" style={styles.spinning} />
          ) : (
            <Icon name="play" size={16} color="#ffffff" />
          )}
          <Text style={styles.generateButtonText}>
            {selectedReport === report.id ? 'Generando...' : 'Generar'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.exportButton]}
          onPress={() => handleExportReport(report)}
        >
          <Icon name="download" size={16} color="#3b82f6" />
          <Text style={styles.exportButtonText}>Exportar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.scheduleButton]}
          onPress={() => handleScheduleReport(report)}
        >
          <Icon name="clock" size={16} color="#f59e0b" />
          <Text style={styles.scheduleButtonText}>Programar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFinancialCharts = () => (
    <View style={styles.chartsContainer}>
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Ingresos Mensuales</Text>
        <LineChart
          data={{
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            datasets: [{
              data: getFinancialData()
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
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#10b981'
            }
          }}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Distribución de Ingresos</Text>
        <PieChart
          data={getRevenueDistribution()}
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
  );

  const renderOperationalCharts = () => (
    <View style={styles.chartsContainer}>
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Crecimiento de Conductores</Text>
        <LineChart
          data={{
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            datasets: [{
              data: getDriversData()
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
        <Text style={styles.chartTitle}>Estado de Vehículos</Text>
        <BarChart
          data={{
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            datasets: [{
              data: getVehiclesData()
            }]
          }}
          width={screenWidth - 80}
          height={180}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(245, 158, 11, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
            style: {
              borderRadius: 16
            }
          }}
          style={styles.chart}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Reportes</Text>
          <Text style={styles.subtitle}>Análisis y estadísticas del negocio</Text>
        </View>

        {/* Date Range Selector */}
        <View style={styles.dateRangeContainer}>
          <Text style={styles.dateRangeTitle}>Período de Análisis:</Text>
          <View style={styles.dateRangeButtons}>
            <TouchableOpacity
              style={[
                styles.dateRangeButton,
                dateRange === 'week' && styles.dateRangeButtonActive
              ]}
              onPress={() => handleDateRangeChange('week')}
            >
              <Text style={[
                styles.dateRangeButtonText,
                dateRange === 'week' && styles.dateRangeButtonTextActive
              ]}>
                Semana
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.dateRangeButton,
                dateRange === 'month' && styles.dateRangeButtonActive
              ]}
              onPress={() => handleDateRangeChange('month')}
            >
              <Text style={[
                styles.dateRangeButtonText,
                dateRange === 'month' && styles.dateRangeButtonTextActive
              ]}>
                Mes
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.dateRangeButton,
                dateRange === 'quarter' && styles.dateRangeButtonActive
              ]}
              onPress={() => handleDateRangeChange('quarter')}
            >
              <Text style={[
                styles.dateRangeButtonText,
                dateRange === 'quarter' && styles.dateRangeButtonTextActive
              ]}>
                Trimestre
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.dateRangeButton,
                dateRange === 'year' && styles.dateRangeButtonActive
              ]}
              onPress={() => handleDateRangeChange('year')}
            >
              <Text style={[
                styles.dateRangeButtonText,
                dateRange === 'year' && styles.dateRangeButtonTextActive
              ]}>
                Año
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStatsContainer}>
          <View style={styles.quickStatCard}>
            <Icon name="trending-up" size={24} color="#10b981" />
            <Text style={styles.quickStatNumber}>$45.6k</Text>
            <Text style={styles.quickStatLabel}>Ingresos</Text>
          </View>
          
          <View style={styles.quickStatCard}>
            <Icon name="users" size={24} color="#3b82f6" />
            <Text style={styles.quickStatNumber}>24</Text>
            <Text style={styles.quickStatLabel}>Conductores</Text>
          </View>
          
          <View style={styles.quickStatCard}>
            <Icon name="truck" size={24} color="#f59e0b" />
            <Text style={styles.quickStatNumber}>18</Text>
            <Text style={styles.quickStatLabel}>Vehículos</Text>
          </View>
          
          <View style={styles.quickStatCard}>
            <Icon name="check-circle" size={24} color="#8b5cf6" />
            <Text style={styles.quickStatNumber}>156</Text>
            <Text style={styles.quickStatLabel}>Pagos</Text>
          </View>
        </View>

        {/* Financial Charts */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Análisis Financiero</Text>
          {renderFinancialCharts()}
        </View>

        {/* Operational Charts */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Análisis Operacional</Text>
          {renderOperationalCharts()}
        </View>

        {/* Reports List */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Reportes Disponibles</Text>
          <View style={styles.reportsContainer}>
            {reports.map(renderReportCard)}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.quickActionsTitle}>Acciones Rápidas</Text>
          
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickActionButton}>
              <View style={styles.quickActionIcon}>
                <Icon name="download" size={24} color="#3b82f6" />
              </View>
              <Text style={styles.quickActionText}>Exportar Todos</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton}>
              <View style={styles.quickActionIcon}>
                <Icon name="clock" size={24} color="#f59e0b" />
              </View>
              <Text style={styles.quickActionText}>Programar Todos</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton}>
              <View style={styles.quickActionIcon}>
                <Icon name="share-2" size={24} color="#10b981" />
              </View>
              <Text style={styles.quickActionText}>Compartir</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton}>
              <View style={styles.quickActionIcon}>
                <Icon name="settings" size={24} color="#8b5cf6" />
              </View>
              <Text style={styles.quickActionText}>Configurar</Text>
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
  header: {
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
  dateRangeContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  dateRangeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  dateRangeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  dateRangeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  dateRangeButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  dateRangeButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  dateRangeButtonTextActive: {
    color: '#ffffff',
  },
  quickStatsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
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
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  chartsContainer: {
    paddingHorizontal: 20,
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
  reportsContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  reportCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  reportIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  reportInfo: {
    flex: 1,
    marginRight: 16,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  reportDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  reportLastGenerated: {
    fontSize: 12,
    color: '#9ca3af',
  },
  reportStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  reportActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  generateButton: {
    backgroundColor: '#10b981',
    flex: 1,
  },
  exportButton: {
    backgroundColor: '#dbeafe',
  },
  scheduleButton: {
    backgroundColor: '#fef3c7',
  },
  generateButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
  },
  exportButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#3b82f6',
  },
  scheduleButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#f59e0b',
  },
  spinning: {
    transform: [{ rotate: '360deg' }],
  },
  quickActionsContainer: {
    marginBottom: 24,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  quickActionButton: {
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
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
});