import pytest
from unittest.mock import MagicMock, patch
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from db import get_transactions

class TestDatabaseQueries:
    """Verify that database queries return the correct star-schema data structure."""

    @patch('db.get_db_connection')
    def test_get_transactions_returns_joined_data(self, mock_get_conn):
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_get_conn.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor
        
        # Mock a joined row result
        # Columns: id, date, description, amount, currency, category_id, normalized_description, 
        # flow_type, flow_sub_type, category, is_recurrent
        mock_columns = [
            'id', 'date', 'description', 'amount', 'currency', 'category_id', 
            'normalized_description', 'flow_type', 'flow_sub_type', 'category', 'is_recurrent'
        ]
        mock_cursor.description = [(col,) for col in mock_columns]
        
        mock_row = (
            1, '2026-01-15', 'Deliveroo', -45.08, 'CHF', 101, 
            'Deliveroo', 'expense', 'passive', 'dining_out', 0
        )
        mock_cursor.fetchall.return_value = [mock_row]

        result = get_transactions()

        assert len(result) == 1
        transaction = result[0]
        assert transaction['category'] == 'dining_out'
        assert transaction['flow_type'] == 'expense'
        assert transaction['normalized_description'] == 'Deliveroo'
        assert 'flow_sub_type' in transaction

    @patch('db.get_db_connection')
    def test_get_transactions_filtering_by_flow_type(self, mock_get_conn):
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_get_conn.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor
        
        mock_cursor.description = [('id',), ('flow_type',)]
        mock_cursor.fetchall.return_value = []

        # Test filtering
        get_transactions(flow_type='income')

        # Verify SQL contains flow_type filter
        last_query = mock_cursor.execute.call_args[0][0]
        assert "WHERE c.flow_type = %s" in last_query
        assert mock_cursor.execute.call_args[0][1] == ('income',)

    @patch('db.get_db_connection')
    def test_get_transactions_with_category_id_filter(self, mock_get_conn):
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_get_conn.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor
        
        mock_cursor.description = [('id',), ('category_id',)]
        mock_cursor.fetchall.return_value = []

        get_transactions(category_id=101)

        last_query = mock_cursor.execute.call_args[0][0]
        assert "t.category_id = %s" in last_query
        assert 101 in mock_cursor.execute.call_args[0][1]
