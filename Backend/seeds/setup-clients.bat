@echo off
REM Colors are limited in Windows CMD - using simple formatting
cls
echo ========================================
echo Arohan InfoTech - Client Showcase Setup
echo ========================================
echo.

REM Seed the database
echo [1/2] Seeding test data...
echo.
cd /d "%~dp0\.."
call node seeds\brandAssetsSeed.js

if errorlevel 1 (
    echo.
    echo Warning: Error seeding database. Make sure MongoDB is running.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.

echo To start the development server:
echo.
echo Terminal 1 - Backend:
echo   cd Backend
echo   npm install  (if needed)
echo   npm start
echo.

echo Terminal 2 - Frontend:
echo   cd Frontend
echo   npm install  (if needed)
echo   npm run dev
echo.

echo Then visit:
echo   Portfolio: http://localhost:5173/portfolio
echo   Admin: http://localhost:5173/admin (login required)
echo.
echo ========================================

pause
