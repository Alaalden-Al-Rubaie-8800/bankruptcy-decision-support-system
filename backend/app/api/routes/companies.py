"""مسارات API الخاصة بالشركات مع حماية JWT."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from app.core.dependencies import get_current_user
from app.database.session import get_db
from app.schemas.company import CompanyCreate, CompanyResponse, CompanyUpdate
from app.services.company_service import (
    create_company,
    delete_company,
    get_companies,
    get_company,
    update_company,
)

router = APIRouter(
    prefix="/companies",
    tags=["Companies"],
    dependencies=[Depends(get_current_user)],
)

@router.post("/", response_model=CompanyResponse, status_code=status.HTTP_201_CREATED)
def create(data: CompanyCreate, db: Session = Depends(get_db)):
    try:
        return create_company(db, data)

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Registration number already exists",
        )

@router.get("/", response_model=list[CompanyResponse])
def get_all(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_companies(db, skip, limit)

@router.get("/{company_id}", response_model=CompanyResponse)
def get_one(company_id: int, db: Session = Depends(get_db)):
    company = get_company(db, company_id)

    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    return company

@router.put("/{company_id}", response_model=CompanyResponse)
def update(company_id: int, data: CompanyUpdate, db: Session = Depends(get_db)):
    company = get_company(db, company_id)

    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    try:
        return update_company(db, company, data)

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Registration number already exists",
        )

@router.delete("/{company_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(company_id: int, db: Session = Depends(get_db)):
    company = get_company(db, company_id)

    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    delete_company(db, company)