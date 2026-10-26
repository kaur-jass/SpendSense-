import numpy as np


def mean_absolute_error(
    y_true: np.ndarray,
    y_pred: np.ndarray,
) -> float:
    """Calculate Mean Absolute Error (MAE)."""
    y_true = np.asarray(y_true, dtype=float).reshape(-1)
    y_pred = np.asarray(y_pred, dtype=float).reshape(-1)
    if y_true.size == 0 or y_true.shape != y_pred.shape:
        raise ValueError("Inputs must have the same non-zero length.")

    if not np.isfinite(y_true).all() or not np.isfinite(y_pred).all():
        raise ValueError("Inputs must contain only finite values.")

    return float(np.mean(np.abs(y_true - y_pred)))


def root_mean_squared_error(
    y_true: np.ndarray,
    y_pred: np.ndarray,
) -> float:
    """Calculate Root Mean Squared Error (RMSE)."""
    y_true = np.asarray(y_true, dtype=float).reshape(-1)
    y_pred = np.asarray(y_pred, dtype=float).reshape(-1)
    if y_true.size == 0 or y_true.shape != y_pred.shape:
        raise ValueError("Inputs must have the same non-zero length.")

    if not np.isfinite(y_true).all() or not np.isfinite(y_pred).all():
        raise ValueError("Inputs must contain only finite values.")

    return float(np.sqrt(np.mean((y_true - y_pred) ** 2)))


def r_squared(
    y_true: np.ndarray,
    y_pred: np.ndarray,
) -> float:
    """Calculate the coefficient of determination (R²)."""
    y_true = np.asarray(y_true, dtype=float).reshape(-1)
    y_pred = np.asarray(y_pred, dtype=float).reshape(-1)
    if y_true.size == 0 or y_true.shape != y_pred.shape:
        raise ValueError("Inputs must have the same non-zero length.")

    if not np.isfinite(y_true).all() or not np.isfinite(y_pred).all():
        raise ValueError("Inputs must contain only finite values.")

    ss_res = np.sum((y_true - y_pred) ** 2)
    ss_tot = np.sum((y_true - np.mean(y_true)) ** 2)

    if ss_tot == 0:
        raise ValueError("R² is undefined when actual values are constant.")

    return float(1 - ss_res / ss_tot)