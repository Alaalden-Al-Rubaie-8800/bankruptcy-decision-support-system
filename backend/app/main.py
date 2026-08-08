"""نقطة تشغيل تطبيق FastAPI وربط جميع مسارات النظام."""

from fastapi import FastAPI
from app.api.routes import (
    companies_router,
    financial_records_router,
    predictions_router,
    recommendations_router,
    users_router,
)
from app.api.routes.analysis import router as analysis_router
from app.api.routes.auth import router as auth_router

app = FastAPI(
    title="Bankruptcy Decision Support System API",
    version="0.1.0",
)

app.include_router(auth_router)
app.include_router(analysis_router)
app.include_router(companies_router)
app.include_router(users_router)
app.include_router(financial_records_router)
app.include_router(predictions_router)
app.include_router(recommendations_router)

@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}