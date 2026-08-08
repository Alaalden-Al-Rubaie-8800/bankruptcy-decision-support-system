"""خطوات AI Agent من قراءة البيانات حتى حفظ نتائج التحليل."""

from sqlalchemy.orm import Session
from app.agents.state import AgentState
from app.schemas.prediction import PredictionCreate
from app.schemas.recommendation import RecommendationCreate
from app.services.financial_record_service import get_financial_record
from app.services.prediction_service import create_prediction
from app.services.recommendation_service import create_recommendation

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
    if not state.get("validated_data"):
        state["status"] = "failed"
        state["error"] = "Validated data is missing"
        return state

    # مؤقت حتى يتم ربط مودل ML الحقيقي
    probability = 0.18

    if probability < 0.30:
        risk_level = "Low"
    elif probability < 0.70:
        risk_level = "Medium"
    else:
        risk_level = "High"

    state["bankruptcy_probability"] = probability
    state["risk_level"] = risk_level
    state["model_version"] = "placeholder-v1"
    state["status"] = "predicted"
    state["error"] = None
    return state

def explain_prediction(state: AgentState) -> AgentState:
    data = state.get("validated_data")
    risk_level = state.get("risk_level")

    if not data or not risk_level:
        state["status"] = "failed"
        state["error"] = "Prediction data is missing"
        return state

    state["explanation"] = (
        f"Risk level is {risk_level}. "
        f"Total assets are {data['total_assets']}, "
        f"total liabilities are {data['total_liabilities']}, "
        f"net income is {data['net_income']}, "
        f"and operating cash flow is {data['operating_cash_flow']}."
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
        bankruptcy_probability=state["bankruptcy_probability"],
        risk_level=state["risk_level"],
        model_version=state["model_version"],
        explanation=state["explanation"],
    )

    prediction = create_prediction(db, prediction_data)

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