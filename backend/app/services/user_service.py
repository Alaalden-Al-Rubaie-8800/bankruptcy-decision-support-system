from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate

def create_user(
    db: Session,
    user_data: UserCreate,
    hashed_password: str,
) -> User:
    user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        hashed_password=hashed_password,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user

def get_user(db: Session, user_id: int) -> User | None:
    statement = select(User).where(User.id == user_id)
    return db.scalar(statement)

def get_user_by_email(db: Session, email: str) -> User | None:
    statement = select(User).where(User.email == email)
    return db.scalar(statement)

def get_users(
    db: Session,
    skip: int = 0,
    limit: int = 100,
) -> list[User]:
    statement = (
        select(User)
        .offset(skip)
        .limit(limit)
        .order_by(User.id)
    )

    return list(db.scalars(statement).all())

def update_user(
    db: Session,
    user: User,
    user_data: UserUpdate,
    hashed_password: str | None = None,
) -> User:
    update_data = user_data.model_dump(
        exclude_unset=True,
        exclude={"password"},
    )

    for field, value in update_data.items():
        setattr(user, field, value)

    if hashed_password is not None:
        user.hashed_password = hashed_password

    db.add(user)
    db.commit()
    db.refresh(user)

    return user

def delete_user(
    db: Session,
    user: User,
) -> None:
    db.delete(user)
    db.commit()