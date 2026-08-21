"""مثال حقيقي يوضح استدعاء الـML من الـBackend باستخدام أسماء المؤشرات المالية."""

from pathlib import Path
import sys

import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
SRC_DIR = ROOT / "src"
TEST_PATH = ROOT / "data" / "processed" / "test.csv"

if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))


from feature_adapter import technical_features_to_ratios
from ml_service import analyze_financial_ratios
from predict import FEATURES


def main() -> None:
    """تشغيل مثال تكامل كامل بين بيانات الاختبار وخدمة الـML."""

    if not TEST_PATH.exists():
        raise FileNotFoundError(
            f"Test dataset not found: {TEST_PATH}"
        )

    test = pd.read_csv(TEST_PATH)

    if test.empty:
        raise ValueError(
            "Test dataset is empty"
        )

    missing_features = [
        feature
        for feature in FEATURES
        if feature not in test.columns
    ]

    if missing_features:
        preview = ", ".join(
            missing_features[:5]
        )

        raise ValueError(
            f"Test dataset is missing "
            f"{len(missing_features)} required model features. "
            f"First missing: {preview}"
        )

    technical_features = (
        test.iloc[0][FEATURES]
        .to_dict()
    )

    yearly_ratios = (
        technical_features_to_ratios(
            technical_features
        )
    )

    result = analyze_financial_ratios(
        yearly_ratios
    )

    print("Prediction:")
    print(
        result["prediction"]
    )

    print("\nExplanation:")
    print(
        result["explanation"]
    )


if __name__ == "__main__":
    main()