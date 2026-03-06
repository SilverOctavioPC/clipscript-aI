@echo off
echo ===================================================
echo        Iniciando servidores de ClipScript AI
echo ===================================================

:: Iniciar el servidor Backend en una nueva ventana
echo [1/2] Levantando el Backend (FastAPI)...
start "ClipScript AI - Backend" cmd /k "cd backend && .\venv\Scripts\activate && uvicorn main:app --reload --port 8000"

:: Iniciar el servidor Frontend en una nueva ventana
echo [2/2] Levantando el Frontend (React/Vite)...
start "ClipScript AI - Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Los servidores se estan iniciando en nuevas ventanas.
echo Backend:   http://localhost:8000
echo Frontend:  http://localhost:5173
echo.
pause
