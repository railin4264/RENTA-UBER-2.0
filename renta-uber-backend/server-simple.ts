import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(cors({
  origin: true, // Permitir todos los orígenes para desarrollo
  credentials: true
}));

// Test endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Renta Uber API',
    version: '1.0.0',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Auth endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'admin@renta-uber.com' && password === 'admin123') {
    res.json({
      success: true,
      data: {
        token: 'test-token-123',
        user: {
          id: 1,
          email: 'admin@renta-uber.com',
          firstName: 'Admin',
          lastName: 'Sistema',
          role: 'admin'
        }
      }
    });
  } else {
    res.status(401).json({
      success: false,
      error: 'Credenciales inválidas'
    });
  }
});

// Dashboard endpoint
app.get('/api/dashboard', (req, res) => {
  res.json({
    stats: {
      activeDrivers: 5,
      totalVehicles: 12,
      monthlyIncome: 45000,
      pendingDebts: 8000,
      activeContracts: 8,
      vehiclesInMaintenance: 2,
      incomeGrowth: 12.5,
      pendingCases: 3
    },
    recentActivities: [
      {
        id: '1',
        type: 'payment',
        description: 'Pago recibido de Carlos Martínez',
        amount: 3200,
        timestamp: new Date().toISOString()
      },
      {
        id: '2',
        type: 'contract',
        description: 'Nuevo contrato creado',
        amount: null,
        timestamp: new Date(Date.now() - 86400000).toISOString()
      }
    ],
    upcomingPayments: [
      {
        id: '1',
        driverName: 'Ana López',
        amount: 1600,
        dueDate: new Date(Date.now() + 86400000).toISOString()
      }
    ]
  });
});

// Drivers endpoints
app.get('/api/drivers', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 1,
        firstName: 'Carlos',
        lastName: 'Martínez',
        email: 'carlos@example.com',
        phone: '+52 55 1234 5678',
        licenseNumber: 'DL123456',
        status: { name: 'Activo', color: '#10B981' },
        vehicle: { id: 1, plate: 'ABC-123', model: 'Toyota Corolla' },
        contract: { id: 1, startDate: '2024-01-01', endDate: '2024-12-31' }
      },
      {
        id: 2,
        firstName: 'Ana',
        lastName: 'López',
        email: 'ana@example.com',
        phone: '+52 55 9876 5432',
        licenseNumber: 'DL789012',
        status: { name: 'Activo', color: '#10B981' },
        vehicle: { id: 2, plate: 'XYZ-789', model: 'Honda Civic' },
        contract: { id: 2, startDate: '2024-02-01', endDate: '2024-12-31' }
      }
    ]
  });
});

app.post('/api/drivers', (req, res) => {
  res.json({
    success: true,
    data: {
      id: 3,
      ...req.body,
      status: { name: 'Activo', color: '#10B981' }
    }
  });
});

app.put('/api/drivers/:id', (req, res) => {
  res.json({
    success: true,
    data: {
      id: parseInt(req.params.id),
      ...req.body
    }
  });
});

app.delete('/api/drivers/:id', (req, res) => {
  res.json({
    success: true,
    message: 'Conductor eliminado exitosamente'
  });
});

// Vehicles endpoints
app.get('/api/vehicles', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 1,
        plate: 'ABC-123',
        model: 'Toyota Corolla',
        year: 2020,
        color: 'Blanco',
        status: { name: 'Disponible', color: '#10B981' },
        driver: { id: 1, name: 'Carlos Martínez' }
      },
      {
        id: 2,
        plate: 'XYZ-789',
        model: 'Honda Civic',
        year: 2019,
        color: 'Negro',
        status: { name: 'Disponible', color: '#10B981' },
        driver: { id: 2, name: 'Ana López' }
      }
    ]
  });
});

// Payments endpoints
app.get('/api/payments', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 1,
        driverName: 'Carlos Martínez',
        amount: 3200,
        date: '2024-01-15',
        type: 'payment',
        status: { name: 'Pagado', color: '#10B981' }
      },
      {
        id: 2,
        driverName: 'Ana López',
        amount: 2800,
        date: '2024-01-20',
        type: 'payment',
        status: { name: 'Pendiente', color: '#F59E0B' }
      }
    ]
  });
});

// Contracts endpoints
app.get('/api/contracts', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 1,
        driverName: 'Carlos Martínez',
        vehiclePlate: 'ABC-123',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        monthlyAmount: 3200,
        status: { name: 'Vigente', color: '#10B981' }
      },
      {
        id: 2,
        driverName: 'Ana López',
        vehiclePlate: 'XYZ-789',
        startDate: '2024-02-01',
        endDate: '2024-12-31',
        monthlyAmount: 2800,
        status: { name: 'Vigente', color: '#10B981' }
      }
    ]
  });
});

// Expenses endpoints
app.get('/api/expenses', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 1,
        description: 'Mantenimiento ABC-123',
        amount: 1500,
        date: '2024-01-10',
        type: 'maintenance',
        vehicle: 'ABC-123',
        status: { name: 'Pagado', color: '#10B981' }
      },
      {
        id: 2,
        description: 'Combustible XYZ-789',
        amount: 800,
        date: '2024-01-15',
        type: 'fuel',
        vehicle: 'XYZ-789',
        status: { name: 'Pendiente', color: '#F59E0B' }
      }
    ]
  });
});

// Statuses endpoint
app.get('/api/statuses', (req, res) => {
  const { module } = req.query;
  const statuses = [
    { name: 'Activo', module: 'driver', color: '#10B981' },
    { name: 'Inactivo', module: 'driver', color: '#EF4444' },
    { name: 'Disponible', module: 'vehicle', color: '#10B981' },
    { name: 'En Mantenimiento', module: 'vehicle', color: '#F59E0B' },
    { name: 'Fuera de Servicio', module: 'vehicle', color: '#EF4444' },
    { name: 'Pagado', module: 'payment', color: '#10B981' },
    { name: 'Pendiente', module: 'payment', color: '#F59E0B' },
    { name: 'Vencido', module: 'payment', color: '#EF4444' },
    { name: 'Vigente', module: 'contract', color: '#10B981' },
    { name: 'Vencido', module: 'contract', color: '#EF4444' }
  ];
  
  if (module) {
    const filteredStatuses = statuses.filter(s => s.module === module);
    res.json({ success: true, data: filteredStatuses });
  } else {
    res.json({ success: true, data: statuses });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor simple funcionando en http://localhost:${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/api/dashboard`);
  console.log(`👥 Conductores: http://localhost:${PORT}/api/drivers`);
  console.log(`🚗 Vehículos: http://localhost:${PORT}/api/vehicles`);
  console.log(`💰 Pagos: http://localhost:${PORT}/api/payments`);
  console.log(`📋 Contratos: http://localhost:${PORT}/api/contracts`);
  console.log(`💸 Gastos: http://localhost:${PORT}/api/expenses`);
  console.log(`🏷️ Estados: http://localhost:${PORT}/api/statuses`);
}); 