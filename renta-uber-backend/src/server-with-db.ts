import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/authRoutes';
import driverRoutes from './routes/driverRoutes';
import vehicleRoutes from './routes/vehicleRoutes';
import paymentRoutes from './routes/paymentRoutes';
import expenseRoutes from './routes/expenseRoutes';
import contractRoutes from './routes/contractRoutes';
import statusRoutes from './routes/statusRoutes';
import { errorHandler, notFound } from './utils/errorHandler';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5174',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Test database connection
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$connect();
    res.json({ 
      status: 'OK', 
      database: 'Connected',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      database: 'Disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Renta Uber API con PostgreSQL',
    version: '1.0.0',
    status: 'OK',
    database: 'PostgreSQL',
    timestamp: new Date().toISOString()
  });
});

// Dashboard endpoint with real data from database
app.get('/api/dashboard', async (req, res) => {
  try {
    const [drivers, vehicles, payments, contracts] = await Promise.all([
      prisma.driver.findMany({ 
        include: { 
          status: true,
          vehicles: true,
          contracts: true
        } 
      }),
      prisma.vehicle.findMany({ 
        include: { 
          status: true,
          driver: true
        } 
      }),
      prisma.payment.findMany({ 
        include: { 
          status: true,
          driver: true
        } 
      }),
      prisma.contract.findMany({ 
        include: { 
          status: true,
          driver: true,
          vehicle: true
        } 
      })
    ]);

    const activeDrivers = drivers.filter(d => d.status?.name === 'Activo').length;
    const totalVehicles = vehicles.length;
    const vehiclesInMaintenance = vehicles.filter(v => v.status?.name === 'En Mantenimiento').length;
    const activeContracts = contracts.filter(c => c.status?.name === 'Vigente').length;

    const currentMonth = new Date().getMonth();
    const monthlyPayments = payments.filter(p => {
      const paymentDate = new Date(p.date);
      return paymentDate.getMonth() === currentMonth && p.type === 'payment';
    });

    const monthlyIncome = monthlyPayments.reduce((sum, p) => sum + p.amount, 0);
    const pendingDebts = payments.filter(p => p.status?.name === 'Pendiente').reduce((sum, p) => sum + p.amount, 0);

    res.json({
      stats: {
        activeDrivers,
        totalVehicles,
        monthlyIncome,
        pendingDebts,
        activeContracts,
        vehiclesInMaintenance,
        incomeGrowth: 12.5,
        pendingCases: 5
      },
      recentActivities: payments.slice(0, 5).map(p => ({
        id: p.id,
        type: 'payment',
        description: `Pago de ${p.driver?.firstName} ${p.driver?.lastName}`,
        amount: p.amount,
        timestamp: p.date.toISOString()
      })),
      upcomingPayments: contracts.filter(c => c.status?.name === 'Vigente').slice(0, 3).map(c => ({
        id: c.id,
        driverName: `${c.driver?.firstName} ${c.driver?.lastName}`,
        amount: c.monthlyAmount,
        dueDate: new Date(Date.now() + 86400000).toISOString()
      }))
    });
  } catch (error) {
    console.error('Error en dashboard:', error);
    res.status(500).json({
      error: 'Error cargando datos del dashboard',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/statuses', statusRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Cerrando conexión a la base de datos...');
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor con PostgreSQL funcionando en http://localhost:${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/api/dashboard`);
  console.log(`🔍 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`👥 Conductores: http://localhost:${PORT}/api/drivers`);
  console.log(`🚗 Vehículos: http://localhost:${PORT}/api/vehicles`);
  console.log(`💰 Pagos: http://localhost:${PORT}/api/payments`);
  console.log(`📋 Contratos: http://localhost:${PORT}/api/contracts`);
  console.log(`💸 Gastos: http://localhost:${PORT}/api/expenses`);
  console.log(`🏷️ Estados: http://localhost:${PORT}/api/statuses`);
}); 