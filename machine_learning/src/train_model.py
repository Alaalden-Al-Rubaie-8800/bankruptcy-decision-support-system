from pathlib import Path
import json
import pandas as pd
import joblib

from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, ExtraTreesClassifier
from sklearn.metrics import average_precision_score, roc_auc_score

from utils.model_utils import best_f2_threshold, save_model, save_json

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data" / "processed"
ARTIFACTS_DIR = ROOT / "artifacts"
RESULTS_DIR = ROOT / "results"

def get_models():
    return {
        "logistic_regression": Pipeline([
            ("scaler", StandardScaler()),
            ("model", LogisticRegression(
                max_iter=3000, class_weight="balanced", random_state=42
            ))
        ]),
        "random_forest": RandomForestClassifier(
            n_estimators=400,
            min_samples_leaf=2,
            class_weight="balanced_subsample",
            random_state=42,
            n_jobs=-1,
        ),
        "extra_trees": ExtraTreesClassifier(
            n_estimators=400,
            min_samples_leaf=2,
            class_weight="balanced",
            random_state=42,
            n_jobs=-1,
        ),
    }

def train_all_models():
    train = pd.read_csv(DATA_DIR / "train.csv")
    val = pd.read_csv(DATA_DIR / "validation.csv")
    feature_cols = [c for c in train.columns if c.startswith("t_minus_")]

    X_train, y_train = train[feature_cols], train["target"].astype(int)
    X_val, y_val = val[feature_cols], val["target"].astype(int)

    comparison = []
    trained = {}

    for name, model in get_models().items():
        print(f"Training: {name}")
        model.fit(X_train, y_train)
        probs = model.predict_proba(X_val)[:, 1]
        threshold_info = best_f2_threshold(y_val, probs)

        row = {
            "model": name,
            "validation_pr_auc": float(average_precision_score(y_val, probs)),
            "validation_roc_auc": float(roc_auc_score(y_val, probs)),
            "best_threshold": threshold_info["threshold"],
            "validation_f2": threshold_info["f2"],
            "validation_precision_at_threshold": threshold_info["precision"],
            "validation_recall_at_threshold": threshold_info["recall"],
        }
        comparison.append(row)
        trained[name] = model

    comparison_df = pd.DataFrame(comparison).sort_values(
        ["validation_f2", "validation_pr_auc"], ascending=False
    )
    RESULTS_DIR.mkdir(parents=True, exist_ok=True)
    comparison_df.to_csv(RESULTS_DIR / "model_comparison.csv", index=False)

    best_row = comparison_df.iloc[0].to_dict()
    best_name = best_row["model"]
    best_model = trained[best_name]

    save_model(best_model, ARTIFACTS_DIR / "bankruptcy_model.joblib")
    save_json({
        "threshold": float(best_row["best_threshold"]),
        "selection_metric": "F2 on validation",
        "reason": "F2 gives more weight to recall, suitable for early-warning bankruptcy detection"
    }, ARTIFACTS_DIR / "threshold.json")

    save_json({
        "model_name": best_model.__class__.__name__,
        "model_key": best_name,
        "model_version": "1.0.0",
        "feature_count": len(feature_cols),
        "feature_names": feature_cols,
        "training_years": "2013-2014",
        "validation_year": 2015,
        "test_year": 2016,
        "imbalance_strategy": "class_weight",
        "random_state": 42
    }, ARTIFACTS_DIR / "model_metadata.json")

    save_json(feature_cols, ARTIFACTS_DIR / "feature_names.json")

    print("Best model:", best_name)
    print("Best threshold:", best_row["best_threshold"])
    return comparison_df

if __name__ == "__main__":
    train_all_models()
