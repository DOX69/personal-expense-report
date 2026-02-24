import pandas as pd
from typing import Tuple, List, Optional
import io

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

        # 4. Auto-categorize
        def categorize(row):
            desc = str(row['description']).lower()
            if any(k in desc for k in ['sbb cff', 'tamoil', 'bp', 'sncf', 'heetch']):
                return 'Transport'
            elif any(k in desc for k in ['deliveroo', 'restaurant', 'cafe', 'bento', 'food', 'braisé', 'indes', 'boulangerie']):
                return 'Food & Dining'
            elif any(k in desc for k in ['auchan', 'carrefour', 'match']):
                return 'Groceries'
            elif any(k in desc for k in ['virement', 'revolut', 'change en', 'swift']):
                return 'Transfer'
            elif any(k in desc for k in ['amazon']):
                return 'Shopping'
            else:
                return 'Other'
                
        df['category'] = df.apply(categorize, axis=1)
            
        return df, errors

    except pd.errors.EmptyDataError:
        errors.append("Fichier vide")
        return pd.DataFrame(), errors
    except Exception as e:
        errors.append(f"Erreur de lecture: {str(e)}")
        return pd.DataFrame(), errors
