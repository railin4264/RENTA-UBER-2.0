import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '../contexts/AuthContext';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [email, setEmail] = useState('admin@renta-uber.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, isOnline } = useAuth();

  // Verificar si ya está autenticado
  useEffect(() => {
    // Si ya está autenticado, redirigir
    // Esto se maneja en el AuthContext
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (!isOnline) {
      Alert.alert(
        'Sin Conexión', 
        'No hay conexión a internet. Verifica tu conexión e intenta nuevamente.'
      );
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await login(email.trim(), password);
      
      if (result.success) {
        onLoginSuccess();
      } else {
        Alert.alert('Error de Inicio de Sesión', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error inesperado. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Recuperar Contraseña',
      'Contacta al administrador del sistema para recuperar tu contraseña.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Icon name="car" size={60} color="#3B82F6" />
            <Text style={styles.title}>Renta Uber</Text>
            <Text style={styles.subtitle}>Sistema de Gestión de Flotas</Text>
          </View>

          {/* Status de conexión */}
          <View style={styles.connectionStatus}>
            <Icon 
              name={isOnline ? "wifi" : "wifi-off"} 
              size={16} 
              color={isOnline ? "#10B981" : "#EF4444"} 
            />
            <Text style={[styles.connectionText, { color: isOnline ? "#10B981" : "#EF4444" }]}>
              {isOnline ? 'Conectado' : 'Sin conexión'}
            </Text>
          </View>

          {/* Formulario */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Icon name="mail" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="lock" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoComplete="password"
                editable={!isLoading}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                <Icon 
                  name={showPassword ? "eye-off" : "eye"} 
                  size={20} 
                  color="#6B7280" 
                />
              </TouchableOpacity>
            </View>

            {/* Botón de inicio de sesión */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                (!isOnline || isLoading) && styles.loginButtonDisabled
              ]}
              onPress={handleLogin}
              disabled={!isOnline || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
              )}
            </TouchableOpacity>

            {/* Enlaces adicionales */}
            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={handleForgotPassword}
              disabled={isLoading}
            >
              <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            {/* Información de credenciales de prueba */}
            <View style={styles.testCredentials}>
              <Text style={styles.testCredentialsTitle}>Credenciales de Prueba:</Text>
              <Text style={styles.testCredentialsText}>Email: admin@renta-uber.com</Text>
              <Text style={styles.testCredentialsText}>Contraseña: admin123</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    alignSelf: 'center',
  },
  connectionText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  form: {
    flex: 1,
    justifyContent: 'center',
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    top: 18,
    zIndex: 1,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 48,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1F2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  passwordToggle: {
    position: 'absolute',
    right: 16,
    top: 18,
    padding: 4,
  },
  loginButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPassword: {
    alignItems: 'center',
    marginBottom: 32,
  },
  forgotPasswordText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '500',
  },
  testCredentials: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  testCredentialsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  testCredentialsText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 2,
  },
});