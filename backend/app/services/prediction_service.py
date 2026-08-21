"""
هذا الملف مسؤول عن تنفيذ العمليات الخاصة بنتائج التنبؤ بمخاطر الإفلاس.

تشمل مهامه:
- إنشاء نتيجة تنبؤ جديدة.
- جلب نتيجة تنبؤ باستخدام الرقم التعريفي.
- جلب جميع نتائج التنبؤ الخاصة بشركة معينة.
- جلب أحدث نتيجة تنبؤ للشركة.
- حذف نتيجة تنبؤ من قاعدة البيانات.
"""

from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.prediction import Prediction
from app.schemas.prediction import PredictionCreate

def create_prediction(
    db: Session,
    prediction_data: PredictionCreate,
) -> Prediction:
    prediction = Prediction(
        company_id=prediction_data.company_id,
        financial_record_id=prediction_data.financial_record_id,
        bankruptcy_probability=prediction_data.bankruptcy_probability,
        risk_level=prediction_data.risk_level,
        model_version=prediction_data.model_version,
        explanation=prediction_data.explanation,
    )

    db.add(prediction)
    db.commit()
    db.refresh(prediction)

    return prediction

def get_prediction(
    db: Session,
    prediction_id: int,
) -> Prediction | None:
    statement = select(Prediction).where(
        Prediction.id == prediction_id
    )

    return db.scalar(statement)

def get_company_predictions(
    db: Session,
    company_id: int,
) -> list[Prediction]:
    statement = (
        select(Prediction)
        .where(Prediction.company_id == company_id)
        .order_by(Prediction.created_at.desc())
    )

    return list(db.scalars(statement).all())

def get_latest_company_prediction(
    db: Session,
    company_id: int,
) -> Prediction | None:
    statement = (
        select(Prediction)
        .where(Prediction.company_id == company_id)
        .order_by(Prediction.created_at.desc())
        .limit(1)
    )

    return db.scalar(statement)

def delete_prediction(
    db: Session,
    prediction: Prediction,
) -> None:
    db.delete(prediction)
    db.commit()