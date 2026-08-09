from pathlib import Path
import json
import pandas as pd
import numpy as np

from utils.preprocessing_utils import (
    load_csv, get_feature_columns, check_missing_values, check_duplicates,
    count_infinite_values, validate_target, compute_training_medians,
    clean_with_training_medians, split_by_label, class_distribution, save_json
)

ROOT = Path(__file__).resolve().parents[1]
RAW_PATH = ROOT / "data" / "raw" / "original_dataset.csv"
PROCESSED_DIR = ROOT / "data" / "processed"
ARTIFACTS_DIR = ROOT / "artifacts"
RESULTS_DIR = ROOT / "results"

def run_preprocessing():
    # BLOCK 01 - Load raw data
    df = load_csv(RAW_PATH)
    print(f"Raw shape: {df.shape}")

    # BLOCK 02 - Inspect structure
    feature_cols = get_feature_columns(df)
    print(f"Feature count: {len(feature_cols)}")

    # BLOCK 03 - Check data types
    print("Feature dtypes:")
    print(df[feature_cols].dtypes.value_counts())

    # BLOCK 04 - Missing values
    missing_before = int(df[feature_cols].isna().sum().sum())
    print(f"Missing feature values before cleaning: {missing_before}")

    # BLOCK 05 - Duplicates
    duplicates = check_duplicates(df)
    print(f"Full duplicate rows: {duplicates}")

    # BLOCK 06 - Invalid infinite values
    infinite_before = count_infinite_values(df, feature_cols)
    print(f"Infinite values before cleaning: {infinite_before}")

    # BLOCK 07 - Validate target
    target_counts = validate_target(df)
    print("Target distribution:")
    print(target_counts)

    # BLOCK 08 - Compute medians from TRAIN ONLY
    medians = compute_training_medians(df, feature_cols)

    # BLOCK 09 - Clean invalid/missing feature values
    cleaned = clean_with_training_medians(df, feature_cols, medians)

    # BLOCK 10 - Validate after cleaning
    missing_after = int(cleaned[feature_cols].isna().sum().sum())
    infinite_after = count_infinite_values(cleaned, feature_cols)
    if missing_after != 0 or infinite_after != 0:
        raise RuntimeError("Cleaning validation failed.")

    # BLOCK 11 - Prepare splits
    train_df, val_df, test_df = split_by_label(cleaned)

    # BLOCK 12 - Save processed data
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    cleaned.to_csv(PROCESSED_DIR / "cleaned_dataset.csv", index=False)
    train_df.to_csv(PROCESSED_DIR / "train.csv", index=False)
    val_df.to_csv(PROCESSED_DIR / "validation.csv", index=False)
    test_df.to_csv(PROCESSED_DIR / "test.csv", index=False)

    # BLOCK 13 - Save medians for future predictions
    save_json({k: float(v) for k, v in medians.items()},
              ARTIFACTS_DIR / "training_medians.json")

    # BLOCK 14 - Cleaning report
    report = {
        "raw_rows": int(len(df)),
        "raw_columns": int(df.shape[1]),
        "feature_count": len(feature_cols),
        "missing_before": missing_before,
        "missing_after": missing_after,
        "duplicates": duplicates,
        "infinite_before": infinite_before,
        "infinite_after": infinite_after,
        "train_rows": int(len(train_df)),
        "validation_rows": int(len(val_df)),
        "test_rows": int(len(test_df)),
        "class_distribution_train": class_distribution(train_df),
        "class_distribution_validation": class_distribution(val_df),
        "class_distribution_test": class_distribution(test_df),
        "imputation_strategy": "Median values computed from TRAIN split only",
    }
    save_json(report, RESULTS_DIR / "cleaning_report.json")
    print("Preprocessing completed successfully.")
    return report

if __name__ == "__main__":
    run_preprocessing()
