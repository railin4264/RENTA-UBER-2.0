import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

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

interface DriverCardProps {
  driver: Driver;
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const DriverCard: React.FC<DriverCardProps> = ({ 
  driver, 
  onPress, 
  onEdit, 
  onDelete 
}) => {
  const getStatusColor = () => {
    switch (driver.status) {
      case 'Activo': return '#10b981';
      case 'Inactivo': return '#6b7280';
      case 'Suspendido': return '#f59e0b';
      case 'En Revisión': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getStatusBackground = () => {
    switch (driver.status) {
      case 'Activo': return '#d1fae5';
      case 'Inactivo': return '#f3f4f6';
      case 'Suspendido': return '#fef3c7';
      case 'En Revisión': return '#dbeafe';
      default: return '#f3f4f6';
    }
  };

  const isLicenseExpired = new Date(driver.licenseExpiry) < new Date();
  const isLicenseExpiringSoon = new Date(driver.licenseExpiry) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.photoContainer}>
          {driver.photo ? (
            <Image source={{ uri: driver.photo }} style={styles.photo} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Icon name="user" size={24} color="#9ca3af" />
            </View>
          )}
          
          <View style={[styles.statusBadge, { backgroundColor: getStatusBackground() }]}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {driver.status}
            </Text>
          </View>
        </View>
        
        <View style={styles.info}>
          <Text style={styles.name}>
            {driver.firstName} {driver.lastName}
          </Text>
          <Text style={styles.cedula}>Cédula: {driver.cedula}</Text>
          
          <View style={styles.contactInfo}>
            <View style={styles.contactItem}>
              <Icon name="phone" size={14} color="#6b7280" />
              <Text style={styles.contactText}>{driver.phone}</Text>
            </View>
            
            <View style={styles.contactItem}>
              <Icon name="mail" size={14} color="#6b7280" />
              <Text style={styles.contactText} numberOfLines={1}>
                {driver.email}
              </Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Icon name="calendar" size={16} color="#6b7280" />
            <Text style={styles.detailLabel}>Inicio:</Text>
            <Text style={styles.detailValue}>
              {new Date(driver.startDate).toLocaleDateString('es-ES')}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Icon name="dollar-sign" size={16} color="#6b7280" />
            <Text style={styles.detailLabel}>Salario:</Text>
            <Text style={styles.detailValue}>
              ${driver.salary.toLocaleString()}
            </Text>
          </View>
        </View>
        
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Icon name="percent" size={16} color="#6b7280" />
            <Text style={styles.detailLabel}>Comisión:</Text>
            <Text style={styles.detailValue}>{driver.commission}%</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Icon name="credit-card" size={16} color="#6b7280" />
            <Text style={styles.detailLabel}>Licencia:</Text>
            <Text style={[
              styles.detailValue,
              isLicenseExpired && styles.expiredText,
              isLicenseExpiringSoon && !isLicenseExpired && styles.expiringText
            ]}>
              {new Date(driver.licenseExpiry).toLocaleDateString('es-ES')}
            </Text>
          </View>
        </View>
        
        {(isLicenseExpired || isLicenseExpiringSoon) && (
          <View style={[
            styles.licenseWarning,
            { backgroundColor: isLicenseExpired ? '#fef2f2' : '#fef3c7' }
          ]}>
            <Icon 
              name={isLicenseExpired ? 'alert-triangle' : 'clock'} 
              size={16} 
              color={isLicenseExpired ? '#dc2626' : '#d97706'} 
            />
            <Text style={[
              styles.warningText,
              { color: isLicenseExpired ? '#dc2626' : '#d97706' }
            ]}>
              {isLicenseExpired 
                ? 'Licencia vencida' 
                : 'Licencia próxima a vencer'
              }
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
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  photoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
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
  cedula: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  contactInfo: {
    gap: 4,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contactText: {
    fontSize: 12,
    color: '#6b7280',
  },
  details: {
    gap: 12,
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
  licenseWarning: {
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
    marginTop: 16,
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

export default DriverCard;