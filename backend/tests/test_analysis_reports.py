"""اختبارات حماية عرض وتحميل تقارير التحليل المخزنة في PostgreSQL."""

from types import SimpleNamespace

from fastapi.testclient import TestClient

from app.core.dependencies import get_current_user
from app.database.session import get_db
from app.main import app
import app.api.routes.analysis as analysis_routes


def override_get_db():
    yield object()


app.dependency_overrides[get_db] = override_get_db


client = TestClient(app)


def set_current_user(user_id: int):
    def override_current_user():
        return SimpleNamespace(
            id=user_id,
            role="financial_user",
        )

    app.dependency_overrides[
        get_current_user
    ] = override_current_user


def _database_report(report_id: str):
    return SimpleNamespace(
        report_id=report_id,
        filename=f"{report_id}.html",
        html_content="<html><body>Test Report</body></html>",
    )


def test_report_owner_can_view(monkeypatch):
    report_id = "REP-20260813-ABCDEF12"

    monkeypatch.setattr(
        analysis_routes,
        "get_user_report_history",
        lambda db, user_id, report_id: SimpleNamespace(
            user_id=user_id,
            report_id=report_id,
        ),
    )

    monkeypatch.setattr(
        analysis_routes,
        "get_report_by_report_id",
        lambda db, report_id: _database_report(report_id),
    )

    set_current_user(5)

    response = client.get(
        f"/analysis/reports/{report_id}"
    )

    assert response.status_code == 200
    assert "Test Report" in response.text


def test_report_owner_can_download(monkeypatch):
    report_id = "REP-20260813-ABCDEF12"

    monkeypatch.setattr(
        analysis_routes,
        "get_user_report_history",
        lambda db, user_id, report_id: SimpleNamespace(
            user_id=user_id,
            report_id=report_id,
        ),
    )

    monkeypatch.setattr(
        analysis_routes,
        "get_report_by_report_id",
        lambda db, report_id: _database_report(report_id),
    )

    set_current_user(5)

    response = client.get(
        f"/analysis/reports/{report_id}/download"
    )

    assert response.status_code == 200
    assert "Test Report" in response.text
    assert "attachment" in response.headers["content-disposition"]


def test_other_user_cannot_view_report(monkeypatch):
    report_id = "REP-20260813-ABCDEF12"

    monkeypatch.setattr(
        analysis_routes,
        "get_user_report_history",
        lambda db, user_id, report_id: None,
    )

    set_current_user(6)

    response = client.get(
        f"/analysis/reports/{report_id}"
    )

    assert response.status_code == 404
    assert response.json() == {
        "detail": "Report not found"
    }


def test_other_user_cannot_download_report(monkeypatch):
    report_id = "REP-20260813-ABCDEF12"

    monkeypatch.setattr(
        analysis_routes,
        "get_user_report_history",
        lambda db, user_id, report_id: None,
    )

    set_current_user(6)

    response = client.get(
        f"/analysis/reports/{report_id}/download"
    )

    assert response.status_code == 404
    assert response.json() == {
        "detail": "Report not found"
    }


def test_invalid_report_id_is_rejected(monkeypatch):
    invalid_report_id = "invalid-report-id"

    set_current_user(5)

    response = client.get(
        f"/analysis/reports/{invalid_report_id}"
    )

    assert response.status_code == 400
    assert response.json() == {
        "detail": "Invalid report id"
    }
