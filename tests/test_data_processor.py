import pytest
import pandas as pd
from io import StringIO
from app.data_processor import parse_and_validate_csv

def test_parse_valid_csv():
    csv_content = StringIO("date,montant,devise,categorie\n2026-01-01,-50.00,EUR,Alimentation")
    df, errors = parse_and_validate_csv(csv_content)
    assert len(df) == 1
    assert len(errors) == 0
    assert df.iloc[0]['montant'] == -50.00

def test_parse_missing_category():
    csv_content = StringIO("date,montant,devise,categorie\n2026-01-01,-50.00,EUR,")
    df, errors = parse_and_validate_csv(csv_content)
    assert len(df) == 0
    assert "sans catégorie" in str(errors)

def test_parse_invalid_date():
    csv_content = StringIO("date,montant,devise,categorie\ninvalid_date,-50.00,EUR,Alimentation")
    df, errors = parse_and_validate_csv(csv_content)
    assert len(df) == 0
    assert "date invalide" in str(errors)

def test_ignore_extra_columns():
    csv_content = StringIO("date,montant,devise,categorie,commentaire\n2026-01-01,-50.00,EUR,Alimentation,test")
    df, errors = parse_and_validate_csv(csv_content)
    assert len(df) == 1
    assert 'commentaire' not in df.columns
