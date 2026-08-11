from pathlib import Path
import json
import joblib
import numpy as np
from sklearn.metrics import (
    precision_score, recall_score, f1_score, fbeta_score,
    roc_auc_score, average_precision_score, confusion_matrix
)

def save_model(model, path):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, path)

def load_model(path):
    return joblib.load(path)

def save_json(data, path):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def load_json(path):
    with Path(path).open("r", encoding="utf-8") as f:
        return json.load(f)

def compute_metrics(y_true, probabilities, threshold):
    pred = (np.asarray(probabilities) >= threshold).astype(int)
    return {
        "precision": float(precision_score(y_true, pred, zero_division=0)),
        "recall": float(recall_score(y_true, pred, zero_division=0)),
        "f1": float(f1_score(y_true, pred, zero_division=0)),
        "f2": float(fbeta_score(y_true, pred, beta=2, zero_division=0)),
        "roc_auc": float(roc_auc_score(y_true, probabilities)),
        "pr_auc": float(average_precision_score(y_true, probabilities)),
        "confusion_matrix": confusion_matrix(y_true, pred).tolist(),
    }

def best_f2_threshold(y_true, probabilities):
    probs = np.asarray(probabilities)
    candidates = np.unique(probs)
    best = {"threshold": 0.5, "f2": -1.0, "precision": 0.0, "recall": 0.0}
    for t in candidates:
        pred = (probs >= t).astype(int)
        f2 = fbeta_score(y_true, pred, beta=2, zero_division=0)
        if f2 > best["f2"]:
            best = {
                "threshold": float(t),
                "f2": float(f2),
                "precision": float(precision_score(y_true, pred, zero_division=0)),
                "recall": float(recall_score(y_true, pred, zero_division=0)),
            }
    return best
