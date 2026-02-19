import streamlit as st
import pandas as pd
from app.auth import check_password
from app.ui.sidebar import show_sidebar
from app.ui.dashboard import show_dashboard
from app.data_processor import parse_and_validate_csv
from app.db import init_db, save_transactions, get_transactions

st.set_page_config(page_title="Personal Expense Report", layout="wide")

# Initialize database
init_db()

if not check_password():
    st.stop()

st.sidebar.title("Navigation")
page = st.sidebar.radio("Aller à", ["Dashboard", "Upload"])

if page == "Upload":
    st.title("Importer des Transactions")
    uploaded_file = st.file_uploader("Choisir un fichier CSV", type=["csv"])
    
    if uploaded_file is not None:
        # Read file as string/bytes
        content = uploaded_file.getvalue().decode("utf-8")
        
        df, errors = parse_and_validate_csv(content)
        
        if errors:
            for error in errors:
                st.error(error)
        else:
            st.success(f"{len(df)} transactions chargées avec succès!")
            st.dataframe(df.head())
            
            # Save to database
            if save_transactions(df):
                st.success("Transactions enregistrées dans la base de données.")
            else:
                st.error("Erreur lors de l'enregistrement dans la base de données.")

elif page == "Dashboard":
    start_date, end_date = show_sidebar()
    
    # Load from database
    df = get_transactions()
    
    if not df.empty and start_date and end_date:
        # Filter by date
        df['date'] = pd.to_datetime(df['date'])
        # Convert to datetime64[ns] to match dataframe
        mask = (df['date'].dt.date >= start_date) & (df['date'].dt.date <= end_date)
        df_filtered = df.loc[mask]
        
        show_dashboard(df_filtered)
    elif df.empty:
        st.info("Aucune donnée dans la base. Veuillez uploader des transactions dans l'onglet Upload.")
    else:
        st.info("Sélectionnez une période.")

