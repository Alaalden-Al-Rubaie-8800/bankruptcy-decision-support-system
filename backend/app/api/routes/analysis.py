"""مسار تشغيل التحليل الكامل بواسطة AI Agent."""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.agents.workflow import run_agent
from app.core.dependencies import get_current_user
from app.database.session import get_db

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
):
    result = run_agent(data.financial_record_id, db)

    if result.get("status") == "failed":
        raise HTTPException(
            status_code=400,
            detail=result.get("error"),
        )

    return result