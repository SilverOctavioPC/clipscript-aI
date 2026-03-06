@echo off
echo ===================================================
echo        Deteniendo servidores de ClipScript AI
echo ===================================================

echo.
echo [1/2] Deteniendo el Backend (Python/Uvicorn)...
taskkill /F /IM python.exe /T >nul 2>&1
if !errorlevel! equ 0 (
    echo El backend ha sido detenido.
) else (
    echo No se encontro un backend activo o ya estaba detenido.
)

echo.
echo [2/2] Deteniendo el Frontend (Node/Vite)...
taskkill /F /IM node.exe /T >nul 2>&1
if !errorlevel! equ 0 (
    echo El frontend ha sido detenido.
) else (
    echo No se encontro un frontend activo o ya estaba detenido.
)

echo.
echo ===================================================
echo Todos los procesos relacionados han sido detenidos.
echo ===================================================
pause
