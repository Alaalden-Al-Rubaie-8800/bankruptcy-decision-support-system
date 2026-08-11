from pathlib import Path
import json
import pandas as pd
import numpy as np
import joblib
import matplotlib.pyplot as plt

from sklearn.metrics import (
    ConfusionMatrixDisplay, confusion_matrix, roc_curve,
    precision_recall_curve
)

from utils.model_utils import load_json, compute_metrics

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data" / "processed"
ARTIFACTS_DIR = ROOT / "artifacts"
RESULTS_DIR = ROOT / "results"

def evaluate_saved_model():
    test = pd.read_csv(DATA_DIR / "test.csv")
    meta = load_json(ARTIFACTS_DIR / "model_metadata.json")
    threshold = float(load_json(ARTIFACTS_DIR / "threshold.json")["threshold"])
    model = joblib.load(ARTIFACTS_DIR / "bankruptcy_model.joblib")

    feature_cols = meta["feature_names"]
    X_test = test[feature_cols]
    y_test = test["target"].astype(int)
    probs = model.predict_proba(X_test)[:, 1]

    metrics = compute_metrics(y_test, probs, threshold)
    metrics.update({
        "threshold": threshold,
        "test_rows": int(len(test)),
        "positive_cases_in_test": int(y_test.sum()),
        "model_key": meta["model_key"],
        "model_version": meta["model_version"],
    })

    RESULTS_DIR.mkdir(parents=True, exist_ok=True)
    with (RESULTS_DIR / "metrics.json").open("w", encoding="utf-8") as f:
        json.dump(metrics, f, ensure_ascii=False, indent=2)

    pred = (probs >= threshold).astype(int)

    prediction_table = pd.DataFrame({
        "record_id": test["record_id"].values if "record_id" in test.columns else np.arange(len(test)),
        "actual_target": y_test.values,
        "bankruptcy_probability": probs,
        "predicted_class": pred,
    })
    prediction_table.to_csv(RESULTS_DIR / "test_predictions.csv", index=False)

    cm = confusion_matrix(y_test, pred)
    disp = ConfusionMatrixDisplay(cm, display_labels=["Non-bankrupt", "Bankrupt"])
    disp.plot(values_format="d")
    plt.title("Confusion Matrix - Final Test")
    plt.tight_layout()
    plt.savefig(RESULTS_DIR / "confusion_matrix.png", dpi=160)
    plt.close()

    fpr, tpr, _ = roc_curve(y_test, probs)
    plt.figure()
    plt.plot(fpr, tpr, label=f"ROC AUC = {metrics['roc_auc']:.3f}")
    plt.plot([0, 1], [0, 1], linestyle="--")
    plt.xlabel("False Positive Rate")
    plt.ylabel("True Positive Rate")
    plt.title("ROC Curve - Final Test")
    plt.legend()
    plt.tight_layout()
    plt.savefig(RESULTS_DIR / "roc_curve.png", dpi=160)
    plt.close()

    precision, recall, _ = precision_recall_curve(y_test, probs)
    plt.figure()
    plt.plot(recall, precision, label=f"PR AUC = {metrics['pr_auc']:.3f}")
    plt.xlabel("Recall")
    plt.ylabel("Precision")
    plt.title("Precision-Recall Curve - Final Test")
    plt.legend()
    plt.tight_layout()
    plt.savefig(RESULTS_DIR / "precision_recall_curve.png", dpi=160)
    plt.close()

    # Global feature importance for tree model
    if hasattr(model, "feature_importances_"):
        importances = model.feature_importances_
        pd.DataFrame({
            "feature": feature_cols,
            "importance": importances
        }).sort_values("importance", ascending=False).to_csv(
            RESULTS_DIR / "feature_importance.csv", index=False
        )
        top = np.argsort(importances)[-20:]
        plt.figure(figsize=(8, 7))
        plt.barh(np.array(feature_cols)[top], importances[top])
        plt.xlabel("Importance")
        plt.title("Top 20 Feature Importances")
        plt.tight_layout()
        plt.savefig(RESULTS_DIR / "feature_importance.png", dpi=160)
        plt.close()
    else:
        # Pipeline with logistic model
        inner = model.named_steps["model"] if hasattr(model, "named_steps") else model
        coefs = np.abs(inner.coef_[0])
        top = np.argsort(coefs)[-20:]
        plt.figure(figsize=(8, 7))
        plt.barh(np.array(feature_cols)[top], coefs[top])
        plt.xlabel("Absolute coefficient")
        plt.title("Top 20 Feature Importances")
        plt.tight_layout()
        plt.savefig(RESULTS_DIR / "feature_importance.png", dpi=160)
        plt.close()

    print(json.dumps(metrics, indent=2))
    return metrics

if __name__ == "__main__":
    evaluate_saved_model()
