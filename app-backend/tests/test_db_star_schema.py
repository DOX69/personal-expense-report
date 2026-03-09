import pytest
import mysql.connector
import os
import sys
from unittest.mock import MagicMock, patch

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from db import init_db, get_db_connection

class TestDatabaseStarSchema:
    """Verify the database schema reflects the star-schema requirements."""

    @patch('db.get_db_connection')
    def test_init_db_creates_dim_categories(self, mock_get_conn):
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_get_conn.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor

        init_db()

        # Verify CREATE TABLE for dim_categories was called
        calls = [call[0][0] for call in mock_cursor.execute.call_args_list]
        assert any("CREATE TABLE IF NOT EXISTS dim_categories" in s for s in calls)
        assert any("id INT PRIMARY KEY" in s for s in calls)
        assert any("flow_type VARCHAR" in s for s in calls)

    @patch('db.get_db_connection')
    def test_init_db_adds_columns_to_transactions(self, mock_get_conn):
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_get_conn.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor

        init_db()

        # Verify columns were added or table created with them
        calls = [call[0][0] for call in mock_cursor.execute.call_args_list]
        
        # Either the CREATE TABLE or an ALTER TABLE should mention the new columns
        found_id_col = any("category_id" in s for s in calls)
        found_norm_desc = any("normalized_description" in s for s in calls)
        
        assert found_id_col, "category_id column not found in schema initiation"
        assert found_norm_desc, "normalized_description column not found in schema initiation"

    @patch('db.get_db_connection')
    def test_init_db_seeds_categories(self, mock_get_conn):
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_get_conn.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor
        
        # Mock that dim_categories is empty
        mock_cursor.fetchone.return_value = (0,)

        init_db()

        # Verify INSERT INTO dim_categories was called
        exec_calls = [call[0][0] for call in mock_cursor.execute.call_args_list]
        execmany_calls = [call[0][0] for call in mock_cursor.executemany.call_args_list]
        all_calls = exec_calls + execmany_calls
        
        assert any("INSERT INTO dim_categories" in s or "INSERT IGNORE INTO dim_categories" in s for s in all_calls)
