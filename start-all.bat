@echo off
echo Starting Renta Uber Application...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd renta-uber-backend && node test-server.js"

echo Starting Frontend Server...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Servers are starting...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5174
echo.
echo Press any key to exit...
pause 