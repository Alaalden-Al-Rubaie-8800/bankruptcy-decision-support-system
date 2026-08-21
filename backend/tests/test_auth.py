"""اختبارات مسار تسجيل الدخول والمصادقة."""

from types import SimpleNamespace

from fastapi.testclient import TestClient

from app.database.session import get_db
from app.main import app
import app.api.routes.auth as auth_route


client = TestClient(app)


def override_get_db():
    yield object()


app.dependency_overrides[get_db] = override_get_db


def test_login_success(monkeypatch):
    """يجب تسجيل الدخول بنجاح عند صحة البريد وكلمة المرور."""

    fake_user = SimpleNamespace(
        id=1,
        email="test@example.com",
        hashed_password="hashed-password",
        is_active=True,
    )

    monkeypatch.setattr(
        auth_route,
        "get_user_by_email",
        lambda db, email: fake_user,
    )

    monkeypatch.setattr(
        auth_route,
        "verify_password",
        lambda password, hashed_password: True,
    )

    monkeypatch.setattr(
        auth_route,
        "create_access_token",
        lambda data: "fake-jwt-token",
    )

    response = client.post(
        "/auth/login",
        json={
            "email": "test@example.com",
            "password": "password123",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["access_token"] == "fake-jwt-token"
    assert data["token_type"] == "bearer"


def test_login_invalid_credentials(monkeypatch):
    """يجب رفض تسجيل الدخول عند بيانات دخول غير صحيحة."""

    monkeypatch.setattr(
        auth_route,
        "get_user_by_email",
        lambda db, email: None,
    )

    response = client.post(
        "/auth/login",
        json={
            "email": "wrong@example.com",
            "password": "wrongpassword",
        },
    )

    assert response.status_code == 401

    assert response.json() == {
        "detail": "Invalid email or password"
    }


def test_login_wrong_password(monkeypatch):
    """يجب رفض تسجيل الدخول عند وجود المستخدم وكلمة المرور خاطئة."""

    fake_user = SimpleNamespace(
        id=1,
        email="test@example.com",
        hashed_password="hashed-password",
        is_active=True,
    )

    monkeypatch.setattr(
        auth_route,
        "get_user_by_email",
        lambda db, email: fake_user,
    )

    monkeypatch.setattr(
        auth_route,
        "verify_password",
        lambda password, hashed_password: False,
    )

    response = client.post(
        "/auth/login",
        json={
            "email": "test@example.com",
            "password": "wrongpassword",
        },
    )

    assert response.status_code == 401

    assert response.json() == {
        "detail": "Invalid email or password"
    }


def test_login_inactive_user(monkeypatch):
    """يجب منع المستخدم المعطل من تسجيل الدخول."""

    fake_user = SimpleNamespace(
        id=2,
        email="inactive@example.com",
        hashed_password="hashed-password",
        is_active=False,
    )

    monkeypatch.setattr(
        auth_route,
        "get_user_by_email",
        lambda db, email: fake_user,
    )

    monkeypatch.setattr(
        auth_route,
        "verify_password",
        lambda password, hashed_password: True,
    )

    response = client.post(
        "/auth/login",
        json={
            "email": "inactive@example.com",
            "password": "password123",
        },
    )

    assert response.status_code == 403

    assert response.json() == {
        "detail": "User account is inactive"
    }


def test_login_invalid_email_format():
    """يجب رفض البريد الإلكتروني غير الصحيح بواسطة Pydantic."""

    response = client.post(
        "/auth/login",
        json={
            "email": "not-an-email",
            "password": "password123",
        },
    )

    assert response.status_code == 422