"""add reports table

Revision ID: c2f6a4e9d8b1
Revises: 1f45749f42d9
Create Date: 2026-08-14
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "c2f6a4e9d8b1"
down_revision: Union[str, None] = "1f45749f42d9"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "reports",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("report_id", sa.String(length=40), nullable=False),
        sa.Column("prediction_id", sa.Integer(), nullable=False),
        sa.Column("filename", sa.String(length=255), nullable=False),
        sa.Column(
            "status",
            sa.String(length=30),
            server_default="generated",
            nullable=False,
        ),
        sa.Column("html_content", sa.Text(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["prediction_id"],
            ["predictions.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(
        op.f("ix_reports_id"),
        "reports",
        ["id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_reports_prediction_id"),
        "reports",
        ["prediction_id"],
        unique=True,
    )
    op.create_index(
        op.f("ix_reports_report_id"),
        "reports",
        ["report_id"],
        unique=True,
    )


def downgrade() -> None:
    op.drop_index(
        op.f("ix_reports_report_id"),
        table_name="reports",
    )
    op.drop_index(
        op.f("ix_reports_prediction_id"),
        table_name="reports",
    )
    op.drop_index(
        op.f("ix_reports_id"),
        table_name="reports",
    )
    op.drop_table("reports")
