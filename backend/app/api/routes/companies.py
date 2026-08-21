"""مسارات الشركات وربط كل شركة بصاحب الحساب."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.session import get_db
from app.schemas.company import (
    CompanyCreate,
    CompanyResponse,
    CompanyUpdate,
)
from app.services.company_service import (
    create_company,
    delete_company,
    get_companies,
    get_company,
    get_company_by_user,
    update_company,
)


router = APIRouter(
    prefix="/companies",
    tags=["Companies"],
)


@router.post(
    "/",
    response_model=CompanyResponse,
    status_code=status.HTTP_201_CREATED,
)
def create(
    data: CompanyCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    existing_company = get_company_by_user(
        db,
        current_user.id,
    )

    if existing_company:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User already has a company",
        )

    try:
        return create_company(
            db,
            data,
            current_user.id,
        )

    except IntegrityError:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Registration number already exists",
        )


@router.get(
    "/me",
    response_model=CompanyResponse,
)
def get_my_company(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    company = get_company_by_user(
        db,
        current_user.id,
    )

    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found",
        )

    return company


@router.get(
    "/",
    response_model=list[CompanyResponse],
)
def get_all(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    if current_user.role == "admin":
        return get_companies(
            db,
            skip,
            limit,
        )

    company = get_company_by_user(
        db,
        current_user.id,
    )

    if not company:
        return []

    return [company]


@router.get(
    "/{company_id}",
    response_model=CompanyResponse,
)
def get_one(
    company_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    company = get_company(
        db,
        company_id,
    )

    if not company:
        raise HTTPException(
            status_code=404,
            detail="Company not found",
        )

    if (
        current_user.role != "admin"
        and company.user_id != current_user.id
    ):
        raise HTTPException(
            status_code=403,
            detail="Access denied",
        )

    return company


@router.put(
    "/{company_id}",
    response_model=CompanyResponse,
)
def update(
    company_id: int,
    data: CompanyUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    company = get_company(
        db,
        company_id,
    )

    if not company:
        raise HTTPException(
            status_code=404,
            detail="Company not found",
        )

    if (
        current_user.role != "admin"
        and company.user_id != current_user.id
    ):
        raise HTTPException(
            status_code=403,
            detail="Access denied",
        )

    try:
        return update_company(
            db,
            company,
            data,
        )

    except IntegrityError:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Registration number already exists",
        )


@router.delete(
    "/{company_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete(
    company_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    company = get_company(
        db,
        company_id,
    )

    if not company:
        raise HTTPException(
            status_code=404,
            detail="Company not found",
        )

    if (
        current_user.role != "admin"
        and company.user_id != current_user.id
    ):
        raise HTTPException(
            status_code=403,
            detail="Access denied",
        )

    delete_company(
        db,
        company,
    )