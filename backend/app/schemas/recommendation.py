"""
هذا الملف مسؤول عن تعريف مخططات التحقق من بيانات التوصيات الوقائية.

يتحقق من صحة البيانات التالية:
- رقم نتيجة التنبؤ
- عنوان التوصية
- وصف التوصية
- أولوية التنفيذ
- نوع الإجراء الوقائي
"""

from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

class RecommendationCreate(BaseModel):
    prediction_id: int = Field(
        gt=0,
    )

    title: str = Field(
        min_length=3,
        max_length=200,
    )

    description: str = Field(
        min_length=5,
    )

    priority: str = Field(
        min_length=3,
        max_length=20,
    )

    action_category: str = Field(
        min_length=3,
        max_length=100,
    )

class RecommendationResponse(RecommendationCreate):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)