import pandas as pd

REQUIRED_COLUMNS = {"date", "amount"}


def validate_columns(df: pd.DataFrame) -> None:
    """Validate that the required transaction columns exist."""
    missing_columns = REQUIRED_COLUMNS - set(df.columns)
    if missing_columns:
        missing = ", ".join(sorted(missing_columns))
        raise ValueError(
            f"Missing required columns: {missing}. "
            f"Expected at least: {sorted(REQUIRED_COLUMNS)}"
        )


def clean_amounts(amounts: pd.Series) -> pd.Series:
    """Convert transaction amounts into numeric values.

    Handles:
    - Integer and floating-point amounts
    - Numeric strings
    - Indian currency symbols and thousands separators
    - Commas used as thousands separators

    Negative amounts are preserved because their meaning depends
    on the transaction source.
    """
    cleaned_amounts = amounts.astype("string").str.strip()

    # Remove common currency symbols and whitespace.
    cleaned_amounts = cleaned_amounts.str.replace(r"[₹$€£\s]", "", regex=True)

    # Remove thousands separators.
    cleaned_amounts = cleaned_amounts.str.replace(",", "", regex=False)

    # Convert invalid values to NaN.
    return pd.to_numeric(cleaned_amounts, errors="coerce")


def clean_transactions(df: pd.DataFrame) -> pd.DataFrame:
    """Validate and clean basic transaction fields.

    Expected columns:
        date: Transaction date.
        amount: Transaction amount.

    Optional unique identifier:
        transaction_id: Used to identify duplicate transactions.

    Returns:
        A cleaned copy of the input DataFrame.
    """
    if df.empty:
        raise ValueError("Cannot preprocess an empty DataFrame.")

    validate_columns(df)

    cleaned = df.copy()

    # Convert dates.
    cleaned["date"] = pd.to_datetime(cleaned["date"], errors="coerce")

    # Convert currency-formatted amounts to numbers.
    cleaned["amount"] = clean_amounts(cleaned["amount"])

    # Remove rows with invalid dates or amounts.
    cleaned = cleaned.dropna(subset=["date", "amount"])

    # Remove duplicates only when a transaction identifier exists.
    if "transaction_id" in cleaned.columns:
        cleaned = cleaned.drop_duplicates(
            subset=["transaction_id"], keep="first"
        )

    # Sort transactions chronologically.
    cleaned = cleaned.sort_values("date").reset_index(drop=True)

    return cleaned