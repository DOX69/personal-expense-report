import pandas as pd
from typing import Tuple, List, Optional
import io

def categorize_transaction(row) -> str:
    """Categorizes a transaction based on its description and amount."""
    desc = str(row['description']).lower()
    amount = float(row['amount'])
    
    # Revenus
    if amount > 0:
        if any(k in desc for k in ['salaire', 'prime', 'paye']):
            return 'Revenus - Actifs'
        elif any(k in desc for k in ['dividende', 'interet', 'loyer']):
            return 'Revenus - Passifs'
        elif any(k in desc for k in ['remboursement', 'vinted', 'leboncoin', 'cadeau']):
            return 'Revenus - Exceptionnels'
        return 'Revenus - Autre'
        
    # Dépenses Fixes
    if any(k in desc for k in ['loyer', 'syndic', 'taxe foncière']):
        return 'Dépenses Fixes - Logement'
    elif any(k in desc for k in ['edf', 'engie', 'totalenergies', 'eau']):
        return 'Dépenses Fixes - Énergie & Eau'
    elif any(k in desc for k in ['assurance', 'mutuelle', 'allianz', 'axa', 'macif']):
        return 'Dépenses Fixes - Assurances'
    elif any(k in desc for k in ['orange', 'sfr', 'bouygues', 'free', 'icloud', 'google', 'spotify', 'netflix']):
        return 'Dépenses Fixes - Abonnements Télécom'
    elif any(k in desc for k in ['navigo', 'cff', 'abonnement transport']):
        return 'Dépenses Fixes - Transports (Récurrent)'
        
    # Dépenses Variables
    if any(k in desc for k in ['auchan', 'carrefour', 'leclerc', 'monoprix', 'boulangerie', 'franprix']):
        return 'Dépenses Variables - Alimentation'
    elif any(k in desc for k in ['restaurant', 'cafe', 'bar', 'deliveroo', 'ubereats', 'mcdo', 'burger king']):
        return 'Dépenses Variables - Vie Sociale'
    elif any(k in desc for k in ['sncf', 'total', 'bp', 'tamoil', 'uber', 'taxi', 'parking', 'peage']):
        return 'Dépenses Variables - Transport (Usage)'
    elif any(k in desc for k in ['cinema', 'fnac', 'concert', 'musee']):
        return 'Dépenses Variables - Loisirs & Culture'
    elif any(k in desc for k in ['zara', 'h&m', 'amazon', 'sephora', 'uniqlo', 'vetement']):
        return 'Dépenses Variables - Shopping'
    elif any(k in desc for k in ['pharmacie', 'doctolib', 'medecin', 'dentiste', 'opticien']):
        return 'Dépenses Variables - Santé'
        
    # Dépenses Occasionnelles & Épargne
    if any(k in desc for k in ['virement vers epargne', 'livret']):
        return 'Dépenses Occasionnelles - Épargne'
    elif any(k in desc for k in ['pea', 'assurance-vie', 'crypto', 'binance', 'coinbase']):
        return 'Dépenses Occasionnelles - Investissement'
        
    # Fallback
    return 'Dépenses Variables - Autre'

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
            # If input is string, convert to StringIO
            content = io.StringIO(file_content)
        else:
            # Assume it's a file-like object (e.g. from streamlit uploader or StringIO)
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

        df['category'] = df.apply(categorize_transaction, axis=1)
            
        return df, errors

    except pd.errors.EmptyDataError:
        errors.append("Fichier vide")
        return pd.DataFrame(), errors
    except Exception as e:
        errors.append(f"Erreur de lecture: {str(e)}")
        return pd.DataFrame(), errors
