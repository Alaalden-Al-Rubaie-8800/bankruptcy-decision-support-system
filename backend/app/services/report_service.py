"""Database operations for generated analysis reports."""

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.report import Report
from app.schemas.report import ReportCreate


def create_report(
    db: Session,
    report_data: ReportCreate,
) -> Report:
    report = Report(
        report_id=report_data.report_id,
        prediction_id=report_data.prediction_id,
        filename=report_data.filename,
        status=report_data.status,
        html_content=report_data.html_content,
    )

    db.add(report)
    db.commit()
    db.refresh(report)

    return report


def get_report_by_report_id(
    db: Session,
    report_id: str,
) -> Report | None:
    statement = select(Report).where(
        Report.report_id == report_id
    )

    return db.scalar(statement)
