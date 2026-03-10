import pytest
import pandas as pd
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from data_processor import (
    CATEGORY_SEED_DATA,
    build_keyword_to_category_id_map,
    categorize_transaction,
    parse_and_validate_csv,
)


class TestCategorySeedData:
    """Verify the dim_categories seed data structure."""

    def test_seed_data_is_list_of_dicts(self):
        assert isinstance(CATEGORY_SEED_DATA, list)
        assert len(CATEGORY_SEED_DATA) > 0
        for row in CATEGORY_SEED_DATA:
            assert isinstance(row, dict)

    def test_seed_data_has_required_keys(self):
        required_keys = {'id', 'flow_type', 'flow_sub_type', 'category', 'is_recurrent'}
        for row in CATEGORY_SEED_DATA:
            assert required_keys.issubset(row.keys()), f"Missing keys in {row}"

    def test_seed_data_flow_types_are_english(self):
        valid_flow_types = {'income', 'expense', 'transfer'}
        for row in CATEGORY_SEED_DATA:
            assert row['flow_type'] in valid_flow_types, f"Invalid flow_type: {row['flow_type']}"

    def test_seed_data_has_currency_transfer(self):
        transfer_rows = [r for r in CATEGORY_SEED_DATA if r['flow_type'] == 'transfer']
        assert len(transfer_rows) >= 1
        currency_transfer = [r for r in transfer_rows if r['category'] == 'Currency Transfer']
        assert len(currency_transfer) == 1

    def test_seed_data_has_salary(self):
        salary_rows = [r for r in CATEGORY_SEED_DATA
                       if r['flow_type'] == 'income' and r['category'] == 'Salary']
        assert len(salary_rows) == 1
        salary = salary_rows[0]
        assert salary['flow_sub_type'] == 'active'
        assert salary['is_recurrent'] is True

    def test_seed_data_ids_are_unique(self):
        ids = [r['id'] for r in CATEGORY_SEED_DATA]
        assert len(ids) == len(set(ids))


class TestKeywordToCategoryIdMap:
    """Verify the keyword mapping dictionary."""

    def test_build_returns_dict(self):
        mapping = build_keyword_to_category_id_map()
        assert isinstance(mapping, dict)
        assert len(mapping) > 0

    def test_all_values_are_valid_category_ids(self):
        mapping = build_keyword_to_category_id_map()
        valid_ids = {r['id'] for r in CATEGORY_SEED_DATA}
        for keyword, cat_id in mapping.items():
            assert cat_id in valid_ids, f"Keyword '{keyword}' maps to invalid id {cat_id}"


class TestCategorizeTransaction:
    """Verify deterministic keyword-based categorization."""

    def test_salary_decideom(self):
        row = {'description': 'DECIDEOM SAS Virement', 'amount': 2500.0}
        result = categorize_transaction(row)
        salary = next(r for r in CATEGORY_SEED_DATA if r['category'] == 'Salary')
        assert result == salary['id']

    def test_salary_mondial_relay(self):
        row = {'description': 'MONDIAL RELAY paiement', 'amount': 1800.0}
        result = categorize_transaction(row)
        salary = next(r for r in CATEGORY_SEED_DATA if r['category'] == 'Salary')
        assert result == salary['id']

    def test_currency_transfer_change_en_chf(self):
        row = {'description': 'Change en CHF', 'amount': 1200.0}
        result = categorize_transaction(row)
        ct = next(r for r in CATEGORY_SEED_DATA if r['category'] == 'Currency Transfer')
        assert result == ct['id']

    def test_currency_transfer_change_en_eur(self):
        row = {'description': 'Change en EUR', 'amount': -150.16}
        result = categorize_transaction(row)
        ct = next(r for r in CATEGORY_SEED_DATA if r['category'] == 'Currency Transfer')
        assert result == ct['id']

    def test_transport_sbb_cff(self):
        row = {'description': 'SBB CFF FFS', 'amount': -11.0}
        result = categorize_transaction(row)
        cat = next(r for r in CATEGORY_SEED_DATA if r['id'] == result)
        assert cat['category'] == 'Transport'

    def test_transport_sncf(self):
        row = {'description': 'SNCF voyage', 'amount': -204.5}
        result = categorize_transaction(row)
        cat = next(r for r in CATEGORY_SEED_DATA if r['id'] == result)
        assert cat['category'] == 'Transport'

    def test_food_delivery_deliveroo(self):
        row = {'description': 'Deliveroo', 'amount': -45.08}
        result = categorize_transaction(row)
        cat = next(r for r in CATEGORY_SEED_DATA if r['id'] == result)
        assert cat['category'] == 'Restaurant'

    def test_shopping_amazon(self):
        row = {'description': 'Amazon.fr', 'amount': -6.47}
        result = categorize_transaction(row)
        cat = next(r for r in CATEGORY_SEED_DATA if r['id'] == result)
        assert cat['category'] == 'Shopping'

    def test_fuel_tamoil(self):
        row = {'description': 'Tamoil', 'amount': -22.20}
        result = categorize_transaction(row)
        cat = next(r for r in CATEGORY_SEED_DATA if r['id'] == result)
        assert cat['category'] == 'Transport'

    def test_groceries_auchan(self):
        row = {'description': 'Auchan supermarche', 'amount': -21.80}
        result = categorize_transaction(row)
        cat = next(r for r in CATEGORY_SEED_DATA if r['id'] == result)
        assert cat['category'] == 'Groceries'

    def test_groceries_carrefour(self):
        row = {'description': 'Carrefour', 'amount': -22.99}
        result = categorize_transaction(row)
        cat = next(r for r in CATEGORY_SEED_DATA if r['id'] == result)
        assert cat['category'] == 'Groceries'

    def test_unknown_description_returns_fallback(self):
        row = {'description': 'Random Unknown 123', 'amount': -10.0}
        result = categorize_transaction(row)
        cat = next(r for r in CATEGORY_SEED_DATA if r['id'] == result)
        assert cat['category'] == 'Other Expense'
        assert cat['flow_type'] == 'expense'

    def test_deterministic_same_input_same_output(self):
        row = {'description': 'SBB CFF FFS', 'amount': -11.0}
        result1 = categorize_transaction(row)
        result2 = categorize_transaction(row)
        assert result1 == result2

    def test_positive_amount_unknown_is_other_income(self):
        row = {'description': 'Virement d un utilisateur Revolut', 'amount': 30.0}
        result = categorize_transaction(row)
        cat = next(r for r in CATEGORY_SEED_DATA if r['id'] == result)
        assert cat['flow_type'] == 'income'




class TestParseAndValidateCSVWithCategoryId:
    """Verify CSV parsing now returns category_id instead of French string."""

    def _make_csv(self, rows, header="Date de début,Description,Montant,Devise"):
        lines = [header] + rows
        return "\n".join(lines)

    def test_returns_category_id_column(self):
        csv = self._make_csv(["2026-01-15,Deliveroo,-45.08,CHF"])
        df, errors = parse_and_validate_csv(csv)

        assert errors == []
        assert 'category_id' in df.columns
        # Use a more broad check as pandas might return numpy int64
        assert str(df.iloc[0]['category_id']).isdigit()


    def test_category_column_no_longer_exists(self):
        csv = self._make_csv(["2026-01-15,Deliveroo,-45.08,CHF"])
        df, errors = parse_and_validate_csv(csv)

        assert errors == []
        assert 'category' not in df.columns
