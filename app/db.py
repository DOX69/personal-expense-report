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
                        date DATE NOT NULL,
                        montant FLOAT NOT NULL,
                        devise VARCHAR(10) NOT NULL,
                        categorie VARCHAR(255) NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
        query = "INSERT INTO transactions (date, montant, devise, categorie) VALUES (%s, %s, %s, %s)"
        
        # Prepare data
        data = []
        for _, row in df.iterrows():
            data.append((
                row['date'],
                row['montant'],
                row['devise'],
                row['categorie']
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
        query = "SELECT date, montant, devise, categorie FROM transactions ORDER BY date DESC"
        df = pd.read_sql(query, conn)
        conn.close()
        return df
    except Exception as err:
        print(f"Error retrieving transactions: {err}")
        if conn:
            conn.close()
        return pd.DataFrame()
