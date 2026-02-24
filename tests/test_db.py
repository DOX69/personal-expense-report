import unittest
from unittest.mock import patch, MagicMock
import pandas as pd
from app.db import init_db, save_transactions, get_transactions

class TestDBConsole(unittest.TestCase):

    @patch('app.db.get_db_connection')
    def test_init_db_success(self, mock_get_conn):
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_get_conn.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor

        init_db()

        self.assertTrue(mock_cursor.execute.call_count >= 1)
        # Check if the CREATE TABLE logic executes
        create_sql = mock_cursor.execute.call_args_list[0][0][0]
        self.assertTrue("CREATE TABLE IF NOT EXISTS transactions" in create_sql)
        mock_conn.commit.assert_called_once()
        mock_cursor.close.assert_called_once()
        mock_conn.close.assert_called_once()

    @patch('app.db.get_db_connection')
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
            'category': ['Food'],
            'type': ['Card']
        }
        df = pd.DataFrame(data)

        result = save_transactions(df)

        self.assertTrue(result)
        mock_cursor.executemany.assert_called_once()
        self.assertTrue("INSERT INTO transactions" in mock_cursor.executemany.call_args[0][0])
        self.assertTrue("ON DUPLICATE KEY UPDATE" in mock_cursor.executemany.call_args[0][0])
        mock_conn.commit.assert_called_once()

    @patch('app.db.get_db_connection')
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

    @patch('app.db.get_db_connection')
    def test_save_transactions_failure(self, mock_get_conn):
        mock_get_conn.return_value = None
        df = pd.DataFrame({'col': []})
        result = save_transactions(df)
        self.assertFalse(result)

if __name__ == '__main__':
    unittest.main()
