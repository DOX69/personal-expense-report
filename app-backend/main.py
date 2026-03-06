from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

app = FastAPI(title="Personal Expense Report API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from db import init_db, get_transactions, save_transactions
from data_processor import parse_and_validate_csv
from fastapi import UploadFile, File

@app.on_event("startup")
def startup_event():
    init_db()

@app.get("/")
def read_root():
    return {"message": "Welcome to Personal Expense Report API"}

@app.get("/api/transactions")
def read_transactions():
    df = get_transactions()
    if not df.empty and 'date' in df.columns:
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
def get_dashboard_metrics():
    df = get_transactions()
    if df.empty:
        return {"total_income": 0, "total_expense": 0, "net_cashflow": 0}
    
    total_income = df[df['amount'] > 0]['amount'].sum()
    total_expense = df[df['amount'] < 0]['amount'].sum()
    net_cashflow = total_income + total_expense
    return {
        "total_income": float(total_income),
        "total_expense": float(total_expense),
        "net_cashflow": float(net_cashflow)
    }

@app.get("/api/dashboard/sankey")
def get_sankey_data():
    df = get_transactions()
    if df.empty:
        return {"nodes": [], "links": []}
    
    income_df = df[df['amount'] > 0]
    expense_df = df[df['amount'] < 0]
    
    income_cats = income_df.groupby('category')['amount'].sum().reset_index()
    expense_cats = expense_df.groupby('category')['amount'].sum().abs().reset_index()
    
    # Build strictly unidirectional: Income Sources -> Current Account -> Expense Categories
    # Use unique suffixes to avoid bidirectional node references
    labels = []
    
    # Income source nodes (left side)
    for _, row in income_cats.iterrows():
        labels.append(f"{row['category']} (Income)")
    
    # Central node
    labels.append("Current Account")
    
    # Expense category nodes (right side)
    for _, row in expense_cats.iterrows():
        labels.append(f"{row['category']} (Expense)")
    
    # Net savings node if applicable
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
