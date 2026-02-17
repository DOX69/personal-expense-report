import streamlit as st
from datetime import datetime, timedelta

def show_sidebar():
    st.sidebar.header("Filtres")
    
    # Date filter
    period_options = ["30 derniers jours", "90 derniers jours", "Tout", "Personnalisé"]
    period = st.sidebar.selectbox("Période", period_options)
    
    start_date = None
    end_date = datetime.now().date()
    
    if period == "30 derniers jours":
        start_date = end_date - timedelta(days=30)
    elif period == "90 derniers jours":
        start_date = end_date - timedelta(days=90)
    elif period == "Personnalisé":
        start_date = st.sidebar.date_input("Date de début")
        end_date = st.sidebar.date_input("Date de fin")
        
    return start_date, end_date
