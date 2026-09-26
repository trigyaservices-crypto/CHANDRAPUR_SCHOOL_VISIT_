@echo off
echo ==========================================
echo Starting CHANDRAPUR SCHOOL VISIT Platform
echo ==========================================

IF NOT EXIST "node_modules" (
  echo Installing dependencies...
  call npm install
)

echo Building production package...
call npm run build

echo Serving application on http://localhost:8000 ...
call npm run start
