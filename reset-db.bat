@echo off
echo ========================================
echo    RESET DE BASE DE DATOS POSTGRESQL
echo ========================================
echo.

echo 1. Deteniendo servicios...
taskkill /f /im postgres.exe 2>nul
taskkill /f /im pg_ctl.exe 2>nul

echo 2. Instalando PostgreSQL si no existe...
winget install PostgreSQL.PostgreSQL --accept-source-agreements --accept-package-agreements

echo 3. Iniciando PostgreSQL...
net start postgresql-x64-15

echo 4. Creando base de datos...
psql -U postgres -c "CREATE DATABASE renta_uber_db;" 2>nul
psql -U postgres -c "CREATE USER renta_user WITH PASSWORD 'tu_nueva_clave_2024';" 2>nul
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE renta_uber_db TO renta_user;" 2>nul

echo 5. Actualizando archivo .env...
cd renta-uber-backend
echo DATABASE_URL="postgresql://renta_user:tu_nueva_clave_2024@localhost:5432/renta_uber_db" > .env
echo JWT_SECRET="tu-clave-secreta-2024" >> .env
echo PORT=3001 >> .env

echo 6. Ejecutando migraciones...
npx prisma generate
npx prisma db push

echo.
echo ========================================
echo    ¡BASE DE DATOS RESETEADA!
echo ========================================
echo Usuario: renta_user
echo Contraseña: tu_nueva_clave_2024
echo Base de datos: renta_uber_db
echo.
pause 