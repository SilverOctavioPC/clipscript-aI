@echo off
echo ========================================================
echo   Instalador de Aceleracion GPU (PyTorch CUDA)
echo ========================================================
echo.
echo Activando el entorno virtual de Python...
cd backend
call venv\Scripts\activate.bat

echo.
echo Descargando e instalando PyTorch con soporte para NVIDIA...
echo (Esto pesa alrededor de 2.5 GB y puede tardar varios minutos segun tu internet)
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121

echo.
echo ========================================================
echo               ¡Instalacion Completada!
echo ========================================================
echo Podras cerrar esta ventana, correr de nuevo iniciar_servidores.bat y disfrutar.
pause
