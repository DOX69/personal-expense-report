import unittest
import os
try:
    from app.db import get_db_connection
except ImportError:
    # Fallback for local testing if PYTHONPATH is not set
    import sys
    sys.path.append(os.getcwd())
    if not os.path.exists('app'):
        # On windows symlink might not work easily, just use app-backend
        sys.path.append(os.path.join(os.getcwd(), 'app-backend'))
        from db import get_db_connection
    else:
        from app.db import get_db_connection

class TestCISetup(unittest.TestCase):
    def test_ci_environment(self):
        """Check if CI environment is detected."""
        self.assertEqual(os.getenv('GITHUB_ACTIONS'), 'true', "Not running in GitHub Actions CI")

    def test_database_connection_in_ci(self):
        """Check if database is reachable using CI settings."""
        # These should match the service container configuration in ci.yml
        conn = get_db_connection()
        self.assertIsNotNone(conn, "Could not connect to database in CI environment")
        if conn:
            conn.close()

if __name__ == '__main__':
    unittest.main()
