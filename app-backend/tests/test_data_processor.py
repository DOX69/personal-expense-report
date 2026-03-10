import pytest
import pandas as pd
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from data_processor import parse_and_validate_csv


class TestParseAndValidateCSV:

    def _make_csv(self, rows, header="Date de début,Description,Montant,Devise"):
        lines = [header] + rows
        return "\n".join(lines)

    def test_parses_valid_csv_with_french_columns(self):
        csv = self._make_csv(["2026-01-15,Deliveroo,-45.08,CHF"])
        df, errors = parse_and_validate_csv(csv)

        assert errors == []
        assert len(df) == 1
        assert df.iloc[0]['description'] == 'Deliveroo'
        assert df.iloc[0]['amount'] == -45.08
        assert df.iloc[0]['currency'] == 'CHF'

    def test_returns_error_for_missing_required_columns(self):
        csv = "Date,Desc,Amount\n2026-01-01,Test,100"
        df, errors = parse_and_validate_csv(csv)

        assert len(errors) > 0
        assert "Colonnes manquantes" in errors[0]
        assert df.empty

    def test_returns_error_for_empty_file(self):
        df, errors = parse_and_validate_csv("")

        assert len(errors) > 0
        assert df.empty

    def test_returns_error_for_invalid_dates(self):
        csv = self._make_csv(["not-a-date,Test,-10,CHF"])
        df, errors = parse_and_validate_csv(csv)

        assert len(errors) > 0
        assert "date" in errors[0].lower()
        assert df.empty

    def test_returns_error_for_null_values_in_required_fields(self):
        csv = self._make_csv(["2026-01-15,,-10,CHF"])
        df, errors = parse_and_validate_csv(csv)

        assert len(errors) > 0
        assert df.empty

    def test_categorizes_transport_expense(self):
        csv = self._make_csv(["2026-01-15,SBB CFF FFS,-11.00,CHF"])
        df, errors = parse_and_validate_csv(csv)

        assert errors == []
        assert df.iloc[0]['category_id'] == 22 # transport

    def test_categorizes_food_expense(self):
        csv = self._make_csv(["2026-01-15,Deliveroo,-30.00,CHF"])
        df, errors = parse_and_validate_csv(csv)

        assert errors == []
        assert df.iloc[0]['category_id'] == 21 # dining_out

    def test_categorizes_shopping_expense(self):
        csv = self._make_csv(["2026-01-15,Amazon Prime,-6.47,CHF"])
        df, errors = parse_and_validate_csv(csv)

        assert errors == []
        assert df.iloc[0]['category_id'] == 13 or df.iloc[0]['category_id'] == 24 # telecom (prime) or shopping

    def test_categorizes_income(self):
        csv = self._make_csv(["2026-01-15,Salaire mensuel,3500.00,CHF"])
        df, errors = parse_and_validate_csv(csv)

        assert errors == []
        assert df.iloc[0]['category_id'] == 1 # salary

    def test_fallback_category_for_unknown_description(self):
        csv = self._make_csv(["2026-01-15,Fishcake,-10.00,CHF"])
        df, errors = parse_and_validate_csv(csv)

        assert errors == []
        assert df.iloc[0]['category_id'] == 26 # other expense
