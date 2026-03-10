import pandas as pd
from typing import Tuple, List, Optional, Dict
import io
import re

# Kimball star schema - Category Dimension seed data
CATEGORY_SEED_DATA = [
    {"id": 1, "flow_type": "income", "flow_sub_type": "active", "category": "Salary", "is_recurrent": True},
    {"id": 2, "flow_type": "income", "flow_sub_type": "passive", "category": "Dividends", "is_recurrent": False},
    {"id": 3, "flow_type": "income", "flow_sub_type": "passive", "category": "Interest", "is_recurrent": True},
    {"id": 4, "flow_type": "income", "flow_sub_type": "passive", "category": "Rent", "is_recurrent": True},
    {"id": 5, "flow_type": "income", "flow_sub_type": "exceptional", "category": "Refund", "is_recurrent": False},
    {"id": 6, "flow_type": "income", "flow_sub_type": "exceptional", "category": "Gift", "is_recurrent": False},
    {"id": 7, "flow_type": "income", "flow_sub_type": "other", "category": "Other Income", "is_recurrent": False},
    
    {"id": 10, "flow_type": "expense", "flow_sub_type": "fixed", "category": "Housing", "is_recurrent": True},
    {"id": 11, "flow_type": "expense", "flow_sub_type": "fixed", "category": "Energy & Water", "is_recurrent": True},
    {"id": 12, "flow_type": "expense", "flow_sub_type": "fixed", "category": "Insurance", "is_recurrent": True},
    {"id": 13, "flow_type": "expense", "flow_sub_type": "fixed", "category": "Telecom", "is_recurrent": True},
    {"id": 14, "flow_type": "expense", "flow_sub_type": "fixed", "category": "Transport Subscription", "is_recurrent": True},
    
    {"id": 20, "flow_type": "expense", "flow_sub_type": "variable", "category": "Groceries", "is_recurrent": False},
    {"id": 21, "flow_type": "expense", "flow_sub_type": "variable", "category": "Restaurant", "is_recurrent": False},
    {"id": 22, "flow_type": "expense", "flow_sub_type": "variable", "category": "Transport", "is_recurrent": False},
    {"id": 23, "flow_type": "expense", "flow_sub_type": "variable", "category": "Leisure & Culture", "is_recurrent": False},
    {"id": 24, "flow_type": "expense", "flow_sub_type": "variable", "category": "Shopping", "is_recurrent": False},
    {"id": 25, "flow_type": "expense", "flow_sub_type": "variable", "category": "Health", "is_recurrent": False},
    {"id": 26, "flow_type": "expense", "flow_sub_type": "variable", "category": "Other Expense", "is_recurrent": False},
    {"id": 27, "flow_type": "expense", "flow_sub_type": "variable", "category": "Life & Social", "is_recurrent": False},
    
    {"id": 30, "flow_type": "expense", "flow_sub_type": "savings", "category": "Savings", "is_recurrent": True},
    {"id": 31, "flow_type": "expense", "flow_sub_type": "investment", "category": "Investment", "is_recurrent": False},
    
    {"id": 40, "flow_type": "transfer", "flow_sub_type": "internal", "category": "Currency Transfer", "is_recurrent": False},
]

def build_keyword_to_category_id_map() -> Dict[str, int]:
    """Returns a dictionary mapping keywords to category IDs."""
    return {
        # Salary
        'decideom': 1, 'mondial relay': 1, 'salaire': 1, 'paye': 1,
        # Income - Passive/Exceptional
        'dividende': 2, 'interet': 3, 'loyer': 4, 'remboursement': 5, 'refund': 5, 'vinted': 5, 'cadeau': 6,
        # Housing
        'syndic': 10, 'taxe foncière': 10,
        # Energy
        'edf': 11, 'engie': 11, 'totalenergies': 11, 'eau': 11,
        # Insurance
        'assurance': 12, 'mutuelle': 12, 'allianz': 12, 'axa': 12, 'macif': 12,
        # Telecom
        'orange': 13, 'sfr': 13, 'bouygues': 13, 'free': 13, 'icloud': 13, 'google': 13, 'spotify': 13, 'netflix': 13, 'amazon prime': 13,
        # Transport Subscription
        'navigo': 14, 'abonnement transport': 14,
        # Groceries
        'auchan': 20, 'carrefour': 20, 'leclerc': 20, 'monoprix': 20, 'franprix': 20, 'match': 20, 'aldi': 20, 'lidl': 20,
        # Restaurant
        'restaurant': 21, 'cafe': 21, 'bar': 21, 'deliveroo': 21, 'ubereats': 21, 'mcdo': 21, 'burger king': 21, 'starbucks': 21,
        # Transport (Usage)
        'sncf': 22, 'sbb cff ffs': 22, 'cff': 22, 'uber': 22, 'taxi': 22, 'parking': 22, 'peage': 22, 'tamoil': 22, 'bp': 22, 'total': 22, 'shell': 22,
        # Leisure / Culture
        'cinema': 23, 'fnac': 23, 'concert': 23, 'musee': 23, 'netflix': 23,
        # Shopping
        'zara': 24, 'h&m': 24, 'amazon': 24, 'sephora': 24, 'uniqlo': 24, 'vetement': 24,
        # Health
        'pharmacie': 25, 'doctolib': 25, 'medecin': 25, 'dentiste': 25, 'opticien': 25,
        # Life & Social
        'social': 27, 'club': 27, 'sortie': 27, 'loisir': 27, 'lifestyle': 27,
        # Savings / Investment
        'epargne': 30, 'livret': 30, 'pea': 31, 'assurance-vie': 31, 'crypto': 31, 'binance': 31, 'coinbase': 31,
        # Transfers
        'change en': 40, 'change de': 40,
    }

KEYWORD_MAP = build_keyword_to_category_id_map()


def categorize_transaction(row) -> int:
    """Categorizes a transaction based on its description and amount. Returns dim_categories.id."""
    desc = str(row['description']).lower()
    amount = float(row['amount'])
    
    # 1. Check Keywords - Sort by length descending to match most specific first
    sorted_keywords = sorted(KEYWORD_MAP.keys(), key=len, reverse=True)
    for keyword in sorted_keywords:
        if keyword in desc:
            return KEYWORD_MAP[keyword]
            
    # 2. Heuristics based on amount if no keyword matched
    if amount > 0:
        return 7  # other_income
    
    return 26 # other expense

def parse_and_validate_csv(file_content, user_id: Optional[int] = None) -> Tuple[pd.DataFrame, List[str]]:
    """
    Parses and validates CSV content.
    Returns:
        pd.DataFrame: Validated dataframe
        List[str]: List of error messages
    """
    REQUIRED_COLUMNS = ['Date de début', 'Description', 'Montant', 'Devise']
    errors = []
    
    try:
        if isinstance(file_content, str):
            content = io.StringIO(file_content)
        else:
            content = file_content
            
        df = pd.read_csv(content)
        
        # 1. Validate columns
        missing_cols = [col for col in REQUIRED_COLUMNS if col not in df.columns]
        if missing_cols:
            errors.append(f"Colonnes manquantes: {', '.join(missing_cols)}")
            return pd.DataFrame(), errors
            
        # 2. Rename columns mapping
        rename_map = {
            'Date de début': 'start_date',
            'Description': 'description',
            'Montant': 'amount',
            'Devise': 'currency',
            'Type': 'type'
        }
        df = df.rename(columns=rename_map)
        
        cols_to_keep = ['start_date', 'description', 'amount', 'currency']
        if 'type' in df.columns:
            cols_to_keep.append('type')
        df = df[cols_to_keep]
        
        # 2b. Check for missing values in required renamed columns
        req_renamed = ['start_date', 'description', 'amount', 'currency']
        if df[req_renamed].isnull().any().any():
             null_cols = df[req_renamed].columns[df[req_renamed].isnull().any()].tolist()
             errors.append(f"Valeurs manquantes dans: {', '.join(null_cols)}")
             return pd.DataFrame(), errors

        # 3. Validate Date
        try:
            df['start_date'] = pd.to_datetime(df['start_date'], errors='coerce')
            if df['start_date'].isnull().any():
                errors.append("Format de date invalide")
                return pd.DataFrame(), errors
        except Exception:
            errors.append("Format de date invalide")
            return pd.DataFrame(), errors

        # 4. New Categorization logic
        df['category_id'] = df.apply(categorize_transaction, axis=1)
            
        return df, errors

    except pd.errors.EmptyDataError:
        errors.append("Fichier vide")
        return pd.DataFrame(), errors
    except Exception as e:
        errors.append(f"Erreur de lecture: {str(e)}")
        return pd.DataFrame(), errors
