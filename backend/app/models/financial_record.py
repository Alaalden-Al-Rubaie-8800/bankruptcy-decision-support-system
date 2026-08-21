from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, ForeignKey, Integer, Numeric, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database.session import Base


class FinancialRecord(Base):
    __tablename__ = "financial_records"

    __table_args__ = (
        UniqueConstraint(
            "company_id",
            "fiscal_year",
            name="uq_financial_records_company_fiscal_year",
        ),
    )

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    company_id: Mapped[int] = mapped_column(
        ForeignKey("companies.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    fiscal_year: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    total_assets: Mapped[Decimal] = mapped_column(
        Numeric(18, 2),
        nullable=False,
    )

    total_liabilities: Mapped[Decimal] = mapped_column(
        Numeric(18, 2),
        nullable=False,
    )

    current_assets: Mapped[Decimal] = mapped_column(
        Numeric(18, 2),
        nullable=False,
    )

    current_liabilities: Mapped[Decimal] = mapped_column(
        Numeric(18, 2),
        nullable=False,
    )

    total_revenue: Mapped[Decimal] = mapped_column(
        Numeric(18, 2),
        nullable=False,
    )

    net_income: Mapped[Decimal] = mapped_column(
        Numeric(18, 2),
        nullable=False,
    )

    operating_cash_flow: Mapped[Decimal] = mapped_column(
        Numeric(18, 2),
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )