"""
هذا الملف مسؤول عن تنفيذ العمليات الخاصة بالسجلات المالية للشركات.

تشمل مهامه:
- إنشاء سجل مالي جديد.
- جلب سجل مالي باستخدام الرقم التعريفي.
- جلب سجل مالي باستخدام السنة المالية.
- جلب جميع السجلات المالية الخاصة بشركة معينة.
- تعديل بيانات سجل مالي موجود.
- حذف سجل مالي من قاعدة البيانات.
"""

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.financial_record import FinancialRecord
from app.schemas.financial_record import (
    FinancialRecordCreate,
    FinancialRecordUpdate,
)


def create_financial_record(
    db: Session,
    financial_data: FinancialRecordCreate,
) -> FinancialRecord:
    financial_record = FinancialRecord(
        company_id=financial_data.company_id,
        fiscal_year=financial_data.fiscal_year,
        total_assets=financial_data.total_assets,
        total_liabilities=financial_data.total_liabilities,
        current_assets=financial_data.current_assets,
        current_liabilities=financial_data.current_liabilities,
        total_revenue=financial_data.total_revenue,
        net_income=financial_data.net_income,
        operating_cash_flow=financial_data.operating_cash_flow,
    )

    db.add(financial_record)
    db.commit()
    db.refresh(financial_record)

    return financial_record


def get_financial_record(
    db: Session,
    financial_record_id: int,
) -> FinancialRecord | None:
    statement = select(FinancialRecord).where(
        FinancialRecord.id == financial_record_id
    )

    return db.scalar(statement)


def get_financial_record_by_year(
    db: Session,
    company_id: int,
    fiscal_year: int,
) -> FinancialRecord | None:
    statement = select(FinancialRecord).where(
        FinancialRecord.company_id == company_id,
        FinancialRecord.fiscal_year == fiscal_year,
    )

    return db.scalar(statement)


def get_company_financial_records(
    db: Session,
    company_id: int,
) -> list[FinancialRecord]:
    statement = (
        select(FinancialRecord)
        .where(
            FinancialRecord.company_id == company_id
        )
        .order_by(
            FinancialRecord.fiscal_year.desc()
        )
    )

    return list(
        db.scalars(statement).all()
    )


def update_financial_record(
    db: Session,
    financial_record: FinancialRecord,
    financial_data: FinancialRecordUpdate,
) -> FinancialRecord:
    update_data = financial_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(
            financial_record,
            field,
            value,
        )

    db.add(financial_record)
    db.commit()
    db.refresh(financial_record)

    return financial_record


def delete_financial_record(
    db: Session,
    financial_record: FinancialRecord,
) -> None:
    db.delete(financial_record)
    db.commit()