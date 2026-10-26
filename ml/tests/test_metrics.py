import numpy as np
import pytest
from ml.src.evaluation.metrics import (
    mean_absolute_error,
    r_squared,
    root_mean_squared_error,
)


def test_mean_absolute_error():
    actual = np.array([100, 200, 300])
    predicted = np.array([110, 190, 280])
    assert mean_absolute_error(actual, predicted) == pytest.approx(
        13.3333333333
    )


def test_root_mean_squared_error():
    actual = np.array([100, 200, 300])
    predicted = np.array([110, 190, 280])
    expected = np.sqrt((10**2 + 10**2 + 20**2) / 3)

    assert root_mean_squared_error(actual, predicted) == pytest.approx(
        expected
    )


def test_r_squared():
    actual = np.array([100, 200, 300])
    predicted = np.array([100, 200, 300])
    assert r_squared(actual, predicted) == pytest.approx(1.0)


def test_metrics_reject_mismatched_lengths():
    with pytest.raises(ValueError):
        mean_absolute_error(
            np.array([100, 200]),
            np.array([100]),
        )


def test_r_squared_rejects_constant_actual_values():
    with pytest.raises(ValueError, match="constant"):
        r_squared(
            np.array([100, 100, 100]),
            np.array([90, 100, 110]),
        )