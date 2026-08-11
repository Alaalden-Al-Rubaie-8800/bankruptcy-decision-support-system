"""تجميع جميع موديلات قاعدة البيانات."""

from app.models.analysis_history import AnalysisHistory
from app.models.company import Company
from app.models.financial_record import FinancialRecord
from app.models.prediction import Prediction
from app.models.recommendation import Recommendation
from app.models.user import User

__all__ = [
    "AnalysisHistory",
    "Company",
    "FinancialRecord",
    "Prediction",
    "Recommendation",
    "User",
]