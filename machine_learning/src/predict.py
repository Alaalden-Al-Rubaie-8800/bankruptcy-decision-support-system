"""واجهة التنبؤ المستخدمة لربط نموذج الإفلاس مع الـBackend."""

from pathlib import Path
import json

import joblib
import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
ARTIFACTS_DIR = ROOT / "artifacts"

MODEL = joblib.load(ARTIFACTS_DIR / "bankruptcy_model.joblib")

with (ARTIFACTS_DIR / "threshold.json").open("r", encoding="utf-8") as f:
    THRESHOLD = float(json.load(f)["threshold"])

with (ARTIFACTS_DIR / "model_metadata.json").open("r", encoding="utf-8") as f:
    METADATA = json.load(f)

with (ARTIFACTS_DIR / "training_medians.json").open("r", encoding="utf-8") as f:
    MEDIANS = json.load(f)

FEATURES = METADATA["feature_names"]


def prepare_input(features) -> pd.DataFrame:
    """تحويل مدخل شركة واحدة إلى ترتيب الـ63 Feature المطلوب للنموذج."""

    if isinstance(features, dict):
        missing = [name for name in FEATURES if name not in features]
        if missing:
            preview = ", ".join(missing[:5])
            raise ValueError(
                f"Missing {len(missing)} required features. First missing: {preview}"
            )

        row = {name: features[name] for name in FEATURES}
        df = pd.DataFrame([row])

    elif isinstance(features, (list, tuple, np.ndarray)):
        if len(features) != len(FEATURES):
            raise ValueError(
                f"Expected {len(FEATURES)} values, got {len(features)}"
            )

        df = pd.DataFrame([features], columns=FEATURES)

    elif isinstance(features, pd.DataFrame):
        if len(features) != 1:
            raise ValueError("Prediction expects exactly one company row")

        missing = [name for name in FEATURES if name not in features.columns]
        if missing:
            preview = ", ".join(missing[:5])
            raise ValueError(
                f"Missing {len(missing)} required feature columns. First missing: {preview}"
            )

        df = features[FEATURES].copy()

    else:
        raise TypeError(
            "features must be dict, list/tuple/array, or pandas DataFrame"
        )

    df = df[FEATURES].replace([np.inf, -np.inf], np.nan)

    for name in FEATURES:
        df[name] = pd.to_numeric(df[name], errors="coerce")
        df[name] = df[name].fillna(MEDIANS[name])

    return df


def risk_level(probability: float) -> str:
    """تحويل الاحتمال إلى مستوى خطر متوافق مع النظام."""

    if probability < THRESHOLD * 0.5:
        return "Low"

    if probability < THRESHOLD:
        return "Medium"

    return "High"


def predict(features) -> dict:
    """تشغيل التنبؤ لشركة واحدة وإرجاع النتيجة بصيغة جاهزة للـBackend."""

    data = prepare_input(features)
    probability = float(MODEL.predict_proba(data)[0, 1])
    predicted_class = int(probability >= THRESHOLD)

    return {
        "bankruptcy_probability": probability,
        "predicted_class": predicted_class,
        "risk_level": risk_level(probability),
        "threshold_used": THRESHOLD,
        "model_version": METADATA["model_version"],
        "model_name": METADATA["model_key"],
    }


def predict_from_ratios(yearly_ratios: dict) -> dict:
    """تشغيل التنبؤ باستخدام أسماء المؤشرات المالية بدل أسماء Features التقنية."""

    try:
        from .feature_adapter import build_model_features
    except ImportError:
        from feature_adapter import build_model_features

    return predict(build_model_features(yearly_ratios))


if __name__ == "__main__":
    sample = {name: MEDIANS[name] for name in FEATURES}
    print(json.dumps(predict(sample), ensure_ascii=False, indent=2))
