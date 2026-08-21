"""Schemas الخاصة بسجل عمليات التحليل."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class AnalysisHistoryCreate(BaseModel):
    user_id: int
    company_id: int
    financial_record_id: int
    prediction_id: int
    report_id: str | None = None
    status: str = "completed"


class AnalysisHistoryResponse(AnalysisHistoryCreate):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)