@echo off
setlocal
cd /d "%~dp0"
title Sauce Demo - Shopify automation

echo.
echo  ===================================================
echo    Sauce Demo store - end-to-end tests
echo    Target: %BASE_URL%
echo  ===================================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo  [x] Node.js was not found. Install it from https://nodejs.org and try again.
  pause
  exit /b 1
)

if not exist "node_modules\@playwright\test" (
  echo  [1/3] Installing dependencies...
  call npm install || (echo  [x] npm install failed. & pause & exit /b 1)
) else (
  echo  [1/3] Dependencies already installed.
)

echo  [2/3] Making sure Chromium is installed...
call npx playwright install chromium || (echo  [x] Could not install Chromium. & pause & exit /b 1)

echo  [3/3] Running the tests against the live demo store...
echo.
call npx playwright test %*
set TEST_EXIT=%ERRORLEVEL%

if not exist "aurora-report\index.html" (
  echo  [x] No report was produced. Check the output above.
  pause
  exit /b 1
)

echo.
echo  Opening the report...
start "" "%~dp0aurora-report\index.html"
echo  Done. Exit code: %TEST_EXIT%   ^(0 = all tests passed^)
echo.
pause
endlocal
