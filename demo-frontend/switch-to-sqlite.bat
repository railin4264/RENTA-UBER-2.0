@echo off
echo ========================================
echo    CAMBIANDO A SQLITE TEMPORALMENTE
echo ========================================
echo.

cd renta-uber-backend

echo 1. Actualizando schema.prisma para SQLite...
echo // This is your Prisma schema file, > prisma\schema.prisma
echo // learn more about it in the docs: https://pris.ly/d/prisma-schema >> prisma\schema.prisma
echo. >> prisma\schema.prisma
echo generator client { >> prisma\schema.prisma
echo   provider = "prisma-client-js" >> prisma\schema.prisma
echo } >> prisma\schema.prisma
echo. >> prisma\schema.prisma
echo datasource db { >> prisma\schema.prisma
echo   provider = "sqlite" >> prisma\schema.prisma
echo   url      = "file:./dev.db" >> prisma\schema.prisma
echo } >> prisma\schema.prisma
echo. >> prisma\schema.prisma
echo model User { >> prisma\schema.prisma
echo   id        Int      @id @default(autoincrement()) >> prisma\schema.prisma
echo   email     String   @unique >> prisma\schema.prisma
echo   password  String   >> prisma\schema.prisma
echo   name      String   >> prisma\schema.prisma
echo   role      String   @default("user") >> prisma\schema.prisma
echo   createdAt DateTime @default(now()) >> prisma\schema.prisma
echo   updatedAt DateTime @updatedAt >> prisma\schema.prisma
echo } >> prisma\schema.prisma

echo 2. Actualizando .env para SQLite...
echo DATABASE_URL="file:./dev.db" > .env
echo JWT_SECRET="tu-clave-secreta-2024" >> .env
echo PORT=3001 >> .env

echo 3. Generando cliente Prisma...
npx prisma generate

echo 4. Creando base de datos SQLite...
npx prisma db push

echo.
echo ========================================
echo    ¡CAMBIADO A SQLITE!
echo ========================================
echo Base de datos: dev.db (en la carpeta prisma)
echo No necesitas contraseña para SQLite
echo.
pause 