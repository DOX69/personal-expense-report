import sys
import os

# Add parent directory to path to import main
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from main import app
import pytest
import pandas as pd

# Set a fixed test API key for the environment
TEST_API_KEY = "test_secret_key"
os.environ["API_SECRET_KEY"] = TEST_API_KEY

# Reload main to ensure the API_KEY is set from our test env
import main
import importlib
importlib.reload(main)

client = TestClient(main.app)
HEADERS = {"X-API-Key": TEST_API_KEY}

def _mock_transactions_df():
    return pd.DataFrame({
        'date': pd.to_datetime(['2026-01-15', '2026-01-20', '2026-02-01']),
        'description': ['Deliveroo', 'Salaire', 'SBB CFF FFS'],
        'normalized_description': ['Deliveroo', 'Salaire', 'Sbb Cff Ffs'],
        'amount': [-45.08, 3500.00, -11.00],
        'currency': ['CHF', 'CHF', 'CHF'],
        'category': ['Food & Dining', 'Salary', 'Transport'],
        'flow_type': ['expense', 'income', 'expense'],
        'flow_sub_type': ['variable', 'active', 'variable'],
        'is_recurrent': [False, True, False],
        'type': ['Card', 'Transfer', 'Card']
    })

def test_read_main():
    response = client.get("/", headers=HEADERS)
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to Personal Expense Report API"}

def test_metrics_empty_db(monkeypatch):
    # Mock get_transactions to return an empty dataframe
    monkeypatch.setattr("main.get_transactions", lambda: pd.DataFrame())
    
    response = client.get("/api/dashboard/metrics", headers=HEADERS)
    assert response.status_code == 200
    assert response.json() == {
        "total_income": 0,
        "total_expense": 0,
        "net_cashflow": 0
    }

def test_metrics_with_data(monkeypatch):
    monkeypatch.setattr("main.get_transactions", _mock_transactions_df)

    response = client.get("/api/dashboard/metrics", headers=HEADERS)
    assert response.status_code == 200
    data = response.json()
    assert data["total_income"] == 3500.00
    assert data["total_expense"] == pytest.approx(-56.08, rel=1e-2)
    assert data["net_cashflow"] == pytest.approx(3443.92, rel=1e-2)

def test_metrics_with_date_filter(monkeypatch):
    monkeypatch.setattr("main.get_transactions", _mock_transactions_df)

    # Filter for January only
    response = client.get("/api/dashboard/metrics?start_date=2026-01-01&end_date=2026-01-31", headers=HEADERS)
    assert response.status_code == 200
    data = response.json()
    assert data["total_income"] == 3500.00
    assert data["total_expense"] == pytest.approx(-45.08, rel=1e-2) # Excludes the -11.00 from Feb
    assert data["net_cashflow"] == pytest.approx(3454.92, rel=1e-2)

def test_transactions_returns_formatted_records(monkeypatch):
    monkeypatch.setattr("main.get_transactions", _mock_transactions_df)

    response = client.get("/api/transactions", headers=HEADERS)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3
    assert data[0]['date'] == '2026-01-15'
    assert data[0]['description'] == 'Deliveroo'

def test_transactions_with_filters(monkeypatch):
    monkeypatch.setattr("main.get_transactions", _mock_transactions_df)

    # Filter by category
    response = client.get("/api/transactions?category=Food%20%26%20Dining", headers=HEADERS)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]['description'] == 'Deliveroo'

    # Filter by search term
    response = client.get("/api/transactions?search=Salaire", headers=HEADERS)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]['amount'] == 3500.00
    
    # Filter by date range
    response = client.get("/api/transactions?start_date=2026-02-01&end_date=2026-02-28", headers=HEADERS)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]['description'] == 'SBB CFF FFS'

def test_transactions_empty_db(monkeypatch):
    monkeypatch.setattr("main.get_transactions", lambda: pd.DataFrame())

    response = client.get("/api/transactions", headers=HEADERS)
    assert response.status_code == 200
    assert response.json() == []

def test_sankey_empty_db(monkeypatch):
    monkeypatch.setattr("main.get_transactions", lambda: pd.DataFrame())

    response = client.get("/api/dashboard/sankey", headers=HEADERS)
    assert response.status_code == 200
    data = response.json()
    assert data == {"nodes": [], "links": []}

def test_sankey_returns_unidirectional_data(monkeypatch):
    monkeypatch.setattr("main.get_transactions", _mock_transactions_df)

    response = client.get("/api/dashboard/sankey", headers=HEADERS)
    assert response.status_code == 200
    data = response.json()

    node_names = [n['name'] for n in data['nodes']]
    assert "Current Account" in node_names

    # Verify strictly unidirectional: no node is both source and target
    sources = {link['source'] for link in data['links']}
    targets = {link['target'] for link in data['links']}
    central_idx = node_names.index("Current Account")

    # Only central node should appear in both source and target sets
    shared = sources & targets
    assert shared == {central_idx}, f"Only 'Current Account' should be shared, but found: {shared}"

def test_sankey_with_date_filter(monkeypatch):
    monkeypatch.setattr("main.get_transactions", _mock_transactions_df)

    response = client.get("/api/dashboard/sankey?start_date=2026-01-01&end_date=2026-01-31", headers=HEADERS)
    assert response.status_code == 200
    data = response.json()
    
    node_names = [n['name'] for n in data['nodes']]
    assert "Food & Dining (Expense)" in node_names
    assert "Transport (Expense)" not in node_names # February item should be excluded

def test_unauthorized_access():
    """Verify that requests without a valid API key are rejected with 401"""
    # Test without header
    response = client.get("/")
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid or missing API Key"

    # Test with invalid header
    response = client.get("/", headers={"X-API-Key": "wrong_key"})
    assert response.status_code == 401


