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
    REQUIRED_COLUMNS = ['date', 'montant', 'devise', 'categorie']
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
            if 'categorie' in missing_cols:
                errors.append("Colonnes manquantes (sans catégorie)")
            else:
                errors.append(f"Colonnes manquantes: {', '.join(missing_cols)}")
            return pd.DataFrame(), errors
            
        # 2. Filter extra columns
        df = df[REQUIRED_COLUMNS]
        
        # 2b. Check for missing values in required columns
        if df[REQUIRED_COLUMNS].isnull().any().any():
             # Start check specifically for 'categorie'
             if df['categorie'].isnull().any():
                 errors.append("Colonnes manquantes (sans catégorie)")
             else:
                 # Check other columns
                 null_cols = df.columns[df.isnull().any()].tolist()
                 errors.append(f"Valeurs manquantes dans: {', '.join(null_cols)}")
             return pd.DataFrame(), errors

        # 3. Validate Date
        try:
            df['date'] = pd.to_datetime(df['date'], errors='raise')
        except Exception:
            errors.append("Format de date invalide")
            return pd.DataFrame(), errors
            
        return df, errors

    except pd.errors.EmptyDataError:
        errors.append("Fichier vide")
        return pd.DataFrame(), errors
    except Exception as e:
        errors.append(f"Erreur de lecture: {str(e)}")
        return pd.DataFrame(), errors
