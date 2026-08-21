"""خطوات AI Agent من قراءة البيانات حتى حفظ النتائج والتقرير."""

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.agents.state import AgentState
from app.schemas.analysis_history import AnalysisHistoryCreate
from app.schemas.prediction import PredictionCreate
from app.schemas.recommendation import RecommendationCreate
from app.schemas.report import ReportCreate
from app.services.analysis_history_service import create_analysis_history
from app.services.company_service import get_company
from app.services.financial_record_service import get_financial_record
from app.services.prediction_service import create_prediction
from app.services.recommendation_service import create_recommendation
from app.services.report_service import create_report
from decision_support.decision_support_service import process_prediction
from machine_learning.src.ml_service import analyze_financial_ratios


def load_financial_data(state: AgentState, db: Session) -> AgentState:
    record = get_financial_record(db, state["financial_record_id"])

    if not record:
        state["status"] = "failed"
        state["error"] = "Financial record not found"
        return state

    company = get_company(db, record.company_id)

    state["company_id"] = record.company_id
    state["company_data"] = {
        "id": record.company_id,
        "name": company.name if company else f"Company {record.company_id}",
    }

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
    yearly_ratios = state.get("yearly_ratios")

    if not data:
        state["status"] = "failed"
        state["error"] = "Financial data is missing"
        return state

    if not yearly_ratios or len(yearly_ratios) != 3:
        state["status"] = "failed"
        state["error"] = "Exactly three years of financial ratios are required"
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

    if not yearly_ratios or len(yearly_ratios) != 3:
        state["status"] = "failed"
        state["error"] = "Exactly three years of financial ratios are required"
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
        state["top_risk_factors"] = explanation["top_risk_factors"]

        state["status"] = "predicted"
        state["error"] = None

    except (ValueError, TypeError, KeyError, OSError) as exc:
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
    company = state.get("company_data")
    report_language = state.get("report_language", "en")

    required_values = [
        state.get("bankruptcy_probability"),
        state.get("predicted_class"),
        state.get("risk_level"),
        state.get("model_version"),
        state.get("top_risk_factors"),
    ]

    if not company or any(value is None for value in required_values):
        state["status"] = "failed"
        state["error"] = "Decision support input is incomplete"
        return state

    prediction = {
        "bankruptcy_probability": state["bankruptcy_probability"],
        "predicted_class": state["predicted_class"],
        "risk_level": state["risk_level"],
        "model_version": state["model_version"],
        "top_risk_factors": state["top_risk_factors"],
    }

    try:
        result = process_prediction(
            company=company,
            prediction=prediction,
            report_language=report_language,
        )

        state["recommendations"] = result["recommendations"]

        report = result["report"]
        report_id = report["report_id"]

        state["report"] = {
            "report_id": report_id,
            "status": report["status"],
            "filename": report["filename"],
            "html_content": report["html_content"],
            "view_url": f"/analysis/reports/{report_id}",
            "download_url": f"/analysis/reports/{report_id}/download",
        }

        state["status"] = "recommendations_generated"
        state["error"] = None

    except (ValueError, TypeError, KeyError, OSError) as exc:
        state["status"] = "failed"
        state["error"] = str(exc)

    return state


def save_analysis_results(state: AgentState, db: Session) -> AgentState:
    required_values = [
        state.get("company_id"),
        state.get("financial_record_id"),
        state.get("bankruptcy_probability"),
        state.get("risk_level"),
        state.get("model_version"),
        state.get("explanation"),
        state.get("recommendations"),
        state.get("report"),
    ]

    if any(value is None for value in required_values):
        state["status"] = "failed"
        state["error"] = "Analysis result data is incomplete"
        return state

    try:
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

        report = state["report"]

        report_data = ReportCreate(
            report_id=report["report_id"],
            prediction_id=prediction.id,
            filename=report["filename"],
            status=report["status"],
            html_content=report["html_content"],
        )

        create_report(db, report_data)

        # Do not return the full HTML body in /analysis/run response.
        state["report"] = {
            "report_id": report["report_id"],
            "status": report["status"],
            "filename": report["filename"],
            "view_url": report["view_url"],
            "download_url": report["download_url"],
        }

        state["status"] = "saved"
        state["error"] = None

    except (SQLAlchemyError, ValueError, TypeError, KeyError) as exc:
        db.rollback()
        state["status"] = "failed"
        state["error"] = f"Failed to save analysis results: {exc}"

    return state


def save_analysis_history(state: AgentState, db: Session) -> AgentState:
    if not state.get("user_id") or not state.get("prediction_id"):
        state["status"] = "failed"
        state["error"] = "Analysis history data is missing"
        return state

    report = state.get("report") or {}

    try:
        history_data = AnalysisHistoryCreate(
            user_id=state["user_id"],
            company_id=state["company_id"],
            financial_record_id=state["financial_record_id"],
            prediction_id=state["prediction_id"],
            report_id=report.get("report_id"),
            status="completed",
        )

        create_analysis_history(db, history_data)

        state["status"] = "completed"
        state["error"] = None

    except (SQLAlchemyError, ValueError, TypeError, KeyError) as exc:
        db.rollback()
        state["status"] = "failed"
        state["error"] = f"Failed to save analysis history: {exc}"

    return state