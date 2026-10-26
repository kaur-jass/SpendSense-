from pathlib import Path

import pandas as pd


def load_transactions(file_path: str | Path) -> pd.DataFrame:
    """
    Load transactions from a CSV file.

    Args:
        file_path: Path to the CSV file.

    Returns:
        DataFrame containing the transaction records.

    Raises:
        FileNotFoundError: If the file does not exist.
        ValueError: If the CSV is empty or cannot be parsed.
    """
    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(f"Transaction file not found: {path}")

    try:
        df = pd.read_csv(path)
    except pd.errors.EmptyDataError as exc:
        raise ValueError("The transaction CSV is empty.") from exc
    except pd.errors.ParserError as exc:
        raise ValueError("The transaction CSV could not be parsed.") from exc

    if df.empty:
        raise ValueError("The transaction CSV contains no records.")

    return df