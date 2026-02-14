@echo off
REM 紫琪玩方块 - 开发环境启动脚本

echo ========================================
echo  紫琪玩方块 | Ziqi Tetris
echo  开发服务器启动中...
echo ========================================
echo.

cd /d "%~dp0.."
npm run dev
