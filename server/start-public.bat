@echo off
chcp 65001 >nul
echo ========================================
echo   AI PPT  - 云端同步（公网模式）
echo ========================================
echo.

cd /d "%~dp0"

if not exist "node_modules" (
    echo 安装依赖中...
    call npm install
)

echo 启动本地服务器...
start "AI-PPT-Server" /B node server.js

echo 等待服务器就绪...
timeout /t 3 >nul

echo.
echo 创建公网隧道（首次访问需验证密码，密码是您的外网 IP）...
echo ========================================
echo.
echo   本地: http://localhost:3000
echo.
npx localtunnel --port 3000
echo.
echo ========================================
echo 按任意键退出...
pause >nul
taskkill /F /FI "WINDOWTITLE eq AI-PPT-Server*" >nul 2>&1
