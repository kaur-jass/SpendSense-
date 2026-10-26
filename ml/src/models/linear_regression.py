import numpy as np


class LinearRegression:
    """Linear Regression implemented using NumPy and gradient descent."""

    def __init__(
        self,
        learning_rate: float = 0.01,
        n_iterations: int = 1000,
    ):
        if learning_rate <= 0:
            raise ValueError("Learning rate must be positive.")

        if n_iterations <= 0:
            raise ValueError("Number of iterations must be positive.")

        self.learning_rate = learning_rate
        self.n_iterations = n_iterations
        self.weights = None
        self.bias = 0.0
        self.cost_history = []

    def _prepare_features(self, X: np.ndarray) -> np.ndarray:
        """Convert features to a two-dimensional NumPy array."""
        X = np.asarray(X, dtype=float)

        if X.ndim == 1:
            X = X.reshape(-1, 1)

        if X.ndim != 2:
            raise ValueError("X must be a one- or two-dimensional array.")

        if X.shape[0] == 0 or X.shape[1] == 0:
            raise ValueError("X cannot be empty.")

        if not np.isfinite(X).all():
            raise ValueError("X must contain only finite values.")

        return X

    def _prepare_target(self, y: np.ndarray) -> np.ndarray:
        """Convert target values to a one-dimensional array."""
        y = np.asarray(y, dtype=float).reshape(-1)

        if y.size == 0:
            raise ValueError("y cannot be empty.")

        if not np.isfinite(y).all():
            raise ValueError("y must contain only finite values.")

        return y

    def compute_cost(
        self,
        X: np.ndarray,
        y: np.ndarray,
    ) -> float:
        """Calculate mean squared error cost with a half factor."""
        predictions = X @ self.weights + self.bias
        errors = predictions - y

        return float(np.sum(errors**2) / (2 * len(y)))

    def fit(
        self,
        X: np.ndarray,
        y: np.ndarray,
    ) -> "LinearRegression":
        """Train the model using batch gradient descent."""
        X = self._prepare_features(X)
        y = self._prepare_target(y)

        if X.shape[0] != y.shape[0]:
            raise ValueError("X and y must contain the same number of samples.")

        self.weights = np.zeros(X.shape[1], dtype=float)
        self.bias = 0.0
        self.cost_history = []

        m = X.shape[0]

        for _ in range(self.n_iterations):
            predictions = X @ self.weights + self.bias
            errors = predictions - y

            dw = (X.T @ errors) / m
            db = np.sum(errors) / m

            self.weights -= self.learning_rate * dw
            self.bias -= self.learning_rate * db

            self.cost_history.append(self.compute_cost(X, y))

        return self

    def predict(self, X: np.ndarray) -> np.ndarray:
        """Predict target values for new samples."""
        if self.weights is None:
            raise ValueError("Model must be fitted before making predictions.")

        X = self._prepare_features(X)

        if X.shape[1] != len(self.weights):
            raise ValueError(
                "X has a different number of features than training data."
            )

        return X @ self.weights + self.bias