import unittest
from unittest.mock import patch, MagicMock
import pandas as pd
import sys
import os
sys.path.append(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'app-backend'))
from db import init_db, save_transactions, get_transactions

class TestDBConsole(unittest.TestCase):

    @patch('db.get_db_connection')
    def test_init_db_success(self, mock_get_conn):
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_get_conn.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor

        init_db()

        # Verify dim_categories and transactions tables are created
        execute_calls = [call[0][0] for call in mock_cursor.execute.call_args_list]
        self.assertTrue(any("CREATE TABLE IF NOT EXISTS dim_categories" in sql for sql in execute_calls))
        self.assertTrue(any("CREATE TABLE IF NOT EXISTS transactions" in sql for sql in execute_calls))

        mock_conn.commit.assert_called()
        self.assertEqual(mock_cursor.close.call_count, 2)
        mock_conn.close.assert_called_once()

    @patch('db.get_db_connection')
    def test_save_transactions_success(self, mock_get_conn):
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_get_conn.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor

        data = {
            'start_date': [pd.to_datetime('2023-01-01 12:00:00')],
            'description': ['Test'],
            'amount': [100.0],
            'currency': ['EUR'],
            'category_id': [21],
            'type': ['Card']
        }
        df = pd.DataFrame(data)

        result = save_transactions(df)

        self.assertTrue(result)
        mock_cursor.executemany.assert_called_once()
        self.assertTrue("INSERT INTO transactions" in mock_cursor.executemany.call_args[0][0])
        self.assertTrue("category_id" in mock_cursor.executemany.call_args[0][0])
        mock_conn.commit.assert_called_once()

    @patch('db.get_db_connection')
    def test_get_transactions_success(self, mock_get_conn):
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_get_conn.return_value = mock_conn
        
        with patch('pandas.read_sql') as mock_read_sql:
            expected_df = pd.DataFrame({'date': [], 'amount': [], 'currency': [], 'category': []})
            mock_read_sql.return_value = expected_df
            
            result_df = get_transactions()
            
            self.assertTrue(result_df.empty)
            mock_read_sql.assert_called_once()

    @patch('db.get_db_connection')
    def test_save_transactions_failure(self, mock_get_conn):
        mock_get_conn.return_value = None
        df = pd.DataFrame({'col': []})
        result = save_transactions(df)
        self.assertFalse(result)

if __name__ == '__main__':
    unittest.main()
