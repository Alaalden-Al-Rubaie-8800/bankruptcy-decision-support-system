"""اختبارات سريعة للتأكد من سلامة المودل والربط قبل إدخاله في النظام."""

from pathlib import Path

import pandas as pd

from explain import explain_prediction
from feature_adapter import build_model_features, technical_features_to_ratios
from ml_service import analyze_financial_ratios
from predict import FEATURES, predict

ROOT = Path(__file__).resolve().parents[1]


def main() -> None:
    test = pd.read_csv(ROOT / "data" / "processed" / "test.csv")
    sample = test.iloc[0][FEATURES].to_dict()

    prediction = predict(sample)
    explanation = explain_prediction(sample)

    assert 0.0 <= prediction["bankruptcy_probability"] <= 1.0
    assert prediction["predicted_class"] in (0, 1)
    assert prediction["risk_level"] in ("Low", "Medium", "High")
    assert prediction["model_version"]
    assert explanation["base_probability"] == prediction["bankruptcy_probability"]
    assert explanation["top_risk_factors"] or explanation["protective_factors"]

    yearly_ratios = technical_features_to_ratios(sample)
    rebuilt = build_model_features(yearly_ratios)
    assert list(rebuilt) == FEATURES

    service_result = analyze_financial_ratios(yearly_ratios)
    assert service_result["prediction"] == prediction

    try:
        predict({})
    except ValueError:
        pass
    else:
        raise AssertionError("Missing features must be rejected")

    broken = dict(yearly_ratios)
    broken["t_minus_1"] = dict(broken["t_minus_1"])
    broken["t_minus_1"].pop("ROA")

    try:
        build_model_features(broken)
    except ValueError:
        pass
    else:
        raise AssertionError("Missing financial ratios must be rejected")

    print("ML smoke test passed successfully.")


if __name__ == "__main__":
    main()
