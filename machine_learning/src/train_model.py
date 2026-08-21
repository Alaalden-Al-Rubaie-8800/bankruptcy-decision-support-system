"""تدريب ومقارنة نماذج التنبؤ بمخاطر الإفلاس واختيار أفضل نموذج."""

from pathlib import Path

import pandas as pd

from sklearn.ensemble import ExtraTreesClassifier, RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import average_precision_score, roc_auc_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

from utils.model_utils import (
    best_f2_threshold,
    load_json,
    save_json,
    save_model,
)


ROOT = Path(__file__).resolve().parents[1]

DATA_DIR = ROOT / "data" / "processed"
ARTIFACTS_DIR = ROOT / "artifacts"
RESULTS_DIR = ROOT / "results"

EXPECTED_FEATURE_COUNT = 63
TARGET_COLUMN = "target"


def get_models():
    """إرجاع النماذج المرشحة للمقارنة."""

    return {
        "logistic_regression": Pipeline(
            [
                (
                    "scaler",
                    StandardScaler(),
                ),
                (
                    "model",
                    LogisticRegression(
                        max_iter=3000,
                        class_weight="balanced",
                        random_state=42,
                    ),
                ),
            ]
        ),
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


def validate_training_data(
    train: pd.DataFrame,
    val: pd.DataFrame,
    feature_cols: list[str],
    training_medians: dict,
) -> None:
    """التحقق من صحة بيانات التدريب والـValidation والـArtifacts."""

    if train.empty:
        raise ValueError(
            "Training dataset is empty"
        )

    if val.empty:
        raise ValueError(
            "Validation dataset is empty"
        )

    if TARGET_COLUMN not in train.columns:
        raise ValueError(
            f"Training data is missing target column: {TARGET_COLUMN}"
        )

    if TARGET_COLUMN not in val.columns:
        raise ValueError(
            f"Validation data is missing target column: {TARGET_COLUMN}"
        )

    if len(feature_cols) != EXPECTED_FEATURE_COUNT:
        raise ValueError(
            f"Expected {EXPECTED_FEATURE_COUNT} model features, "
            f"but found {len(feature_cols)}"
        )

    missing_validation_features = [
        feature
        for feature in feature_cols
        if feature not in val.columns
    ]

    if missing_validation_features:
        preview = ", ".join(
            missing_validation_features[:5]
        )

        raise ValueError(
            f"Validation data is missing "
            f"{len(missing_validation_features)} required features. "
            f"First missing: {preview}"
        )

    missing_medians = [
        feature
        for feature in feature_cols
        if feature not in training_medians
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

    train_target = pd.to_numeric(
        train[TARGET_COLUMN],
        errors="coerce",
    )

    val_target = pd.to_numeric(
        val[TARGET_COLUMN],
        errors="coerce",
    )

    if train_target.isna().any():
        raise ValueError(
            "Training target contains invalid values"
        )

    if val_target.isna().any():
        raise ValueError(
            "Validation target contains invalid values"
        )

    train_classes = set(
        train_target.astype(int)
        .unique()
        .tolist()
    )

    val_classes = set(
        val_target.astype(int)
        .unique()
        .tolist()
    )

    expected_classes = {0, 1}

    if train_classes != expected_classes:
        raise ValueError(
            "Training target must contain both classes 0 and 1"
        )

    if val_classes != expected_classes:
        raise ValueError(
            "Validation target must contain both classes 0 and 1"
        )


def prepare_features(
    df: pd.DataFrame,
    feature_cols: list[str],
    training_medians: dict,
) -> pd.DataFrame:
    """
    تجهيز الـFeatures باستخدام Medians المحسوبة
    مسبقًا من Training فقط.
    """

    features = df[
        feature_cols
    ].copy()

    for feature in feature_cols:
        features[feature] = pd.to_numeric(
            features[feature],
            errors="coerce",
        )

        features[feature] = features[feature].fillna(
            float(
                training_medians[feature]
            )
        )

    return features


def train_all_models():
    """تدريب النماذج ومقارنتها وحفظ أفضل نموذج وملفاته."""

    train_path = (
        DATA_DIR / "train.csv"
    )

    validation_path = (
        DATA_DIR / "validation.csv"
    )

    medians_path = (
        ARTIFACTS_DIR / "training_medians.json"
    )

    required_files = [
        train_path,
        validation_path,
        medians_path,
    ]

    missing_files = [
        path
        for path in required_files
        if not path.exists()
    ]

    if missing_files:
        raise FileNotFoundError(
            "Missing required training files: "
            + ", ".join(
                str(path)
                for path in missing_files
            )
        )

    train = pd.read_csv(
        train_path
    )

    val = pd.read_csv(
        validation_path
    )

    training_medians = load_json(
        medians_path
    )

    feature_cols = [
        column
        for column in train.columns
        if column.startswith(
            "t_minus_"
        )
    ]

    validate_training_data(
        train,
        val,
        feature_cols,
        training_medians,
    )

    X_train = prepare_features(
        train,
        feature_cols,
        training_medians,
    )

    y_train = pd.to_numeric(
        train[TARGET_COLUMN],
        errors="raise",
    ).astype(int)

    X_val = prepare_features(
        val,
        feature_cols,
        training_medians,
    )

    y_val = pd.to_numeric(
        val[TARGET_COLUMN],
        errors="raise",
    ).astype(int)

    ARTIFACTS_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    RESULTS_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    comparison = []
    trained_models = {}

    for name, model in get_models().items():
        print(
            f"Training: {name}"
        )

        model.fit(
            X_train,
            y_train,
        )

        probabilities = model.predict_proba(
            X_val
        )[:, 1]

        threshold_info = best_f2_threshold(
            y_val,
            probabilities,
        )

        row = {
            "model": name,
            "validation_pr_auc": float(
                average_precision_score(
                    y_val,
                    probabilities,
                )
            ),
            "validation_roc_auc": float(
                roc_auc_score(
                    y_val,
                    probabilities,
                )
            ),
            "best_threshold": float(
                threshold_info[
                    "threshold"
                ]
            ),
            "validation_f2": float(
                threshold_info[
                    "f2"
                ]
            ),
            "validation_precision_at_threshold": float(
                threshold_info[
                    "precision"
                ]
            ),
            "validation_recall_at_threshold": float(
                threshold_info[
                    "recall"
                ]
            ),
        }

        comparison.append(
            row
        )

        trained_models[
            name
        ] = model

    comparison_df = pd.DataFrame(
        comparison
    ).sort_values(
        [
            "validation_f2",
            "validation_pr_auc",
        ],
        ascending=False,
    )

    comparison_df.to_csv(
        RESULTS_DIR / "model_comparison.csv",
        index=False,
    )

    best_row = (
        comparison_df
        .iloc[0]
        .to_dict()
    )

    best_name = (
        best_row[
            "model"
        ]
    )

    best_model = (
        trained_models[
            best_name
        ]
    )

    save_model(
        best_model,
        ARTIFACTS_DIR
        / "bankruptcy_model.joblib",
    )

    save_json(
        {
            "threshold": float(
                best_row[
                    "best_threshold"
                ]
            ),
            "selection_metric": (
                "F2 on validation"
            ),
            "reason": (
                "F2 gives more weight to recall, "
                "suitable for early-warning bankruptcy detection"
            ),
        },
        ARTIFACTS_DIR
        / "threshold.json",
    )

    save_json(
        {
            "model_name": (
                best_model
                .__class__
                .__name__
            ),
            "model_key": (
                best_name
            ),
            "model_version": (
                "1.0.0"
            ),
            "feature_count": (
                len(
                    feature_cols
                )
            ),
            "feature_names": (
                feature_cols
            ),
            "training_years": (
                "2013-2014"
            ),
            "validation_year": 2015,
            "test_year": 2016,
            "imbalance_strategy": (
                "class_weight"
            ),
            "random_state": 42,
        },
        ARTIFACTS_DIR
        / "model_metadata.json",
    )

    save_json(
        feature_cols,
        ARTIFACTS_DIR
        / "feature_names.json",
    )

    print(
        "Best model:",
        best_name,
    )

    print(
        "Best threshold:",
        best_row[
            "best_threshold"
        ],
    )

    return comparison_df


if __name__ == "__main__":
    train_all_models()