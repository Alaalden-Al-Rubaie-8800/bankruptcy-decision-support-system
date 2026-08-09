"""حالة البيانات التي تنتقل بين خطوات AI Agent."""

from typing import Any, TypedDict

class AgentState(TypedDict, total=False):
    user_id: int
    company_id: int
    financial_record_id: int
    prediction_id: int

    financial_data: dict[str, Any]
    yearly_ratios: dict[str, dict[str, float | None]]
    validated_data: dict[str, Any]

    bankruptcy_probability: float
    predicted_class: int
    risk_level: str

    explanation: str
    top_risk_factors: list[dict[str, Any]]
    recommendations: list[dict[str, Any]]

    model_version: str
    status: str
    error: str | None