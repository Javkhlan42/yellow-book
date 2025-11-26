@echo off
echo Starting Yellow Book Application...
echo.
echo Starting API Server on http://localhost:3333...
start "Yellow Book API" cmd /k "cd /d "%~dp0" && npm run start:api"
timeout /t 5 /nobreak >nul
echo.
echo Starting Web Server on http://localhost:3000...
start "Yellow Book Web" cmd /k "cd /d "%~dp0" && npm run start:web"
echo.
echo ===================================
echo Servers are starting...
echo API: http://localhost:3333
echo Web: http://localhost:3000
echo ===================================
echo.
echo Press any key to open the browser...
pause >nul
start http://localhost:3000
