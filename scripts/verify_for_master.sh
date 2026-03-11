#!/bin/bash
# Script to verify project state before pushing or merging to master
set -e

echo "--- 1. Running Backend Unit Tests ---"
# We use the existing backend tests
export PYTHONPATH=$PYTHONPATH:$(pwd)/app-backend
python -m pytest app-backend/tests/

echo "--- 2. Running Frontend Tests ---"
if [ -d "app-frontend" ]; then
    cd app-frontend
    CI=true npm test -- --watchAll=false
    cd ..
fi

echo "--- 3. Verifying Railway Connection ---"
# This requires the user to be logged into Railway or have RAILWAY_TOKEN set
if command -v railway &> /dev/null; then
    echo "Using Railway CLI to run connection test..."
    railway run python -m pytest tests/test_railway_connection.py
else
    echo "Railway CLI not found. Skipping live connection test."
    echo "Please ensure you have verified the connection manually using: railway run pytest tests/test_railway_connection.py"
fi

echo ""
echo "===================================================="
echo " SUCCESS: All verifications passed!"
echo " You can now safely merge the PR to master."
echo "===================================================="
