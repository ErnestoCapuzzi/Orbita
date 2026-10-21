@echo off
cd /d "%~dp0"
echo ORBITA - Servidor local
echo Abri http://localhost:8000 en tu navegador.
echo Para detenerlo, presiona Ctrl+C.
py -m http.server 8000
pause
