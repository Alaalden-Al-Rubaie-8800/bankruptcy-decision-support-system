"""اختبارات بسيطة لقسم التوصيات والتقارير."""

import tempfile
from pathlib import Path

from decision_support.decision_support_service import process_prediction
from decision_support.recommendations.recommendation_engine import generate_recommendations


TOP_FACTORS = [
    {
        "feature": "t_minus_2_feature_04",
        "year_offset": "t_minus_2",
        "ratio_code": "L1",
        "ratio_name": "Cash Ratio",
        "category": "Liquidity",
        "value": 0.01,
        "median_reference": 0.22,
        "probability_delta": 0.0099,
    },
    {
        "feature": "t_minus_2_feature_12",
        "year_offset": "t_minus_2",
        "ratio_code": "DE",
        "ratio_name": "Debt-to-Equity Ratio",
        "category": "Solvency",
        "value": 319.44,
        "median_reference": 1.23,
        "probability_delta": 0.0049,
    },
]


def test_low_risk_recommendations_are_backend_ready():
    recs = generate_recommendations(0.0149, "Low", TOP_FACTORS)
    assert recs
    assert {"title", "description", "priority", "action_category"} <= recs[0].keys()
    assert any(item["action_category"] == "liquidity" for item in recs)


def test_high_risk_escalation():
    recs = generate_recommendations(0.82, "High", TOP_FACTORS)
    ids = {item["id"] for item in recs}
    assert "REC006" in ids
    assert "REC010" in ids


def test_report_with_ml_factor_dicts():
    company = {"id": 3, "name": "Test Company"}
    prediction = {
        "bankruptcy_probability": 0.0149,
        "predicted_class": 0,
        "risk_level": "Low",
        "model_version": "1.0.0",
        "top_risk_factors": TOP_FACTORS,
    }

    with tempfile.TemporaryDirectory() as temp_dir:
        result = process_prediction(company, prediction, output_dir=temp_dir)
        report_path = Path(result["report"]["report_path"])
        assert report_path.exists()
        html_text = report_path.read_text(encoding="utf-8")
        assert "Cash Ratio" in html_text
        assert "Debt-to-Equity Ratio" in html_text
        assert result["report"]["status"] == "generated"


def test_invalid_probability_rejected():
    try:
        generate_recommendations(1.5, "High", [])
    except ValueError:
        return
    raise AssertionError("Invalid probability must raise ValueError")
