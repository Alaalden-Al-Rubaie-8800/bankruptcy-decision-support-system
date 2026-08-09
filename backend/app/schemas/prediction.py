"""
هذا الملف مسؤول عن تعريف مخططات التحقق من بيانات نتائج التنبؤ بالإفلاس.

يتحقق من صحة البيانات التالية:
- رقم الشركة
- رقم السجل المالي
- احتمال الإفلاس
- مستوى الخطر
- إصدار نموذج التعلم الآلي
- تفسير نتيجة التنبؤ
"""
from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, ConfigDict, Field

class PredictionCreate(BaseModel):
    company_id: int = Field(
        gt=0,
    )

    financial_record_id: int = Field(
        gt=0,
    )

    bankruptcy_probability: Decimal = Field(
        ge=0,
        le=1,
        max_digits=5,
        decimal_places=4,
    )

    risk_level: str = Field(
        min_length=3,
        max_length=20,
    )

    model_version: str = Field(
        min_length=1,
        max_length=50,
    )

    explanation: str | None = None

class PredictionResponse(PredictionCreate):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)