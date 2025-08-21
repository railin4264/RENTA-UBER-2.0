const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seedCompleteData() {
  try {
    console.log('🌱 Iniciando inserción de datos completos...');
    
    // 1. Crear estados
    console.log('📊 Creando estados...');
    const statuses = await Promise.all([
      prisma.status.create({ data: { name: 'Activo', module: 'driver', color: '#10B981' } }),
      prisma.status.create({ data: { name: 'Inactivo', module: 'driver', color: '#EF4444' } }),
      prisma.status.create({ data: { name: 'Mantenimiento', module: 'vehicle', color: '#F59E0B' } }),
      prisma.status.create({ data: { name: 'Disponible', module: 'vehicle', color: '#3B82F6' } }),
      prisma.status.create({ data: { name: 'Vigente', module: 'contract', color: '#10B981' } }),
      prisma.status.create({ data: { name: 'Vencido', module: 'contract', color: '#EF4444' } })
    ]);

    const activeStatus = await prisma.status.findFirst({ where: { name: 'Activo' } });
    const maintenanceStatus = await prisma.status.findFirst({ where: { name: 'Mantenimiento' } });
    const availableStatus = await prisma.status.findFirst({ where: { name: 'Disponible' } });
    const activeContractStatus = await prisma.status.findFirst({ where: { name: 'Vigente' } });

    // 2. Crear conductores
    console.log('👥 Creando conductores...');
    const drivers = await Promise.all([
      prisma.driver.create({
        data: {
          firstName: 'Carlos',
          lastName: 'Martínez',
          cedula: '1234567890',
          license: 'ABC123456',
          phone: '0991234567',
          email: 'carlos.martinez@email.com',
          address: 'Av. Principal 123, Quito',
          workplace: 'Uber',
          emergencyContact: 'María Martínez',
          emergencyPhone: '0998765432',
          salary: 2500,
          commission: 15,
          notes: 'Conductor experimentado',
          statusId: activeStatus.id
        }
      }),
      prisma.driver.create({
        data: {
          firstName: 'Ana',
          lastName: 'López',
          cedula: '0987654321',
          license: 'XYZ789012',
          phone: '0992345678',
          email: 'ana.lopez@email.com',
          address: 'Calle Secundaria 456, Guayaquil',
          workplace: 'Uber',
          emergencyContact: 'Juan López',
          emergencyPhone: '0997654321',
          salary: 2200,
          commission: 12,
          notes: 'Conductora nueva',
          statusId: activeStatus.id
        }
      }),
      prisma.driver.create({
        data: {
          firstName: 'Roberto',
          lastName: 'García',
          cedula: '1122334455',
          license: 'DEF456789',
          phone: '0993456789',
          email: 'roberto.garcia@email.com',
          address: 'Plaza Central 789, Cuenca',
          workplace: 'Uber',
          emergencyContact: 'Carmen García',
          emergencyPhone: '0996543210',
          salary: 2800,
          commission: 18,
          notes: 'Conductor senior',
          statusId: activeStatus.id
        }
      })
    ]);

    // 3. Crear garantes
    console.log('🤝 Creando garantes...');
    const guarantors = await Promise.all([
      prisma.guarantor.create({
        data: {
          driverId: drivers[0].id,
          firstName: 'María',
          lastName: 'Martínez',
          cedula: '1111111111',
          address: 'Av. Principal 123, Quito',
          workplace: 'Empresa ABC',
          phone: '0998765432'
        }
      }),
      prisma.guarantor.create({
        data: {
          driverId: drivers[1].id,
          firstName: 'Juan',
          lastName: 'López',
          cedula: '2222222222',
          address: 'Calle Secundaria 456, Guayaquil',
          workplace: 'Empresa XYZ',
          phone: '0997654321'
        }
      })
    ]);

    // 4. Crear vehículos
    console.log('🚗 Creando vehículos...');
    const vehicles = await Promise.all([
      prisma.vehicle.create({
        data: {
          brand: 'Toyota',
          model: 'Corolla',
          year: 2020,
          color: 'Blanco',
          plate: 'ABC1234',
          vin: '1HGBH41JXMN109186',
          engine: '2.0L',
          transmission: 'Automático',
          fuelType: 'Gasolina',
          mileage: 45000,
          lastMaintenance: '2024-01-15',
          nextMaintenance: '2024-07-15',
          insuranceExpiry: '2024-12-31',
          registrationExpiry: '2024-12-31',
          purchaseDate: '2020-03-15',
          purchasePrice: 25000,
          currentValue: 20000,
          notes: 'Vehículo en excelente estado',
          statusId: availableStatus.id
        }
      }),
      prisma.vehicle.create({
        data: {
          brand: 'Honda',
          model: 'Civic',
          year: 2019,
          color: 'Negro',
          plate: 'XYZ5678',
          vin: '2T1BURHE0JC123456',
          engine: '1.8L',
          transmission: 'Automático',
          fuelType: 'Gasolina',
          mileage: 65000,
          lastMaintenance: '2024-02-20',
          nextMaintenance: '2024-08-20',
          insuranceExpiry: '2024-11-30',
          registrationExpiry: '2024-11-30',
          purchaseDate: '2019-06-10',
          purchasePrice: 22000,
          currentValue: 18000,
          notes: 'Necesita mantenimiento',
          statusId: maintenanceStatus.id
        }
      }),
      prisma.vehicle.create({
        data: {
          brand: 'Nissan',
          model: 'Sentra',
          year: 2021,
          color: 'Gris',
          plate: 'DEF9012',
          vin: '3N1AB6AP7BL123456',
          engine: '2.0L',
          transmission: 'CVT',
          fuelType: 'Gasolina',
          mileage: 30000,
          lastMaintenance: '2024-03-10',
          nextMaintenance: '2024-09-10',
          insuranceExpiry: '2024-10-31',
          registrationExpiry: '2024-10-31',
          purchaseDate: '2021-01-20',
          purchasePrice: 28000,
          currentValue: 24000,
          notes: 'Vehículo nuevo',
          statusId: availableStatus.id
        }
      })
    ]);

    // 5. Crear contratos
    console.log('📄 Creando contratos...');
    const contracts = await Promise.all([
      prisma.contract.create({
        data: {
          driverId: drivers[0].id,
          vehicleId: vehicles[0].id,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          type: 'MONTHLY',
          monthlyPrice: 3200,
          deposit: 1000,
          terms: 'Contrato estándar de 12 meses',
          notes: 'Conductor experimentado',
          statusId: activeContractStatus.id
        }
      }),
      prisma.contract.create({
        data: {
          driverId: drivers[1].id,
          vehicleId: vehicles[2].id,
          startDate: new Date('2024-02-01'),
          endDate: new Date('2025-01-31'),
          type: 'MONTHLY',
          monthlyPrice: 2800,
          deposit: 800,
          terms: 'Contrato estándar de 12 meses',
          notes: 'Conductora nueva',
          statusId: activeContractStatus.id
        }
      })
    ]);

    // 6. Crear pagos
    console.log('💰 Creando pagos...');
    const payments = await Promise.all([
      prisma.payment.create({
        data: {
          contractId: contracts[0].id,
          driverId: drivers[0].id,
          amount: 3200,
          type: 'payment',
          method: 'bank_transfer',
          status: 'completed',
          date: new Date('2024-01-15'),
          description: 'Pago mensual enero',
          reference: 'PAY-001'
        }
      }),
      prisma.payment.create({
        data: {
          contractId: contracts[0].id,
          driverId: drivers[0].id,
          amount: 3200,
          type: 'payment',
          method: 'cash',
          status: 'completed',
          date: new Date('2024-02-15'),
          description: 'Pago mensual febrero',
          reference: 'PAY-002'
        }
      }),
      prisma.payment.create({
        data: {
          contractId: contracts[1].id,
          driverId: drivers[1].id,
          amount: 2800,
          type: 'payment',
          method: 'bank_transfer',
          status: 'completed',
          date: new Date('2024-02-15'),
          description: 'Pago mensual febrero',
          reference: 'PAY-003'
        }
      }),
      prisma.payment.create({
        data: {
          driverId: drivers[2].id,
          amount: 500,
          type: 'deposit',
          method: 'cash',
          status: 'completed',
          date: new Date('2024-03-01'),
          description: 'Depósito inicial',
          reference: 'DEP-001'
        }
      })
    ]);

    // 7. Crear gastos
    console.log('💸 Creando gastos...');
    const expenses = await Promise.all([
      prisma.expense.create({
        data: {
          vehicleId: vehicles[1].id,
          category: 'maintenance',
          amount: 450,
          description: 'Cambio de aceite y filtros',
          date: new Date('2024-02-20'),
          vendor: 'Taller Automotriz ABC',
          invoiceNumber: 'INV-001',
          paymentMethod: 'cash',
          status: 'paid'
        }
      }),
      prisma.expense.create({
        data: {
          vehicleId: vehicles[0].id,
          category: 'fuel',
          amount: 120,
          description: 'Tanque de gasolina',
          date: new Date('2024-03-01'),
          vendor: 'Estación de Servicio XYZ',
          paymentMethod: 'credit_card',
          status: 'paid'
        }
      }),
      prisma.expense.create({
        data: {
          vehicleId: vehicles[2].id,
          category: 'insurance',
          amount: 800,
          description: 'Seguro anual',
          date: new Date('2024-01-15'),
          vendor: 'Seguros del Ecuador',
          invoiceNumber: 'INV-002',
          paymentMethod: 'bank_transfer',
          status: 'paid'
        }
      })
    ]);

    // 8. Crear reportes
    console.log('📊 Creando reportes...');
    const reports = await Promise.all([
      prisma.report.create({
        data: {
          title: 'Reporte Financiero Enero 2024',
          description: 'Análisis de ingresos y gastos del mes de enero',
          data: {
            income: 6400,
            expenses: 1370,
            profit: 5030,
            details: {
              payments: 2,
              maintenance: 1,
              fuel: 1
            }
          }
        }
      }),
      prisma.report.create({
        data: {
          title: 'Reporte de Mantenimiento',
          description: 'Estado de mantenimiento de todos los vehículos',
          data: {
            totalVehicles: 3,
            needingMaintenance: 1,
            nextMaintenance: '2024-07-15',
            totalExpenses: 450
          }
        }
      })
    ]);

    console.log('✅ Datos completos insertados exitosamente!');
    console.log(`📊 Resumen:
   - ${statuses.length} estados creados
   - ${drivers.length} conductores creados
   - ${guarantors.length} garantes creados
   - ${vehicles.length} vehículos creados
   - ${contracts.length} contratos creados
   - ${payments.length} pagos creados
   - ${expenses.length} gastos creados
   - ${reports.length} reportes creados`);

    console.log('\n🔑 Credenciales de acceso:');
    console.log('📧 Email: admin@rentauber.com');
    console.log('🔑 Contraseña: admin123');

  } catch (error) {
    console.error('❌ Error insertando datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedCompleteData(); 