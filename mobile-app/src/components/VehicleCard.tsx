import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

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

interface VehicleCardProps {
  vehicle: Vehicle;
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ 
  vehicle, 
  onPress, 
  onEdit, 
  onDelete 
}) => {
  const getStatusColor = () => {
    switch (vehicle.status) {
      case 'Disponible': return '#10b981';
      case 'En Uso': return '#3b82f6';
      case 'En Mantenimiento': return '#f59e0b';
      case 'Fuera de Servicio': return '#ef4444';
      case 'Reservado': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getStatusBackground = () => {
    switch (vehicle.status) {
      case 'Disponible': return '#d1fae5';
      case 'En Uso': return '#dbeafe';
      case 'En Mantenimiento': return '#fef3c7';
      case 'Fuera de Servicio': return '#fef2f2';
      case 'Reservado': return '#f3e8ff';
      default: return '#f3f4f6';
    }
  };

  const isInsuranceExpired = new Date(vehicle.insuranceExpiry) < new Date();
  const isInsuranceExpiringSoon = new Date(vehicle.insuranceExpiry) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  
  const isRegistrationExpired = new Date(vehicle.registrationExpiry) < new Date();
  const isRegistrationExpiringSoon = new Date(vehicle.registrationExpiry) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  
  const isMaintenanceDue = new Date(vehicle.nextMaintenance) <= new Date();
  const isMaintenanceDueSoon = new Date(vehicle.nextMaintenance) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.photoContainer}>
          {vehicle.photo ? (
            <Image source={{ uri: vehicle.photo }} style={styles.photo} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Icon name="truck" size={24} color="#9ca3af" />
            </View>
          )}
          
          <View style={[styles.statusBadge, { backgroundColor: getStatusBackground() }]}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {vehicle.status}
            </Text>
          </View>
        </View>
        
        <View style={styles.info}>
          <Text style={styles.name}>
            {vehicle.brand} {vehicle.model}
          </Text>
          <Text style={styles.plate}>{vehicle.plate}</Text>
          <Text style={styles.year}>{vehicle.year} • {vehicle.color}</Text>
          
          <View style={styles.specs}>
            <View style={styles.specItem}>
              <Icon name="zap" size={14} color="#6b7280" />
              <Text style={styles.specText}>{vehicle.fuelType}</Text>
            </View>
            
            <View style={styles.specItem}>
              <Icon name="settings" size={14} color="#6b7280" />
              <Text style={styles.specText}>{vehicle.transmission}</Text>
            </View>
            
            <View style={styles.specItem}>
              <Icon name="activity" size={14} color="#6b7280" />
              <Text style={styles.specText}>{vehicle.mileage.toLocaleString()} km</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Icon name="calendar" size={16} color="#6b7280" />
            <Text style={styles.detailLabel}>Compra:</Text>
            <Text style={styles.detailValue}>
              {new Date(vehicle.purchaseDate).toLocaleDateString('es-ES')}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Icon name="dollar-sign" size={16} color="#6b7280" />
            <Text style={styles.detailLabel}>Valor:</Text>
            <Text style={styles.detailValue}>
              ${vehicle.currentValue.toLocaleString()}
            </Text>
          </View>
        </View>
        
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Icon name="wrench" size={16} color="#6b7280" />
            <Text style={styles.detailLabel}>Último Mant.:Text>
            <Text style={styles.detailValue}>
              {new Date(vehicle.lastMaintenance).toLocaleDateString('es-ES')}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Icon name="clock" size={16} color="#6b7280" />
            <Text style={styles.detailLabel}>Próximo Mant.:Text>
            <Text style={[
              styles.detailValue,
              isMaintenanceDue && styles.expiredText,
              isMaintenanceDueSoon && !isMaintenanceDue && styles.expiringText
            ]}>
              {new Date(vehicle.nextMaintenance).toLocaleDateString('es-ES')}
            </Text>
          </View>
        </View>
      </View>
      
      {/* Warnings Section */}
      <View style={styles.warnings}>
        {(isInsuranceExpired || isInsuranceExpiringSoon) && (
          <View style={[
            styles.warning,
            { backgroundColor: isInsuranceExpired ? '#fef2f2' : '#fef3c7' }
          ]}>
            <Icon 
              name={isInsuranceExpired ? 'alert-triangle' : 'clock'} 
              size={16} 
              color={isInsuranceExpired ? '#dc2626' : '#d97706'} 
            />
            <Text style={[
              styles.warningText,
              { color: isInsuranceExpired ? '#dc2626' : '#d97706' }
            ]}>
              Seguro {isInsuranceExpired ? 'vencido' : 'próximo a vencer'}
            </Text>
          </View>
        )}
        
        {(isRegistrationExpired || isRegistrationExpiringSoon) && (
          <View style={[
            styles.warning,
            { backgroundColor: isRegistrationExpired ? '#fef2f2' : '#fef3c7' }
          ]}>
            <Icon 
              name={isRegistrationExpired ? 'alert-triangle' : 'clock'} 
              size={16} 
              color={isRegistrationExpired ? '#dc2626' : '#d97706'} 
            />
            <Text style={[
              styles.warningText,
              { color: isRegistrationExpired ? '#dc2626' : '#d97706' }
            ]}>
              Registro {isRegistrationExpired ? 'vencido' : 'próximo a vencer'}
            </Text>
          </View>
        )}
        
        {(isMaintenanceDue || isMaintenanceDueSoon) && (
          <View style={[
            styles.warning,
            { backgroundColor: isMaintenanceDue ? '#fef2f2' : '#fef3c7' }
          ]}>
            <Icon 
              name={isMaintenanceDue ? 'alert-triangle' : 'clock'} 
              size={16} 
              color={isMaintenanceDue ? '#dc2626' : '#d97706'} 
            />
            <Text style={[
              styles.warningText,
              { color: isMaintenanceDue ? '#dc2626' : '#d97706' }
            ]}>
              Mantenimiento {isMaintenanceDue ? 'requerido' : 'próximo'}
            </Text>
          </View>
        )}
      </View>
      
      {(onEdit || onDelete) && (
        <View style={styles.actions}>
          {onEdit && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.editButton]} 
              onPress={onEdit}
            >
              <Icon name="edit" size={16} color="#3b82f6" />
              <Text style={styles.actionText}>Editar</Text>
            </TouchableOpacity>
          )}
          
          {onDelete && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.deleteButton]} 
              onPress={onDelete}
            >
              <Icon name="trash-2" size={16} color="#ef4444" />
              <Text style={styles.actionText}>Eliminar</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  photoContainer: {
    position: 'relative',
    marginRight: 16,
  },
  photo: {
    width: 80,
    height: 60,
    borderRadius: 12,
  },
  photoPlaceholder: {
    width: 80,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  plate: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3b82f6',
    marginBottom: 4,
    letterSpacing: 1,
  },
  year: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  specs: {
    flexDirection: 'row',
    gap: 16,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  specText: {
    fontSize: 12,
    color: '#6b7280',
  },
  details: {
    gap: 12,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '600',
  },
  expiredText: {
    color: '#dc2626',
  },
  expiringText: {
    color: '#d97706',
  },
  warnings: {
    gap: 8,
    marginBottom: 16,
  },
  warning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  warningText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  editButton: {
    backgroundColor: '#eff6ff',
    borderColor: '#dbeafe',
  },
  deleteButton: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default VehicleCard;