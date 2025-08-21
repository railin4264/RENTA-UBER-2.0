const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data
const mockDashboardData = {
  stats: {
    totalDrivers: 12,
    activeDrivers: 8,
    totalVehicles: 15,
    availableVehicles: 6,
    monthlyIncome: 125000,
    pendingPayments: 32000,
    activeContracts: 8,
    vehiclesInMaintenance: 2
  },
  recentActivities: [
    {
      id: '1',
      type: 'payment',
      description: 'Pago recibido de Carlos Martínez',
      amount: 3200,
      date: '2024-01-15T10:30:00Z',
      status: 'completed'
    },
    {
      id: '2',
      type: 'contract',
      description: 'Nuevo contrato creado',
      amount: 12800,
      date: '2024-01-14T15:45:00Z',
      status: 'active'
    },
    {
      id: '3',
      type: 'expense',
      description: 'Mantenimiento vehículo ABC-123',
      amount: 8500,
      date: '2024-01-13T09:20:00Z',
      status: 'paid'
    }
  ],
  upcomingPayments: [
    {
      id: '1',
      driverName: 'Ana López',
      amount: 3200,
      dueDate: '2024-01-20',
      status: 'pending'
    },
    {
      id: '2',
      driverName: 'Roberto Silva',
      amount: 3200,
      dueDate: '2024-01-22',
      status: 'pending'
    }
  ]
};

const mockDrivers = [
  {
    id: '1',
    firstName: 'Carlos',
    lastName: 'Martínez',
    cedula: '12345678901',
    phone: '809-555-0101',
    email: 'carlos.martinez@email.com',
    license: 'DL-2024-001',
    licenseExpiry: '2025-12-31',
    status: { id: '1', name: 'Activo' },
    salary: 3200,
    commission: 15,
    emergencyContact: {
      name: 'María Martínez',
      phone: '809-555-0102',
      relationship: 'Esposa'
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    firstName: 'Ana',
    lastName: 'López',
    cedula: '98765432109',
    phone: '809-555-0202',
    email: 'ana.lopez@email.com',
    license: 'DL-2024-002',
    licenseExpiry: '2025-06-30',
    status: { id: '1', name: 'Activo' },
    salary: 3200,
    commission: 15,
    emergencyContact: {
      name: 'Juan López',
      phone: '809-555-0203',
      relationship: 'Hermano'
    },
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  }
];

const mockVehicles = [
  {
    id: '1',
    brand: 'Toyota',
    model: 'Corolla',
    plate: 'ABC-123',
    year: 2020,
    color: 'Blanco',
    vin: '1HGBH41JXMN109186',
    engine: '1.8L 4-Cylinder',
    mileage: 45000,
    lastMaintenance: '2024-01-10',
    nextMaintenance: '2024-04-10',
    insuranceExpiry: '2024-12-31',
    registrationExpiry: '2024-12-31',
    purchasePrice: 850000,
    currentValue: 650000,
    status: { id: '1', name: 'Disponible' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    brand: 'Honda',
    model: 'Civic',
    plate: 'DEF-456',
    year: 2019,
    color: 'Negro',
    vin: '2T1BURHE0JC123456',
    engine: '1.5L Turbo',
    mileage: 38000,
    lastMaintenance: '2024-01-05',
    nextMaintenance: '2024-04-05',
    insuranceExpiry: '2024-12-31',
    registrationExpiry: '2024-12-31',
    purchasePrice: 900000,
    currentValue: 700000,
    status: { id: '2', name: 'En Uso' },
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z'
  }
];

const mockContracts = [
  {
    id: '1',
    driverId: '1',
    vehicleId: '1',
    startDate: '2024-01-15',
    endDate: '2024-12-31',
    rate: 3200,
    rateType: 'weekly',
    deposit: 5000,
    status: { id: '1', name: 'Activo' },
    totalValue: 128000,
    driver: {
      id: '1',
      firstName: 'Carlos',
      lastName: 'Martínez',
      cedula: '12345678901',
      phone: '809-555-0101'
    },
    vehicle: {
      id: '1',
      brand: 'Toyota',
      model: 'Corolla',
      plate: 'ABC-123',
      year: 2020
    },
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  }
];

const mockPayments = [
  {
    id: '1',
    contractId: '1',
    driverId: '1',
    amount: 3200,
    type: 'payment',
    method: 'cash',
    status: 'completed',
    date: '2024-01-15',
    dueDate: '2024-01-15',
    description: 'Pago semanal de renta',
    reference: 'REF-001',
    notes: 'Pago recibido en efectivo',
    driver: {
      id: '1',
      firstName: 'Carlos',
      lastName: 'Martínez',
      cedula: '12345678901'
    },
    contract: {
      id: '1',
      startDate: '2024-01-15',
      endDate: '2024-12-31',
      rate: 3200,
      rateType: 'weekly'
    },
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  }
];

const mockExpenses = [
  {
    id: '1',
    vehicleId: '1',
    category: 'maintenance',
    amount: 8500,
    description: 'Cambio de aceite y filtros',
    date: '2024-11-15',
    vendor: 'Taller Mecánico ABC',
    invoiceNumber: 'INV-001',
    paymentMethod: 'cash',
    status: 'paid',
    notes: 'Mantenimiento preventivo programado',
    vehicle: {
      id: '1',
      brand: 'Toyota',
      model: 'Corolla',
      plate: 'ABC-123'
    },
    createdAt: '2024-11-15T00:00:00Z',
    updatedAt: '2024-11-15T00:00:00Z'
  }
];

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server running' });
});

app.get('/api/dashboard', (req, res) => {
  res.json(mockDashboardData);
});

app.get('/api/drivers', (req, res) => {
  res.json(mockDrivers);
});

app.get('/api/vehicles', (req, res) => {
  res.json(mockVehicles);
});

app.get('/api/contracts', (req, res) => {
  res.json(mockContracts);
});

app.get('/api/payments', (req, res) => {
  res.json(mockPayments);
});

app.get('/api/expenses', (req, res) => {
  res.json(mockExpenses);
});

// POST routes for creating data
app.post('/api/drivers', (req, res) => {
  const newDriver = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  mockDrivers.push(newDriver);
  res.status(201).json(newDriver);
});

app.post('/api/vehicles', (req, res) => {
  const newVehicle = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  mockVehicles.push(newVehicle);
  res.status(201).json(newVehicle);
});

app.post('/api/contracts', (req, res) => {
  const newContract = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  mockContracts.push(newContract);
  res.status(201).json(newContract);
});

app.post('/api/payments', (req, res) => {
  const newPayment = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  mockPayments.push(newPayment);
  res.status(201).json(newPayment);
});

app.post('/api/expenses', (req, res) => {
  const newExpense = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  mockExpenses.push(newExpense);
  res.status(201).json(newExpense);
});

// DELETE routes
app.delete('/api/drivers/:id', (req, res) => {
  const { id } = req.params;
  const index = mockDrivers.findIndex(driver => driver.id === id);
  if (index > -1) {
    mockDrivers.splice(index, 1);
    res.json({ success: true, message: 'Conductor eliminado' });
  } else {
    res.status(404).json({ success: false, message: 'Conductor no encontrado' });
  }
});

app.delete('/api/vehicles/:id', (req, res) => {
  const { id } = req.params;
  const index = mockVehicles.findIndex(vehicle => vehicle.id === id);
  if (index > -1) {
    mockVehicles.splice(index, 1);
    res.json({ success: true, message: 'Vehículo eliminado' });
  } else {
    res.status(404).json({ success: false, message: 'Vehículo no encontrado' });
  }
});

app.delete('/api/contracts/:id', (req, res) => {
  const { id } = req.params;
  const index = mockContracts.findIndex(contract => contract.id === id);
  if (index > -1) {
    mockContracts.splice(index, 1);
    res.json({ success: true, message: 'Contrato eliminado' });
  } else {
    res.status(404).json({ success: false, message: 'Contrato no encontrado' });
  }
});

app.delete('/api/payments/:id', (req, res) => {
  const { id } = req.params;
  const index = mockPayments.findIndex(payment => payment.id === id);
  if (index > -1) {
    mockPayments.splice(index, 1);
    res.json({ success: true, message: 'Pago eliminado' });
  } else {
    res.status(404).json({ success: false, message: 'Pago no encontrado' });
  }
});

app.delete('/api/expenses/:id', (req, res) => {
  const { id } = req.params;
  const index = mockExpenses.findIndex(expense => expense.id === id);
  if (index > -1) {
    mockExpenses.splice(index, 1);
    res.json({ success: true, message: 'Gasto eliminado' });
  } else {
    res.status(404).json({ success: false, message: 'Gasto no encontrado' });
  }
});

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'admin@rentauber.com' && password === 'admin123') {
    res.json({
      success: true,
      token: 'mock-jwt-token',
      user: {
        id: '1',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@rentauber.com',
        role: 'admin'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Credenciales inválidas'
    });
  }
});

app.post('/api/auth/verify', (req, res) => {
  res.json({
    success: true,
    user: {
      id: '1',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@rentauber.com',
      role: 'admin'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Test server running on http://localhost:${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/api/dashboard`);
  console.log(`👥 Drivers: http://localhost:${PORT}/api/drivers`);
  console.log(`🚗 Vehicles: http://localhost:${PORT}/api/vehicles`);
  console.log(`📄 Contracts: http://localhost:${PORT}/api/contracts`);
  console.log(`💰 Payments: http://localhost:${PORT}/api/payments`);
  console.log(`📊 Expenses: http://localhost:${PORT}/api/expenses`);
  console.log(`🔐 Login: POST http://localhost:${PORT}/api/auth/login`);
  console.log(`\n🔑 Test Credentials:`);
  console.log(`   Email: admin@rentauber.com`);
  console.log(`   Password: admin123`);
}); 