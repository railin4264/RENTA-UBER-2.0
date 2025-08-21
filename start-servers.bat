@echo off
echo ========================================
echo    SISTEMA DE RENTA UBER
echo ========================================
echo.

echo Iniciando servidor backend...
cd renta-uber-backend
start "Backend Server" cmd /k "npm run dev"
cd ..

echo.
echo Iniciando servidor frontend...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ========================================
echo Servidores iniciados:
echo - Backend: http://localhost:3001
echo - Frontend: http://localhost:5173
echo ========================================
echo.
echo Credenciales de prueba:
echo - Email: admin@renta-uber.com
echo - Password: admin123
echo ========================================
pause 