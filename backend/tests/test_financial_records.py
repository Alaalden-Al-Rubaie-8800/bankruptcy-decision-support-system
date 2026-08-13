"""اختبارات مسارات السجلات المالية."""

from types import SimpleNamespace

from fastapi.testclient import TestClient

from app.core.dependencies import get_current_user
from app.database.session import get_db
from app.main import app
import app.api.routes.financial_records as financial_routes


client = TestClient(app)


def override_get_db():
    yield object()


def override_current_user():
    return SimpleNamespace(
        id=1,
        role="financial_user",
    )


app.dependency_overrides[get_db] = override_get_db
app.dependency_overrides[get_current_user] = override_current_user


def test_create_financial_record_success(monkeypatch):
    fake_company = SimpleNamespace(id=10)

    fake_record = {
        "id": 1,
        "company_id": 10,
        "fiscal_year": 2025,
        "total_assets": 100000,
        "total_liabilities": 50000,
        "current_assets": 40000,
        "current_liabilities": 20000,
        "total_revenue": 120000,
        "net_income": 15000,
        "operating_cash_flow": 18000,
        "created_at": "2026-08-13T00:00:00Z",
    }

    monkeypatch.setattr(
        financial_routes,
        "get_company_by_user",
        lambda db, user_id: fake_company,
    )

    monkeypatch.setattr(
        financial_routes,
        "get_financial_record_by_year",
        lambda db, company_id, fiscal_year: None,
    )

    monkeypatch.setattr(
        financial_routes,
        "create_financial_record",
        lambda db, data: fake_record,
    )

    response = client.post(
        "/financial-records/",
        json={
            "fiscal_year": 2025,
            "total_assets": 100000,
            "total_liabilities": 50000,
            "current_assets": 40000,
            "current_liabilities": 20000,
            "total_revenue": 120000,
            "net_income": 15000,
            "operating_cash_flow": 18000,
        },
    )

    assert response.status_code == 201
    assert response.json()["fiscal_year"] == 2025


def test_create_financial_record_duplicate_year(monkeypatch):
    fake_company = SimpleNamespace(id=10)
    existing_record = SimpleNamespace(
        id=99,
        fiscal_year=2025,
    )

    monkeypatch.setattr(
        financial_routes,
        "get_company_by_user",
        lambda db, user_id: fake_company,
    )

    monkeypatch.setattr(
        financial_routes,
        "get_financial_record_by_year",
        lambda db, company_id, fiscal_year: existing_record,
    )

    response = client.post(
        "/financial-records/",
        json={
            "fiscal_year": 2025,
            "total_assets": 100000,
            "total_liabilities": 50000,
            "current_assets": 40000,
            "current_liabilities": 20000,
            "total_revenue": 120000,
            "net_income": 15000,
            "operating_cash_flow": 18000,
        },
    )

    assert response.status_code == 409
    assert response.json() == {
        "detail": "A financial record already exists for this fiscal year"
    }


def test_get_my_financial_records(monkeypatch):
    fake_company = SimpleNamespace(id=10)

    fake_records = [
        {
            "id": 1,
            "company_id": 10,
            "fiscal_year": 2025,
            "total_assets": 100000,
            "total_liabilities": 50000,
            "current_assets": 40000,
            "current_liabilities": 20000,
            "total_revenue": 120000,
            "net_income": 15000,
            "operating_cash_flow": 18000,
            "created_at": "2026-08-13T00:00:00Z",
        }
    ]

    monkeypatch.setattr(
        financial_routes,
        "get_company_by_user",
        lambda db, user_id: fake_company,
    )

    monkeypatch.setattr(
        financial_routes,
        "get_company_financial_records",
        lambda db, company_id: fake_records,
    )

    response = client.get(
        "/financial-records/me"
    )

    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["fiscal_year"] == 2025


def test_get_financial_record_access_denied(monkeypatch):
    fake_record = SimpleNamespace(
        id=1,
        company_id=99,
        fiscal_year=2025,
        total_assets=100000,
        total_liabilities=50000,
        current_assets=40000,
        current_liabilities=20000,
        total_revenue=120000,
        net_income=15000,
        operating_cash_flow=18000,
        created_at="2026-08-13T00:00:00Z",
    )

    fake_company = SimpleNamespace(
        id=10,
    )

    monkeypatch.setattr(
        financial_routes,
        "get_financial_record",
        lambda db, record_id: fake_record,
    )

    monkeypatch.setattr(
        financial_routes,
        "get_company_by_user",
        lambda db, user_id: fake_company,
    )

    response = client.get(
        "/financial-records/1"
    )

    assert response.status_code == 403
    assert response.json() == {
        "detail": "Access denied"
    }