@echo off
title KUK MERU Website - Local Server
echo ============================================
echo   KUK MERU Website - Local Development
echo ============================================
echo.
echo Starting server at http://localhost:8765
echo Press Ctrl+C to stop the server
echo.
start http://localhost:8765
python -m http.server 8765
pause
