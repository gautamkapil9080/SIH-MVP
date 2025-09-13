@echo off
echo ======================================
echo   Nabha Telemedicine - Quick Start
echo ======================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo Choose the LTS version and restart this script.
    pause
    exit /b 1
)

echo ✅ Node.js is installed
echo.

REM Check if dependencies are installed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)

echo ✅ Dependencies are ready
echo.

echo 🚀 Starting development server...
echo The application will open at http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

npm start