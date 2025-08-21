const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Backend funcionando correctamente'
  });
});

// Dashboard endpoint
app.get('/api/dashboard', (req, res) => {
  res.json({
    stats: {
      activeDrivers: 24,
      totalVehicles: 18,
      monthlyIncome: 485600,
      pendingDebts: 28400,
      activeContracts: 15,
      vehiclesInMaintenance: 2,
      incomeGrowth: 12.5,
      pendingCases: 5
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
        timestamp: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: '3',
        type: 'expense',
        description: 'Mantenimiento vehículo ABC-123',
        amount: 8500,
        timestamp: new Date(Date.now() - 172800000).toISOString()
      }
    ],
    upcomingPayments: [
      {
        id: '1',
        driverName: 'Ana López',
        amount: 1600,
        dueDate: new Date(Date.now() + 86400000).toISOString()
      },
      {
        id: '2',
        driverName: 'Miguel Rodríguez',
        amount: 2400,
        dueDate: new Date(Date.now() + 172800000).toISOString()
      }
    ]
  });
});

// Mock endpoints for testing
app.get('/api/drivers', (req, res) => {
  res.json([
    {
      id: '1',
      firstName: 'Carlos',
      lastName: 'Martínez',
      cedula: '12345678901',
      phone: '809-123-4567',
      email: 'carlos@example.com',
      license: 'ABC123456',
      status: { name: 'Activo' }
    },
    {
      id: '2',
      firstName: 'Ana',
      lastName: 'López',
      cedula: '98765432109',
      phone: '809-987-6543',
      email: 'ana@example.com',
      license: 'DEF789012',
      status: { name: 'Activo' }
    }
  ]);
});

app.get('/api/vehicles', (req, res) => {
  res.json([
    {
      id: '1',
      brand: 'Toyota',
      model: 'Corolla',
      plate: 'ABC-123',
      year: 2020,
      color: 'Blanco',
      status: { name: 'Disponible' }
    },
    {
      id: '2',
      brand: 'Honda',
      model: 'Civic',
      plate: 'DEF-456',
      year: 2019,
      color: 'Negro',
      status: { name: 'En Uso' }
    }
  ]);
});

app.get('/api/payments', (req, res) => {
  res.json([
    {
      id: '1',
      amount: 3200,
      type: 'payment',
      status: 'Completado',
      date: new Date().toISOString(),
      driver: { firstName: 'Carlos', lastName: 'Martínez' }
    },
    {
      id: '2',
      amount: 1600,
      type: 'payment',
      status: 'Pendiente',
      date: new Date(Date.now() + 86400000).toISOString(),
      driver: { firstName: 'Ana', lastName: 'López' }
    }
  ]);
});

app.get('/api/contracts', (req, res) => {
  res.json([
    {
      id: '1',
      startDate: new Date().toISOString(),
      status: { name: 'Activo' },
      driver: { firstName: 'Carlos', lastName: 'Martínez' },
      vehicle: { plate: 'ABC-123' }
    },
    {
      id: '2',
      startDate: new Date(Date.now() - 86400000).toISOString(),
      status: { name: 'Activo' },
      driver: { firstName: 'Ana', lastName: 'López' },
      vehicle: { plate: 'DEF-456' }
    }
  ]);
});

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'admin@example.com' && password === 'admin123') {
    res.json({
      token: 'mock-jwt-token-12345',
      user: {
        id: '1',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        role: 'admin'
      }
    });
  } else {
    res.status(401).json({ error: 'Credenciales inválidas' });
  }
});

app.post('/api/auth/verify', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (token === 'mock-jwt-token-12345') {
    res.json({ valid: true });
  } else {
    res.status(401).json({ error: 'Token inválido' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Servidor de prueba corriendo en http://localhost:${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/api/dashboard`);
  console.log(`🔐 Login: POST http://localhost:${PORT}/api/auth/login`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
  console.log('\n📝 Credenciales de prueba:');
  console.log('   Email: admin@example.com');
  console.log('   Password: admin123');
}); 