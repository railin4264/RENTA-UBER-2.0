#!/bin/bash

echo "🚀 Sistema de Renta Uber - Setup Automático"
echo "==========================================="

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Función para verificar comandos
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}❌ $1 no está instalado${NC}"
        return 1
    else
        echo -e "${GREEN}✅ $1 está instalado${NC}"
        return 0
    fi
}

# Verificar requisitos
echo -e "\n${YELLOW}📋 Verificando requisitos...${NC}"
check_command node
check_command npm
check_command git

# Preguntar tipo de base de datos
echo -e "\n${YELLOW}🗄️  ¿Qué base de datos deseas usar?${NC}"
echo "1) SQLite (Recomendado para desarrollo)"
echo "2) PostgreSQL (Para producción)"
read -p "Selecciona una opción (1 o 2): " db_choice

# Configurar Backend
echo -e "\n${YELLOW}⚙️  Configurando Backend...${NC}"
cd renta-uber-backend

# Instalar dependencias
echo "📦 Instalando dependencias del backend..."
npm install

# Configurar .env si no existe
if [ ! -f .env ]; then
    echo "📝 Creando archivo .env..."
    cp env.example .env
    
    # Generar JWT secrets aleatorios
    JWT_SECRET=$(openssl rand -base64 32)
    JWT_REFRESH_SECRET=$(openssl rand -base64 32)
    
    # Actualizar .env con secrets seguros
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/JWT_SECRET=.*/JWT_SECRET=\"$JWT_SECRET\"/" .env
        sed -i '' "s/JWT_REFRESH_SECRET=.*/JWT_REFRESH_SECRET=\"$JWT_REFRESH_SECRET\"/" .env
    else
        # Linux
        sed -i "s/JWT_SECRET=.*/JWT_SECRET=\"$JWT_SECRET\"/" .env
        sed -i "s/JWT_REFRESH_SECRET=.*/JWT_REFRESH_SECRET=\"$JWT_REFRESH_SECRET\"/" .env
    fi
    
    echo -e "${GREEN}✅ Archivo .env creado con secrets seguros${NC}"
fi

# Configurar base de datos
if [ "$db_choice" = "1" ]; then
    echo "🗄️  Configurando SQLite..."
    # Cambiar a SQLite en .env
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' 's|DATABASE_URL=.*|DATABASE_URL="file:./dev.db"|' .env
    else
        sed -i 's|DATABASE_URL=.*|DATABASE_URL="file:./dev.db"|' .env
    fi
    
    # Usar schema de SQLite
    cp prisma/schema.sqlite.prisma prisma/schema.prisma
else
    echo "🐘 Configurando PostgreSQL..."
    read -p "Ingresa el DATABASE_URL de PostgreSQL: " db_url
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s|DATABASE_URL=.*|DATABASE_URL=\"$db_url\"|" .env
    else
        sed -i "s|DATABASE_URL=.*|DATABASE_URL=\"$db_url\"|" .env
    fi
fi

# Crear directorios necesarios
echo "📁 Creando directorios..."
mkdir -p uploads/drivers/photos
mkdir -p uploads/drivers/documents
mkdir -p uploads/vehicles/photos
mkdir -p uploads/receipts

# Configurar base de datos
echo "🗄️  Configurando base de datos..."
npm run prisma:generate
npm run prisma:push

# Sembrar datos
read -p "¿Deseas cargar datos de prueba? (s/n): " seed_choice
if [ "$seed_choice" = "s" ]; then
    echo "🌱 Sembrando datos de prueba..."
    npm run prisma:seed
fi

# Configurar Frontend
echo -e "\n${YELLOW}⚙️  Configurando Frontend...${NC}"
cd ../demo-frontend

# Instalar dependencias
echo "📦 Instalando dependencias del frontend..."
npm install

# Crear .env si no existe
if [ ! -f .env ]; then
    echo "📝 Creando archivo .env del frontend..."
    echo "VITE_API_URL=http://localhost:3001/api" > .env
    echo -e "${GREEN}✅ Archivo .env del frontend creado${NC}"
fi

# Resumen
echo -e "\n${GREEN}✨ ¡Configuración completada!${NC}"
echo -e "\n${YELLOW}📋 Resumen:${NC}"
echo "- Backend configurado en: renta-uber-backend/"
echo "- Frontend configurado en: demo-frontend/"
echo "- Base de datos: $([ "$db_choice" = "1" ] && echo "SQLite" || echo "PostgreSQL")"
echo -e "\n${YELLOW}🚀 Para iniciar la aplicación:${NC}"
echo -e "\n${GREEN}Opción 1 - Dos terminales:${NC}"
echo "Terminal 1: cd renta-uber-backend && npm run dev"
echo "Terminal 2: cd demo-frontend && npm run dev"
echo -e "\n${GREEN}Opción 2 - Script unificado:${NC}"
echo "cd demo-frontend && ./start-all.sh"
echo -e "\n${YELLOW}📱 Acceso:${NC}"
echo "Frontend: http://localhost:5173"
echo "Backend API: http://localhost:3001/api"
echo -e "\n${YELLOW}🔑 Credenciales de demo:${NC}"
echo "Admin: admin@renta-uber.com / admin123"
echo "Usuario: user@renta-uber.com / user123"
echo -e "\n${GREEN}¡Listo para usar! 🎉${NC}"