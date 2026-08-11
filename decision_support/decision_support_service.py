"""يجمع التوصيات والتقرير النهائي من نتيجة نموذج التنبؤ."""

from typing import Any

from .recommendations.recommendation_engine import generate_recommendations
from .reports.report_generator import generate_report


def process_prediction(
    company: dict[str, Any],
    prediction: dict[str, Any],
    output_dir: str | None = None,
) -> dict[str, Any]:
    recommendations = generate_recommendations(
        bankruptcy_probability=prediction["bankruptcy_probability"],
        risk_level=prediction["risk_level"],
        top_risk_factors=prediction.get("top_risk_factors", []),
    )

    report = generate_report(
        company=company,
        prediction=prediction,
        recommendations=recommendations,
        output_dir=output_dir,
    )

    return {
        "company": company,
        "prediction": prediction,
        "recommendations": recommendations,
        "report": report,
    }
