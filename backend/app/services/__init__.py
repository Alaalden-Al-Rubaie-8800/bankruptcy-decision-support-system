"""
هذا الملف يجمع جميع خدمات المشروع في مكان واحد،
حتى يسهل استيرادها واستخدامها من باقي أجزاء الـ Backend.

تشمل الخدمات:
- خدمات الشركات.
- خدمات المستخدمين.
- خدمات السجلات المالية.
- خدمات نتائج التنبؤ.
- خدمات التوصيات الوقائية.
"""

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

from app.services.user_service import (
    create_user,
    delete_user,
    get_user,
    get_user_by_email,
    get_users,
    update_user,
)


__all__ = [
    "create_company",
    "get_company",
    "get_companies",
    "update_company",
    "delete_company",
    "create_user",
    "get_user",
    "get_user_by_email",
    "get_users",
    "update_user",
    "delete_user",
    "create_financial_record",
    "get_financial_record",
    "get_company_financial_records",
    "update_financial_record",
    "delete_financial_record",
    "create_prediction",
    "get_prediction",
    "get_company_predictions",
    "get_latest_company_prediction",
    "delete_prediction",
    "create_recommendation",
    "get_recommendation",
    "get_prediction_recommendations",
    "update_recommendation",
    "delete_recommendation",
]