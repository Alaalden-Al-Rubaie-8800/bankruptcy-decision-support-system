"""مسارات المستخدمين مع صلاحيات Admin وJWT."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, require_admin
from app.core.security import hash_password
from app.database.session import get_db
from app.schemas.user import (
    UserAccountUpdate,
    UserCreate,
    UserResponse,
    UserUpdate,
)
from app.services.user_service import (
    create_user,
    delete_user,
    get_user,
    get_user_by_email,
    get_users,
    update_user,
)


router = APIRouter(prefix="/users", tags=["Users"])


@router.post(
    "/",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def create(
    data: UserCreate,
    db: Session = Depends(get_db),
):
    if get_user_by_email(db, data.email):
        raise HTTPException(
            status_code=409,
            detail="Email already exists",
        )

    return create_user(
        db,
        data,
        hash_password(data.password),
    )


@router.get(
    "/me",
    response_model=UserResponse,
)
def get_me(
    current_user = Depends(get_current_user),
):
    return current_user


@router.put(
    "/me",
    response_model=UserResponse,
)
def update_me(
    data: UserAccountUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    if data.email and data.email != current_user.email:
        existing_user = get_user_by_email(
            db,
            data.email,
        )

        if existing_user:
            raise HTTPException(
                status_code=409,
                detail="Email already exists",
            )

    hashed_password = None

    if data.password:
        hashed_password = hash_password(
            data.password
        )

    update_data = UserUpdate(
        full_name=data.full_name,
        email=data.email,
        password=data.password,
    )

    return update_user(
        db,
        current_user,
        update_data,
        hashed_password,
    )


@router.get(
    "/",
    response_model=list[UserResponse],
)
def get_all(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    admin = Depends(require_admin),
):
    return get_users(
        db,
        skip,
        limit,
    )


@router.get(
    "/{user_id}",
    response_model=UserResponse,
)
def get_one(
    user_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    if (
        current_user.id != user_id
        and current_user.role != "admin"
    ):
        raise HTTPException(
            status_code=403,
            detail="You can only view your own account",
        )

    user = get_user(
        db,
        user_id,
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    return user


@router.put(
    "/{user_id}",
    response_model=UserResponse,
)
def update(
    user_id: int,
    data: UserUpdate,
    db: Session = Depends(get_db),
    admin = Depends(require_admin),
):
    user = get_user(
        db,
        user_id,
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    hashed_password = None

    if data.password:
        hashed_password = hash_password(
            data.password
        )

    return update_user(
        db,
        user,
        data,
        hashed_password,
    )


@router.delete(
    "/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete(
    user_id: int,
    db: Session = Depends(get_db),
    admin = Depends(require_admin),
):
    user = get_user(
        db,
        user_id,
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    delete_user(
        db,
        user,
    )