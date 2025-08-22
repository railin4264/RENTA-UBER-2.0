import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Limpiar datos existentes
  await prisma.activityLog.deleteMany();
  await prisma.fine.deleteMany();
  await prisma.debtRecord.deleteMany();
  await prisma.contract.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.guarantor.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.status.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing data');

  // Crear usuarios
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@renta-uber.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'Sistema',
      role: 'admin'
    }
  });

  const normalUser = await prisma.user.create({
    data: {
      email: 'user@renta-uber.com',
      password: userPassword,
      firstName: 'Usuario',
      lastName: 'Demo',
      role: 'user'
    }
  });

  console.log('👥 Created users');

  // Crear estados
  const driverStatuses = await Promise.all([
    prisma.status.create({
      data: {
        name: 'Activo',
        module: 'driver',
        color: '#10b981'
      }
    }),
    prisma.status.create({
      data: {
        name: 'Inactivo',
        module: 'driver',
        color: '#ef4444'
      }
    }),
    prisma.status.create({
      data: {
        name: 'Suspendido',
        module: 'driver',
        color: '#f59e0b'
      }
    }),
    prisma.status.create({
      data: {
        name: 'En evaluación',
        module: 'driver',
        color: '#3b82f6'
      }
    })
  ]);

  const vehicleStatuses = await Promise.all([
    prisma.status.create({
      data: {
        name: 'Disponible',
        module: 'vehicle',
        color: '#10b981'
      }
    }),
    prisma.status.create({
      data: {
        name: 'Rentado',
        module: 'vehicle',
        color: '#3b82f6'
      }
    }),
    prisma.status.create({
      data: {
        name: 'En mantenimiento',
        module: 'vehicle',
        color: '#f59e0b'
      }
    }),
    prisma.status.create({
      data: {
        name: 'Fuera de servicio',
        module: 'vehicle',
        color: '#ef4444'
      }
    })
  ]);

  const contractStatuses = await Promise.all([
    prisma.status.create({
      data: {
        name: 'Activo',
        module: 'contract',
        color: '#10b981'
      }
    }),
    prisma.status.create({
      data: {
        name: 'Completado',
        module: 'contract',
        color: '#3b82f6'
      }
    }),
    prisma.status.create({
      data: {
        name: 'Cancelado',
        module: 'contract',
        color: '#ef4444'
      }
    })
  ]);

  console.log('📊 Created statuses');

  // Crear conductores
  const drivers = await Promise.all([
    prisma.driver.create({
      data: {
        firstName: 'Carlos',
        lastName: 'Martínez',
        cedula: '12345678',
        license: 'A123456',
        licenseExpiry: new Date('2025-12-31').toISOString(),
        phone: '0991234567',
        email: 'carlos@example.com',
        address: 'Av. Principal 123',
        workplace: 'Zona Centro',
        emergencyContact: 'María Martínez',
        emergencyPhone: '0991234568',
        salary: 1500000,
        commission: 10,
        statusId: driverStatuses[0].id,
        startDate: new Date('2024-01-15')
      }
    }),
    prisma.driver.create({
      data: {
        firstName: 'Ana',
        lastName: 'López',
        cedula: '87654321',
        license: 'B654321',
        licenseExpiry: new Date('2024-06-30').toISOString(),
        phone: '0992345678',
        email: 'ana@example.com',
        address: 'Calle Secundaria 456',
        workplace: 'Zona Norte',
        emergencyContact: 'Pedro López',
        emergencyPhone: '0992345679',
        salary: 1800000,
        commission: 12,
        statusId: driverStatuses[0].id,
        startDate: new Date('2023-06-01')
      }
    }),
    prisma.driver.create({
      data: {
        firstName: 'Juan',
        lastName: 'González',
        cedula: '11223344',
        license: 'C112233',
        licenseExpiry: new Date('2026-03-15').toISOString(),
        phone: '0993456789',
        email: 'juan@example.com',
        address: 'Barrio San José 789',
        workplace: 'Zona Sur',
        emergencyContact: 'Laura González',
        emergencyPhone: '0993456780',
        salary: 1600000,
        commission: 11,
        statusId: driverStatuses[1].id,
        startDate: new Date('2022-09-10')
      }
    })
  ]);

  console.log('🚗 Created drivers');

  // Crear vehículos
  const vehicles = await Promise.all([
    prisma.vehicle.create({
      data: {
        brand: 'Toyota',
        model: 'Corolla',
        year: 2022,
        color: 'Blanco',
        plate: 'ABC1234',
        vin: 'JTDBL40E299061234',
        engine: '1.8L',
        transmission: 'Automático',
        fuelType: 'Gasolina',
        mileage: 25000,
        lastMaintenance: new Date('2024-01-10').toISOString(),
        nextMaintenanceKm: 30000,
        dailyRate: 200000,
        weeklyRate: 1200000,
        monthlyRate: 4000000,
        insuranceExpiry: new Date('2024-12-31').toISOString(),
        circulationPermitExpiry: new Date('2024-12-31').toISOString(),
        inspectionExpiry: new Date('2024-06-30').toISOString(),
        statusId: vehicleStatuses[0].id
      }
    }),
    prisma.vehicle.create({
      data: {
        brand: 'Honda',
        model: 'Civic',
        year: 2021,
        color: 'Negro',
        plate: 'XYZ5678',
        vin: 'JHMFA36208S012345',
        engine: '2.0L',
        transmission: 'Manual',
        fuelType: 'Gasolina',
        mileage: 35000,
        lastMaintenance: new Date('2023-12-15').toISOString(),
        nextMaintenanceKm: 40000,
        dailyRate: 220000,
        weeklyRate: 1300000,
        monthlyRate: 4200000,
        insuranceExpiry: new Date('2024-11-30').toISOString(),
        circulationPermitExpiry: new Date('2024-11-30').toISOString(),
        inspectionExpiry: new Date('2024-05-31').toISOString(),
        statusId: vehicleStatuses[2].id
      }
    }),
    prisma.vehicle.create({
      data: {
        brand: 'Nissan',
        model: 'Sentra',
        year: 2023,
        color: 'Gris',
        plate: 'DEF9012',
        vin: '3N1AB7AP3EY303456',
        engine: '1.6L',
        transmission: 'Automático',
        fuelType: 'Gasolina',
        mileage: 15000,
        lastMaintenance: new Date('2024-02-01').toISOString(),
        nextMaintenanceKm: 20000,
        dailyRate: 180000,
        weeklyRate: 1100000,
        monthlyRate: 3800000,
        insuranceExpiry: new Date('2025-01-31').toISOString(),
        circulationPermitExpiry: new Date('2025-01-31').toISOString(),
        inspectionExpiry: new Date('2024-08-31').toISOString(),
        statusId: vehicleStatuses[1].id
      }
    })
  ]);

  console.log('🚙 Created vehicles');

  // Crear contratos
  const contracts = await Promise.all([
    prisma.contract.create({
      data: {
        driverId: drivers[0].id,
        vehicleId: vehicles[2].id,
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-12-31'),
        type: 'monthly',
        rate: 3800000,
        deposit: 500000,
        totalPaid: 3800000,
        balance: 0,
        status: 'active',
        statusId: contractStatuses[0].id
      }
    }),
    prisma.contract.create({
      data: {
        driverId: drivers[1].id,
        vehicleId: vehicles[0].id,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-06-30'),
        type: 'monthly',
        rate: 4000000,
        deposit: 600000,
        totalPaid: 8000000,
        balance: 0,
        status: 'active',
        statusId: contractStatuses[0].id
      }
    })
  ]);

  console.log('📋 Created contracts');

  // Crear pagos
  const payments = await Promise.all([
    prisma.payment.create({
      data: {
        driverId: drivers[0].id,
        amount: 1500000,
        type: 'salary',
        date: new Date('2024-01-31'),
        period: 'monthly',
        notes: 'Salario enero 2024'
      }
    }),
    prisma.payment.create({
      data: {
        driverId: drivers[0].id,
        amount: 1500000,
        type: 'salary',
        date: new Date('2024-02-29'),
        period: 'monthly',
        notes: 'Salario febrero 2024'
      }
    }),
    prisma.payment.create({
      data: {
        driverId: drivers[1].id,
        amount: 1800000,
        type: 'salary',
        date: new Date('2024-01-31'),
        period: 'monthly',
        notes: 'Salario enero 2024'
      }
    })
  ]);

  console.log('💰 Created payments');

  // Crear gastos
  const expenses = await Promise.all([
    prisma.expense.create({
      data: {
        vehicleId: vehicles[0].id,
        type: 'maintenance',
        amount: 350000,
        date: new Date('2024-01-10'),
        description: 'Cambio de aceite y filtros',
        mileage: 25000
      }
    }),
    prisma.expense.create({
      data: {
        vehicleId: vehicles[1].id,
        type: 'fuel',
        amount: 150000,
        date: new Date('2024-02-15'),
        description: 'Combustible semanal',
        mileage: 35100
      }
    }),
    prisma.expense.create({
      data: {
        vehicleId: vehicles[2].id,
        type: 'insurance',
        amount: 1200000,
        date: new Date('2024-01-01'),
        description: 'Renovación seguro anual'
      }
    })
  ]);

  console.log('📝 Created expenses');

  // Crear logs de actividad
  await prisma.activityLog.create({
    data: {
      userId: adminUser.id,
      action: 'create',
      entity: 'driver',
      entityId: drivers[0].id,
      details: 'Conductor Carlos Martínez creado',
      ip: '127.0.0.1'
    }
  });

  console.log('📋 Created activity logs');

  console.log('✅ Database seed completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });