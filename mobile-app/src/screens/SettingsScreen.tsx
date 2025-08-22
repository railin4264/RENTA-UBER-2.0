import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
}

interface NotificationSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  paymentReminders: boolean;
  maintenanceAlerts: boolean;
  systemUpdates: boolean;
}

interface SystemSettings {
  darkMode: boolean;
  autoSave: boolean;
  dataSync: boolean;
  language: string;
  currency: string;
}

export default function SettingsScreen() {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Carlos Mendoza',
    email: 'carlos.mendoza@rentauber.com',
    phone: '+1 (555) 123-4567',
    company: 'Renta Uber Inc.',
    role: 'Administrador',
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    paymentReminders: true,
    maintenanceAlerts: true,
    systemUpdates: false,
  });

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    darkMode: false,
    autoSave: true,
    dataSync: true,
    language: 'Español',
    currency: 'USD',
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempProfile, setTempProfile] = useState<UserProfile>(userProfile);

  const handleNotificationToggle = (key: keyof NotificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSystemToggle = (key: keyof SystemSettings) => {
    setSystemSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleEditProfile = () => {
    setIsEditingProfile(true);
    setTempProfile(userProfile);
  };

  const handleSaveProfile = async () => {
    try {
      setUserProfile(tempProfile);
      setIsEditingProfile(false);
      
      // Guardar en AsyncStorage
      await AsyncStorage.setItem('userProfile', JSON.stringify(tempProfile));
      
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el perfil');
    }
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setTempProfile(userProfile);
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Cerrar Sesión', 
          style: 'destructive',
          onPress: () => {
            // Aquí iría la lógica de logout
            Alert.alert('Sesión Cerrada', 'Has cerrado sesión correctamente');
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Eliminar Cuenta',
      'Esta acción no se puede deshacer. ¿Estás seguro de que quieres eliminar tu cuenta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Cuenta Eliminada', 'Tu cuenta ha sido eliminada');
          }
        }
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert('Exportar Datos', 'Funcionalidad de exportación de datos');
  };

  const handleBackupData = () => {
    Alert.alert('Respaldo de Datos', 'Funcionalidad de respaldo de datos');
  };

  const handleChangePassword = () => {
    Alert.alert('Cambiar Contraseña', 'Funcionalidad de cambio de contraseña');
  };

  const handleTwoFactorAuth = () => {
    Alert.alert('Autenticación de Dos Factores', 'Funcionalidad de 2FA');
  };

  const handlePrivacyPolicy = () => {
    Alert.alert('Política de Privacidad', 'Funcionalidad de política de privacidad');
  };

  const handleTermsOfService = () => {
    Alert.alert('Términos de Servicio', 'Funcionalidad de términos de servicio');
  };

  const handleSupport = () => {
    Alert.alert('Soporte', 'Funcionalidad de soporte al cliente');
  };

  const handleAbout = () => {
    Alert.alert('Acerca de', 'Renta Uber v1.0.0\nDesarrollado por el equipo de desarrollo');
  };

  const renderProfileSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Icon name="user" size={20} color="#3b82f6" />
        <Text style={styles.sectionTitle}>Perfil de Usuario</Text>
        {!isEditingProfile && (
          <TouchableOpacity onPress={handleEditProfile} style={styles.editButton}>
            <Icon name="edit-3" size={16} color="#3b82f6" />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.profileCard}>
        {isEditingProfile ? (
          <View style={styles.editForm}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nombre</Text>
              <TextInput
                style={styles.textInput}
                value={tempProfile.name}
                onChangeText={(text) => setTempProfile(prev => ({ ...prev, name: text }))}
                placeholder="Nombre completo"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.textInput}
                value={tempProfile.email}
                onChangeText={(text) => setTempProfile(prev => ({ ...prev, email: text }))}
                placeholder="Email"
                keyboardType="email-address"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Teléfono</Text>
              <TextInput
                style={styles.textInput}
                value={tempProfile.phone}
                onChangeText={(text) => setTempProfile(prev => ({ ...prev, phone: text }))}
                placeholder="Teléfono"
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Empresa</Text>
              <TextInput
                style={styles.textInput}
                value={tempProfile.company}
                onChangeText={(text) => setTempProfile(prev => ({ ...prev, company: text }))}
                placeholder="Empresa"
              />
            </View>
            
            <View style={styles.editActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={handleCancelEdit}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, styles.saveButton]}
                onPress={handleSaveProfile}
              >
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.profileInfo}>
            <View style={styles.profileRow}>
              <Icon name="user" size={16} color="#6b7280" />
              <Text style={styles.profileLabel}>Nombre:</Text>
              <Text style={styles.profileValue}>{userProfile.name}</Text>
            </View>
            
            <View style={styles.profileRow}>
              <Icon name="mail" size={16} color="#6b7280" />
              <Text style={styles.profileLabel}>Email:</Text>
              <Text style={styles.profileValue}>{userProfile.email}</Text>
            </View>
            
            <View style={styles.profileRow}>
              <Icon name="phone" size={16} color="#6b7280" />
              <Text style={styles.profileLabel}>Teléfono:</Text>
              <Text style={styles.profileValue}>{userProfile.phone}</Text>
            </View>
            
            <View style={styles.profileRow}>
              <Icon name="briefcase" size={16} color="#6b7280" />
              <Text style={styles.profileLabel}>Empresa:</Text>
              <Text style={styles.profileValue}>{userProfile.company}</Text>
            </View>
            
            <View style={styles.profileRow}>
              <Icon name="shield" size={16} color="#6b7280" />
              <Text style={styles.profileLabel}>Rol:</Text>
              <Text style={styles.profileValue}>{userProfile.role}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );

  const renderNotificationSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Icon name="bell" size={20} color="#3b82f6" />
        <Text style={styles.sectionTitle}>Notificaciones</Text>
      </View>
      
      <View style={styles.settingsCard}>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Notificaciones Push</Text>
            <Text style={styles.settingDescription}>Recibir notificaciones en el dispositivo</Text>
          </View>
          <Switch
            value={notificationSettings.pushNotifications}
            onValueChange={() => handleNotificationToggle('pushNotifications')}
            trackColor={{ false: '#e5e7eb', true: '#93c5fd' }}
            thumbColor={notificationSettings.pushNotifications ? '#3b82f6' : '#f3f4f6'}
          />
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Notificaciones por Email</Text>
            <Text style={styles.settingDescription}>Recibir notificaciones por correo electrónico</Text>
          </View>
          <Switch
            value={notificationSettings.emailNotifications}
            onValueChange={() => handleNotificationToggle('emailNotifications')}
            trackColor={{ false: '#e5e7eb', true: '#93c5fd' }}
            thumbColor={notificationSettings.emailNotifications ? '#3b82f6' : '#f3f4f6'}
          />
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Notificaciones SMS</Text>
            <Text style={styles.settingDescription}>Recibir notificaciones por mensaje de texto</Text>
          </View>
          <Switch
            value={notificationSettings.smsNotifications}
            onValueChange={() => handleNotificationToggle('smsNotifications')}
            trackColor={{ false: '#e5e7eb', true: '#93c5fd' }}
            thumbColor={notificationSettings.smsNotifications ? '#3b82f6' : '#f3f4f6'}
          />
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Recordatorios de Pago</Text>
            <Text style={styles.settingDescription}>Alertas sobre pagos pendientes y vencidos</Text>
          </View>
          <Switch
            value={notificationSettings.paymentReminders}
            onValueChange={() => handleNotificationToggle('paymentReminders')}
            trackColor={{ false: '#e5e7eb', true: '#93c5fd' }}
            thumbColor={notificationSettings.paymentReminders ? '#3b82f6' : '#f3f4f6'}
          />
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Alertas de Mantenimiento</Text>
            <Text style={styles.settingDescription}>Notificaciones sobre mantenimiento de vehículos</Text>
          </View>
          <Switch
            value={notificationSettings.maintenanceAlerts}
            onValueChange={() => handleNotificationToggle('maintenanceAlerts')}
            trackColor={{ false: '#e5e7eb', true: '#93c5fd' }}
            thumbColor={notificationSettings.maintenanceAlerts ? '#3b82f6' : '#f3f4f6'}
          />
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Actualizaciones del Sistema</Text>
            <Text style={styles.settingDescription}>Información sobre nuevas características y mejoras</Text>
          </View>
          <Switch
            value={notificationSettings.systemUpdates}
            onValueChange={() => handleNotificationToggle('systemUpdates')}
            trackColor={{ false: '#e5e7eb', true: '#93c5fd' }}
            thumbColor={notificationSettings.systemUpdates ? '#3b82f6' : '#f3f4f6'}
          />
        </View>
      </View>
    </View>
  );

  const renderSystemSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Icon name="settings" size={20} color="#3b82f6" />
        <Text style={styles.sectionTitle}>Sistema</Text>
      </View>
      
      <View style={styles.settingsCard}>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Modo Oscuro</Text>
            <Text style={styles.settingDescription}>Cambiar entre tema claro y oscuro</Text>
          </View>
          <Switch
            value={systemSettings.darkMode}
            onValueChange={() => handleSystemToggle('darkMode')}
            trackColor={{ false: '#e5e7eb', true: '#93c5fd' }}
            thumbColor={systemSettings.darkMode ? '#3b82f6' : '#f3f4f6'}
          />
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Guardado Automático</Text>
            <Text style={styles.settingDescription}>Guardar cambios automáticamente</Text>
          </View>
          <Switch
            value={systemSettings.autoSave}
            onValueChange={() => handleSystemToggle('autoSave')}
            trackColor={{ false: '#e5e7eb', true: '#93c5fd' }}
            thumbColor={systemSettings.autoSave ? '#3b82f6' : '#f3f4f6'}
          />
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Sincronización de Datos</Text>
            <Text style={styles.settingDescription}>Sincronizar datos en la nube</Text>
          </View>
          <Switch
            value={systemSettings.dataSync}
            onValueChange={() => handleSystemToggle('dataSync')}
            trackColor={{ false: '#e5e7eb', true: '#93c5fd' }}
            thumbColor={systemSettings.dataSync ? '#3b82f6' : '#f3f4f6'}
          />
        </View>
      </View>
    </View>
  );

  const renderSecuritySection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Icon name="lock" size={20} color="#3b82f6" />
        <Text style={styles.sectionTitle}>Seguridad</Text>
      </View>
      
      <View style={styles.settingsCard}>
        <TouchableOpacity style={styles.settingRow} onPress={handleChangePassword}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Cambiar Contraseña</Text>
            <Text style={styles.settingDescription}>Actualizar tu contraseña de acceso</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#9ca3af" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingRow} onPress={handleTwoFactorAuth}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Autenticación de Dos Factores</Text>
            <Text style={styles.settingDescription}>Configurar 2FA para mayor seguridad</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#9ca3af" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDataSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Icon name="database" size={20} color="#3b82f6" />
        <Text style={styles.sectionTitle}>Datos</Text>
      </View>
      
      <View style={styles.settingsCard}>
        <TouchableOpacity style={styles.settingRow} onPress={handleExportData}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Exportar Datos</Text>
            <Text style={styles.settingDescription}>Descargar todos tus datos en formato CSV</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#9ca3af" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingRow} onPress={handleBackupData}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Respaldo de Datos</Text>
            <Text style={styles.settingDescription}>Crear una copia de seguridad de tus datos</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#9ca3af" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSupportSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Icon name="help-circle" size={20} color="#3b82f6" />
        <Text style={styles.sectionTitle}>Soporte y Ayuda</Text>
      </View>
      
      <View style={styles.settingsCard}>
        <TouchableOpacity style={styles.settingRow} onPress={handleSupport}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Soporte al Cliente</Text>
            <Text style={styles.settingDescription}>Contactar con nuestro equipo de soporte</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#9ca3af" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingRow} onPress={handlePrivacyPolicy}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Política de Privacidad</Text>
            <Text style={styles.settingDescription}>Leer nuestra política de privacidad</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#9ca3af" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingRow} onPress={handleTermsOfService}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Términos de Servicio</Text>
            <Text style={styles.settingDescription}>Leer nuestros términos de servicio</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#9ca3af" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingRow} onPress={handleAbout}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Acerca de</Text>
            <Text style={styles.settingDescription}>Información sobre la aplicación</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#9ca3af" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAccountSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Icon name="user-x" size={20} color="#ef4444" />
        <Text style={styles.sectionTitle}>Cuenta</Text>
      </View>
      
      <View style={styles.settingsCard}>
        <TouchableOpacity style={styles.settingRow} onPress={handleLogout}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, styles.logoutText]}>Cerrar Sesión</Text>
            <Text style={styles.settingDescription}>Salir de tu cuenta actual</Text>
          </View>
          <Icon name="log-out" size={20} color="#ef4444" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingRow} onPress={handleDeleteAccount}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, styles.deleteText]}>Eliminar Cuenta</Text>
            <Text style={styles.settingDescription}>Eliminar permanentemente tu cuenta</Text>
          </View>
          <Icon name="trash-2" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Configuración</Text>
          <Text style={styles.subtitle}>Personaliza tu experiencia</Text>
        </View>

        {/* Profile Section */}
        {renderProfileSection()}

        {/* Notification Section */}
        {renderNotificationSection()}

        {/* System Section */}
        {renderSystemSection()}

        {/* Security Section */}
        {renderSecuritySection()}

        {/* Data Section */}
        {renderDataSection()}

        {/* Support Section */}
        {renderSupportSection()}

        {/* Account Section */}
        {renderAccountSection()}

        {/* Version Info */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Renta Uber v1.0.0</Text>
          <Text style={styles.copyrightText}>© 2024 Renta Uber Inc. Todos los derechos reservados.</Text>
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
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 12,
  },
  editButton: {
    marginLeft: 'auto',
    padding: 8,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  profileInfo: {
    gap: 12,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    minWidth: 80,
  },
  profileValue: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  editForm: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#ffffff',
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
  },
  saveButton: {
    backgroundColor: '#3b82f6',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  settingsCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  logoutText: {
    color: '#ef4444',
  },
  deleteText: {
    color: '#ef4444',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  versionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 8,
  },
  copyrightText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 16,
  },
});