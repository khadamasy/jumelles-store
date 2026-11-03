@echo off
title Demarrage Jumelles Store
echo =======================================================
echo    LANCEMENT DE LA BOUTIQUE JUMELLES STORE DAKAR
echo =======================================================
echo.
echo 1/2 Demarrage du serveur Backend (API port 4000)...
start "Jumelles Store - Backend API" cmd /k "cd /d %~dp0backend && npm run dev"

echo 2/2 Demarrage du serveur Frontend (Vite port 3000)...
start "Jumelles Store - Frontend Vue3" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Lancement de la boutique dans votre navigateur...
timeout /t 3 >nul
start http://localhost:3000

echo.
echo =======================================================
echo  Site Client     : http://localhost:3000
echo  Espace Gerance  : http://localhost:3000/admin
echo =======================================================
