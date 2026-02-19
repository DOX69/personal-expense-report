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

        mock_cursor.execute.assert_called_once()
        self.assertTrue("CREATE TABLE IF NOT EXISTS transactions" in mock_cursor.execute.call_args[0][0])
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
            'date': ['2023-01-01'],
            'montant': [100.0],
            'devise': ['EUR'],
            'categorie': ['Food']
        }
        df = pd.DataFrame(data)

        result = save_transactions(df)

        self.assertTrue(result)
        mock_cursor.executemany.assert_called_once()
        self.assertTrue("INSERT INTO transactions" in mock_cursor.executemany.call_args[0][0])
        mock_conn.commit.assert_called_once()

    @patch('app.db.get_db_connection')
    def test_get_transactions_success(self, mock_get_conn):
        mock_conn = MagicMock()
        mock_cursor = MagicMock() # Not used by read_sql directly usually, but good to mock
        mock_get_conn.return_value = mock_conn
        
        # pd.read_sql uses the connection. We can mock pd.read_sql instead to avoid DB implementation details of pandas
        with patch('pandas.read_sql') as mock_read_sql:
            expected_df = pd.DataFrame({'date': [], 'montant': [], 'devise': [], 'categorie': []})
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
