"""
هذا الملف يجمع جميع مخططات التحقق من البيانات داخل المشروع،
حتى يسهل استيرادها من مكان واحد.
"""

from app.schemas.company import CompanyCreate, CompanyResponse, CompanyUpdate
from app.schemas.financial_record import (
    FinancialRecordCreate,
    FinancialRecordResponse,
    FinancialRecordUpdate,
)
from app.schemas.prediction import PredictionCreate, PredictionResponse
from app.schemas.recommendation import RecommendationCreate, RecommendationResponse
from app.schemas.user import UserCreate, UserResponse, UserUpdate

__all__ = [
    "CompanyCreate",
    "CompanyUpdate",
    "CompanyResponse",
    "FinancialRecordCreate",
    "FinancialRecordUpdate",
    "FinancialRecordResponse",
    "PredictionCreate",
    "PredictionResponse",
    "RecommendationCreate",
    "RecommendationResponse",
    "UserCreate",
    "UserUpdate",
    "UserResponse",
]