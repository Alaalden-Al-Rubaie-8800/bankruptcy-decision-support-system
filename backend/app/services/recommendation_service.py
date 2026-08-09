"""
هذا الملف مسؤول عن تنفيذ العمليات الخاصة بالتوصيات الوقائية.

تشمل مهامه:
- إنشاء توصية جديدة مرتبطة بنتيجة تنبؤ.
- جلب توصية باستخدام الرقم التعريفي.
- جلب جميع التوصيات المرتبطة بنتيجة تنبؤ معينة.
- تعديل بيانات توصية موجودة.
- حذف توصية من قاعدة البيانات.
"""

from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.recommendation import Recommendation
from app.schemas.recommendation import RecommendationCreate

def create_recommendation(
    db: Session,
    recommendation_data: RecommendationCreate,
) -> Recommendation:
    recommendation = Recommendation(
        prediction_id=recommendation_data.prediction_id,
        title=recommendation_data.title,
        description=recommendation_data.description,
        priority=recommendation_data.priority,
        action_category=recommendation_data.action_category,
    )

    db.add(recommendation)
    db.commit()
    db.refresh(recommendation)

    return recommendation

def get_recommendation(
    db: Session,
    recommendation_id: int,
) -> Recommendation | None:
    statement = select(Recommendation).where(
        Recommendation.id == recommendation_id
    )

    return db.scalar(statement)

def get_prediction_recommendations(
    db: Session,
    prediction_id: int,
) -> list[Recommendation]:
    statement = (
        select(Recommendation)
        .where(Recommendation.prediction_id == prediction_id)
        .order_by(Recommendation.created_at.desc())
    )

    return list(db.scalars(statement).all())

def update_recommendation(
    db: Session,
    recommendation: Recommendation,
    title: str | None = None,
    description: str | None = None,
    priority: str | None = None,
    action_category: str | None = None,
) -> Recommendation:
    if title is not None:
        recommendation.title = title

    if description is not None:
        recommendation.description = description

    if priority is not None:
        recommendation.priority = priority

    if action_category is not None:
        recommendation.action_category = action_category

    db.add(recommendation)
    db.commit()
    db.refresh(recommendation)

    return recommendation

def delete_recommendation(
    db: Session,
    recommendation: Recommendation,
) -> None:
    db.delete(recommendation)
    db.commit()