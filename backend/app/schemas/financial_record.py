"""Schemas الخاصة بالسجلات المالية للشركات."""

from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class FinancialValues(BaseModel):
    fiscal_year: int = Field(
        ge=2000,
        le=2100,
    )

    total_assets: Decimal = Field(
        ge=0,
        max_digits=18,
        decimal_places=2,
    )

    total_liabilities: Decimal = Field(
        ge=0,
        max_digits=18,
        decimal_places=2,
    )

    current_assets: Decimal = Field(
        ge=0,
        max_digits=18,
        decimal_places=2,
    )

    current_liabilities: Decimal = Field(
        ge=0,
        max_digits=18,
        decimal_places=2,
    )

    total_revenue: Decimal = Field(
        ge=0,
        max_digits=18,
        decimal_places=2,
    )

    net_income: Decimal = Field(
        max_digits=18,
        decimal_places=2,
    )

    operating_cash_flow: Decimal = Field(
        max_digits=18,
        decimal_places=2,
    )


class FinancialRecordAccountCreate(FinancialValues):
    pass


class FinancialRecordCreate(FinancialValues):
    company_id: int = Field(
        gt=0,
    )


class FinancialRecordUpdate(BaseModel):
    fiscal_year: int | None = Field(
        default=None,
        ge=2000,
        le=2100,
    )

    total_assets: Decimal | None = Field(
        default=None,
        ge=0,
        max_digits=18,
        decimal_places=2,
    )

    total_liabilities: Decimal | None = Field(
        default=None,
        ge=0,
        max_digits=18,
        decimal_places=2,
    )

    current_assets: Decimal | None = Field(
        default=None,
        ge=0,
        max_digits=18,
        decimal_places=2,
    )

    current_liabilities: Decimal | None = Field(
        default=None,
        ge=0,
        max_digits=18,
        decimal_places=2,
    )

    total_revenue: Decimal | None = Field(
        default=None,
        ge=0,
        max_digits=18,
        decimal_places=2,
    )

    net_income: Decimal | None = Field(
        default=None,
        max_digits=18,
        decimal_places=2,
    )

    operating_cash_flow: Decimal | None = Field(
        default=None,
        max_digits=18,
        decimal_places=2,
    )


class FinancialRecordResponse(FinancialValues):
    id: int
    company_id: int
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )