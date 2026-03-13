#!/bin/bash
# Script to verify project state before pushing or merging to master
set -e

# Load environment variables if .env.local exists (for local runs)
if [ -f "app-frontend/.env.local" ]; then
    echo "--- 0. Loading Environment Variables ---"
    # This is a simple way to load variables for the script
    # Caution: doesn't handle spaces or special characters well
    export $(grep -v '^#' app-frontend/.env.local | xargs)
fi

echo "--- 1. Running All Frontend Tests ---"
if [ -d "app-frontend" ]; then
    cd app-frontend
    # Run all tests in CI mode (non-interactive)
    CI=true npm test -- --watchAll=false
    
    echo "--- 1.1 Verifying CSV Import Integrity ---"
    npm test src/app/api/upload/__tests__/import.integration.test.ts -- --watchAll=false
    cd ..
else
    echo "ERROR: app-frontend directory not found!"
    exit 1
fi

echo "--- 2. Verifying Supabase Configuration ---"
# Check if Supabase variables are set
if [ -z "$SUPABASE_ANON_KEY" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "WARNING: Supabase environment variables are missing."
    echo "Please ensure SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY are set."
else
    echo "Supabase configuration variables are present."
fi

echo ""
echo "===================================================="
echo " SUCCESS: All verifications passed!"
echo " You can now safely merge the PR to master."
echo "===================================================="
