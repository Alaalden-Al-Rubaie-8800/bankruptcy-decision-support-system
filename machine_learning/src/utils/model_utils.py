"""أدوات مشتركة لحفظ النماذج وحساب المقاييس واختيار أفضل Threshold."""

from pathlib import Path
import json

import joblib
import numpy as np

from sklearn.metrics import (
    average_precision_score,
    confusion_matrix,
    f1_score,
    fbeta_score,
    precision_score,
    recall_score,
    roc_auc_score,
)


def save_model(model, path):
    """حفظ نموذج Machine Learning باستخدام joblib."""

    path = Path(path)
    path.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    joblib.dump(
        model,
        path,
    )


def load_model(path):
    """تحميل نموذج Machine Learning محفوظ."""

    path = Path(path)

    if not path.exists():
        raise FileNotFoundError(
            f"Model file not found: {path}"
        )

    return joblib.load(path)


def save_json(data, path):
    """حفظ البيانات بصيغة JSON."""

    path = Path(path)

    path.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    with path.open(
        "w",
        encoding="utf-8",
    ) as file:
        json.dump(
            data,
            file,
            ensure_ascii=False,
            indent=2,
        )


def load_json(path):
    """تحميل ملف JSON."""

    path = Path(path)

    if not path.exists():
        raise FileNotFoundError(
            f"JSON file not found: {path}"
        )

    with path.open(
        "r",
        encoding="utf-8",
    ) as file:
        return json.load(file)


def _validate_evaluation_inputs(
    y_true,
    probabilities,
):
    """التحقق من صحة بيانات التقييم."""

    y_true_array = np.asarray(y_true)
    probs = np.asarray(
        probabilities,
        dtype=float,
    )

    if y_true_array.ndim != 1:
        raise ValueError(
            "y_true must be one-dimensional"
        )

    if probs.ndim != 1:
        raise ValueError(
            "probabilities must be one-dimensional"
        )

    if len(y_true_array) != len(probs):
        raise ValueError(
            "y_true and probabilities must have the same length"
        )

    if len(y_true_array) == 0:
        raise ValueError(
            "Evaluation data cannot be empty"
        )

    if not np.all(
        np.isfinite(probs)
    ):
        raise ValueError(
            "Probabilities contain NaN or infinite values"
        )

    if np.any(
        (probs < 0) | (probs > 1)
    ):
        raise ValueError(
            "Probabilities must be between 0 and 1"
        )

    classes = set(
        np.unique(
            y_true_array
        ).tolist()
    )

    if not classes.issubset(
        {0, 1}
    ):
        raise ValueError(
            "y_true must contain only binary labels 0 and 1"
        )

    return y_true_array, probs


def compute_metrics(
    y_true,
    probabilities,
    threshold,
):
    """حساب مقاييس تقييم النموذج عند Threshold محدد."""

    y_true_array, probs = (
        _validate_evaluation_inputs(
            y_true,
            probabilities,
        )
    )

    threshold = float(
        threshold
    )

    if not 0 <= threshold <= 1:
        raise ValueError(
            "threshold must be between 0 and 1"
        )

    pred = (
        probs >= threshold
    ).astype(int)

    return {
        "precision": float(
            precision_score(
                y_true_array,
                pred,
                zero_division=0,
            )
        ),
        "recall": float(
            recall_score(
                y_true_array,
                pred,
                zero_division=0,
            )
        ),
        "f1": float(
            f1_score(
                y_true_array,
                pred,
                zero_division=0,
            )
        ),
        "f2": float(
            fbeta_score(
                y_true_array,
                pred,
                beta=2,
                zero_division=0,
            )
        ),
        "roc_auc": float(
            roc_auc_score(
                y_true_array,
                probs,
            )
        ),
        "pr_auc": float(
            average_precision_score(
                y_true_array,
                probs,
            )
        ),
        "confusion_matrix": confusion_matrix(
            y_true_array,
            pred,
            labels=[0, 1],
        ).tolist(),
    }


def best_f2_threshold(
    y_true,
    probabilities,
):
    """
    اختيار أفضل Threshold بناءً على F2.

    عند تعادل F2 يتم تفضيل Recall الأعلى،
    ثم Precision الأعلى.
    """

    y_true_array, probs = (
        _validate_evaluation_inputs(
            y_true,
            probabilities,
        )
    )

    if len(
        np.unique(
            y_true_array
        )
    ) < 2:
        raise ValueError(
            "Threshold selection requires both classes 0 and 1"
        )

    candidates = np.unique(
        probs
    )

    best = {
        "threshold": 0.5,
        "f2": -1.0,
        "precision": 0.0,
        "recall": 0.0,
    }

    for threshold in candidates:
        pred = (
            probs >= threshold
        ).astype(int)

        precision = float(
            precision_score(
                y_true_array,
                pred,
                zero_division=0,
            )
        )

        recall = float(
            recall_score(
                y_true_array,
                pred,
                zero_division=0,
            )
        )

        f2 = float(
            fbeta_score(
                y_true_array,
                pred,
                beta=2,
                zero_division=0,
            )
        )

        is_better = (
            f2 > best["f2"]
            or (
                np.isclose(
                    f2,
                    best["f2"],
                )
                and recall > best["recall"]
            )
            or (
                np.isclose(
                    f2,
                    best["f2"],
                )
                and np.isclose(
                    recall,
                    best["recall"],
                )
                and precision > best["precision"]
            )
        )

        if is_better:
            best = {
                "threshold": float(
                    threshold
                ),
                "f2": f2,
                "precision": precision,
                "recall": recall,
            }

    return best