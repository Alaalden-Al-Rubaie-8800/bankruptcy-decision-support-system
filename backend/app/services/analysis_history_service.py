"""عمليات حفظ وجلب سجل التحليلات."""

from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.analysis_history import AnalysisHistory
from app.schemas.analysis_history import AnalysisHistoryCreate

def create_analysis_history(
    db: Session,
    data: AnalysisHistoryCreate,
) -> AnalysisHistory:
    history = AnalysisHistory(
        user_id=data.user_id,
        company_id=data.company_id,
        financial_record_id=data.financial_record_id,
        prediction_id=data.prediction_id,
        status=data.status,
    )

    db.add(history)
    db.commit()
    db.refresh(history)

    return history

def get_analysis_history(
    db: Session,
    history_id: int,
) -> AnalysisHistory | None:
    statement = select(AnalysisHistory).where(
        AnalysisHistory.id == history_id
    )

    return db.scalar(statement)

def get_user_analysis_history(
    db: Session,
    user_id: int,
) -> list[AnalysisHistory]:
    statement = (
        select(AnalysisHistory)
        .where(AnalysisHistory.user_id == user_id)
        .order_by(AnalysisHistory.created_at.desc())
    )

    return list(db.scalars(statement).all())