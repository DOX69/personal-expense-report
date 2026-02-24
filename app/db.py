import mysql.connector
import os
import pandas as pd
import time
from typing import List, Dict, Optional

def get_db_connection():
    """Establishes a connection to the MySQL database."""
    try:
        connection = mysql.connector.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            user=os.getenv('DB_USER', 'user'),
            password=os.getenv('DB_PASSWORD', 'password'),
            database=os.getenv('DB_NAME', 'expense_report')
        )
        return connection
    except mysql.connector.Error as err:
        print(f"Error connecting to database: {err}")
        return None

def init_db():
    """Initializes the database table if it does not exist."""
    # Retry logic for container startup
    max_retries = 10
    for i in range(max_retries):
        conn = get_db_connection()
        if conn:
            try:
                cursor = conn.cursor()
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS transactions (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        start_date DATETIME NOT NULL,
                        description VARCHAR(500) NOT NULL,
                        amount FLOAT NOT NULL,
                        currency VARCHAR(10) NOT NULL,
                        category VARCHAR(255) NOT NULL,
                        type VARCHAR(255),
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        UNIQUE KEY idx_txn (start_date, description(255))
                    )
                """)
                conn.commit()
                cursor.close()
                conn.close()
                print("Database initialized successfully.")
                return
            except mysql.connector.Error as err:
                print(f"Error initializing database: {err}")
                return
        print(f"Database not ready, retrying ({i+1}/{max_retries})...")
        time.sleep(2)

def save_transactions(df: pd.DataFrame) -> bool:
    """Saves a dataframe of transactions to the database."""
    conn = get_db_connection()
    if not conn:
        return False
    
    try:
        cursor = conn.cursor()
        query = """
            INSERT INTO transactions (start_date, description, amount, currency, category, type) 
            VALUES (%s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE 
            amount = VALUES(amount), 
            currency = VALUES(currency), 
            category = VALUES(category),
            type = VALUES(type)
        """
        
        # Prepare data
        data = []
        for _, row in df.iterrows():
            data.append((
                row['start_date'].to_pydatetime() if pd.notna(row['start_date']) else None,
                str(row['description']),
                float(row['amount']),
                str(row['currency']),
                str(row['category']),
                str(row['type']) if 'type' in row and pd.notna(row['type']) else None
            ))
            
        cursor.executemany(query, data)
        conn.commit()
        cursor.close()
        conn.close()
        return True
    except mysql.connector.Error as err:
        print(f"Error saving transactions: {err}")
        if conn:
            conn.close()
        return False

def get_transactions() -> pd.DataFrame:
    """Retrieves all transactions from the database."""
    conn = get_db_connection()
    if not conn:
        return pd.DataFrame()
    
    try:
        query = "SELECT start_date as date, description, amount, currency, category, type FROM transactions ORDER BY start_date DESC"
        df = pd.read_sql(query, conn)
        conn.close()
        return df
    except Exception as err:
        print(f"Error retrieving transactions: {err}")
        if conn:
            conn.close()
        return pd.DataFrame()
