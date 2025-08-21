@echo off
echo ========================================
echo    RENTA UBER - SERVIDOR POSTGRESQL
echo ========================================
echo.
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5174
echo Health Check: http://localhost:3001/api/health
echo.
echo Credenciales:
echo Email: admin@renta-uber.com
echo Password: admin123
echo.
echo ========================================
echo    VERIFICANDO CONFIGURACION
echo ========================================
echo.

REM Verificar si existe el archivo .env
if not exist .env (
    echo ERROR: Archivo .env no encontrado
    echo.
    echo Ejecuta primero: setup-postgres.bat
    echo.
    pause
    exit /b 1
)

REM Verificar si PostgreSQL esta instalado
echo Verificando PostgreSQL...
pg_config --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: PostgreSQL no esta instalado
    echo.
    echo Para instalar PostgreSQL:
    echo 1. Ve a https://www.postgresql.org/download/
    echo 2. Descarga e instala PostgreSQL
    echo 3. Durante la instalacion, anota la contraseña del usuario 'postgres'
    echo.
    pause
    exit /b 1
)

echo PostgreSQL encontrado!
echo.

REM Instalar dependencias si es necesario
if not exist node_modules (
    echo Instalando dependencias...
    npm install
    echo.
)

REM Generar cliente de Prisma
echo Generando cliente de Prisma...
npx prisma generate
echo.

REM Ejecutar migraciones
echo Ejecutando migraciones...
npx prisma migrate dev
echo.

REM Iniciar servidor
echo Iniciando servidor con PostgreSQL...
echo.
npx ts-node src/server-with-db.ts
pause 