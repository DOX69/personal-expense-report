import pytest
from unittest.mock import MagicMock, patch
import pandas as pd
import sys
import os

# Add parent directory to path to import db
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from db import get_transactions

class TestDatabaseQueries:
    """Verify that database queries return the correct star-schema data structure."""

    @patch('db.get_db_connection')
    def test_get_transactions_returns_joined_data(self, mock_get_conn):
        mock_conn = MagicMock()
        mock_get_conn.return_value = mock_conn
        
        # Mock pandas read_sql to return a dataframe with the expected columns
        # SELECT date, description, normalized_description, amount, currency, category, flow_type, flow_sub_type, is_recurrent, type
        mock_columns = [
            'date', 'description', 'normalized_description', 'amount', 'currency', 
            'category', 'flow_type', 'flow_sub_type', 'is_recurrent', 'type'
        ]
        mock_df = pd.DataFrame([
            ['2026-01-15', 'Deliveroo', 'Deliveroo', -45.08, 'CHF', 'dining_out', 'expense', 'variable', 0, 'Card']
        ], columns=mock_columns)
        
        with patch('pandas.read_sql', return_value=mock_df) as mock_read_sql:
            result = get_transactions()

            assert len(result) == 1
            assert result.iloc[0]['category'] == 'dining_out'
            assert result.iloc[0]['flow_type'] == 'expense'
            assert result.iloc[0]['normalized_description'] == 'Deliveroo'
            assert 'flow_sub_type' in result.columns
            mock_read_sql.assert_called_once()
            mock_conn.close.assert_called_once()
