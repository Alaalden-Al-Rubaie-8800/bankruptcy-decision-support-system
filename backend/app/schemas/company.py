from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

class CompanyBase(BaseModel):
    name: str = Field(
        min_length=2,
        max_length=150,
    )

    industry: str = Field(
        min_length=2,
        max_length=100,
    )

    registration_number: str | None = Field(
        default=None,
        max_length=100,
    )

class CompanyCreate(CompanyBase):
    pass

class CompanyUpdate(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=2,
        max_length=150,
    )

    industry: str | None = Field(
        default=None,
        min_length=2,
        max_length=100,
    )

    registration_number: str | None = Field(
        default=None,
        max_length=100,
    )

class CompanyResponse(CompanyBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)