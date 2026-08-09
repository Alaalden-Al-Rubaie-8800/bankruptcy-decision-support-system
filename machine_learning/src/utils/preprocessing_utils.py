from pathlib import Path
import json
import numpy as np
import pandas as pd

FEATURE_PREFIX = "t_minus_"

def load_csv(path):
    return pd.read_csv(path)

def get_feature_columns(df):
    cols = [c for c in df.columns if c.startswith(FEATURE_PREFIX)]
    if len(cols) != 63:
        raise ValueError(f"Expected 63 features, found {len(cols)}")
    return cols

def check_missing_values(df):
    missing = df.isna().sum()
    return missing[missing > 0].sort_values(ascending=False)

def check_duplicates(df):
    return int(df.duplicated().sum())

def count_infinite_values(df, feature_cols):
    arr = df[feature_cols].to_numpy(dtype=float)
    return int(np.isinf(arr).sum())

def validate_target(df, target_col="target"):
    values = sorted(pd.Series(df[target_col].dropna().unique()).astype(int).tolist())
    if values != [0, 1]:
        raise ValueError(f"Target must contain only 0 and 1. Found: {values}")
    return df[target_col].value_counts().sort_index()

def compute_training_medians(df, feature_cols, split_col="split"):
    train = df[df[split_col] == "train"].copy()
    train[feature_cols] = train[feature_cols].replace([np.inf, -np.inf], np.nan)
    return train[feature_cols].median()

def clean_with_training_medians(df, feature_cols, medians):
    out = df.copy()
    out[feature_cols] = out[feature_cols].replace([np.inf, -np.inf], np.nan)
    out[feature_cols] = out[feature_cols].fillna(medians)
    return out

def split_by_label(df, split_col="split"):
    return (
        df[df[split_col] == "train"].copy(),
        df[df[split_col] == "validation"].copy(),
        df[df[split_col] == "test"].copy(),
    )

def save_json(data, path):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def class_distribution(df, target_col="target"):
    counts = df[target_col].value_counts().sort_index()
    total = len(df)
    return {
        int(k): {"count": int(v), "percentage": float(v / total * 100)}
        for k, v in counts.items()
    }
