"""قواعد اختيار التوصيات حسب مستوى الخطر والعوامل المؤثرة."""

from typing import Any

VALID_RISK_LEVELS = {"low", "medium", "high"}

CATEGORY_RECOMMENDATIONS = {
    "liquidity": ["REC002"],
    "solvency": ["REC003", "REC005"],
    "activity": ["REC004"],
    "profitability": ["REC005"],
    "leverage": ["REC003", "REC005"],
}


def normalize_risk_level(risk_level: str) -> str:
    if not isinstance(risk_level, str):
        raise TypeError("risk_level must be a string")

    risk = risk_level.strip().lower()
    if risk not in VALID_RISK_LEVELS:
        raise ValueError("risk_level must be low, medium, or high")

    return risk


def _factor_categories(top_risk_factors: list[Any] | None) -> list[str]:
    categories: list[str] = []

    for factor in top_risk_factors or []:
        if isinstance(factor, dict):
            category = str(factor.get("category", "")).strip().lower()
            if category and category not in categories:
                categories.append(category)

    return categories


def get_recommendation_ids(
    risk_level: str,
    bankruptcy_probability: float,
    top_risk_factors: list[Any] | None = None,
) -> list[str]:
    risk = normalize_risk_level(risk_level)
    p = float(bankruptcy_probability)

    if not 0 <= p <= 1:
        raise ValueError("bankruptcy_probability must be between 0 and 1")

    if risk == "low":
        ids = ["REC007", "REC008"]
    elif risk == "medium":
        ids = ["REC004", "REC009"]
    else:
        ids = ["REC001", "REC004"]
        if p >= 0.60:
            ids.append("REC006")
        if p >= 0.80:
            ids.append("REC010")

    for category in _factor_categories(top_risk_factors):
        for rec_id in CATEGORY_RECOMMENDATIONS.get(category, []):
            if rec_id not in ids:
                ids.append(rec_id)

    return ids
