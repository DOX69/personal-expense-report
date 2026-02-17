import streamlit as st
import plotly.express as px
import pandas as pd

def show_dashboard(df: pd.DataFrame):
    st.title("Tableau de Bord des Dépenses")
    
    if df.empty:
        st.info("Aucune donnée à afficher pour cette période.")
        return

    # Invalid dates handling
    df['date'] = pd.to_datetime(df['date'], errors='coerce')
    df = df.dropna(subset=['date'])

    # KPIs
    total_expense = df['montant'].sum()
    avg_expense = df['montant'].mean()
    
    col1, col2 = st.columns(2)
    col1.metric("Total Dépenses", f"{total_expense:.2f} €")
    col2.metric("Dépense Moyenne", f"{avg_expense:.2f} €")
    
    # Charts
    st.subheader("Répartition par Catégorie")
    fig_pie = px.pie(df, values='montant', names='categorie', title='Dépenses par Catégorie')
    st.plotly_chart(fig_pie)
    
    st.subheader("Évolution dans le temps")
    # Group by week/month for better viz
    df_daily = df.groupby('date')['montant'].sum().reset_index()
    fig_line = px.line(df_daily, x='date', y='montant', title='Évolution des Dépenses')
    st.plotly_chart(fig_line)
