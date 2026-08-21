"""تقييم النموذج النهائي على مجموعة الاختبار وحفظ النتائج والرسومات."""

from pathlib import Path
import json

import joblib
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

from sklearn.metrics import (
    ConfusionMatrixDisplay,
    confusion_matrix,
    precision_recall_curve,
    roc_curve,
)

from utils.model_utils import compute_metrics, load_json


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data" / "processed"
ARTIFACTS_DIR = ROOT / "artifacts"
RESULTS_DIR = ROOT / "results"

TARGET_COLUMN = "target"


def prepare_test_data(
    test: pd.DataFrame,
    feature_cols: list[str],
    medians: dict,
) -> tuple[pd.DataFrame, pd.Series]:
    """
    التحقق من بيانات الاختبار وتجهيزها بنفس معالجة
    القيم المفقودة المستخدمة أثناء التدريب والتنبؤ.
    """

    if test.empty:
        raise ValueError("Test dataset is empty")

    if TARGET_COLUMN not in test.columns:
        raise ValueError(
            f"Test dataset is missing target column: {TARGET_COLUMN}"
        )

    missing_features = [
        feature
        for feature in feature_cols
        if feature not in test.columns
    ]

    if missing_features:
        preview = ", ".join(
            missing_features[:5]
        )

        raise ValueError(
            f"Test dataset is missing "
            f"{len(missing_features)} required features. "
            f"First missing: {preview}"
        )

    missing_medians = [
        feature
        for feature in feature_cols
        if feature not in medians
    ]

    if missing_medians:
        preview = ", ".join(
            missing_medians[:5]
        )

        raise ValueError(
            f"Training medians are missing for "
            f"{len(missing_medians)} features. "
            f"First missing: {preview}"
        )

    X_test = test[feature_cols].copy()

    X_test = X_test.replace(
        [np.inf, -np.inf],
        np.nan,
    )

    for feature in feature_cols:
        X_test[feature] = pd.to_numeric(
            X_test[feature],
            errors="coerce",
        )

        X_test[feature] = X_test[feature].fillna(
            float(medians[feature])
        )

    y_test = pd.to_numeric(
        test[TARGET_COLUMN],
        errors="raise",
    ).astype(int)

    classes = set(
        y_test.unique().tolist()
    )

    if classes != {0, 1}:
        raise ValueError(
            "Test target must contain both classes 0 and 1"
        )

    return X_test, y_test


def save_feature_importance(
    model,
    feature_cols: list[str],
) -> None:
    """
    حفظ أهم الخصائص للمودل النهائي.

    يدعم النماذج الشجرية وLogistic Regression
    الموجود داخل Pipeline.
    """

    feature_names = np.array(
        feature_cols
    )

    if hasattr(model, "feature_importances_"):
        importances = np.asarray(
            model.feature_importances_,
            dtype=float,
        )

        importance_label = "importance"

    else:
        inner_model = (
            model.named_steps.get("model")
            if hasattr(model, "named_steps")
            else model
        )

        if not hasattr(inner_model, "coef_"):
            print(
                "Feature importance is not available "
                "for the selected model."
            )
            return

        importances = np.abs(
            np.asarray(
                inner_model.coef_[0],
                dtype=float,
            )
        )

        importance_label = "absolute_coefficient"

    if len(importances) != len(feature_cols):
        raise ValueError(
            "Feature importance count does not match "
            "the number of model features"
        )

    importance_table = pd.DataFrame(
        {
            "feature": feature_cols,
            importance_label: importances,
        }
    ).sort_values(
        importance_label,
        ascending=False,
    )

    importance_table.to_csv(
        RESULTS_DIR / "feature_importance.csv",
        index=False,
    )

    top_count = min(
        20,
        len(importances),
    )

    top_indices = np.argsort(
        importances
    )[-top_count:]

    plt.figure(
        figsize=(8, 7)
    )

    plt.barh(
        feature_names[top_indices],
        importances[top_indices],
    )

    if importance_label == "importance":
        plt.xlabel("Importance")
    else:
        plt.xlabel("Absolute coefficient")

    plt.title(
        f"Top {top_count} Feature Importances"
    )

    plt.tight_layout()

    plt.savefig(
        RESULTS_DIR / "feature_importance.png",
        dpi=160,
    )

    plt.close()


def evaluate_saved_model():
    """
    تقييم النموذج المحفوظ على Test Set النهائي
    وحفظ المقاييس والتنبؤات والرسومات.
    """

    test_path = DATA_DIR / "test.csv"
    model_path = ARTIFACTS_DIR / "bankruptcy_model.joblib"
    metadata_path = ARTIFACTS_DIR / "model_metadata.json"
    threshold_path = ARTIFACTS_DIR / "threshold.json"
    medians_path = ARTIFACTS_DIR / "training_medians.json"

    required_files = [
        test_path,
        model_path,
        metadata_path,
        threshold_path,
        medians_path,
    ]

    missing_files = [
        path
        for path in required_files
        if not path.exists()
    ]

    if missing_files:
        raise FileNotFoundError(
            "Missing required evaluation files: "
            + ", ".join(
                str(path)
                for path in missing_files
            )
        )

    test = pd.read_csv(
        test_path
    )

    meta = load_json(
        metadata_path
    )

    threshold_data = load_json(
        threshold_path
    )

    medians = load_json(
        medians_path
    )

    threshold = float(
        threshold_data["threshold"]
    )

    if not 0 <= threshold <= 1:
        raise ValueError(
            f"Invalid classification threshold: {threshold}"
        )

    model = joblib.load(
        model_path
    )

    feature_cols = meta.get(
        "feature_names"
    )

    if not feature_cols:
        raise ValueError(
            "Model metadata does not contain feature_names"
        )

    expected_feature_count = int(
        meta.get(
            "feature_count",
            len(feature_cols),
        )
    )

    if len(feature_cols) != expected_feature_count:
        raise ValueError(
            "Feature count in model metadata does not match "
            "the number of feature names"
        )

    X_test, y_test = prepare_test_data(
        test,
        feature_cols,
        medians,
    )

    probabilities = model.predict_proba(
        X_test
    )[:, 1]

    metrics = compute_metrics(
        y_test,
        probabilities,
        threshold,
    )

    metrics.update(
        {
            "threshold": threshold,
            "test_rows": int(
                len(test)
            ),
            "positive_cases_in_test": int(
                y_test.sum()
            ),
            "negative_cases_in_test": int(
                (y_test == 0).sum()
            ),
            "model_key": meta["model_key"],
            "model_version": meta["model_version"],
            "feature_count": len(
                feature_cols
            ),
        }
    )

    RESULTS_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    with (
        RESULTS_DIR / "metrics.json"
    ).open(
        "w",
        encoding="utf-8",
    ) as file:
        json.dump(
            metrics,
            file,
            ensure_ascii=False,
            indent=2,
        )

    predictions = (
        probabilities >= threshold
    ).astype(int)

    if "record_id" in test.columns:
        record_ids = test[
            "record_id"
        ].values
    else:
        record_ids = np.arange(
            len(test)
        )

    prediction_table = pd.DataFrame(
        {
            "record_id": record_ids,
            "actual_target": y_test.values,
            "bankruptcy_probability": probabilities,
            "predicted_class": predictions,
        }
    )

    prediction_table.to_csv(
        RESULTS_DIR / "test_predictions.csv",
        index=False,
    )

    #
    # Confusion Matrix
    #
    matrix = confusion_matrix(
        y_test,
        predictions,
        labels=[0, 1],
    )

    display = ConfusionMatrixDisplay(
        confusion_matrix=matrix,
        display_labels=[
            "Non-bankrupt",
            "Bankrupt",
        ],
    )

    display.plot(
        values_format="d"
    )

    plt.title(
        "Confusion Matrix - Final Test"
    )

    plt.tight_layout()

    plt.savefig(
        RESULTS_DIR / "confusion_matrix.png",
        dpi=160,
    )

    plt.close()

    #
    # ROC Curve
    #
    fpr, tpr, _ = roc_curve(
        y_test,
        probabilities,
    )

    plt.figure()

    plt.plot(
        fpr,
        tpr,
        label=(
            f"ROC AUC = "
            f"{metrics['roc_auc']:.3f}"
        ),
    )

    plt.plot(
        [0, 1],
        [0, 1],
        linestyle="--",
    )

    plt.xlabel(
        "False Positive Rate"
    )

    plt.ylabel(
        "True Positive Rate"
    )

    plt.title(
        "ROC Curve - Final Test"
    )

    plt.legend()

    plt.tight_layout()

    plt.savefig(
        RESULTS_DIR / "roc_curve.png",
        dpi=160,
    )

    plt.close()

    #
    # Precision-Recall Curve
    #
    precision, recall, _ = (
        precision_recall_curve(
            y_test,
            probabilities,
        )
    )

    plt.figure()

    plt.plot(
        recall,
        precision,
        label=(
            f"PR AUC = "
            f"{metrics['pr_auc']:.3f}"
        ),
    )

    plt.xlabel(
        "Recall"
    )

    plt.ylabel(
        "Precision"
    )

    plt.title(
        "Precision-Recall Curve - Final Test"
    )

    plt.legend()

    plt.tight_layout()

    plt.savefig(
        RESULTS_DIR / "precision_recall_curve.png",
        dpi=160,
    )

    plt.close()

    save_feature_importance(
        model,
        feature_cols,
    )

    print(
        json.dumps(
            metrics,
            ensure_ascii=False,
            indent=2,
        )
    )

    return metrics


if __name__ == "__main__":
    evaluate_saved_model()