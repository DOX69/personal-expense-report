import streamlit as st
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd

def show_dashboard(df: pd.DataFrame):
     # Custom CSS for premium UI
    st.markdown("""
        <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
        
        * {
            font-family: 'Inter', sans-serif;
        }
        .metric-card {
            background: linear-gradient(145deg, #1e1e1e, #2a2a2a);
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
            text-align: center;
            border: 1px solid #333;
            transition: transform 0.2s ease-in-out;
        }
        .metric-card:hover {
            transform: translateY(-5px);
        }
        .metric-title { color: #a0a0a0; font-size: 1.1rem; margin-bottom: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;}
        .metric-value { color: #ffffff; font-size: 2.2rem; font-weight: 800; }
        .positive { color: #4ade80 !important; }
        .negative { color: #f87171 !important; }
        </style>
    """, unsafe_allow_html=True)

    st.title("✨ Tableau de Bord Financier")
    
    if df.empty:
        st.info("Aucune donnée à afficher pour cette période.")
        return

    df['date'] = pd.to_datetime(df['date'], errors='coerce')
    df = df.dropna(subset=['date'])

    # KPIs
    total_income = df[df['amount'] > 0]['amount'].sum()
    total_expense = df[df['amount'] < 0]['amount'].sum()
    net_cashflow = total_income + total_expense
    
    col1, col2, col3 = st.columns(3)
    
    col1.markdown(f'<div class="metric-card"><div class="metric-title">Income</div><div class="metric-value positive">+{total_income:.2f} €</div></div>', unsafe_allow_html=True)
    col2.markdown(f'<div class="metric-card"><div class="metric-title">Expenses</div><div class="metric-value negative">{total_expense:.2f} €</div></div>', unsafe_allow_html=True)
    
    net_class = 'positive' if net_cashflow >= 0 else 'negative'
    net_sign = '+' if net_cashflow >= 0 else ''
    col3.markdown(f'<div class="metric-card"><div class="metric-title">Net Cashflow</div><div class="metric-value {net_class}">{net_sign}{net_cashflow:.2f} €</div></div>', unsafe_allow_html=True)
    
    st.markdown("<br><hr style='border: 1px solid #333;'><br>", unsafe_allow_html=True)
    
    # Histogram (Cashflow)
    st.subheader("📊 Cashflow Evolution")
    
    df['cashflow_type'] = df['amount'].apply(lambda x: 'Income' if x > 0 else 'Expense')
    df_weekly = df.groupby([pd.Grouper(key='date', freq='W-MON'), 'cashflow_type'])['amount'].sum().reset_index()
    
    fig_hist = px.bar(df_weekly, x='date', y='amount', color='cashflow_type', 
                      barmode='relative',
                      color_discrete_map={'Income': '#4ade80', 'Expense': '#f87171'},
                      template='plotly_dark')
    fig_hist.update_layout(
        margin=dict(l=0, r=0, t=30, b=0), 
        plot_bgcolor='rgba(0,0,0,0)', 
        paper_bgcolor='rgba(0,0,0,0)',
        xaxis_title="",
        yaxis_title="Amount",
        legend_title=""
    )
    st.plotly_chart(fig_hist, use_container_width=True)

    st.markdown("<br>", unsafe_allow_html=True)

    # Sankey Diagram
    st.subheader("🌊 Cashflow (Sankey)")
    
    expense_cats = df[df['amount'] < 0].groupby('category')['amount'].sum().abs().reset_index()
    income_cats = df[df['amount'] > 0].groupby('category')['amount'].sum().reset_index()
    
    labels = ["Current Account"] + list(income_cats['category']) + list(expense_cats['category'])
    labels = list(dict.fromkeys(labels))
    
    source = []
    target = []
    value = []
    
    for _, row in income_cats.iterrows():
        source.append(labels.index(row['category']))
        target.append(labels.index("Current Account"))
        value.append(row['amount'])
        
    for _, row in expense_cats.iterrows():
        source.append(labels.index("Current Account"))
        target.append(labels.index(row['category']))
        value.append(row['amount'])
    
    if net_cashflow > 0:
        labels.append("Savings")
        source.append(labels.index("Current Account"))
        target.append(labels.index("Savings"))
        value.append(net_cashflow)
        
    fig_sankey = go.Figure(data=[go.Sankey(
        node = dict(
          pad = 20,
          thickness = 25,
          line = dict(color = "#1e1e1e", width = 1),
          label = labels,
          color = "#3b82f6"
        ),
        link = dict(
          source = source,
          target = target,
          value = value,
          color = "rgba(59, 130, 246, 0.3)" 
      ))])
      
    fig_sankey.update_layout(
        height=600, 
        font_size=13, 
        template='plotly_dark', 
        plot_bgcolor='rgba(0,0,0,0)', 
        paper_bgcolor='rgba(0,0,0,0)',
        font=dict(family="Inter, sans-serif")
    )
    st.plotly_chart(fig_sankey, use_container_width=True)
