@echo off
echo ========================================
echo    INICIANDO SISTEMA RENTA UBER
echo ========================================
echo.

echo Iniciando servidor backend...
start "Backend" cmd /k "node test-server.cjs"

echo Esperando 3 segundos...
timeout /t 3 /nobreak >nul

echo Iniciando frontend...
start "Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo    SISTEMA INICIADO
echo ========================================
echo.
echo 🌐 Frontend: http://localhost:5173 (o 5174)
echo 🔧 Backend:  http://localhost:3001
echo.
echo 🔑 Credenciales:
echo    Email: admin@rentauber.com
echo    Password: admin123
echo.
echo 📱 Abre el navegador y ve a la URL del frontend
echo.
pause 