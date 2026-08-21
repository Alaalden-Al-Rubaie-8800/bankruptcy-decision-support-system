"""دوال مساعدة لتجهيز وتنظيف بيانات Machine Learning."""

from pathlib import Path
import json

import numpy as np
import pandas as pd


FEATURE_PREFIX = "t_minus_"
EXPECTED_FEATURE_COUNT = 63
REQUIRED_SPLITS = {"train", "validation", "test"}


def load_csv(path):
    """تحميل ملف CSV بعد التأكد من وجوده."""

    path = Path(path)

    if not path.exists():
        raise FileNotFoundError(
            f"CSV file not found: {path}"
        )

    df = pd.read_csv(path)

    if df.empty:
        raise ValueError(
            f"CSV file is empty: {path}"
        )

    return df


def get_feature_columns(df):
    """استخراج الـ63 Feature المستخدمة في النموذج."""

    cols = [
        column
        for column in df.columns
        if column.startswith(FEATURE_PREFIX)
    ]

    if len(cols) != EXPECTED_FEATURE_COUNT:
        raise ValueError(
            f"Expected {EXPECTED_FEATURE_COUNT} features, "
            f"found {len(cols)}"
        )

    return cols


def check_missing_values(df):
    """إرجاع الأعمدة التي تحتوي على قيم مفقودة."""

    missing = df.isna().sum()

    return missing[
        missing > 0
    ].sort_values(
        ascending=False
    )


def check_duplicates(df):
    """حساب عدد الصفوف المكررة بالكامل."""

    return int(
        df.duplicated().sum()
    )


def count_infinite_values(
    df,
    feature_cols,
):
    """حساب قيم +inf و-inf في الـFeatures."""

    numeric = df[
        feature_cols
    ].apply(
        pd.to_numeric,
        errors="coerce",
    )

    arr = numeric.to_numpy(
        dtype=float
    )

    return int(
        np.isinf(arr).sum()
    )


def validate_target(
    df,
    target_col="target",
):
    """التحقق من أن Target ثنائي ويحتوي على 0 و1 فقط."""

    if target_col not in df.columns:
        raise ValueError(
            f"Missing target column: {target_col}"
        )

    if df[target_col].isna().any():
        raise ValueError(
            "Target column contains missing values"
        )

    numeric_target = pd.to_numeric(
        df[target_col],
        errors="coerce",
    )

    if numeric_target.isna().any():
        raise ValueError(
            "Target column contains non-numeric values"
        )

    values = sorted(
        numeric_target
        .astype(int)
        .unique()
        .tolist()
    )

    if values != [0, 1]:
        raise ValueError(
            f"Target must contain both 0 and 1. "
            f"Found: {values}"
        )

    return (
        numeric_target
        .astype(int)
        .value_counts()
        .sort_index()
    )


def validate_splits(
    df,
    split_col="split",
):
    """التحقق من وجود Train وValidation وTest."""

    if split_col not in df.columns:
        raise ValueError(
            f"Missing split column: {split_col}"
        )

    split_values = set(
        df[split_col]
        .dropna()
        .astype(str)
        .str.strip()
        .str.lower()
        .unique()
        .tolist()
    )

    missing_splits = (
        REQUIRED_SPLITS
        - split_values
    )

    if missing_splits:
        raise ValueError(
            "Missing required dataset splits: "
            + ", ".join(
                sorted(
                    missing_splits
                )
            )
        )


def compute_training_medians(
    df,
    feature_cols,
    split_col="split",
):
    """
    حساب Median لكل Feature من Training فقط
    لمنع Data Leakage.
    """

    validate_splits(
        df,
        split_col,
    )

    train = df[
        df[split_col]
        .astype(str)
        .str.strip()
        .str.lower()
        == "train"
    ].copy()

    if train.empty:
        raise ValueError(
            "Training split is empty"
        )

    train[feature_cols] = (
        train[feature_cols]
        .apply(
            pd.to_numeric,
            errors="coerce",
        )
        .replace(
            [np.inf, -np.inf],
            np.nan,
        )
    )

    medians = train[
        feature_cols
    ].median()

    invalid_medians = [
        feature
        for feature in feature_cols
        if pd.isna(
            medians[feature]
        )
    ]

    if invalid_medians:
        preview = ", ".join(
            invalid_medians[:5]
        )

        raise ValueError(
            f"Could not calculate training median for "
            f"{len(invalid_medians)} features. "
            f"First invalid: {preview}"
        )

    return medians


def clean_with_training_medians(
    df,
    feature_cols,
    medians,
):
    """
    تنظيف Features باستخدام Medians المحسوبة
    من Training فقط.
    """

    out = df.copy()

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
            f"Missing medians for "
            f"{len(missing_medians)} features. "
            f"First missing: {preview}"
        )

    out[feature_cols] = (
        out[feature_cols]
        .apply(
            pd.to_numeric,
            errors="coerce",
        )
        .replace(
            [np.inf, -np.inf],
            np.nan,
        )
    )

    out[feature_cols] = (
        out[feature_cols]
        .fillna(
            medians
        )
    )

    return out


def split_by_label(
    df,
    split_col="split",
):
    """تقسيم البيانات إلى Train وValidation وTest."""

    validate_splits(
        df,
        split_col,
    )

    normalized_split = (
        df[split_col]
        .astype(str)
        .str.strip()
        .str.lower()
    )

    train = df[
        normalized_split == "train"
    ].copy()

    validation = df[
        normalized_split == "validation"
    ].copy()

    test = df[
        normalized_split == "test"
    ].copy()

    if train.empty:
        raise ValueError(
            "Training split is empty"
        )

    if validation.empty:
        raise ValueError(
            "Validation split is empty"
        )

    if test.empty:
        raise ValueError(
            "Test split is empty"
        )

    return (
        train,
        validation,
        test,
    )


def save_json(
    data,
    path,
):
    """حفظ البيانات في ملف JSON."""

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


def class_distribution(
    df,
    target_col="target",
):
    """حساب توزيع الفئات وعدد ونسبة كل فئة."""

    if df.empty:
        raise ValueError(
            "Cannot calculate class distribution for empty data"
        )

    if target_col not in df.columns:
        raise ValueError(
            f"Missing target column: {target_col}"
        )

    counts = (
        df[target_col]
        .astype(int)
        .value_counts()
        .sort_index()
    )

    total = len(df)

    return {
        int(label): {
            "count": int(count),
            "percentage": float(
                count / total * 100
            ),
        }
        for label, count in counts.items()
    }