#!/bin/bash

echo "🚀 Iniciando Sistema de Renta Uber..."
echo "===================================="

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Verificar si los módulos están instalados
if [ ! -d "../renta-uber-backend/node_modules" ]; then
    echo -e "${RED}❌ Backend no está configurado. Ejecuta primero: ./setup.sh${NC}"
    exit 1
fi

if [ ! -d "node_modules" ]; then
    echo -e "${RED}❌ Frontend no está configurado. Ejecuta primero: ./setup.sh${NC}"
    exit 1
fi

# Función para matar procesos al salir
cleanup() {
    echo -e "\n${YELLOW}🛑 Deteniendo servidores...${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

# Configurar trap para limpiar al salir
trap cleanup EXIT INT TERM

# Iniciar Backend
echo -e "${YELLOW}🔧 Iniciando Backend...${NC}"
cd ../renta-uber-backend
npm run dev &
BACKEND_PID=$!
cd ../demo-frontend

# Esperar a que el backend esté listo
echo -e "${YELLOW}⏳ Esperando a que el backend esté listo...${NC}"
while ! curl -s http://localhost:3001 > /dev/null; do
    sleep 1
done
echo -e "${GREEN}✅ Backend listo en http://localhost:3001${NC}"

# Iniciar Frontend
echo -e "${YELLOW}🎨 Iniciando Frontend...${NC}"
npm run dev &
FRONTEND_PID=$!

# Mostrar información
echo -e "\n${GREEN}✨ ¡Aplicación iniciada!${NC}"
echo -e "\n${YELLOW}📱 URLs:${NC}"
echo "- Frontend: http://localhost:5173"
echo "- Backend API: http://localhost:3001/api"
echo -e "\n${YELLOW}🔑 Credenciales:${NC}"
echo "- Admin: admin@renta-uber.com / admin123"
echo "- Usuario: user@renta-uber.com / user123"
echo -e "\n${YELLOW}💡 Presiona Ctrl+C para detener los servidores${NC}\n"

# Mantener el script ejecutándose
wait