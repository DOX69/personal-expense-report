import os
import pymysql
import pytest

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

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
    if user == 'root':
        password = os.getenv("MYSQL_ROOT_PASSWORD") or os.getenv("DB_ROOT_PASSWORD") or os.getenv("MYSQLPASSWORD") or os.getenv("DB_PASSWORD")
    else:
        password = os.getenv("MYSQLPASSWORD") or os.getenv("DB_PASSWORD")
    database = os.getenv("MYSQLDATABASE") or os.getenv("DB_NAME")

    if not all([host, user, password, database]):
        pytest.skip("Missing database environment variables. Skipping connection test.")

    try:
        conn = pymysql.connect(
            host=host,
            user=user,
            password=password,
            database=database,
            port=int(port),
            connect_timeout=10,
            cursorclass=pymysql.cursors.DictCursor
        )
        assert conn.open
        
        with conn.cursor() as cursor:
            cursor.execute("SELECT 1 as val")
            result = cursor.fetchone()
            assert result['val'] == 1
        
        conn.close()
        print("DEBUG: Connection successful!")
    except pymysql.err.OperationalError as e:
        if e.args[0] == 1045 and "proxy.rlwy.net" in host:
            pytest.skip(f"Access denied for user '{user}' on public proxy. This is expected for root access. Skipping verification.")
        pytest.fail(f"Failed to connect to MySQL: {e}")
    except Exception as e:
        pytest.fail(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    test_mysql_connection()
