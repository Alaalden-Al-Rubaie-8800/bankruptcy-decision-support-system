"""مسارات السجلات المالية وربطها بشركة المستخدم الحالي."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.session import get_db
from app.schemas.financial_record import (
    FinancialRecordAccountCreate,
    FinancialRecordCreate,
    FinancialRecordResponse,
    FinancialRecordUpdate,
)
from app.services.company_service import get_company_by_user
from app.services.financial_record_service import (
    create_financial_record,
    delete_financial_record,
    get_company_financial_records,
    get_financial_record,
    get_financial_record_by_year,
    update_financial_record,
)


router = APIRouter(
    prefix="/financial-records",
    tags=["Financial Records"],
)


@router.post(
    "/",
    response_model=FinancialRecordResponse,
    status_code=status.HTTP_201_CREATED,
)
def create(
    data: FinancialRecordAccountCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
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

    existing_record = get_financial_record_by_year(
        db=db,
        company_id=company.id,
        fiscal_year=data.fiscal_year,
    )

    if existing_record:
        raise HTTPException(
            status_code=409,
            detail="A financial record already exists for this fiscal year",
        )

    financial_data = FinancialRecordCreate(
        company_id=company.id,
        fiscal_year=data.fiscal_year,
        total_assets=data.total_assets,
        total_liabilities=data.total_liabilities,
        current_assets=data.current_assets,
        current_liabilities=data.current_liabilities,
        total_revenue=data.total_revenue,
        net_income=data.net_income,
        operating_cash_flow=data.operating_cash_flow,
    )

    return create_financial_record(
        db,
        financial_data,
    )


@router.get(
    "/me",
    response_model=list[FinancialRecordResponse],
)
def get_my_records(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    company = get_company_by_user(
        db,
        current_user.id,
    )

    if not company:
        return []

    return get_company_financial_records(
        db,
        company.id,
    )


@router.get(
    "/{record_id}",
    response_model=FinancialRecordResponse,
)
def get_one(
    record_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    record = get_financial_record(
        db,
        record_id,
    )

    if not record:
        raise HTTPException(
            status_code=404,
            detail="Financial record not found",
        )

    if current_user.role != "admin":
        company = get_company_by_user(
            db,
            current_user.id,
        )

        if (
            not company
            or record.company_id != company.id
        ):
            raise HTTPException(
                status_code=403,
                detail="Access denied",
            )

    return record


@router.put(
    "/{record_id}",
    response_model=FinancialRecordResponse,
)
def update(
    record_id: int,
    data: FinancialRecordUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    record = get_financial_record(
        db,
        record_id,
    )

    if not record:
        raise HTTPException(
            status_code=404,
            detail="Financial record not found",
        )

    if current_user.role != "admin":
        company = get_company_by_user(
            db,
            current_user.id,
        )

        if (
            not company
            or record.company_id != company.id
        ):
            raise HTTPException(
                status_code=403,
                detail="Access denied",
            )

    if (
        data.fiscal_year is not None
        and data.fiscal_year != record.fiscal_year
    ):
        existing_record = get_financial_record_by_year(
            db=db,
            company_id=record.company_id,
            fiscal_year=data.fiscal_year,
        )

        if existing_record:
            raise HTTPException(
                status_code=409,
                detail="A financial record already exists for this fiscal year",
            )

    return update_financial_record(
        db,
        record,
        data,
    )


@router.delete(
    "/{record_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete(
    record_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    record = get_financial_record(
        db,
        record_id,
    )

    if not record:
        raise HTTPException(
            status_code=404,
            detail="Financial record not found",
        )

    if current_user.role != "admin":
        company = get_company_by_user(
            db,
            current_user.id,
        )

        if (
            not company
            or record.company_id != company.id
        ):
            raise HTTPException(
                status_code=403,
                detail="Access denied",
            )

    delete_financial_record(
        db,
        record,
    )