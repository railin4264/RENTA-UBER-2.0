#!/bin/bash

echo "🚀 Iniciando Sistema Renta Uber..."
echo "=================================="

# Función para verificar si un puerto está en uso
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Función para esperar a que un servicio esté disponible
wait_for_service() {
    local url=$1
    local name=$2
    local max_attempts=30
    local attempt=1
    
    echo "⏳ Esperando a que $name esté disponible..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" >/dev/null 2>&1; then
            echo "✅ $name está funcionando"
            return 0
        fi
        
        echo "   Intento $attempt/$max_attempts..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo "❌ $name no responde después de $max_attempts intentos"
    return 1
}

# Verificar dependencias
echo "📦 Verificando dependencias..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado"
    exit 1
fi

echo "✅ Dependencias verificadas"

# Iniciar Backend
echo ""
echo "🔧 Iniciando Backend..."
cd renta-uber-backend

if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias del backend..."
    npm install
fi

echo "🚀 Iniciando servidor backend..."
npx ts-node server-simple.ts &
BACKEND_PID=$!

# Esperar a que el backend esté disponible
wait_for_service "http://localhost:3001/health" "Backend"

if [ $? -ne 0 ]; then
    echo "❌ Error iniciando el backend"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Iniciar Frontend Demo
echo ""
echo "🌐 Iniciando Frontend Demo..."
cd ../demo-frontend

if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias del frontend..."
    npm install
fi

echo "🚀 Iniciando servidor frontend..."
npm run dev &
FRONTEND_PID=$!

# Esperar a que el frontend esté disponible
wait_for_service "http://localhost:5174" "Frontend"

if [ $? -ne 0 ]; then
    echo "❌ Error iniciando el frontend"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 1
fi

# Mostrar información del sistema
echo ""
echo "🎉 ¡Sistema Renta Uber iniciado exitosamente!"
echo "============================================="
echo ""
echo "🔧 Backend API:"
echo "   URL: http://localhost:3001"
echo "   Health: http://localhost:3001/health"
echo "   Docs: http://localhost:3001/api"
echo ""
echo "🌐 Frontend Demo:"
echo "   URL: http://localhost:5174"
echo ""
echo "🔐 Credenciales de prueba:"
echo "   Email: admin@renta-uber.com"
echo "   Contraseña: admin123"
echo ""
echo "📋 Endpoints disponibles:"
echo "   GET  /api/dashboard     - Métricas del sistema"
echo "   GET  /api/drivers       - Lista de conductores"
echo "   GET  /api/vehicles      - Lista de vehículos"
echo "   GET  /api/payments      - Lista de pagos"
echo "   GET  /api/contracts     - Lista de contratos"
echo "   GET  /api/expenses      - Lista de gastos"
echo "   POST /api/auth/login    - Iniciar sesión"
echo ""
echo "💡 Para detener el sistema, presiona Ctrl+C"
echo ""

# Función para limpiar procesos al salir
cleanup() {
    echo ""
    echo "🛑 Deteniendo sistema..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo "✅ Sistema detenido"
    exit 0
}

# Capturar señal de interrupción
trap cleanup SIGINT

# Mantener el script ejecutándose
echo "🔄 Sistema ejecutándose... (Ctrl+C para detener)"
wait