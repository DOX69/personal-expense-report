from fastapi.testclient import TestClient
from main import app
import sys
import os
import pytest
import pandas as pd

# Add parent directory to path to import main
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

client = TestClient(app)

def _mock_transactions_df():
    return pd.DataFrame({
        'date': pd.to_datetime(['2026-01-15', '2026-01-20', '2026-02-01']),
        'description': ['Deliveroo', 'Salaire', 'SBB CFF FFS'],
        'amount': [-45.08, 3500.00, -11.00],
        'currency': ['CHF', 'CHF', 'CHF'],
        'category': ['Food & Dining', 'Transfer', 'Transport'],
    })

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to Personal Expense Report API"}

def test_metrics_empty_db(monkeypatch):
    # Mock get_transactions to return an empty dataframe
    monkeypatch.setattr("main.get_transactions", lambda: pd.DataFrame())
    
    response = client.get("/api/dashboard/metrics")
    assert response.status_code == 200
    assert response.json() == {
        "total_income": 0,
        "total_expense": 0,
        "net_cashflow": 0
    }

def test_metrics_with_data(monkeypatch):
    monkeypatch.setattr("main.get_transactions", _mock_transactions_df)

    response = client.get("/api/dashboard/metrics")
    assert response.status_code == 200
    data = response.json()
    assert data["total_income"] == 3500.00
    assert data["total_expense"] == pytest.approx(-56.08, rel=1e-2)
    assert data["net_cashflow"] == pytest.approx(3443.92, rel=1e-2)

def test_transactions_returns_formatted_records(monkeypatch):
    monkeypatch.setattr("main.get_transactions", _mock_transactions_df)

    response = client.get("/api/transactions")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3
    assert data[0]['date'] == '2026-01-15'
    assert data[0]['description'] == 'Deliveroo'

def test_transactions_empty_db(monkeypatch):
    monkeypatch.setattr("main.get_transactions", lambda: pd.DataFrame())

    response = client.get("/api/transactions")
    assert response.status_code == 200
    assert response.json() == []

def test_sankey_empty_db(monkeypatch):
    monkeypatch.setattr("main.get_transactions", lambda: pd.DataFrame())

    response = client.get("/api/dashboard/sankey")
    assert response.status_code == 200
    data = response.json()
    assert data == {"nodes": [], "links": []}

def test_sankey_returns_unidirectional_data(monkeypatch):
    monkeypatch.setattr("main.get_transactions", _mock_transactions_df)

    response = client.get("/api/dashboard/sankey")
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

