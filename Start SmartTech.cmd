@echo off
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\start-smarttech.ps1"
echo.
echo SmartTech server stopped. Press any key to close this window.
pause >nul
