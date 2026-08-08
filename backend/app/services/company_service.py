from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.company import Company
from app.schemas.company import CompanyCreate, CompanyUpdate

def create_company(db: Session, company_data: CompanyCreate) -> Company:
    company = Company(
        name=company_data.name,
        industry=company_data.industry,
        registration_number=company_data.registration_number,
    )

    db.add(company)
    db.commit()
    db.refresh(company)

    return company

def get_company(db: Session, company_id: int) -> Company | None:
    statement = select(Company).where(Company.id == company_id)
    return db.scalar(statement)

def get_companies(
    db: Session,
    skip: int = 0,
    limit: int = 100,
) -> list[Company]:
    statement = (
        select(Company)
        .offset(skip)
        .limit(limit)
        .order_by(Company.id)
    )

    return list(db.scalars(statement).all())

def update_company(
    db: Session,
    company: Company,
    company_data: CompanyUpdate,
) -> Company:
    update_data = company_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(company, field, value)

    db.add(company)
    db.commit()
    db.refresh(company)

    return company

def delete_company(
    db: Session,
    company: Company,
) -> None:
    db.delete(company)
    db.commit()