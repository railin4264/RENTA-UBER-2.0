import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/authRoutes';
import driverRoutes from './routes/driverRoutes';
import vehicleRoutes from './routes/vehicleRoutes';
import paymentRoutes from './routes/paymentRoutes';
import expenseRoutes from './routes/expenseRoutes';
import contractRoutes from './routes/contractRoutes';
import reportRoutes from './routes/reportRoutes';
import statusRoutes from './routes/statusRoutes';
import logRoutes from './routes/logRoutes';
import { errorHandler, notFound } from './utils/errorHandler';
import { requestLogger, errorLogger } from './middlewares/logging';

// Load environment variables
dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve static uploads (photos, documents)
app.use('/uploads', express.static('uploads'));

// Logging middleware
app.use(requestLogger);

// CORS configuration
const corsOrigins = process.env.NODE_ENV === 'production' 
  ? [process.env.FRONTEND_URL || 'http://localhost:5173']
  : [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176',
      'http://localhost:5177',
      'http://localhost:5178',
      'http://localhost:5179',
      'http://localhost:5180',
      'http://localhost:3000',
      'http://localhost:3001'
    ];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (corsOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Renta Uber API',
    version: '1.0.0',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/statuses', statusRoutes);
app.use('/api/logs', logRoutes);

// Dashboard data endpoint (using real DB data for activities and upcoming payments)
app.get('/api/dashboard', async (req, res) => {
  try {
    const [drivers, vehicles, payments, contracts] = await Promise.all([
      prisma.driver.findMany({ include: { status: true } }),
      prisma.vehicle.findMany({ include: { status: true } }),
      prisma.payment.findMany({ include: { driver: true, contract: true }, orderBy: { createdAt: 'desc' } }),
      prisma.contract.findMany({ include: { status: true, driver: true, vehicle: true }, orderBy: { createdAt: 'desc' } })
    ]);

    const activeDrivers = drivers.filter(d => d.status?.name === 'Activo').length;
    const totalDrivers = drivers.length;
    const totalVehicles = vehicles.length;
    const availableVehicles = vehicles.filter(v => v.status?.name === 'Disponible').length;
    const vehiclesInMaintenance = vehicles.filter(v => v.status?.name === 'En Mantenimiento').length;
    const activeContracts = contracts.filter(c => c.status?.name === 'Vigente').length;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyPayments = payments.filter(p => {
      const paymentDate = new Date(p.date);
      return paymentDate.getMonth() === currentMonth && 
             paymentDate.getFullYear() === currentYear && 
             p.type === 'payment';
    });

    const monthlyIncome = monthlyPayments.reduce((sum, p) => sum + p.amount, 0);
    const pendingPayments = payments.filter(p => p.status === 'Pendiente').reduce((sum, p) => sum + p.amount, 0);

    // Recent activities (compose from latest payments and contracts)
    const recentPayments = payments.slice(0, 10).map((p) => ({
      id: p.id,
      type: 'payment',
      description: `Pago ${p.method ? '(' + p.method + ')' : ''} de ${p.driver?.firstName || ''} ${p.driver?.lastName || ''}`.trim(),
      amount: p.amount,
      date: p.date.toISOString(),
      status: (p.status || 'completed').toLowerCase()
    }));

    const recentContracts = contracts.slice(0, 10).map((c) => ({
      id: c.id,
      type: 'contract',
      description: `Contrato ${c.vehicle?.plate || ''} - ${c.driver?.firstName || ''} ${c.driver?.lastName || ''}`.trim(),
      amount: c.basePrice || 0,
      date: c.createdAt.toISOString(),
      status: (c.status?.name || 'active').toLowerCase()
    }));

    const recentActivities = [...recentPayments, ...recentContracts]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

    // Upcoming payments: payments with status pending and dueDate in the future (if present)
    const upcomingPayments = payments
      .filter(p => (p.status?.toLowerCase?.() === 'pending' || p.status?.toLowerCase?.() === 'pendiente') && (!!p.dueDate))
      .sort((a, b) => new Date(a.dueDate as string).getTime() - new Date(b.dueDate as string).getTime())
      .slice(0, 10)
      .map(p => ({
        id: p.id,
        driverName: `${p.driver?.firstName || ''} ${p.driver?.lastName || ''}`.trim(),
        amount: p.amount,
        dueDate: new Date(p.dueDate as string).toISOString(),
        status: 'pending'
      }));

    res.json({
      stats: {
        totalDrivers,
        activeDrivers,
        totalVehicles,
        availableVehicles,
        monthlyIncome,
        pendingPayments,
        activeContracts,
        vehiclesInMaintenance
      },
      recentActivities,
      upcomingPayments
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Error handling middleware
app.use(errorLogger);
app.use(notFound);
app.use(errorHandler);

export default app;


// ...existing code...
