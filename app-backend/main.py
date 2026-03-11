from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os

from fastapi import Security, HTTPException, status, Depends
from fastapi.security.api_key import APIKeyHeader

API_KEY = os.getenv("API_SECRET_KEY")
API_KEY_NAME = "X-API-Key"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

async def verify_api_key(key: str = Security(api_key_header)):
    if not API_KEY:
        # In development, we might not have the key set
        # But for Railway, it's mandatory
        return
    if key != API_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API Key",
        )

app = FastAPI(
    title="Personal Expense Report API",
    dependencies=[Depends(verify_api_key)]
)

# Configure CORS
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
allowed_origins = [origin.strip() for origin in allowed_origins_env.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    from .db import init_db, get_transactions, save_transactions, get_categories
    from .data_processor import parse_and_validate_csv
except (ImportError, ValueError):
    from db import init_db, get_transactions, save_transactions, get_categories
    from data_processor import parse_and_validate_csv
from fastapi import UploadFile, File

@app.on_event("startup")
def startup_event():
    init_db()

@app.get("/")
def read_root():
    return {"message": "Welcome to Personal Expense Report API"}

def filter_transactions_df(df: pd.DataFrame, start_date: str = None, end_date: str = None, category: str = None, flow_type: str = None) -> pd.DataFrame:
    if df.empty or 'date' not in df.columns:
        return df
        
    if start_date:
        df = df[df['date'] >= pd.to_datetime(start_date)]
    if end_date:
        df = df[df['date'] <= pd.to_datetime(end_date)]
        
    if category and category != 'all':
        # Handle multiple categories (comma separated)
        cat_list = [c.strip() for c in category.split(',')]
        df = df[df['category'].isin(cat_list)]
        
    if flow_type and flow_type != 'all':
        df = df[df['flow_type'] == flow_type]
        
    return df

@app.get("/api/categories")
def read_categories():
    return get_categories()

@app.get("/api/transactions")
def read_transactions(start_date: str = None, end_date: str = None, category: str = None, flow_type: str = None, search: str = None):
    df = get_transactions()
    
    if not df.empty:
        df = filter_transactions_df(df, start_date, end_date, category, flow_type)
        
        if search:
            search_term = search.lower()
            # Search in original description and category
            mask = (
                df['description'].str.lower().str.contains(search_term, na=False) | 
                df['category'].str.lower().str.contains(search_term, na=False)
            )
            df = df[mask]

        if 'date' in df.columns:
            df['date'] = df['date'].dt.strftime('%Y-%m-%d')
            
    df = df.where(pd.notnull(df), None)
    return df.to_dict(orient="records")

@app.post("/api/upload")
async def upload_csv(file: UploadFile = File(...)):
    content = await file.read()
    try:
        content_str = content.decode("utf-8")
    except UnicodeDecodeError:
        content_str = content.decode("iso-8859-1")
    
    df, errors = parse_and_validate_csv(content_str)
    if errors:
        return {"success": False, "errors": errors}
    
    if save_transactions(df):
        return {"success": True, "inserted": len(df)}
    else:
        return {"success": False, "errors": ["Failed to save transactions to database"]}

@app.get("/api/dashboard/metrics")
def get_dashboard_metrics(start_date: str = None, end_date: str = None):
    df = get_transactions()
    if df.empty:
        return {"total_income": 0, "total_expense": 0, "net_cashflow": 0}
    
    # Filter by date, but exclude internal transfers from metrics
    df = filter_transactions_df(df, start_date, end_date)
    metrics_df = df[df['flow_type'] != 'transfer']
    
    total_income = metrics_df[metrics_df['flow_type'] == 'income']['amount'].sum()
    total_expense = metrics_df[metrics_df['flow_type'] == 'expense']['amount'].sum()
    net_cashflow = total_income + total_expense
    
    return {
        "total_income": float(total_income),
        "total_expense": float(total_expense),
        "net_cashflow": float(net_cashflow)
    }

@app.get("/api/dashboard/sankey")
def get_sankey_data(start_date: str = None, end_date: str = None):
    df = get_transactions()
    if df.empty:
        return {"nodes": [], "links": []}
        
    df = filter_transactions_df(df, start_date, end_date)
    # Exclude internal transfers as they are not "flows" in/out of the system
    df = df[df['flow_type'] != 'transfer']
    
    income_df = df[df['flow_type'] == 'income']
    expense_df = df[df['flow_type'] == 'expense']
    
    income_cats = income_df.groupby('category')['amount'].sum().reset_index()
    expense_cats = expense_df.groupby('category')['amount'].sum().abs().reset_index()
    
    # Build unique node labels
    labels = []
    
    # Income source nodes
    for _, row in income_cats.iterrows():
        labels.append(f"{row['category']} (Income)")
    
    # Central node
    labels.append("Current Account")
    
    # Expense category nodes
    for _, row in expense_cats.iterrows():
        labels.append(f"{row['category']} (Expense)")
    
    # Net savings node
    net_cashflow = income_cats['amount'].sum() - expense_cats['amount'].sum()
    if net_cashflow > 0:
        labels.append("Savings")
    
    links = []
    central_idx = labels.index("Current Account")
    
    # Income -> Current Account
    for _, row in income_cats.iterrows():
        src = labels.index(f"{row['category']} (Income)")
        links.append({"source": src, "target": central_idx, "value": round(float(row['amount']), 2)})
    
    # Current Account -> Expenses
    for _, row in expense_cats.iterrows():
        tgt = labels.index(f"{row['category']} (Expense)")
        links.append({"source": central_idx, "target": tgt, "value": round(float(row['amount']), 2)})
    
    # Current Account -> Savings
    if net_cashflow > 0:
        links.append({"source": central_idx, "target": labels.index("Savings"), "value": round(float(net_cashflow), 2)})

    return {"nodes": [{"name": l} for l in labels], "links": links}
