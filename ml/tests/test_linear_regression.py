import numpy as np
import pytest
from ml.src.models.linear_regression import LinearRegression


def test_model_learns_linear_relationship():
    X = np.array([1, 2, 3, 4, 5], dtype=float)
    y = np.array([3, 5, 7, 9, 11], dtype=float)
    model = LinearRegression(
        learning_rate=0.01,
        n_iterations=5000,
    )

    model.fit(X, y)
    predictions = model.predict(X)

    assert np.mean((predictions - y) ** 2) < 0.01
    assert model.weights.shape == (1,)


def test_model_predicts_new_values():
    X = np.array([1, 2, 3, 4, 5], dtype=float)
    y = 2 * X + 1
    model = LinearRegression(
        learning_rate=0.01,
        n_iterations=5000,
    )

    model.fit(X, y)

    prediction = model.predict(np.array([6]))

    assert prediction.shape == (1,)
    assert prediction[0] == pytest.approx(13, abs=0.1)


def test_model_rejects_mismatched_sample_counts():
    model = LinearRegression()
    with pytest.raises(ValueError, match="same number of samples"):
        model.fit(
            np.array([1, 2, 3]),
            np.array([1, 2]),
        )


def test_model_cannot_predict_before_training():
    model = LinearRegression()
    with pytest.raises(ValueError, match="must be fitted"):
        model.predict(np.array([1, 2]))


def test_model_rejects_invalid_learning_rate():
    with pytest.raises(ValueError, match="Learning rate"):
        LinearRegression(learning_rate=0)


def test_cost_history_is_recorded():
    X = np.array([1, 2, 3], dtype=float)
    y = np.array([2, 4, 6], dtype=float)
    model = LinearRegression(n_iterations=1000)
    model.fit(X, y)

    assert len(model.cost_history) == 1000
    assert np.isfinite(model.cost_history).all()
    assert model.cost_history[-1] < model.cost_history[0]