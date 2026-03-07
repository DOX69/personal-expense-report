import pytest
import pandas as pd
from io import StringIO
import sys
import os
sys.path.append(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'app-backend'))
from data_processor import parse_and_validate_csv

def test_parse_valid_csv():
    csv_content = StringIO("Date de début,Description,Montant,Devise,Type\n2026-01-01 10:00:00,Deliveroo,-50.00,EUR,Paiement par carte")
    df, errors = parse_and_validate_csv(csv_content)
    assert len(df) == 1
    assert len(errors) == 0
    assert df.iloc[0]['amount'] == -50.00
    assert df.iloc[0]['category'] == 'Dépenses Variables - Vie Sociale'

def test_parse_missing_columns():
    csv_content = StringIO("Description,Montant,Devise\nDeliveroo,-50.00,EUR")
    df, errors = parse_and_validate_csv(csv_content)
    assert len(df) == 0
    assert "Colonnes manquantes" in str(errors[0])

def test_parse_invalid_date():
    csv_content = StringIO("Date de début,Description,Montant,Devise\ninvalid_date,Deliveroo,-50.00,EUR")
    df, errors = parse_and_validate_csv(csv_content)
    assert len(df) == 0
    assert "date invalide" in str(errors[0])

def test_ignore_extra_columns():
    csv_content = StringIO("Date de début,Description,Montant,Devise,Frais\n2026-01-01 10:00:00,Deliveroo,-50.00,EUR,0.00")
    df, errors = parse_and_validate_csv(csv_content)
    assert len(df) == 1
    assert 'Frais' not in df.columns
