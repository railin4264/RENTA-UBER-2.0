import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de la base de datos
const databaseConfig = {
  url: process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/renta_uber_db',
  pool: {
    min: 2,
    max: 10,
    acquireTimeoutMillis: 30000,
    createTimeoutMillis: 30000,
    destroyTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 100,
  },
};

// Crear instancia de Prisma con configuración
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseConfig.url,
    },
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

// Manejo de eventos de conexión
prisma.$on('beforeExit', async () => {
  console.log('Cerrando conexión a la base de datos...');
  await prisma.$disconnect();
});

prisma.$on('error', (e) => {
  console.error('Error de Prisma:', e);
});

// Función para verificar la conexión
export const testConnection = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos establecida correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
    return false;
  }
};

// Función para cerrar la conexión
export const closeConnection = async () => {
  try {
    await prisma.$disconnect();
    console.log('✅ Conexión a la base de datos cerrada correctamente');
  } catch (error) {
    console.error('❌ Error al cerrar la conexión:', error);
  }
};

export default prisma;