@echo off
title AgyLens - Antigravity Chat Reader
echo Starting AgyLens...
cd /d "%~dp0"

start "" "http://localhost:5174/"
call npx vite --port 5174
pause
