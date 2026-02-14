@echo off
REM 紫琪玩方块 - 生产构建脚本

echo ========================================
echo  紫琪玩方块 | Ziqi Tetris
echo  开始构建生产版本...
echo ========================================
echo.

cd /d "%~dp0.."

echo [1/2] 运行类型检查...
call npx tsc --noEmit
if %errorlevel% neq 0 (
    echo 类型检查失败！
    exit /b 1
)

echo [2/2] 构建项目...
call npm run build
if %errorlevel% neq 0 (
    echo 构建失败！
    exit /b 1
)

echo.
echo ========================================
echo  构建成功！
echo  使用 'npm start' 启动生产服务器
echo ========================================
