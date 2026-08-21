"""اختبارات سريعة للتأكد من سلامة المودل والربط قبل إدخاله في النظام."""

from pathlib import Path

import numpy as np
import pandas as pd

from explain import explain_prediction
from feature_adapter import (
    build_model_features,
    technical_features_to_ratios,
)
from ml_service import analyze_financial_ratios
from predict import FEATURES, predict


ROOT = Path(__file__).resolve().parents[1]
TEST_PATH = ROOT / "data" / "processed" / "test.csv"


def main() -> None:
    """تشغيل Smoke Tests الأساسية للـMachine Learning integration."""

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
            f"{len(missing_features)} model features. "
            f"First missing: {preview}"
        )

    if len(FEATURES) != 63:
        raise AssertionError(
            f"Expected 63 model features, found {len(FEATURES)}"
        )

    #
    # Test 1 - Basic Prediction
    #
    sample = (
        test.iloc[0][FEATURES]
        .to_dict()
    )

    prediction = predict(sample)

    assert (
        0.0
        <= prediction["bankruptcy_probability"]
        <= 1.0
    ), "Probability must be between 0 and 1"

    assert prediction["predicted_class"] in (
        0,
        1,
    ), "Predicted class must be 0 or 1"

    assert prediction["risk_level"] in (
        "Low",
        "Medium",
        "High",
    ), "Invalid risk level"

    assert prediction[
        "model_version"
    ], "Model version is missing"

    assert prediction[
        "model_name"
    ], "Model name is missing"

    assert (
        0.0
        <= prediction["threshold_used"]
        <= 1.0
    ), "Threshold must be between 0 and 1"

    #
    # Test 2 - Local Explanation
    #
    explanation = explain_prediction(
        sample
    )

    assert np.isclose(
        explanation["base_probability"],
        prediction["bankruptcy_probability"],
    ), (
        "Explanation probability must match "
        "prediction probability"
    )

    assert (
        explanation["method"]
        == "single-feature median replacement"
    ), "Unexpected explanation method"

    assert isinstance(
        explanation["top_risk_factors"],
        list,
    )

    assert isinstance(
        explanation["protective_factors"],
        list,
    )

    for factor in (
        explanation["top_risk_factors"]
        + explanation["protective_factors"]
    ):
        required_keys = {
            "feature",
            "year_offset",
            "ratio_code",
            "ratio_name",
            "category",
            "value",
            "median_reference",
            "probability_delta",
        }

        missing_keys = (
            required_keys
            - set(factor)
        )

        assert not missing_keys, (
            f"Explanation factor is missing keys: "
            f"{sorted(missing_keys)}"
        )

    #
    # Test 3 - Technical Features → Ratios → Features
    #
    yearly_ratios = (
        technical_features_to_ratios(
            sample
        )
    )

    assert set(
        yearly_ratios.keys()
    ) == {
        "t_minus_3",
        "t_minus_2",
        "t_minus_1",
    }, "Exactly three financial years are required"

    rebuilt = build_model_features(
        yearly_ratios
    )

    assert list(
        rebuilt.keys()
    ) == list(
        FEATURES
    ), "Rebuilt feature order does not match model feature order"

    #
    # Test 4 - Full ML Service
    #
    service_result = (
        analyze_financial_ratios(
            yearly_ratios
        )
    )

    service_prediction = (
        service_result["prediction"]
    )

    assert np.isclose(
        service_prediction[
            "bankruptcy_probability"
        ],
        prediction[
            "bankruptcy_probability"
        ],
    ), (
        "ML service probability does not match "
        "direct prediction"
    )

    assert (
        service_prediction[
            "predicted_class"
        ]
        == prediction[
            "predicted_class"
        ]
    )

    assert (
        service_prediction[
            "risk_level"
        ]
        == prediction[
            "risk_level"
        ]
    )

    #
    # Test 5 - Missing Technical Features
    #
    try:
        predict({})

    except ValueError:
        pass

    else:
        raise AssertionError(
            "Missing features must be rejected"
        )

    #
    # Test 6 - Missing Financial Ratio
    #
    broken_ratios = {
        year: dict(ratios)
        for year, ratios
        in yearly_ratios.items()
    }

    broken_ratios[
        "t_minus_1"
    ].pop("ROA")

    try:
        build_model_features(
            broken_ratios
        )

    except ValueError:
        pass

    else:
        raise AssertionError(
            "Missing financial ratios must be rejected"
        )

    #
    # Test 7 - Missing Year
    #
    missing_year = {
        year: ratios
        for year, ratios
        in yearly_ratios.items()
        if year != "t_minus_3"
    }

    try:
        build_model_features(
            missing_year
        )

    except ValueError:
        pass

    else:
        raise AssertionError(
            "Missing financial year must be rejected"
        )

    print(
        "ML smoke test passed successfully."
    )


if __name__ == "__main__":
    main()