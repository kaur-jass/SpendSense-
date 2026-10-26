import pandas as pd
import pytest
from ml.src.data.preprocessing import (
    clean_amounts,
    clean_transactions,
    validate_columns,
)


def test_validate_columns_success():
    df = pd.DataFrame({
        "date": ["2026-01-01"],
        "amount": [100],
    })
    validate_columns(df)


def test_validate_columns_missing_amount():
    df = pd.DataFrame({
        "date": ["2026-01-01"],
    })
    with pytest.raises(ValueError, match="Missing required columns"):
        validate_columns(df)


def test_clean_transactions_removes_invalid_rows_and_sorts():
    df = pd.DataFrame({
        "date": ["2026-01-03", "invalid-date", "2026-01-01"],
        "amount": ["300", "200", "100"],
    })
    result = clean_transactions(df)

    assert len(result) == 2
    assert result["date"].is_monotonic_increasing
    assert result["amount"].tolist() == [100, 300]


def test_clean_amounts_handles_currency_formatting():
    amounts = pd.Series([
        "250",
        "₹1,250.00",
        "₹ 2,500",
        "-350",
        "invalid",
    ])
    result = clean_amounts(amounts)

    assert result.iloc[0] == 250
    assert result.iloc[1] == 1250
    assert result.iloc[2] == 2500
    assert result.iloc[3] == -350
    assert pd.isna(result.iloc[4])


def test_negative_amounts_are_preserved():
    df = pd.DataFrame({
        "date": ["2026-01-01", "2026-01-02"],
        "amount": [500, -200],
    })
    result = clean_transactions(df)

    assert result["amount"].tolist() == [500, -200]


def test_duplicate_transaction_ids_are_removed():
    df = pd.DataFrame({
        "transaction_id": ["TX001", "TX001", "TX002"],
        "date": ["2026-01-01", "2026-01-01", "2026-01-01"],
        "amount": [100, 100, 100],
    })
    result = clean_transactions(df)

    assert len(result) == 2
    assert result["transaction_id"].tolist() == ["TX001", "TX002"]


def test_same_amount_without_transaction_id_is_preserved():
    df = pd.DataFrame({
        "date": ["2026-01-01", "2026-01-01"],
        "amount": [100, 100],
    })
    result = clean_transactions(df)

    assert len(result) == 2


def test_empty_dataframe_raises_error():
    df = pd.DataFrame(columns=["date", "amount"])
    with pytest.raises(ValueError, match="Cannot preprocess an empty"):
        clean_transactions(df)