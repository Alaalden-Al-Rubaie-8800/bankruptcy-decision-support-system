"""تجميع جميع خدمات النظام."""

from app.services.analysis_history_service import (
    create_analysis_history,
    get_analysis_history,
    get_user_analysis_history,
)
from app.services.company_service import (
    create_company,
    delete_company,
    get_companies,
    get_company,
    update_company,
)
from app.services.financial_record_service import (
    create_financial_record,
    delete_financial_record,
    get_company_financial_records,
    get_financial_record,
    update_financial_record,
)
from app.services.prediction_service import (
    create_prediction,
    delete_prediction,
    get_company_predictions,
    get_latest_company_prediction,
    get_prediction,
)
from app.services.recommendation_service import (
    create_recommendation,
    delete_recommendation,
    get_prediction_recommendations,
    get_recommendation,
    update_recommendation,
)
from app.services.report_service import (
    create_report,
    get_report_by_report_id,
)
from app.services.user_service import (
    create_user,
    delete_user,
    get_user,
    get_user_by_email,
    get_users,
    update_user,
)

__all__ = [
    "create_analysis_history",
    "get_analysis_history",
    "get_user_analysis_history",
    "create_company",
    "delete_company",
    "get_companies",
    "get_company",
    "update_company",
    "create_financial_record",
    "delete_financial_record",
    "get_company_financial_records",
    "get_financial_record",
    "update_financial_record",
    "create_prediction",
    "delete_prediction",
    "get_company_predictions",
    "get_latest_company_prediction",
    "get_prediction",
    "create_recommendation",
    "delete_recommendation",
    "get_prediction_recommendations",
    "get_recommendation",
    "update_recommendation",
    "create_report",
    "get_report_by_report_id",
    "create_user",
    "delete_user",
    "get_user",
    "get_user_by_email",
    "get_users",
    "update_user",
]
