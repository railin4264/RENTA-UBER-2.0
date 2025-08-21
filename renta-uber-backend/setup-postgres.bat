@echo off
echo ========================================
echo    CONFIGURACION DE POSTGRESQL
echo ========================================
echo.
echo Este script te ayudara a configurar PostgreSQL
echo.

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

REM Crear archivo .env si no existe
if not exist .env (
    echo Creando archivo .env...
    echo # Database - PostgreSQL > .env
    echo DATABASE_URL="postgresql://postgres:TU_PASSWORD_AQUI@localhost:5432/renta_uber_db" >> .env
    echo. >> .env
    echo # JWT >> .env
    echo JWT_SECRET="renta-uber-super-secret-jwt-key-2024" >> .env
    echo JWT_EXPIRES_IN="7d" >> .env
    echo. >> .env
    echo # Server >> .env
    echo PORT=3001 >> .env
    echo NODE_ENV=development >> .env
    echo. >> .env
    echo # Frontend URL for CORS >> .env
    echo FRONTEND_URL=http://localhost:5174 >> .env
    echo. >> .env
    echo # File Upload >> .env
    echo MAX_FILE_SIZE=5242880 >> .env
    echo UPLOAD_PATH=./uploads >> .env
    echo.
    echo Archivo .env creado!
    echo IMPORTANTE: Edita el archivo .env y cambia TU_PASSWORD_AQUI por tu contraseña de PostgreSQL
    echo.
)

echo ========================================
echo    PASOS PARA CONFIGURAR POSTGRESQL
echo ========================================
echo.
echo 1. Si no tienes PostgreSQL instalado:
echo    - Descarga desde: https://www.postgresql.org/download/
echo    - Instala con la contraseña que recuerdes
echo.
echo 2. Si ya tienes PostgreSQL instalado:
echo    - Abre pgAdmin o psql
echo    - Conectate con tu usuario y contraseña
echo.
echo 3. Crear la base de datos:
echo    - CREATE DATABASE renta_uber_db;
echo.
echo 4. Editar el archivo .env:
echo    - Cambia TU_PASSWORD_AQUI por tu contraseña real
echo.
echo 5. Ejecutar las migraciones:
echo    - npx prisma migrate dev
echo.
echo 6. Iniciar el servidor:
echo    - npm run dev
echo.
echo ========================================
echo    RECUPERAR CONTRASEÑA POSTGRESQL
echo ========================================
echo.
echo Si olvidaste tu contraseña de PostgreSQL:
echo.
echo Opcion 1 - Windows (Reiniciar contraseña):
echo 1. Abre CMD como administrador
echo 2. Ve al directorio de PostgreSQL (ej: C:\Program Files\PostgreSQL\14\bin)
echo 3. Ejecuta: psql -U postgres
echo 4. Si no funciona, reinicia el servicio:
echo    net stop postgresql-x64-14
echo    net start postgresql-x64-14
echo.
echo Opcion 2 - Reinstalar PostgreSQL:
echo 1. Desinstala PostgreSQL desde Panel de Control
echo 2. Elimina la carpeta: C:\Program Files\PostgreSQL
echo 3. Reinstala PostgreSQL con nueva contraseña
echo.
echo Opcion 3 - Usar contraseña por defecto:
echo - Intenta con: postgres, admin, password, 123456
echo.
pause 