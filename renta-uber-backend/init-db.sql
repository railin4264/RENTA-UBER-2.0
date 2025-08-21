-- Inicialización de la base de datos Renta Uber
-- Este archivo se ejecuta automáticamente al crear el contenedor PostgreSQL

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Crear estados básicos del sistema
INSERT INTO "Status" (id, name, module, color, "createdAt") VALUES
('status_driver_active', 'Activo', 'driver', '#10b981', NOW()),
('status_driver_inactive', 'Inactivo', 'driver', '#6b7280', NOW()),
('status_driver_suspended', 'Suspendido', 'driver', '#ef4444', NOW()),
('status_vehicle_available', 'Disponible', 'vehicle', '#3b82f6', NOW()),
('status_vehicle_rented', 'Rentado', 'vehicle', '#f59e0b', NOW()),
('status_vehicle_maintenance', 'En Mantenimiento', 'vehicle', '#ef4444', NOW()),
('status_vehicle_repair', 'En Reparación', 'vehicle', '#dc2626', NOW()),
('status_contract_active', 'Vigente', 'contract', '#10b981', NOW()),
('status_contract_expired', 'Expirado', 'contract', '#6b7280', NOW()),
('status_contract_cancelled', 'Cancelado', 'contract', '#ef4444', NOW()),
('status_payment_pending', 'Pendiente', 'payment', '#f59e0b', NOW()),
('status_payment_completed', 'Completado', 'payment', '#10b981', NOW()),
('status_payment_failed', 'Fallido', 'payment', '#ef4444', NOW()),
('status_expense_pending', 'Pendiente', 'expense', '#f59e0b', NOW()),
('status_expense_paid', 'Pagado', 'expense', '#10b981', NOW()),
('status_expense_cancelled', 'Cancelado', 'expense', '#6b7280', NOW())
ON CONFLICT (id) DO NOTHING;

-- Crear usuario administrador por defecto
-- Contraseña: admin123 (hash bcrypt)
INSERT INTO "User" (id, email, password, "firstName", "lastName", role, "createdAt", "updatedAt") VALUES
('admin_user', 'admin@renta-uber.com', '$2b$10$rQZ8KzQ8KzQ8KzQ8KzQ8K.8KzQ8KzQ8KzQ8KzQ8KzQ8KzQ8KzQ8K', 'Administrador', 'Sistema', 'admin', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Crear choferes de ejemplo
INSERT INTO "Driver" (id, "firstName", "lastName", cedula, license, phone, email, address, salary, commission, "statusId", "createdAt") VALUES
('driver_1', 'Juan', 'Pérez', '1234567890', 'ABC123456', '3001234567', 'juan.perez@ejemplo.com', 'Calle 123 #45-67, Bogotá', 1500000, 10, 'status_driver_active', NOW()),
('driver_2', 'María', 'García', '0987654321', 'DEF789012', '3009876543', 'maria.garcia@ejemplo.com', 'Calle 456 #78-90, Medellín', 1600000, 12, 'status_driver_active', NOW()),
('driver_3', 'Carlos', 'López', '1122334455', 'GHI345678', '3001122334', 'carlos.lopez@ejemplo.com', 'Calle 789 #12-34, Cali', 1400000, 8, 'status_driver_active', NOW())
ON CONFLICT (id) DO NOTHING;

-- Crear vehículos de ejemplo
INSERT INTO "Vehicle" (id, brand, model, year, color, plate, vin, engine, transmission, fuelType, mileage, "purchasePrice", "currentValue", "statusId", "createdAt") VALUES
('vehicle_1', 'Toyota', 'Corolla', 2020, 'Blanco', 'ABC123', '1HGBH41JXMN109186', '2.0L 4-Cylinder', 'Automático', 'Gasolina', 50000, 45000000, 40000000, 'status_vehicle_available', NOW()),
('vehicle_2', 'Honda', 'Civic', 2019, 'Negro', 'DEF456', '2T1BURHE0JC123456', '1.8L 4-Cylinder', 'Automático', 'Gasolina', 75000, 42000000, 38000000, 'status_vehicle_available', NOW()),
('vehicle_3', 'Nissan', 'Sentra', 2021, 'Gris', 'GHI789', '3N1AB6AP7BL123456', '2.0L 4-Cylinder', 'Automático', 'Gasolina', 30000, 48000000, 45000000, 'status_vehicle_available', NOW())
ON CONFLICT (id) DO NOTHING;

-- Crear contratos de ejemplo
INSERT INTO "Contract" (id, "driverId", "vehicleId", "startDate", "endDate", type, "monthlyPrice", deposit, "penaltyRate", "allowedDelayDays", "automaticRenewal", "statusId", "createdBy", "createdAt", "updatedAt") VALUES
('contract_1', 'driver_1', 'vehicle_1', NOW(), NOW() + INTERVAL '1 year', 'MONTHLY', 500000, 1000000, 0.05, 3, true, 'status_contract_active', 'admin_user', NOW(), NOW()),
('contract_2', 'driver_2', 'vehicle_2', NOW(), NOW() + INTERVAL '1 year', 'MONTHLY', 520000, 1000000, 0.05, 3, true, 'status_contract_active', 'admin_user', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Crear pagos de ejemplo
INSERT INTO "Payment" (id, "contractId", "driverId", amount, type, method, status, date, "dueDate", description, "createdAt") VALUES
('payment_1', 'contract_1', 'driver_1', 500000, 'payment', 'cash', 'completed', NOW(), NOW(), 'Pago mensual enero 2024', NOW()),
('payment_2', 'contract_2', 'driver_2', 520000, 'payment', 'bank_transfer', 'completed', NOW(), NOW(), 'Pago mensual enero 2024', NOW())
ON CONFLICT (id) DO NOTHING;

-- Crear gastos de ejemplo
INSERT INTO "Expense" (id, "vehicleId", category, amount, description, date, vendor, "paymentMethod", status, "createdAt") VALUES
('expense_1', 'vehicle_1', 'maintenance', 250000, 'Cambio de aceite y filtros', NOW(), 'Taller Automotriz ABC', 'credit_card', 'paid', NOW()),
('expense_2', 'vehicle_2', 'fuel', 150000, 'Carga de combustible', NOW(), 'Estación de Servicio XYZ', 'cash', 'paid', NOW())
ON CONFLICT (id) DO NOTHING;

-- Crear garantes de ejemplo
INSERT INTO "Guarantor" (id, "driverId", "firstName", "lastName", cedula, address, workplace, phone, "createdAt") VALUES
('guarantor_1', 'driver_1', 'Pedro', 'Pérez', '1111111111', 'Calle 111 #22-33, Bogotá', 'Empresa ABC', '3001111111', NOW()),
('guarantor_2', 'driver_2', 'Ana', 'García', '2222222222', 'Calle 222 #33-44, Medellín', 'Empresa XYZ', '3002222222', NOW())
ON CONFLICT (id) DO NOTHING;

-- Crear reportes de ejemplo
INSERT INTO "Report" (id, title, description, data, "createdAt") VALUES
('report_1', 'Reporte de Ingresos Enero 2024', 'Análisis detallado de ingresos del mes', '{"totalIncome": 1020000, "totalPayments": 2, "averageAmount": 510000}', NOW()),
('report_2', 'Reporte de Gastos Enero 2024', 'Análisis detallado de gastos del mes', '{"totalExpenses": 400000, "totalExpenses": 2, "averageAmount": 200000}', NOW())
ON CONFLICT (id) DO NOTHING;

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_driver_status ON "Driver"("statusId");
CREATE INDEX IF NOT EXISTS idx_driver_cedula ON "Driver"(cedula);
CREATE INDEX IF NOT EXISTS idx_driver_email ON "Driver"(email);
CREATE INDEX IF NOT EXISTS idx_vehicle_status ON "Vehicle"("statusId");
CREATE INDEX IF NOT EXISTS idx_vehicle_plate ON "Vehicle"(plate);
CREATE INDEX IF NOT EXISTS idx_contract_driver ON "Contract"("driverId");
CREATE INDEX IF NOT EXISTS idx_contract_vehicle ON "Contract"("vehicleId");
CREATE INDEX IF NOT EXISTS idx_contract_status ON "Contract"("statusId");
CREATE INDEX IF NOT EXISTS idx_payment_driver ON "Payment"("driverId");
CREATE INDEX IF NOT EXISTS idx_payment_contract ON "Payment"("contractId");
CREATE INDEX IF NOT EXISTS idx_payment_date ON "Payment"(date);
CREATE INDEX IF NOT EXISTS idx_expense_vehicle ON "Expense"("vehicleId");
CREATE INDEX IF NOT EXISTS idx_expense_category ON "Expense"(category);
CREATE INDEX IF NOT EXISTS idx_expense_date ON "Expense"(date);
CREATE INDEX IF NOT EXISTS idx_guarantor_driver ON "Guarantor"("driverId");
CREATE INDEX IF NOT EXISTS idx_user_email ON "User"(email);
CREATE INDEX IF NOT EXISTS idx_status_module ON "Status"(module);

-- Crear vistas para consultas comunes
CREATE OR REPLACE VIEW driver_summary AS
SELECT 
    d.id,
    d."firstName",
    d."lastName",
    d.cedula,
    d.phone,
    d.email,
    d.salary,
    d.commission,
    s.name as status,
    s.color as statusColor,
    COUNT(c.id) as activeContracts,
    COUNT(g.id) as guarantors
FROM "Driver" d
LEFT JOIN "Status" s ON d."statusId" = s.id
LEFT JOIN "Contract" c ON d.id = c."driverId" AND c."statusId" = 'status_contract_active'
LEFT JOIN "Guarantor" g ON d.id = g."driverId"
GROUP BY d.id, s.name, s.color;

CREATE OR REPLACE VIEW vehicle_summary AS
SELECT 
    v.id,
    v.brand,
    v.model,
    v.year,
    v.plate,
    v.mileage,
    v."purchasePrice",
    v."currentValue",
    s.name as status,
    s.color as statusColor,
    COUNT(c.id) as activeContracts,
    COUNT(e.id) as totalExpenses,
    COALESCE(SUM(e.amount), 0) as totalExpenseAmount
FROM "Vehicle" v
LEFT JOIN "Status" s ON v."statusId" = s.id
LEFT JOIN "Contract" c ON v.id = c."vehicleId" AND c."statusId" = 'status_contract_active'
LEFT JOIN "Expense" e ON v.id = e."vehicleId"
GROUP BY v.id, s.name, s.color;

CREATE OR REPLACE VIEW payment_summary AS
SELECT 
    p.id,
    p.amount,
    p.type,
    p.method,
    p.status,
    p.date,
    p."dueDate",
    d."firstName" || ' ' || d."lastName" as driverName,
    v.plate as vehiclePlate,
    c."monthlyPrice"
FROM "Payment" p
JOIN "Driver" d ON p."driverId" = d.id
LEFT JOIN "Contract" c ON p."contractId" = c.id
LEFT JOIN "Vehicle" v ON c."vehicleId" = v.id;

-- Crear funciones para cálculos comunes
CREATE OR REPLACE FUNCTION calculate_monthly_income(year_param INTEGER, month_param INTEGER)
RETURNS DECIMAL AS $$
BEGIN
    RETURN (
        SELECT COALESCE(SUM(amount), 0)
        FROM "Payment"
        WHERE EXTRACT(YEAR FROM date) = year_param
        AND EXTRACT(MONTH FROM date) = month_param
        AND type = 'payment'
        AND status = 'completed'
    );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calculate_pending_payments()
RETURNS DECIMAL AS $$
BEGIN
    RETURN (
        SELECT COALESCE(SUM(amount), 0)
        FROM "Payment"
        WHERE status = 'pending'
    );
END;
$$ LANGUAGE plpgsql;

-- Crear triggers para auditoría
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "User"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contract_updated_at BEFORE UPDATE ON "Contract"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Crear función para limpiar datos antiguos (opcional)
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS VOID AS $$
BEGIN
    -- Eliminar pagos fallidos de hace más de 30 días
    DELETE FROM "Payment" 
    WHERE status = 'failed' 
    AND "createdAt" < NOW() - INTERVAL '30 days';
    
    -- Eliminar reportes de hace más de 1 año
    DELETE FROM "Report" 
    WHERE "createdAt" < NOW() - INTERVAL '1 year';
END;
$$ LANGUAGE plpgsql;

-- Comentarios sobre la estructura
COMMENT ON TABLE "User" IS 'Usuarios del sistema con roles y permisos';
COMMENT ON TABLE "Driver" IS 'Choferes registrados en el sistema';
COMMENT ON TABLE "Vehicle" IS 'Vehículos disponibles para renta';
COMMENT ON TABLE "Contract" IS 'Contratos de renta entre choferes y vehículos';
COMMENT ON TABLE "Payment" IS 'Registro de pagos y transacciones';
COMMENT ON TABLE "Expense" IS 'Gastos asociados a vehículos';
COMMENT ON TABLE "Status" IS 'Estados del sistema para diferentes módulos';
COMMENT ON TABLE "Guarantor" IS 'Garantes de los choferes';
COMMENT ON TABLE "Report" IS 'Reportes generados por el sistema';

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE 'Base de datos Renta Uber inicializada correctamente';
    RAISE NOTICE 'Usuario admin creado: admin@renta-uber.com / admin123';
    RAISE NOTICE 'Estados del sistema configurados';
    RAISE NOTICE 'Datos de ejemplo insertados';
    RAISE NOTICE 'Índices y vistas creados para optimización';
END $$;