@echo off
setlocal
set PORT=%1
if "%PORT%"=="" set PORT=3000

cd /d %~dp0
where pnpm >nul 2>&1
if errorlevel 1 (
  echo pnpm is not installed. Install from https://pnpm.io/installation
  exit /b 1
)
start "skincubator-dev" cmd /c "pnpm dev -- -p %PORT% ^| type"
start http://localhost:%PORT%
echo Dev server starting on http://localhost:%PORT%
endlocal
