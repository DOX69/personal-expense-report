from fastapi.testclient import TestClient
from main import app
import sys
import os
import pytest

# Add parent directory to path to import main
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to Personal Expense Report API"}

def test_metrics_empty_db(monkeypatch):
    # Mock get_transactions to return an empty dataframe
    import pandas as pd
    def mock_get_transactions():
        return pd.DataFrame()
    
    monkeypatch.setattr("main.get_transactions", mock_get_transactions)
    
    response = client.get("/api/dashboard/metrics")
    assert response.status_code == 200
    assert response.json() == {
        "total_income": 0,
        "total_expense": 0,
        "net_cashflow": 0
    }
