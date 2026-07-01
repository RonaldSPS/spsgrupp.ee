@echo off
taskkill /f /im node.exe 2>nul
cd /d "D:\WORKS\SPS\2026AprillWeb\AprilBuild"
start "" npm run dev
timeout /t 6 /nobreak >nul
start "" http://localhost:3000
