"""مسارات API الخاصة بالسجلات المالية مع حماية JWT."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.dependencies import get_current_user
from app.database.session import get_db
from app.schemas.financial_record import (
    FinancialRecordCreate,
    FinancialRecordResponse,
    FinancialRecordUpdate,
)
from app.services.financial_record_service import (
    create_financial_record,
    delete_financial_record,
    get_company_financial_records,
    get_financial_record,
    update_financial_record,
)

router = APIRouter(
    prefix="/financial-records",
    tags=["Financial Records"],
    dependencies=[Depends(get_current_user)],
)

@router.post("/", response_model=FinancialRecordResponse, status_code=status.HTTP_201_CREATED)
def create(data: FinancialRecordCreate, db: Session = Depends(get_db)):
    return create_financial_record(db, data)

@router.get("/{record_id}", response_model=FinancialRecordResponse)
def get_one(record_id: int, db: Session = Depends(get_db)):
    record = get_financial_record(db, record_id)

    if not record:
        raise HTTPException(status_code=404, detail="Financial record not found")

    return record

@router.get("/company/{company_id}", response_model=list[FinancialRecordResponse])
def get_by_company(company_id: int, db: Session = Depends(get_db)):
    return get_company_financial_records(db, company_id)

@router.put("/{record_id}", response_model=FinancialRecordResponse)
def update(
    record_id: int,
    data: FinancialRecordUpdate,
    db: Session = Depends(get_db),
):
    record = get_financial_record(db, record_id)

    if not record:
        raise HTTPException(status_code=404, detail="Financial record not found")

    return update_financial_record(db, record, data)

@router.delete("/{record_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(record_id: int, db: Session = Depends(get_db)):
    record = get_financial_record(db, record_id)

    if not record:
        raise HTTPException(status_code=404, detail="Financial record not found")

    delete_financial_record(db, record)