import pytest
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from data_processor import CATEGORY_SEED_DATA, categorize_transaction

def test_category_names_are_title_case():
    """Requirement: exceptionnaly for category column in dim_categories, it should be in a user friendly value format, instead of snake_case"""
    for item in CATEGORY_SEED_DATA:
        cat_name = item['category']
        # Check if it's title case or contains spaces/special chars instead of underscores
        # We expect things like "Dining Out" to be "Restaurant" now, but generally title case
        assert "_" not in cat_name, f"Category name '{cat_name}' still contains underscores"
        assert cat_name[0].isupper(), f"Category name '{cat_name}' should start with uppercase"

def test_restaurant_rename():
    """Requirement: rename 'dining_out' to 'Restaurant'"""
    restaurant_cat = next((item for item in CATEGORY_SEED_DATA if item['id'] == 21), None)
    assert restaurant_cat is not None
    assert restaurant_cat['category'] == "Restaurant"

def test_life_social_category_exists():
    """Requirement: add 'Life & Social' category with ID 27"""
    social_cat = next((item for item in CATEGORY_SEED_DATA if item['id'] == 27), None)
    assert social_cat is not None
    assert social_cat['category'] == "Life & Social"
    assert social_cat['flow_type'] == "expense"
    assert social_cat['flow_sub_type'] == "variable"

def test_social_keyword_categorization():
    """Requirement: categorize 'Social' keywords to ID 27"""
    # Test with a potential social keyword (e.g., 'sorties', 'bars' - wait, bar was 21)
    # Let's assume 'social' or 'loisirs' or 'club'
    row = {'description': 'Abonnement Club de Sport', 'amount': -50.0}
    result = categorize_transaction(row)
    assert result == 27

def test_all_categories_user_friendly():
    """Verify all categories follow the new naming convention"""
    expected_names = {
        1: "Salary",
        2: "Dividends",
        3: "Interest",
        4: "Rent",
        5: "Refund",
        6: "Gift",
        7: "Other Income",
        10: "Housing",
        11: "Energy & Water",
        12: "Insurance",
        13: "Telecom",
        14: "Transport Subscription",
        20: "Groceries",
        21: "Restaurant",
        22: "Transport",
        23: "Leisure & Culture",
        24: "Shopping",
        25: "Health",
        26: "Other Expense",
        27: "Life & Social",
        30: "Savings",
        31: "Investment",
        40: "Currency Transfer"
    }
    for item in CATEGORY_SEED_DATA:
        if item['id'] in expected_names:
            assert item['category'] == expected_names[item['id']], f"Category ID {item['id']} name mismatch"
