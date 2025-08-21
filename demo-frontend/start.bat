@echo off
echo ========================================
echo    SISTEMA RENTA UBER - INICIANDO
echo ========================================
echo.

echo 🚀 Iniciando servidor backend...
start cmd /k "node test-server.js"

echo.
echo ⏳ Esperando 3 segundos para que el backend inicie...
timeout /t 3 /nobreak > nul

echo.
echo 🌐 Iniciando frontend...
start cmd /k "npm run dev"

echo.
echo ========================================
echo    SISTEMAS INICIADOS EXITOSAMENTE
echo ========================================
echo.
echo 📊 Frontend: http://localhost:5173
echo 🔧 Backend:  http://localhost:3001
echo.
echo 📝 Credenciales de prueba:
echo    Email: admin@example.com
echo    Password: admin123
echo.
echo ✅ Presiona cualquier tecla para cerrar esta ventana...
pause > nul 