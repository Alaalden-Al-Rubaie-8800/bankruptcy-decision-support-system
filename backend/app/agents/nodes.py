"""خطوات AI Agent من قراءة البيانات حتى حفظ نتائج التحليل."""

from sqlalchemy.orm import Session
from app.agents.state import AgentState
from app.schemas.prediction import PredictionCreate
from app.schemas.recommendation import RecommendationCreate
from app.services.financial_record_service import get_financial_record
from app.services.prediction_service import create_prediction
from app.services.recommendation_service import create_recommendation
from app.schemas.analysis_history import AnalysisHistoryCreate
from app.services.analysis_history_service import create_analysis_history
from machine_learning.src.ml_service import analyze_financial_ratios

def load_financial_data(state: AgentState, db: Session) -> AgentState:
    record = get_financial_record(db, state["financial_record_id"])

    if not record:
        state["status"] = "failed"
        state["error"] = "Financial record not found"
        return state

    state["company_id"] = record.company_id

    state["financial_data"] = {
        "company_id": record.company_id,
        "fiscal_year": record.fiscal_year,
        "total_assets": float(record.total_assets),
        "total_liabilities": float(record.total_liabilities),
        "current_assets": float(record.current_assets),
        "current_liabilities": float(record.current_liabilities),
        "total_revenue": float(record.total_revenue),
        "net_income": float(record.net_income),
        "operating_cash_flow": float(record.operating_cash_flow),
    }

    state["status"] = "data_loaded"
    state["error"] = None
    return state

def validate_financial_data(state: AgentState) -> AgentState:
    data = state.get("financial_data")

    if not data:
        state["status"] = "failed"
        state["error"] = "Financial data is missing"
        return state

    required_fields = [
        "total_assets",
        "total_liabilities",
        "current_assets",
        "current_liabilities",
        "total_revenue",
        "net_income",
        "operating_cash_flow",
    ]

    for field in required_fields:
        if field not in data:
            state["status"] = "failed"
            state["error"] = f"Missing field: {field}"
            return state

    state["validated_data"] = data
    state["status"] = "validated"
    state["error"] = None
    return state

def predict_bankruptcy(state: AgentState) -> AgentState:
    yearly_ratios = state.get("yearly_ratios")

    if not yearly_ratios:
        state["status"] = "failed"
        state["error"] = "Three years of financial ratios are required"
        return state

    try:
        result = analyze_financial_ratios(yearly_ratios)

        prediction = result["prediction"]
        explanation = result["explanation"]

        state["bankruptcy_probability"] = prediction[
            "bankruptcy_probability"
        ]

        state["predicted_class"] = prediction["predicted_class"]
        state["risk_level"] = prediction["risk_level"]
        state["model_version"] = prediction["model_version"]

        state["top_risk_factors"] = explanation[
            "top_risk_factors"
        ]

        state["status"] = "predicted"
        state["error"] = None

    except (ValueError, TypeError, KeyError) as exc:
        state["status"] = "failed"
        state["error"] = str(exc)

    return state

def explain_prediction(state: AgentState) -> AgentState:
    top_factors = state.get("top_risk_factors")
    risk_level = state.get("risk_level")

    if not top_factors or not risk_level:
        state["status"] = "failed"
        state["error"] = "Prediction explanation is missing"
        return state

    factors_text = ", ".join(
        f"{factor['ratio_name']} ({factor['ratio_code']}) - "
        f"{factor['year_offset']}"
        for factor in top_factors[:5]
    )

    state["explanation"] = (
        f"Risk level is {risk_level}. "
        f"The most influential financial factors are: {factors_text}."
    )

    state["status"] = "explained"
    state["error"] = None
    return state

def generate_recommendations(state: AgentState) -> AgentState:
    risk_level = state.get("risk_level")

    if not risk_level:
        state["status"] = "failed"
        state["error"] = "Risk level is missing"
        return state

    if risk_level == "Low":
        recommendations = [{
            "title": "Maintain Financial Stability",
            "description": "Continue controlling liabilities and maintain positive cash flow.",
            "priority": "Medium",
            "action_category": "Financial Management",
        }]

    elif risk_level == "Medium":
        recommendations = [{
            "title": "Reduce Financial Pressure",
            "description": "Reduce liabilities and improve operating cash flow.",
            "priority": "High",
            "action_category": "Financial Management",
        }]

    else:
        recommendations = [{
            "title": "Immediate Financial Action",
            "description": "Reduce debt, control expenses, and improve liquidity immediately.",
            "priority": "Critical",
            "action_category": "Risk Management",
        }]

    state["recommendations"] = recommendations
    state["status"] = "recommendations_generated"
    state["error"] = None
    return state

def save_analysis_results(state: AgentState, db: Session) -> AgentState:
    prediction_data = PredictionCreate(
        company_id=state["company_id"],
        financial_record_id=state["financial_record_id"],
        bankruptcy_probability=round(
            state["bankruptcy_probability"],
            4,
        ),
        risk_level=state["risk_level"],
        model_version=state["model_version"],
        explanation=state["explanation"],
    )

    prediction = create_prediction(db, prediction_data)
    state["prediction_id"] = prediction.id

    for item in state["recommendations"]:
        recommendation_data = RecommendationCreate(
            prediction_id=prediction.id,
            title=item["title"],
            description=item["description"],
            priority=item["priority"],
            action_category=item["action_category"],
        )

        create_recommendation(db, recommendation_data)

    state["status"] = "saved"
    state["error"] = None
    return state

def save_analysis_history(state: AgentState, db: Session) -> AgentState:
    if not state.get("user_id") or not state.get("prediction_id"):
        state["status"] = "failed"
        state["error"] = "Analysis history data is missing"
        return state

    history_data = AnalysisHistoryCreate(
        user_id=state["user_id"],
        company_id=state["company_id"],
        financial_record_id=state["financial_record_id"],
        prediction_id=state["prediction_id"],
        status="completed",
    )

    create_analysis_history(db, history_data)

    state["status"] = "completed"
    state["error"] = None
    return state