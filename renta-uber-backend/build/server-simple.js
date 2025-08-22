"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app = (0, express_1.default)();
const PORT = 3001;
const JWT_SECRET = 'renta-uber-secret-key-2024';
const JWT_REFRESH_SECRET = 'renta-uber-refresh-secret-2024';
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: true, // Permitir todos los orígenes para desarrollo
    credentials: true
}));
// Simular base de datos de usuarios y tokens
const users = [
    {
        id: 1,
        email: 'admin@renta-uber.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'Sistema',
        role: 'admin',
        avatar: null
    }
];
const refreshTokens = [];
// Middleware de autenticación
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, error: 'Token de acceso requerido' });
    }
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, error: 'Token inválido o expirado' });
        }
        req.user = user;
        next();
    });
};
// Generar tokens
const generateTokens = (user) => {
    const accessToken = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
    refreshTokens.push(refreshToken);
    return { accessToken, refreshToken };
};
// Test endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Renta Uber API',
        version: '1.0.0',
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});
// Auth endpoints
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        const { accessToken, refreshToken } = generateTokens(user);
        res.json({
            success: true,
            data: {
                accessToken,
                refreshToken,
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    avatar: user.avatar
                }
            }
        });
    }
    else {
        res.status(401).json({
            success: false,
            error: 'Credenciales inválidas'
        });
    }
});
app.post('/api/auth/logout', authenticateToken, (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    // Remover refresh token si existe
    if (token) {
        const tokenIndex = refreshTokens.indexOf(token);
        if (tokenIndex > -1) {
            refreshTokens.splice(tokenIndex, 1);
        }
    }
    res.json({
        success: true,
        message: 'Sesión cerrada exitosamente'
    });
});
app.post('/api/auth/refresh', (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).json({ success: false, error: 'Refresh token requerido' });
    }
    if (!refreshTokens.includes(refreshToken)) {
        return res.status(403).json({ success: false, error: 'Refresh token inválido' });
    }
    jsonwebtoken_1.default.verify(refreshToken, JWT_REFRESH_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, error: 'Refresh token expirado' });
        }
        const userData = users.find(u => u.id === user.id);
        if (!userData) {
            return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
        }
        const newTokens = generateTokens(userData);
        // Remover refresh token anterior
        const tokenIndex = refreshTokens.indexOf(refreshToken);
        if (tokenIndex > -1) {
            refreshTokens.splice(tokenIndex, 1);
        }
        res.json({
            success: true,
            data: {
                accessToken: newTokens.accessToken,
                refreshToken: newTokens.refreshToken,
                user: {
                    id: userData.id,
                    email: userData.email,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    role: userData.role,
                    avatar: userData.avatar
                }
            }
        });
    });
});
app.get('/api/auth/validate', authenticateToken, (req, res) => {
    res.json({
        success: true,
        message: 'Token válido',
        user: req.user
    });
});
// Dashboard endpoint
app.get('/api/dashboard', authenticateToken, (req, res) => {
    res.json({
        success: true,
        data: {
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
                },
                {
                    id: '3',
                    type: 'maintenance',
                    description: 'Mantenimiento completado ABC-123',
                    amount: 1500,
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
                    driverName: 'Juan Pérez',
                    amount: 2200,
                    dueDate: new Date(Date.now() + 172800000).toISOString()
                }
            ]
        }
    });
});
// Drivers endpoints
app.get('/api/drivers', authenticateToken, (req, res) => {
    const { status, search } = req.query;
    let drivers = [
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
        },
        {
            id: 3,
            firstName: 'Juan',
            lastName: 'Pérez',
            email: 'juan@example.com',
            phone: '+52 55 5555 5555',
            licenseNumber: 'DL345678',
            status: { name: 'Inactivo', color: '#EF4444' },
            vehicle: null,
            contract: null
        }
    ];
    // Filtrar por estado
    if (status && status !== 'all' && typeof status === 'string') {
        drivers = drivers.filter(d => d.status.name.toLowerCase() === status.toLowerCase());
    }
    // Filtrar por búsqueda
    if (search && typeof search === 'string') {
        const searchLower = search.toLowerCase();
        drivers = drivers.filter(d => d.firstName.toLowerCase().includes(searchLower) ||
            d.lastName.toLowerCase().includes(searchLower) ||
            d.email.toLowerCase().includes(searchLower) ||
            d.licenseNumber.toLowerCase().includes(searchLower));
    }
    res.json({
        success: true,
        data: drivers
    });
});
app.get('/api/drivers/:id', authenticateToken, (req, res) => {
    const driverId = parseInt(req.params.id);
    const driver = [
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
        }
    ].find(d => d.id === driverId);
    if (driver) {
        res.json({ success: true, data: driver });
    }
    else {
        res.status(404).json({ success: false, error: 'Conductor no encontrado' });
    }
});
app.post('/api/drivers', authenticateToken, (req, res) => {
    const newDriver = {
        id: Date.now(),
        ...req.body,
        status: { name: 'Activo', color: '#10B981' }
    };
    res.json({
        success: true,
        data: newDriver
    });
});
app.put('/api/drivers/:id', authenticateToken, (req, res) => {
    const driverId = parseInt(req.params.id);
    res.json({
        success: true,
        data: {
            id: driverId,
            ...req.body
        }
    });
});
app.delete('/api/drivers/:id', authenticateToken, (req, res) => {
    const driverId = parseInt(req.params.id);
    res.json({
        success: true,
        message: `Conductor ${driverId} eliminado exitosamente`
    });
});
// Vehicles endpoints
app.get('/api/vehicles', authenticateToken, (req, res) => {
    const { status, search } = req.query;
    let vehicles = [
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
        },
        {
            id: 3,
            plate: 'DEF-456',
            model: 'Nissan Sentra',
            year: 2021,
            color: 'Gris',
            status: { name: 'En Mantenimiento', color: '#F59E0B' },
            driver: null
        }
    ];
    // Filtrar por estado
    if (status && status !== 'all' && typeof status === 'string') {
        vehicles = vehicles.filter(v => v.status.name.toLowerCase() === status.toLowerCase());
    }
    // Filtrar por búsqueda
    if (search && typeof search === 'string') {
        const searchLower = search.toLowerCase();
        vehicles = vehicles.filter(v => v.plate.toLowerCase().includes(searchLower) ||
            v.model.toLowerCase().includes(searchLower) ||
            v.color.toLowerCase().includes(searchLower));
    }
    res.json({
        success: true,
        data: vehicles
    });
});
app.get('/api/vehicles/:id', authenticateToken, (req, res) => {
    const vehicleId = parseInt(req.params.id);
    const vehicle = [
        {
            id: 1,
            plate: 'ABC-123',
            model: 'Toyota Corolla',
            year: 2020,
            color: 'Blanco',
            status: { name: 'Disponible', color: '#10B981' },
            driver: { id: 1, name: 'Carlos Martínez' }
        }
    ].find(v => v.id === vehicleId);
    if (vehicle) {
        res.json({ success: true, data: vehicle });
    }
    else {
        res.status(404).json({ success: false, error: 'Vehículo no encontrado' });
    }
});
app.post('/api/vehicles', authenticateToken, (req, res) => {
    const newVehicle = {
        id: Date.now(),
        ...req.body,
        status: { name: 'Disponible', color: '#10B981' }
    };
    res.json({
        success: true,
        data: newVehicle
    });
});
app.put('/api/vehicles/:id', authenticateToken, (req, res) => {
    const vehicleId = parseInt(req.params.id);
    res.json({
        success: true,
        data: {
            id: vehicleId,
            ...req.body
        }
    });
});
app.delete('/api/vehicles/:id', authenticateToken, (req, res) => {
    const vehicleId = parseInt(req.params.id);
    res.json({
        success: true,
        message: `Vehículo ${vehicleId} eliminado exitosamente`
    });
});
// Payments endpoints
app.get('/api/payments', authenticateToken, (req, res) => {
    const { status, type, search } = req.query;
    let payments = [
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
        },
        {
            id: 3,
            driverName: 'Juan Pérez',
            amount: 3500,
            date: '2024-01-25',
            type: 'fee',
            status: { name: 'Vencido', color: '#EF4444' }
        }
    ];
    // Filtrar por estado
    if (status && status !== 'all' && typeof status === 'string') {
        payments = payments.filter(p => p.status.name.toLowerCase() === status.toLowerCase());
    }
    // Filtrar por tipo
    if (type && type !== 'all' && typeof type === 'string') {
        payments = payments.filter(p => p.type.toLowerCase() === type.toLowerCase());
    }
    // Filtrar por búsqueda
    if (search && typeof search === 'string') {
        const searchLower = search.toLowerCase();
        payments = payments.filter(p => p.driverName.toLowerCase().includes(searchLower));
    }
    res.json({
        success: true,
        data: payments
    });
});
app.get('/api/payments/:id', authenticateToken, (req, res) => {
    const paymentId = parseInt(req.params.id);
    const payment = [
        {
            id: 1,
            driverName: 'Carlos Martínez',
            amount: 3200,
            date: '2024-01-15',
            type: 'payment',
            status: { name: 'Pagado', color: '#10B981' }
        }
    ].find(p => p.id === paymentId);
    if (payment) {
        res.json({ success: true, data: payment });
    }
    else {
        res.status(404).json({ success: false, error: 'Pago no encontrado' });
    }
});
app.post('/api/payments', authenticateToken, (req, res) => {
    const newPayment = {
        id: Date.now(),
        ...req.body,
        status: { name: 'Pendiente', color: '#F59E0B' }
    };
    res.json({
        success: true,
        data: newPayment
    });
});
app.put('/api/payments/:id', authenticateToken, (req, res) => {
    const paymentId = parseInt(req.params.id);
    res.json({
        success: true,
        data: {
            id: paymentId,
            ...req.body
        }
    });
});
app.delete('/api/payments/:id', authenticateToken, (req, res) => {
    const paymentId = parseInt(req.params.id);
    res.json({
        success: true,
        message: `Pago ${paymentId} eliminado exitosamente`
    });
});
// Contracts endpoints
app.get('/api/contracts', authenticateToken, (req, res) => {
    const { status, search } = req.query;
    let contracts = [
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
        },
        {
            id: 3,
            driverName: 'Juan Pérez',
            vehiclePlate: 'DEF-456',
            startDate: '2023-06-01',
            endDate: '2023-12-31',
            monthlyAmount: 3000,
            status: { name: 'Vencido', color: '#EF4444' }
        }
    ];
    // Filtrar por estado
    if (status && status !== 'all' && typeof status === 'string') {
        contracts = contracts.filter(c => c.status.name.toLowerCase() === status.toLowerCase());
    }
    // Filtrar por búsqueda
    if (search && typeof search === 'string') {
        const searchLower = search.toLowerCase();
        contracts = contracts.filter(c => c.driverName.toLowerCase().includes(searchLower) ||
            c.vehiclePlate.toLowerCase().includes(searchLower));
    }
    res.json({
        success: true,
        data: contracts
    });
});
app.get('/api/contracts/:id', authenticateToken, (req, res) => {
    const contractId = parseInt(req.params.id);
    const contract = [
        {
            id: 1,
            driverName: 'Carlos Martínez',
            vehiclePlate: 'ABC-123',
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            monthlyAmount: 3200,
            status: { name: 'Vigente', color: '#10B981' }
        }
    ].find(c => c.id === contractId);
    if (contract) {
        res.json({ success: true, data: contract });
    }
    else {
        res.status(404).json({ success: false, error: 'Contrato no encontrado' });
    }
});
app.post('/api/contracts', authenticateToken, (req, res) => {
    const newContract = {
        id: Date.now(),
        ...req.body,
        status: { name: 'Vigente', color: '#10B981' }
    };
    res.json({
        success: true,
        data: newContract
    });
});
app.put('/api/contracts/:id', authenticateToken, (req, res) => {
    const contractId = parseInt(req.params.id);
    res.json({
        success: true,
        data: {
            id: contractId,
            ...req.body
        }
    });
});
app.delete('/api/contracts/:id', authenticateToken, (req, res) => {
    const contractId = parseInt(req.params.id);
    res.json({
        success: true,
        message: `Contrato ${contractId} eliminado exitosamente`
    });
});
// Expenses endpoints
app.get('/api/expenses', authenticateToken, (req, res) => {
    const { category, status, search } = req.query;
    let expenses = [
        {
            id: 1,
            description: 'Mantenimiento ABC-123',
            amount: 1500,
            date: '2024-01-10',
            category: 'maintenance',
            vehicle: 'ABC-123',
            status: { name: 'Pagado', color: '#10B981' }
        },
        {
            id: 2,
            description: 'Combustible XYZ-789',
            amount: 800,
            date: '2024-01-15',
            category: 'fuel',
            vehicle: 'XYZ-789',
            status: { name: 'Pendiente', color: '#F59E0B' }
        },
        {
            id: 3,
            description: 'Seguro DEF-456',
            amount: 2500,
            date: '2024-01-20',
            category: 'insurance',
            vehicle: 'DEF-456',
            status: { name: 'Pagado', color: '#10B981' }
        }
    ];
    // Filtrar por categoría
    if (category && category !== 'all' && typeof category === 'string') {
        expenses = expenses.filter(e => e.category.toLowerCase() === category.toLowerCase());
    }
    // Filtrar por estado
    if (status && status !== 'all' && typeof status === 'string') {
        expenses = expenses.filter(e => e.status.name.toLowerCase() === status.toLowerCase());
    }
    // Filtrar por búsqueda
    if (search && typeof search === 'string') {
        const searchLower = search.toLowerCase();
        expenses = expenses.filter(e => e.description.toLowerCase().includes(searchLower) ||
            e.vehicle.toLowerCase().includes(searchLower));
    }
    res.json({
        success: true,
        data: expenses
    });
});
app.get('/api/expenses/:id', authenticateToken, (req, res) => {
    const expenseId = parseInt(req.params.id);
    const expense = [
        {
            id: 1,
            description: 'Mantenimiento ABC-123',
            amount: 1500,
            date: '2024-01-10',
            category: 'maintenance',
            vehicle: 'ABC-123',
            status: { name: 'Pagado', color: '#10B981' }
        }
    ].find(e => e.id === expenseId);
    if (expense) {
        res.json({ success: true, data: expense });
    }
    else {
        res.status(404).json({ success: false, error: 'Gasto no encontrado' });
    }
});
app.post('/api/expenses', authenticateToken, (req, res) => {
    const newExpense = {
        id: Date.now(),
        ...req.body,
        status: { name: 'Pendiente', color: '#F59E0B' }
    };
    res.json({
        success: true,
        data: newExpense
    });
});
app.put('/api/expenses/:id', authenticateToken, (req, res) => {
    const expenseId = parseInt(req.params.id);
    res.json({
        success: true,
        data: {
            id: expenseId,
            ...req.body
        }
    });
});
app.delete('/api/expenses/:id', authenticateToken, (req, res) => {
    const expenseId = parseInt(req.params.id);
    res.json({
        success: true,
        message: `Gasto ${expenseId} eliminado exitosamente`
    });
});
// Statuses endpoint
app.get('/api/statuses', authenticateToken, (req, res) => {
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
    if (module && typeof module === 'string') {
        const filteredStatuses = statuses.filter(s => s.module === module);
        res.json({ success: true, data: filteredStatuses });
    }
    else {
        res.json({ success: true, data: statuses });
    }
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
    });
});
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint no encontrado'
    });
});
app.listen(PORT, () => {
    console.log(`🚀 Servidor Renta Uber funcionando en http://localhost:${PORT}`);
    console.log(`🔐 Autenticación JWT habilitada`);
    console.log(`📊 Dashboard: http://localhost:${PORT}/api/dashboard`);
    console.log(`👥 Conductores: http://localhost:${PORT}/api/drivers`);
    console.log(`🚗 Vehículos: http://localhost:${PORT}/api/vehicles`);
    console.log(`💰 Pagos: http://localhost:${PORT}/api/payments`);
    console.log(`📋 Contratos: http://localhost:${PORT}/api/contracts`);
    console.log(`💸 Gastos: http://localhost:${PORT}/api/expenses`);
    console.log(`🏷️ Estados: http://localhost:${PORT}/api/statuses`);
    console.log(`\n📱 Credenciales de prueba:`);
    console.log(`   Email: admin@renta-uber.com`);
    console.log(`   Contraseña: admin123`);
});
