"""مسار تشغيل التحليل الكامل بواسطة AI Agent."""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.agents.workflow import run_agent
from app.core.dependencies import get_current_user
from app.database.session import get_db
from app.schemas.analysis_history import AnalysisHistoryResponse
from app.services.analysis_history_service import get_user_analysis_history

router = APIRouter(
    prefix="/analysis",
    tags=["Analysis"],
    dependencies=[Depends(get_current_user)],
)

class AnalysisRequest(BaseModel):
    financial_record_id: int

@router.post("/run")
def run_analysis(
    data: AnalysisRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    result = run_agent(
        financial_record_id=data.financial_record_id,
        user_id=current_user.id,
        db=db,
    )

    if result.get("status") == "failed":
        raise HTTPException(
            status_code=400,
            detail=result.get("error"),
        )

    return result

@router.get(
    "/history",
    response_model=list[AnalysisHistoryResponse],
)
def get_analysis_history(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    return get_user_analysis_history(
        db,
        current_user.id,
    )