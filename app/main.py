import streamlit as st
import pandas as pd
from app.auth import check_password
from app.ui.sidebar import show_sidebar
from app.ui.dashboard import show_dashboard
from app.data_processor import parse_and_validate_csv

st.set_page_config(page_title="Personal Expense Report", layout="wide")

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
            
            # Save to session state for demo purposes (in real app, save to DB)
            if 'transactions' not in st.session_state:
                 st.session_state['transactions'] = pd.DataFrame()
            
            st.session_state['transactions'] = pd.concat([st.session_state.get('transactions', pd.DataFrame()), df], ignore_index=True)
            st.success("Transactions ajoutées à la session.")

elif page == "Dashboard":
    start_date, end_date = show_sidebar()
    
    df = st.session_state.get('transactions', pd.DataFrame())
    
    if not df.empty and start_date and end_date:
        # Filter by date
        df['date'] = pd.to_datetime(df['date'])
        # Convert to datetime64[ns] to match dataframe
        mask = (df['date'].dt.date >= start_date) & (df['date'].dt.date <= end_date)
        df_filtered = df.loc[mask]
        
        show_dashboard(df_filtered)
    else:
        st.info("Veuillez uploader des données dans l'onglet Upload.")

