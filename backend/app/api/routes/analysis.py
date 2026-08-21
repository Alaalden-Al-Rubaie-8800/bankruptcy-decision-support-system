"""مسارات تشغيل التحليل وعرض السجل والتقارير."""

import re
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import HTMLResponse, Response
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.agents.workflow import run_agent
from app.core.dependencies import get_current_user
from app.database.session import get_db
from app.schemas.analysis_history import AnalysisHistoryResponse
from app.services.analysis_history_service import (
    get_user_analysis_history,
    get_user_report_history,
)
from app.services.company_service import get_company_by_user
from app.services.financial_record_service import (
    get_company_financial_records,
)
from app.services.report_service import get_report_by_report_id


router = APIRouter(
    prefix="/analysis",
    tags=["Analysis"],
)


REPORT_ID_PATTERN = re.compile(
    r"^REP-\d{8}-[A-F0-9]{8}$"
)


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
    yearly_ratios: YearlyRatios

    # Report presentation language only.
    # This does not change the analysis workflow.
    report_language: Literal["en", "ar"] = "en"


def _validate_report_id(
    report_id: str,
) -> None:
    if not REPORT_ID_PATTERN.fullmatch(
        report_id
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid report id",
        )


def _check_report_access(
    db: Session,
    report_id: str,
    user_id: int,
):
    history = get_user_report_history(
        db=db,
        user_id=user_id,
        report_id=report_id,
    )

    if not history:
        raise HTTPException(
            status_code=404,
            detail="Report not found",
        )

    return history


def _get_database_report(
    db: Session,
    report_id: str,
):
    report = get_report_by_report_id(
        db=db,
        report_id=report_id,
    )

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Report not found",
        )

    return report


@router.post("/run")
def run_analysis(
    data: AnalysisRequest,
    db: Session = Depends(get_db),
    current_user=Depends(
        get_current_user
    ),
):
    company = get_company_by_user(
        db,
        current_user.id,
    )

    if not company:
        raise HTTPException(
            status_code=400,
            detail="Create your company first",
        )

    financial_records = (
        get_company_financial_records(
            db,
            company.id,
        )
    )

    if not financial_records:
        raise HTTPException(
            status_code=400,
            detail=(
                "No financial records found "
                "for your company"
            ),
        )

    latest_record = (
        financial_records[0]
    )

    result = run_agent(
        financial_record_id=(
            latest_record.id
        ),
        user_id=current_user.id,
        yearly_ratios=(
            data.yearly_ratios.model_dump()
        ),
        report_language=(
            data.report_language
        ),
        db=db,
    )

    if (
        result.get("status")
        == "failed"
    ):
        raise HTTPException(
            status_code=400,
            detail=result.get(
                "error"
            ),
        )

    return result


@router.get(
    "/history",
    response_model=list[
        AnalysisHistoryResponse
    ],
)
def get_analysis_history(
    db: Session = Depends(get_db),
    current_user=Depends(
        get_current_user
    ),
):
    return get_user_analysis_history(
        db,
        current_user.id,
    )


@router.get(
    "/reports/{report_id}"
)
def view_report(
    report_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(
        get_current_user
    ),
):
    _validate_report_id(
        report_id
    )

    _check_report_access(
        db,
        report_id,
        current_user.id,
    )

    report = _get_database_report(
        db,
        report_id,
    )

    return HTMLResponse(
        content=(
            report.html_content
        ),
        status_code=200,
    )


@router.get(
    "/reports/{report_id}/download"
)
def download_report(
    report_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(
        get_current_user
    ),
):
    _validate_report_id(
        report_id
    )

    _check_report_access(
        db,
        report_id,
        current_user.id,
    )

    report = _get_database_report(
        db,
        report_id,
    )

    return Response(
        content=(
            report.html_content
        ),
        media_type="text/html",
        headers={
            "Content-Disposition": (
                f'attachment; '
                f'filename="{report.filename}"'
            )
        },
    )