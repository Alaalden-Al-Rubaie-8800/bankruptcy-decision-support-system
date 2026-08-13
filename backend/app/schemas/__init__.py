"""تجميع جميع Schemas المستخدمة في النظام."""

from app.schemas.analysis_history import (
    AnalysisHistoryCreate,
    AnalysisHistoryResponse,
)
from app.schemas.company import CompanyCreate, CompanyResponse, CompanyUpdate
from app.schemas.financial_record import (
    FinancialRecordCreate,
    FinancialRecordResponse,
    FinancialRecordUpdate,
)
from app.schemas.prediction import PredictionCreate, PredictionResponse
from app.schemas.recommendation import RecommendationCreate, RecommendationResponse
from app.schemas.report import ReportCreate, ReportResponse
from app.schemas.user import UserCreate, UserResponse, UserUpdate

__all__ = [
    "AnalysisHistoryCreate",
    "AnalysisHistoryResponse",
    "CompanyCreate",
    "CompanyResponse",
    "CompanyUpdate",
    "FinancialRecordCreate",
    "FinancialRecordResponse",
    "FinancialRecordUpdate",
    "PredictionCreate",
    "PredictionResponse",
    "RecommendationCreate",
    "RecommendationResponse",
    "ReportCreate",
    "ReportResponse",
    "UserCreate",
    "UserResponse",
    "UserUpdate",
]
