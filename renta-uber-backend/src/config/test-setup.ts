import dotenv from 'dotenv';
import { cleanTestDatabase, createTestData, closeTestConnection } from './test';

// Cargar variables de entorno de test
dotenv.config({ path: '.env.test' });

// Configurar variables de entorno por defecto para tests
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://username:password@localhost:5432/renta_uber_test';

// Configuración global para tests
beforeAll(async () => {
  console.log('🚀 Configurando entorno de tests...');
  
  try {
    // Limpiar base de datos antes de todos los tests
    await cleanTestDatabase();
    
    // Crear datos de prueba
    await createTestData();
    
    console.log('✅ Entorno de tests configurado correctamente');
  } catch (error) {
    console.error('❌ Error configurando entorno de tests:', error);
    throw error;
  }
});

// Limpiar después de cada test
afterEach(async () => {
  // Aquí podrías limpiar datos específicos si es necesario
});

// Limpiar después de todos los tests
afterAll(async () => {
  console.log('🧹 Limpiando entorno de tests...');
  
  try {
    await cleanTestDatabase();
    await closeTestConnection();
    console.log('✅ Entorno de tests limpiado correctamente');
  } catch (error) {
    console.error('❌ Error limpiando entorno de tests:', error);
  }
});

// Configurar timeouts más largos para tests de base de datos
jest.setTimeout(30000);

// Mock de console.log para tests más limpios
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  // Silenciar logs en tests por defecto
  if (process.env.NODE_ENV === 'test' && !process.env.VERBOSE_TESTS) {
    console.log = jest.fn();
    console.error = jest.fn();
    console.warn = jest.fn();
  }
});

afterAll(() => {
  // Restaurar console original
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Función helper para crear tokens JWT de prueba
export const createTestJWT = (payload: any = {}) => {
  const jwt = require('jsonwebtoken');
  const secret = process.env.JWT_SECRET || 'test-secret';
  
  return jwt.sign(
    {
      id: 'test-user-id',
      email: 'test@example.com',
      role: 'admin',
      ...payload,
    },
    secret,
    { expiresIn: '1h' }
  );
};

// Función helper para crear headers de autorización
export const createAuthHeaders = (token?: string) => ({
  'Authorization': `Bearer ${token || createTestJWT()}`,
  'Content-Type': 'application/json',
});

// Función helper para esperar operaciones asíncronas
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Función helper para validar respuestas de API
export const validateApiResponse = (response: any, expectedStatus: number = 200) => {
  expect(response.status).toBe(expectedStatus);
  expect(response.body).toHaveProperty('success');
  
  if (expectedStatus >= 200 && expectedStatus < 300) {
    expect(response.body.success).toBe(true);
  } else {
    expect(response.body.success).toBe(false);
  }
  
  return response;
};

// Función helper para crear datos de prueba
export const createTestDriver = async (prisma: any, data: any = {}) => {
  const status = await prisma.status.create({
    data: {
      name: 'Activo',
      module: 'driver',
      color: '#10b981',
    },
  });

  return await prisma.driver.create({
    data: {
      firstName: 'Test',
      lastName: 'Driver',
      cedula: '1234567890',
      license: 'TEST123',
      phone: '3001234567',
      statusId: status.id,
      ...data,
    },
  });
};

export const createTestVehicle = async (prisma: any, data: any = {}) => {
  const status = await prisma.status.create({
    data: {
      name: 'Disponible',
      module: 'vehicle',
      color: '#3b82f6',
    },
  });

  return await prisma.vehicle.create({
    data: {
      brand: 'Test',
      model: 'Vehicle',
      year: 2020,
      plate: 'TEST123',
      statusId: status.id,
      ...data,
    },
  });
};

export const createTestUser = async (prisma: any, data: any = {}) => {
  return await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: '$2b$10$test.hash.for.testing.purposes.only',
      firstName: 'Test',
      lastName: 'User',
      role: 'admin',
      ...data,
    },
  });
};