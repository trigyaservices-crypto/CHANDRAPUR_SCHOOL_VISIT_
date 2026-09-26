#!/bin/bash
set -e

echo "=========================================="
echo "Starting CHANDRAPUR SCHOOL VISIT Platform"
echo "=========================================="

if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

echo "Building production package..."
npm run build

echo "Serving application on http://localhost:8000 ..."
npm run start
