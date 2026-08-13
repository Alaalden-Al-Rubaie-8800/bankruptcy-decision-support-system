"""اختبارات حماية عرض وتحميل تقارير التحليل."""

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


def test_report_owner_can_view(
    monkeypatch,
    tmp_path,
):
    """صاحب التقرير يجب أن يستطيع فتح تقريره."""

    report_id = "REP-20260813-ABCDEF12"

    report_file = (
        tmp_path / f"{report_id}.html"
    )

    report_file.write_text(
        "<html><body>Test Report</body></html>",
        encoding="utf-8",
    )

    monkeypatch.setattr(
        analysis_routes,
        "GENERATED_REPORTS_DIR",
        tmp_path,
    )

    monkeypatch.setattr(
        analysis_routes,
        "get_user_report_history",
        lambda db, user_id, report_id: (
            SimpleNamespace(
                user_id=user_id,
                report_id=report_id,
            )
        ),
    )

    set_current_user(5)

    response = client.get(
        f"/analysis/reports/{report_id}"
    )

    assert response.status_code == 200
    assert "Test Report" in response.text


def test_other_user_cannot_view_report(
    monkeypatch,
):
    """مستخدم آخر يجب ألا يستطيع فتح التقرير."""

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


def test_other_user_cannot_download_report(
    monkeypatch,
):
    """مستخدم آخر يجب ألا يستطيع تحميل التقرير."""

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


def test_invalid_report_id_is_rejected(
    monkeypatch,
):
    """يجب رفض report_id غير المطابق للصيغة المعتمدة."""

    invalid_report_id = "invalid-report-id"

    monkeypatch.setattr(
        analysis_routes,
        "get_user_report_history",
        lambda db, user_id, report_id: (
            SimpleNamespace(
                user_id=user_id,
                report_id=report_id,
            )
        ),
    )

    set_current_user(5)

    response = client.get(
        f"/analysis/reports/{invalid_report_id}"
    )

    assert response.status_code == 400

    assert response.json() == {
        "detail": "Invalid report id"
    }