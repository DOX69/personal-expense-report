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
            port=int(os.getenv('DB_PORT', 3306)),
            user=os.getenv('DB_USER', 'user'),
            password=os.getenv('DB_PASSWORD', 'password'),
            database=os.getenv('DB_NAME', 'expense_report')
        )
        return connection
    except mysql.connector.Error as err:
        print(f"Error connecting to database: {err}")
        return None

try:
    from .data_processor import CATEGORY_SEED_DATA, categorize_transaction
except (ImportError, ValueError):
    from data_processor import CATEGORY_SEED_DATA, categorize_transaction

def migrate_existing_transactions(conn):
    """Re-categorizes all existing transactions after schema upgrade."""
    try:
        cursor = conn.cursor(dictionary=True)
        # Select rows that need re-categorization
        cursor.execute("SELECT id, description, amount FROM transactions WHERE category_id IS NULL")
        rows = cursor.fetchall()
        
        if not rows:
            return
            
        print(f"Migrating {len(rows)} transactions...")
        update_query = "UPDATE transactions SET category_id = %s WHERE id = %s"
        update_data = []
        for row in rows:
            cat_id = categorize_transaction(row)
            update_data.append((cat_id, row['id']))
            
        cursor.executemany(update_query, update_data)
        conn.commit()
        cursor.close()
        print("Migration completed.")
    except Exception as e:
        print(f"Error during migration: {e}")

def init_db():
    """Initializes the database table if it does not exist."""
    # Retry logic for container startup
    max_retries = 10
    for i in range(max_retries):
        conn = get_db_connection()
        if conn:
            try:
                cursor = conn.cursor()
                
                # 1. Create dim_categories table
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS dim_categories (
                        id INT PRIMARY KEY,
                        flow_type VARCHAR(50) NOT NULL,
                        flow_sub_type VARCHAR(50) NOT NULL,
                        category VARCHAR(255) NOT NULL,
                        is_recurrent BOOLEAN NOT NULL
                    )
                """)
                
                # 2. Seed/Update dim_categories
                seed_query = """
                    INSERT INTO dim_categories (id, flow_type, flow_sub_type, category, is_recurrent)
                    VALUES (%s, %s, %s, %s, %s)
                    ON DUPLICATE KEY UPDATE 
                        flow_type = VALUES(flow_type),
                        flow_sub_type = VALUES(flow_sub_type),
                        category = VALUES(category),
                        is_recurrent = VALUES(is_recurrent)
                """
                seed_data = [
                    (c['id'], c['flow_type'], c['flow_sub_type'], c['category'], c['is_recurrent'])
                    for c in CATEGORY_SEED_DATA
                ]
                cursor.executemany(seed_query, seed_data)
                
                # 3. Create transactions table (removed old 'category' column)
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS transactions (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        start_date DATETIME NOT NULL,
                        description VARCHAR(500) NOT NULL,
                        amount FLOAT NOT NULL,
                        currency VARCHAR(10) NOT NULL,
                        category_id INT,
                        type VARCHAR(255),
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        UNIQUE KEY idx_txn (start_date, description(255)),
                        CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES dim_categories(id)
                    )
                """)
                
                # 4. Migration: Add columns if table already exists but columns are missing
                cursor.execute("SHOW COLUMNS FROM transactions LIKE 'category_id'")
                if not cursor.fetchone():
                    cursor.execute("ALTER TABLE transactions ADD COLUMN category_id INT")
                    try:
                        cursor.execute("ALTER TABLE transactions ADD CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES dim_categories(id)")
                    except: pass # Might already exist if previous run partially failed

                # Remove legacy 'normalized_description' column if it exists
                cursor.execute("SHOW COLUMNS FROM transactions LIKE 'normalized_description'")
                if cursor.fetchone():
                    cursor.execute("ALTER TABLE transactions DROP COLUMN normalized_description")

                # Remove legacy 'category' column if it exists
                cursor.execute("SHOW COLUMNS FROM transactions LIKE 'category'")
                if cursor.fetchone():
                    cursor.execute("ALTER TABLE transactions DROP COLUMN category")

                conn.commit()
                
                # Perform content migration
                migrate_existing_transactions(conn)
                
                cursor.close()
                conn.close()
                print("Database initialized successfully.")
                return
            except mysql.connector.Error as err:
                print(f"Error initializing database: {err}")
                if conn: conn.close()
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
            INSERT INTO transactions (start_date, description, amount, currency, category_id, type) 
            VALUES (%s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE 
            amount = VALUES(amount), 
            currency = VALUES(currency), 
            category_id = VALUES(category_id),
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
                int(row['category_id']) if 'category_id' in row else None,
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
    """Retrieves all transactions from the database with category details."""
    conn = get_db_connection()
    if not conn:
        return pd.DataFrame()
    
    try:
        query = """
            SELECT 
                t.start_date as date, 
                t.description, 
                t.amount, 
                t.currency, 
                c.category,
                c.flow_type,
                c.flow_sub_type,
                c.is_recurrent,
                t.type
            FROM transactions t
            LEFT JOIN dim_categories c ON t.category_id = c.id
            ORDER BY t.start_date DESC
        """
        df = pd.read_sql(query, conn)
        conn.close()
        return df
    except Exception as err:
        print(f"Error retrieving transactions: {err}")
        if conn:
            conn.close()
        return pd.DataFrame()

def get_categories() -> List[Dict]:
    """Retrieves all available categories from the database."""
    conn = get_db_connection()
    if not conn:
        return []
    
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM dim_categories ORDER BY category ASC")
        categories = cursor.fetchall()
        cursor.close()
        conn.close()
        return categories
    except Exception as err:
        print(f"Error retrieving categories: {err}")
        if conn:
            conn.close()
        return []
