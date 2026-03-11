import sys
import os
import pytest
from fastapi.testclient import TestClient

# Add parent directory to path to import main
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app

import importlib
import main

def test_cors_origin_from_env(monkeypatch):
    # Set the environment variable
    test_origin = "https://my-railway-app.up.railway.app"
    monkeypatch.setenv("ALLOWED_ORIGINS", test_origin)
    
    # Reload the main module to re-initialize the app with the new environment variable
    importlib.reload(main)
    from main import app
    
    client = TestClient(app)
    response = client.get("/", headers={"Origin": test_origin})
    
    assert response.headers.get("access-control-allow-origin") == test_origin

def test_cors_default_origin(monkeypatch):
    # Ensure ALLOWED_ORIGINS is not set
    monkeypatch.delenv("ALLOWED_ORIGINS", raising=False)
    
    # Reload the main module to pick up the default
    importlib.reload(main)
    from main import app
    
    client = TestClient(app)
    default_origin = "http://localhost:3000"
    response = client.get("/", headers={"Origin": default_origin})
    
    assert response.headers.get("access-control-allow-origin") == default_origin
