@echo off
echo ========================================
echo    RECUPERAR CONTRASEÑA POSTGRESQL
echo ========================================
echo.
echo Este script te ayudara a recuperar tu contraseña de PostgreSQL
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

echo ========================================
echo    OPCIONES PARA RECUPERAR CONTRASEÑA
echo ========================================
echo.
echo Opcion 1 - Probar contraseñas comunes:
echo.
echo Intentando conectar con contraseñas comunes...
echo.

REM Lista de contraseñas comunes
set passwords=postgres admin password 123456 1234 admin123 root

for %%p in (%passwords%) do (
    echo Probando contraseña: %%p
    echo "SELECT 1;" | psql -U postgres -h localhost -p 5432 -d postgres -W %%p >nul 2>&1
    if !errorlevel! equ 0 (
        echo.
        echo ¡EXITO! Contraseña encontrada: %%p
        echo.
        echo Ahora puedes:
        echo 1. Editar el archivo .env
        echo 2. Cambiar TU_PASSWORD_AQUI por: %%p
        echo 3. Ejecutar: start-postgres.bat
        echo.
        pause
        exit /b 0
    )
)

echo.
echo Ninguna contraseña común funciono.
echo.

echo ========================================
echo    OPCIONES AVANZADAS
echo ========================================
echo.
echo Opcion 1 - Reiniciar servicio PostgreSQL:
echo 1. Abre CMD como administrador
echo 2. Ejecuta: net stop postgresql-x64-14
echo 3. Ejecuta: net start postgresql-x64-14
echo 4. Intenta conectar sin contraseña
echo.
echo Opcion 2 - Usar pgAdmin:
echo 1. Abre pgAdmin
echo 2. Conectate al servidor localhost
echo 3. Usuario: postgres
echo 4. Prueba contraseñas comunes
echo.
echo Opcion 3 - Reinstalar PostgreSQL:
echo 1. Desinstala desde Panel de Control
echo 2. Elimina: C:\Program Files\PostgreSQL
echo 3. Reinstala con nueva contraseña
echo.
echo Opcion 4 - Usar SQLite temporalmente:
echo 1. Cambia en schema.prisma: provider = "sqlite"
echo 2. Ejecuta: npx prisma migrate dev
echo 3. Usa el servidor simple: start-simple.bat
echo.
echo ========================================
echo    COMANDOS UTILES
echo ========================================
echo.
echo Para verificar conexion:
echo psql -U postgres -h localhost -p 5432 -d postgres
echo.
echo Para crear base de datos:
echo CREATE DATABASE renta_uber_db;
echo.
echo Para cambiar contraseña:
echo ALTER USER postgres PASSWORD 'nueva_contraseña';
echo.
pause 