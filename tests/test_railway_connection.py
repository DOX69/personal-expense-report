import os
import mysql.connector
import pytest
from dotenv import load_dotenv

# Load local .env for local testing if present
load_dotenv()

def test_mysql_connection():
    """
    Tests the connection to the MySQL database using environment variables.
    Tries public endpoint first (for local testing via railway run), 
    then falls back to private endpoint (for production).
    """
    # Prefer public endpoint if we are running from outside Railway (e.g. railway run)
    host = os.getenv("DB_HOST_PUBLIC") or os.getenv("MYSQLHOST_PUBLIC") or os.getenv("MYSQLHOST") or os.getenv("DB_HOST")
    port = os.getenv("DB_PORT_PUBLIC") or os.getenv("MYSQLPORT_PUBLIC") or os.getenv("MYSQLPORT") or os.getenv("DB_PORT") or "3306"
    
    user = os.getenv("MYSQLUSER") or os.getenv("DB_USER")
    password = os.getenv("MYSQLPASSWORD") or os.getenv("DB_PASSWORD")
    database = os.getenv("MYSQLDATABASE") or os.getenv("DB_NAME")

    print(f"DEBUG: Attempting connection to host={host}, port={port}, user={user}, database={database}")

    if not all([host, user, password, database]):
        pytest.skip("Missing database environment variables. Skipping connection test.")

    try:
        conn = mysql.connector.connect(
            host=host,
            user=user,
            password=password,
            database=database,
            port=int(port),
            connect_timeout=10
        )
        assert conn.is_connected()
        
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        result = cursor.fetchone()
        assert result[0] == 1
        
        cursor.close()
        conn.close()
        print("DEBUG: Connection successful!")
    except Exception as e:
        pytest.fail(f"Failed to connect to MySQL: {e}")

if __name__ == "__main__":
    test_mysql_connection()
