"""يجمع جميع مسارات API في مكان واحد."""

from app.api.routes.companies import router as companies_router
from app.api.routes.financial_records import router as financial_records_router
from app.api.routes.predictions import router as predictions_router
from app.api.routes.recommendations import router as recommendations_router
from app.api.routes.users import router as users_router

__all__ = [
    "companies_router",
    "users_router",
    "financial_records_router",
    "predictions_router",
    "recommendations_router",
]