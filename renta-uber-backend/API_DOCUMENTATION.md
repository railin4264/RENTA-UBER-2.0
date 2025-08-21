# 📚 Documentación de la API - Renta Uber

## 📋 Índice

1. [Información General](#información-general)
2. [Autenticación](#autenticación)
3. [Endpoints](#endpoints)
4. [Modelos de Datos](#modelos-de-datos)
5. [Códigos de Error](#códigos-de-error)
6. [Ejemplos de Uso](#ejemplos-de-uso)
7. [Rate Limiting](#rate-limiting)
8. [Webhooks](#webhooks)

## 🌐 Información General

- **Base URL**: `http://localhost:3001/api` (desarrollo)
- **Versión**: 1.0.0
- **Formato de Respuesta**: JSON
- **Autenticación**: JWT Bearer Token
- **Rate Limiting**: 100 requests por 15 minutos

### Headers Requeridos

```http
Content-Type: application/json
Authorization: Bearer <token>
```

## 🔐 Autenticación

### Login

```http
POST /api/auth/login
```

**Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

**Respuesta Exitosa:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_id",
      "email": "usuario@ejemplo.com",
      "firstName": "Usuario",
      "lastName": "Ejemplo",
      "role": "admin"
    }
  }
}
```

### Registro

```http
POST /api/auth/register
```

**Body:**
```json
{
  "email": "nuevo@ejemplo.com",
  "password": "contraseña123",
  "firstName": "Nuevo",
  "lastName": "Usuario",
  "role": "user"
}
```

### Verificar Token

```http
POST /api/auth/verify
```

**Headers:**
```http
Authorization: Bearer <token>
```

## 🚀 Endpoints

### 📊 Dashboard

#### Obtener Estadísticas del Dashboard

```http
GET /api/dashboard
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalDrivers": 25,
      "activeDrivers": 20,
      "totalVehicles": 30,
      "availableVehicles": 25,
      "monthlyIncome": 5000000,
      "pendingPayments": 800000,
      "activeContracts": 18,
      "vehiclesInMaintenance": 5
    },
    "recentActivities": [
      {
        "id": "activity_id",
        "type": "payment",
        "description": "Pago de Juan Pérez",
        "amount": 150000,
        "date": "2024-01-15T10:30:00Z",
        "status": "completed"
      }
    ],
    "upcomingPayments": [
      {
        "id": "payment_id",
        "driverName": "María García",
        "amount": 200000,
        "dueDate": "2024-01-20T00:00:00Z",
        "status": "pending"
      }
    ]
  }
}
```

### 👥 Choferes (Drivers)

#### Listar Choferes

```http
GET /api/drivers?page=1&limit=20&search=juan&status=activo
```

**Parámetros de Query:**
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 20, max: 100)
- `search`: Búsqueda por nombre, cédula o email
- `status`: Filtrar por estado

#### Obtener Chofer por ID

```http
GET /api/drivers/{driverId}
```

#### Crear Chofer

```http
POST /api/drivers
```

**Body:**
```json
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "cedula": "1234567890",
  "license": "ABC123456",
  "phone": "3001234567",
  "email": "juan.perez@ejemplo.com",
  "address": "Calle 123 #45-67",
  "salary": 1500000,
  "commission": 10
}
```

#### Actualizar Chofer

```http
PUT /api/drivers/{driverId}
```

#### Eliminar Chofer

```http
DELETE /api/drivers/{driverId}
```

#### Subir Foto del Chofer

```http
POST /api/drivers/{driverId}/photo
```

**Content-Type:** `multipart/form-data`

**Body:**
- `photo`: Archivo de imagen (JPG, PNG, GIF)

### 🚗 Vehículos (Vehicles)

#### Listar Vehículos

```http
GET /api/vehicles?page=1&limit=20&brand=toyota&status=disponible
```

#### Obtener Vehículo por ID

```http
GET /api/vehicles/{vehicleId}
```

#### Crear Vehículo

```http
POST /api/vehicles
```

**Body:**
```json
{
  "brand": "Toyota",
  "model": "Corolla",
  "year": 2020,
  "plate": "ABC123",
  "color": "Blanco",
  "mileage": 50000,
  "purchasePrice": 45000000,
  "currentValue": 40000000
}
```

#### Actualizar Vehículo

```http
PUT /api/vehicles/{vehicleId}
```

#### Eliminar Vehículo

```http
DELETE /api/vehicles/{vehicleId}
```

#### Subir Fotos del Vehículo

```http
POST /api/vehicles/{vehicleId}/photos
```

**Content-Type:** `multipart/form-data`

**Body:**
- `photos`: Múltiples archivos de imagen

### 💰 Pagos (Payments)

#### Listar Pagos

```http
GET /api/payments?page=1&limit=20&status=pending&driverId=driver_id
```

#### Obtener Pago por ID

```http
GET /api/payments/{paymentId}
```

#### Crear Pago

```http
POST /api/payments
```

**Body:**
```json
{
  "driverId": "driver_id",
  "contractId": "contract_id",
  "amount": 150000,
  "type": "payment",
  "method": "cash",
  "date": "2024-01-15T10:30:00Z",
  "description": "Pago mensual enero 2024"
}
```

#### Actualizar Pago

```http
PUT /api/payments/{paymentId}
```

#### Eliminar Pago

```http
DELETE /api/payments/{paymentId}
```

### 📊 Gastos (Expenses)

#### Listar Gastos

```http
GET /api/expenses?page=1&limit=20&category=maintenance&vehicleId=vehicle_id
```

#### Obtener Gasto por ID

```http
GET /api/expenses/{expenseId}
```

#### Crear Gasto

```http
POST /api/expenses
```

**Body:**
```json
{
  "vehicleId": "vehicle_id",
  "category": "maintenance",
  "amount": 250000,
  "description": "Cambio de aceite y filtros",
  "date": "2024-01-15T10:30:00Z",
  "vendor": "Taller Automotriz ABC",
  "paymentMethod": "credit_card"
}
```

### 📋 Contratos (Contracts)

#### Listar Contratos

```http
GET /api/contracts?page=1&limit=20&status=vigente&driverId=driver_id
```

#### Obtener Contrato por ID

```http
GET /api/contracts/{contractId}
```

#### Crear Contrato

```http
POST /api/contracts
```

**Body:**
```json
{
  "driverId": "driver_id",
  "vehicleId": "vehicle_id",
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-12-31T23:59:59Z",
  "type": "MONTHLY",
  "monthlyPrice": 500000,
  "deposit": 1000000,
  "penaltyRate": 0.05,
  "allowedDelayDays": 3,
  "automaticRenewal": true
}
```

### 📈 Reportes (Reports)

#### Listar Reportes

```http
GET /api/reports?page=1&limit=20
```

#### Generar Reporte

```http
POST /api/reports
```

**Body:**
```json
{
  "title": "Reporte de Ingresos Enero 2024",
  "description": "Análisis detallado de ingresos del mes",
  "type": "income",
  "dateFrom": "2024-01-01T00:00:00Z",
  "dateTo": "2024-01-31T23:59:59Z",
  "filters": {
    "driverId": "driver_id",
    "vehicleId": "vehicle_id"
  }
}
```

### 📝 Estados (Statuses)

#### Listar Estados

```http
GET /api/statuses?module=driver
```

#### Crear Estado

```http
POST /api/statuses
```

**Body:**
```json
{
  "name": "Activo",
  "module": "driver",
  "color": "#10b981"
}
```

### 📋 Garantes (Guarantors)

#### Listar Garantes de un Chofer

```http
GET /api/drivers/{driverId}/guarantors
```

#### Crear Garante

```http
POST /api/drivers/{driverId}/guarantors
```

**Body:**
```json
{
  "firstName": "Carlos",
  "lastName": "García",
  "cedula": "0987654321",
  "address": "Calle 456 #78-90",
  "workplace": "Empresa XYZ",
  "phone": "3009876543"
}
```

### 📊 Registros de Deuda (Debt Records)

#### Listar Deudas

```http
GET /api/debt-records?driverId=driver_id&status=pending
```

#### Crear Registro de Deuda

```http
POST /api/debt-records
```

**Body:**
```json
{
  "driverId": "driver_id",
  "vehiclePlate": "ABC123",
  "amount": 300000,
  "dueDate": "2024-01-20T00:00:00Z",
  "notes": "Pago pendiente del mes anterior"
}
```

## 🗃️ Modelos de Datos

### Usuario (User)

```typescript
interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user' | 'manager';
  createdAt: Date;
  updatedAt: Date;
}
```

### Chofer (Driver)

```typescript
interface Driver {
  id: string;
  photo?: string;
  firstName: string;
  lastName: string;
  cedula: string;
  cedulaPhoto?: string;
  license: string;
  licensePhoto?: string;
  licenseExpiry?: string;
  startDate?: Date;
  address?: string;
  googleMapsLink?: string;
  phone: string;
  email?: string;
  workplace?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  salary?: number;
  commission?: number;
  notes?: string;
  documents?: string;
  createdAt: Date;
  status?: Status;
  guarantors?: Guarantor[];
}
```

### Vehículo (Vehicle)

```typescript
interface Vehicle {
  id: string;
  brand?: string;
  model: string;
  year?: number;
  color?: string;
  plate: string;
  vin?: string;
  engine?: string;
  transmission?: string;
  fuelType?: string;
  mileage?: number;
  lastMaintenance?: string;
  nextMaintenance?: string;
  insuranceExpiry?: string;
  registrationExpiry?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  currentValue?: number;
  photos?: string;
  generalPhoto?: string;
  currentConditionPhotos?: string;
  notes?: string;
  documents?: string;
  createdAt: Date;
  status?: Status;
}
```

### Contrato (Contract)

```typescript
interface Contract {
  id: string;
  tenantId?: string;
  driverId: string;
  vehicleId: string;
  startDate: Date;
  endDate?: Date;
  type: 'DAILY' | 'MONTHLY' | 'CUSTOM';
  basePrice?: number;
  dailyPrice?: number;
  monthlyPrice?: number;
  deposit?: number;
  penaltyRate?: number;
  allowedDelayDays?: number;
  automaticRenewal?: boolean;
  terms?: string;
  notes?: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  driver?: Driver;
  vehicle?: Vehicle;
  status?: Status;
}
```

### Pago (Payment)

```typescript
interface Payment {
  id: string;
  contractId?: string;
  driverId: string;
  amount: number;
  type: 'payment' | 'deposit' | 'penalty' | 'refund';
  method?: 'cash' | 'bank_transfer' | 'credit_card' | 'debit_card' | 'mobile_payment';
  status?: 'pending' | 'completed' | 'failed' | 'cancelled';
  date: Date;
  dueDate?: string;
  description?: string;
  reference?: string;
  notes?: string;
  createdAt: Date;
  driver?: Driver;
  contract?: Contract;
}
```

### Gasto (Expense)

```typescript
interface Expense {
  id: string;
  vehicleId: string;
  category: 'maintenance' | 'fuel' | 'insurance' | 'repairs' | 'tires' | 'other';
  amount: number;
  description: string;
  date: Date;
  vendor?: string;
  invoiceNumber?: string;
  paymentMethod?: 'cash' | 'bank_transfer' | 'credit_card' | 'debit_card';
  status?: 'pending' | 'paid' | 'cancelled';
  notes?: string;
  createdAt: Date;
  vehicle?: Vehicle;
}
```

## ❌ Códigos de Error

### Errores HTTP Comunes

| Código | Descripción |
|--------|-------------|
| 400 | Bad Request - Datos de entrada inválidos |
| 401 | Unauthorized - Token inválido o expirado |
| 403 | Forbidden - Sin permisos para acceder al recurso |
| 404 | Not Found - Recurso no encontrado |
| 409 | Conflict - Conflicto con datos existentes |
| 422 | Unprocessable Entity - Error de validación |
| 429 | Too Many Requests - Rate limit excedido |
| 500 | Internal Server Error - Error interno del servidor |

### Formato de Error

```json
{
  "success": false,
  "message": "Descripción del error",
  "errors": [
    {
      "field": "email",
      "message": "El email es requerido",
      "code": "REQUIRED"
    }
  ]
}
```

## 💡 Ejemplos de Uso

### Ejemplo 1: Crear un Chofer Completo

```javascript
// 1. Login para obtener token
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@renta-uber.com',
    password: 'admin123'
  })
});

const { token } = await loginResponse.json();

// 2. Crear chofer
const driverResponse = await fetch('/api/drivers', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    firstName: 'Juan',
    lastName: 'Pérez',
    cedula: '1234567890',
    license: 'ABC123456',
    phone: '3001234567'
  })
});

const driver = await driverResponse.json();
```

### Ejemplo 2: Crear Contrato con Vehículo

```javascript
// 1. Crear contrato
const contractResponse = await fetch('/api/contracts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    driverId: 'driver_id',
    vehicleId: 'vehicle_id',
    startDate: new Date().toISOString(),
    type: 'MONTHLY',
    monthlyPrice: 500000,
    deposit: 1000000,
    penaltyRate: 0.05,
    allowedDelayDays: 3,
    automaticRenewal: true
  })
});

const contract = await contractResponse.json();
```

### Ejemplo 3: Registrar Pago

```javascript
// 1. Registrar pago
const paymentResponse = await fetch('/api/payments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    driverId: 'driver_id',
    contractId: 'contract_id',
    amount: 500000,
    type: 'payment',
    method: 'cash',
    date: new Date().toISOString(),
    description: 'Pago mensual enero 2024'
  })
});

const payment = await paymentResponse.json();
```

## 🚦 Rate Limiting

### Límites por Endpoint

- **General**: 100 requests por 15 minutos
- **Autenticación**: 5 intentos por 15 minutos
- **Upload de archivos**: 10 requests por 15 minutos

### Headers de Rate Limiting

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642233600
```

### Respuesta cuando se excede el límite

```json
{
  "success": false,
  "message": "Demasiadas peticiones desde esta IP, intenta de nuevo en 15 minutos"
}
```

## 🔗 Webhooks

### Configuración de Webhooks

```http
POST /api/webhooks
```

**Body:**
```json
{
  "url": "https://tu-sitio.com/webhook",
  "events": ["payment.completed", "contract.expired"],
  "secret": "webhook_secret_key"
}
```

### Eventos Disponibles

- `driver.created` - Chofer creado
- `driver.updated` - Chofer actualizado
- `vehicle.created` - Vehículo creado
- `vehicle.updated` - Vehículo actualizado
- `contract.created` - Contrato creado
- `contract.expired` - Contrato expirado
- `payment.completed` - Pago completado
- `payment.failed` - Pago fallido
- `expense.created` - Gasto creado

### Formato del Webhook

```json
{
  "event": "payment.completed",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "paymentId": "payment_id",
    "amount": 150000,
    "driverName": "Juan Pérez",
    "vehiclePlate": "ABC123"
  },
  "signature": "sha256_hash"
}
```

## 📱 SDKs y Librerías

### JavaScript/TypeScript

```bash
npm install renta-uber-sdk
```

```javascript
import { RentaUberAPI } from 'renta-uber-sdk';

const api = new RentaUberAPI({
  baseURL: 'http://localhost:3001/api',
  token: 'your_jwt_token'
});

// Crear chofer
const driver = await api.drivers.create({
  firstName: 'Juan',
  lastName: 'Pérez',
  cedula: '1234567890',
  license: 'ABC123456',
  phone: '3001234567'
});
```

### Python

```bash
pip install renta-uber-python
```

```python
from renta_uber import RentaUberAPI

api = RentaUberAPI(
    base_url='http://localhost:3001/api',
    token='your_jwt_token'
)

# Crear chofer
driver = api.drivers.create(
    first_name='Juan',
    last_name='Pérez',
    cedula='1234567890',
    license='ABC123456',
    phone='3001234567'
)
```

## 🔧 Herramientas de Desarrollo

### Postman Collection

Descarga la colección de Postman: [Renta-Uber-API.postman_collection.json](https://github.com/tu-usuario/renta-uber/blob/main/postman/Renta-Uber-API.postman_collection.json)

### Swagger/OpenAPI

Documentación interactiva disponible en: `/api/docs`

### Health Check

```http
GET /api/health
```

**Respuesta:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00Z",
  "environment": "development",
  "version": "1.0.0",
  "database": "connected",
  "uptime": "2h 30m 15s"
}
```

## 📞 Soporte

- **Email**: soporte@renta-uber.com
- **Documentación**: https://docs.renta-uber.com
- **GitHub Issues**: https://github.com/tu-usuario/renta-uber/issues
- **Discord**: https://discord.gg/renta-uber

---

**Última actualización**: 15 de Enero, 2024
**Versión de la API**: 1.0.0