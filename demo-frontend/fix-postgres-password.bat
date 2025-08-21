@echo off
echo ========================================
echo    ARREGLANDO CONTRASEÑA POSTGRESQL
echo ========================================
echo.

echo 1. Verificando que PostgreSQL esté ejecutándose...
net start postgresql-x64-17

echo 2. Intentando conectar sin contraseña...
psql -U postgres -c "SELECT version();" 2>nul
if %errorlevel% equ 0 (
    echo ¡Conexión exitosa sin contraseña!
    goto :create_user
)

echo 3. Intentando conectar con contraseña común...
psql -U postgres -h localhost -c "SELECT version();" 2>nul
if %errorlevel% equ 0 (
    echo ¡Conexión exitosa con contraseña por defecto!
    goto :create_user
)

echo 4. Cambiando contraseña del usuario postgres...
echo ALTER USER postgres PASSWORD 'admin123'; | psql -U postgres -h localhost 2>nul
if %errorlevel% equ 0 (
    echo ¡Contraseña cambiada exitosamente!
    goto :create_user
)

echo 5. Intentando reset completo...
echo.
echo ========================================
echo    RESET COMPLETO DE POSTGRESQL
echo ========================================
echo.
echo Si nada funciona, necesitamos:
echo 1. Detener PostgreSQL
echo 2. Eliminar archivo pg_hba.conf
echo 3. Reiniciar PostgreSQL
echo.
echo ¿Quieres continuar con el reset completo? (S/N)
set /p choice=
if /i "%choice%"=="S" goto :reset_complete
goto :end

:create_user
echo.
echo 6. Creando usuario y base de datos...
psql -U postgres -h localhost -c "CREATE DATABASE renta_uber_db;" 2>nul
psql -U postgres -h localhost -c "CREATE USER renta_user WITH PASSWORD 'tu_nueva_clave_2024';" 2>nul
psql -U postgres -h localhost -c "GRANT ALL PRIVILEGES ON DATABASE renta_uber_db TO renta_user;" 2>nul

echo 7. Actualizando archivo .env...
cd renta-uber-backend
echo DATABASE_URL="postgresql://renta_user:tu_nueva_clave_2024@localhost:5432/renta_uber_db" > .env
echo JWT_SECRET="tu-clave-secreta-2024" >> .env
echo PORT=3001 >> .env

echo 8. Ejecutando migraciones...
npx prisma generate
npx prisma db push

echo.
echo ========================================
echo    ¡CONTRASEÑA ARREGLADA!
echo ========================================
echo Usuario postgres: admin123
echo Usuario renta_user: tu_nueva_clave_2024
echo Base de datos: renta_uber_db
echo.
goto :end

:reset_complete
echo.
echo Deteniendo PostgreSQL...
net stop postgresql-x64-17

echo Eliminando configuración de autenticación...
echo # TYPE  DATABASE        USER            ADDRESS                 METHOD > "C:\Program Files\PostgreSQL\17\data\pg_hba.conf"
echo local   all             all                                     trust >> "C:\Program Files\PostgreSQL\17\data\pg_hba.conf"
echo host    all             all             127.0.0.1/32            trust >> "C:\Program Files\PostgreSQL\17\data\pg_hba.conf"
echo host    all             all             ::1/128                 trust >> "C:\Program Files\PostgreSQL\17\data\pg_hba.conf"

echo Iniciando PostgreSQL...
net start postgresql-x64-17

echo Creando usuario y base de datos...
psql -U postgres -c "CREATE DATABASE renta_uber_db;"
psql -U postgres -c "CREATE USER renta_user WITH PASSWORD 'tu_nueva_clave_2024';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE renta_uber_db TO renta_user;"

echo Actualizando archivo .env...
cd renta-uber-backend
echo DATABASE_URL="postgresql://renta_user:tu_nueva_clave_2024@localhost:5432/renta_uber_db" > .env
echo JWT_SECRET="tu-clave-secreta-2024" >> .env
echo PORT=3001 >> .env

echo Ejecutando migraciones...
npx prisma generate
npx prisma db push

echo.
echo ========================================
echo    ¡RESET COMPLETO EXITOSO!
echo ========================================
echo PostgreSQL configurado sin contraseña
echo Usuario renta_user: tu_nueva_clave_2024
echo Base de datos: renta_uber_db
echo.

:end
pause 