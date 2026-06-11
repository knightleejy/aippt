@echo off
chcp 65001 >nul
echo ========================================
echo   AI PPT 高效制作与修改 - 云端同步版
echo ========================================
echo.

cd /d "%~dp0"

echo [1/2] 检查依赖...
if not exist "node_modules" (
    echo 安装依赖中...
    call npm install
)

echo [2/2] 启动服务器...
echo.
echo   本地访问: http://localhost:3000
echo.
echo   如需公网共享，请运行 start-public.bat
echo.
echo   按 Ctrl+C 停止服务器
echo ========================================
echo.

node server.js
pause
