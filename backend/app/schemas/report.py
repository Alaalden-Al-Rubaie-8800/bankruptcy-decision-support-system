"""Schemas for generated reports stored in PostgreSQL."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ReportCreate(BaseModel):
    report_id: str
    prediction_id: int
    filename: str
    status: str = "generated"
    html_content: str


class ReportResponse(ReportCreate):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
