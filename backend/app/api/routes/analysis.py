"""مسارات تشغيل التحليل وعرض السجل والتقارير."""

import re

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.agents.workflow import run_agent
from app.core.dependencies import get_current_user
from app.database.session import get_db
from app.schemas.analysis_history import AnalysisHistoryResponse
from app.services.analysis_history_service import get_user_analysis_history
from decision_support.reports.report_generator import GENERATED_REPORTS_DIR

router = APIRouter(
    prefix="/analysis",
    tags=["Analysis"],
)

REPORT_ID_PATTERN = re.compile(r"^REP-\d{8}-[A-F0-9]{8}$")


class FinancialRatios(BaseModel):
    ROA: float
    ROE: float
    ROS: float
    L1: float
    L2: float
    L3: float
    ATD: float
    DTR: float
    TAT: float
    ITD: float
    DA: float
    DE: float
    FL: float
    ROI: float
    DIR: float
    DCR: float
    ACR: float
    LP: float
    BL: float
    LRR: float
    WAR: float


class YearlyRatios(BaseModel):
    t_minus_3: FinancialRatios
    t_minus_2: FinancialRatios
    t_minus_1: FinancialRatios


class AnalysisRequest(BaseModel):
    financial_record_id: int
    yearly_ratios: YearlyRatios


def _get_report_path(report_id: str):
    if not REPORT_ID_PATTERN.fullmatch(report_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid report id",
        )

    report_path = GENERATED_REPORTS_DIR / f"{report_id}.html"

    if not report_path.is_file():
        raise HTTPException(
            status_code=404,
            detail="Report not found",
        )

    return report_path


@router.post("/run")
def run_analysis(
    data: AnalysisRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    result = run_agent(
        financial_record_id=data.financial_record_id,
        user_id=current_user.id,
        yearly_ratios=data.yearly_ratios.model_dump(),
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
    current_user=Depends(get_current_user),
):
    return get_user_analysis_history(
        db,
        current_user.id,
    )


@router.get("/reports/{report_id}")
def view_report(
    report_id: str,
    current_user=Depends(get_current_user),
):
    report_path = _get_report_path(report_id)

    return FileResponse(
        path=report_path,
        media_type="text/html",
    )


@router.get("/reports/{report_id}/download")
def download_report(
    report_id: str,
    current_user=Depends(get_current_user),
):
    report_path = _get_report_path(report_id)

    return FileResponse(
        path=report_path,
        media_type="text/html",
        filename=report_path.name,
    )
