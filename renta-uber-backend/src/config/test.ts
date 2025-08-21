import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

// Configuración para tests
const testConfig = {
  database: {
    url: process.env.TEST_DATABASE_URL || 'postgresql://username:password@localhost:5432/renta_uber_test',
  },
  jwt: {
    secret: 'test-jwt-secret-key-for-testing-only',
    expiresIn: '1h',
  },
  server: {
    port: process.env.TEST_PORT || 3002,
  },
};

// Cliente de Prisma para tests
const testPrisma = new PrismaClient({
  datasources: {
    db: {
      url: testConfig.database.url,
    },
  },
  log: ['error'],
});

// Función para limpiar la base de datos de test
export const cleanTestDatabase = async () => {
  try {
    // Eliminar todos los datos en orden correcto (respetando foreign keys)
    await testPrisma.payment.deleteMany();
    await testPrisma.expense.deleteMany();
    await testPrisma.contract.deleteMany();
    await testPrisma.debtRecord.deleteMany();
    await testPrisma.guarantor.deleteMany();
    await testPrisma.driver.deleteMany();
    await testPrisma.vehicle.deleteMany();
    await testPrisma.status.deleteMany();
    await testPrisma.user.deleteMany();
    await testPrisma.report.deleteMany();
    
    console.log('✅ Base de datos de test limpiada');
  } catch (error) {
    console.error('❌ Error limpiando base de datos de test:', error);
    throw error;
  }
};

// Función para crear datos de prueba
export const createTestData = async () => {
  try {
    // Crear estados básicos
    const activeStatus = await testPrisma.status.create({
      data: {
        name: 'Activo',
        module: 'driver',
        color: '#10b981',
      },
    });

    const availableStatus = await testPrisma.status.create({
      data: {
        name: 'Disponible',
        module: 'vehicle',
        color: '#3b82f6',
      },
    });

    const activeContractStatus = await testPrisma.status.create({
      data: {
        name: 'Vigente',
        module: 'contract',
        color: '#f59e0b',
      },
    });

    // Crear usuario de prueba
    const testUser = await testPrisma.user.create({
      data: {
        email: 'test@example.com',
        password: '$2b$10$test.hash.for.testing.purposes.only',
        firstName: 'Test',
        lastName: 'User',
        role: 'admin',
      },
    });

    // Crear chofer de prueba
    const testDriver = await testPrisma.driver.create({
      data: {
        firstName: 'Juan',
        lastName: 'Pérez',
        cedula: '1234567890',
        license: 'ABC123456',
        phone: '3001234567',
        email: 'juan.perez@example.com',
        statusId: activeStatus.id,
      },
    });

    // Crear vehículo de prueba
    const testVehicle = await testPrisma.vehicle.create({
      data: {
        brand: 'Toyota',
        model: 'Corolla',
        year: 2020,
        plate: 'ABC123',
        color: 'Blanco',
        mileage: 50000,
        statusId: availableStatus.id,
      },
    });

    // Crear contrato de prueba
    const testContract = await testPrisma.contract.create({
      data: {
        driverId: testDriver.id,
        vehicleId: testVehicle.id,
        startDate: new Date(),
        type: 'MONTHLY',
        monthlyPrice: 500000,
        statusId: activeContractStatus.id,
      },
    });

    console.log('✅ Datos de prueba creados');
    
    return {
      user: testUser,
      driver: testDriver,
      vehicle: testVehicle,
      contract: testContract,
      statuses: {
        active: activeStatus,
        available: availableStatus,
        activeContract: activeContractStatus,
      },
    };
  } catch (error) {
    console.error('❌ Error creando datos de prueba:', error);
    throw error;
  }
};

// Función para cerrar conexión de test
export const closeTestConnection = async () => {
  try {
    await testPrisma.$disconnect();
    console.log('✅ Conexión de test cerrada');
  } catch (error) {
    console.error('❌ Error cerrando conexión de test:', error);
  }
};

export { testPrisma, testConfig };