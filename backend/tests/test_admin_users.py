"""اختبارات صلاحيات وإدارة المستخدمين للأدمن."""

from types import SimpleNamespace

from fastapi.testclient import TestClient

from app.core.dependencies import get_current_user, require_admin
from app.database.session import get_db
from app.main import app
import app.api.routes.users as users_routes


client = TestClient(app)


def override_get_db():
    yield object()


app.dependency_overrides[get_db] = override_get_db


def set_current_user(
    user_id: int,
    role: str,
):
    def override_current_user():
        return SimpleNamespace(
            id=user_id,
            role=role,
            email="current@example.com",
            full_name="Current User",
            is_active=True,
        )

    app.dependency_overrides[
        get_current_user
    ] = override_current_user


def set_admin_dependency(
    user_id: int = 1,
):
    def override_admin():
        return SimpleNamespace(
            id=user_id,
            role="admin",
            email="admin@example.com",
            full_name="Admin User",
            is_active=True,
        )

    app.dependency_overrides[
        require_admin
    ] = override_admin


def clear_admin_dependency():
    app.dependency_overrides.pop(
        require_admin,
        None,
    )


def test_admin_can_get_users(monkeypatch):
    """الأدمن يجب أن يستطيع جلب قائمة المستخدمين."""

    set_admin_dependency()

    fake_users = [
        {
            "id": 1,
            "full_name": "Admin User",
            "email": "admin@example.com",
            "role": "admin",
            "is_active": True,
            "created_at": "2026-08-13T00:00:00Z",
        },
        {
            "id": 2,
            "full_name": "Financial User",
            "email": "financial@example.com",
            "role": "financial_user",
            "is_active": True,
            "created_at": "2026-08-13T00:00:00Z",
        },
    ]

    monkeypatch.setattr(
        users_routes,
        "get_users",
        lambda db, skip, limit: fake_users,
    )

    response = client.get("/users/")

    assert response.status_code == 200
    assert len(response.json()) == 2
    assert response.json()[0]["role"] == "admin"


def test_regular_user_cannot_get_users():
    """المستخدم العادي يجب ألا يستطيع جلب كل المستخدمين."""

    clear_admin_dependency()

    set_current_user(
        user_id=2,
        role="financial_user",
    )

    response = client.get("/users/")

    assert response.status_code in (
        401,
        403,
    )


def test_admin_can_disable_user(monkeypatch):
    """الأدمن يجب أن يستطيع تعطيل مستخدم."""

    set_admin_dependency()

    fake_user = SimpleNamespace(
        id=2,
        full_name="Financial User",
        email="financial@example.com",
        role="financial_user",
        is_active=True,
        created_at="2026-08-13T00:00:00Z",
        hashed_password="hashed-password",
    )

    updated_user = {
        "id": 2,
        "full_name": "Financial User",
        "email": "financial@example.com",
        "role": "financial_user",
        "is_active": False,
        "created_at": "2026-08-13T00:00:00Z",
    }

    monkeypatch.setattr(
        users_routes,
        "get_user",
        lambda db, user_id: fake_user,
    )

    monkeypatch.setattr(
        users_routes,
        "update_user",
        lambda db, user, data, hashed_password: updated_user,
    )

    response = client.put(
        "/users/2",
        json={
            "is_active": False,
        },
    )

    assert response.status_code == 200
    assert response.json()["is_active"] is False


def test_admin_can_delete_user(monkeypatch):
    """الأدمن يجب أن يستطيع حذف مستخدم."""

    set_admin_dependency()

    fake_user = SimpleNamespace(
        id=2,
        full_name="Financial User",
        email="financial@example.com",
        role="financial_user",
        is_active=True,
    )

    deleted = {
        "called": False,
    }

    monkeypatch.setattr(
        users_routes,
        "get_user",
        lambda db, user_id: fake_user,
    )

    def fake_delete_user(
        db,
        user,
    ):
        deleted["called"] = True

    monkeypatch.setattr(
        users_routes,
        "delete_user",
        fake_delete_user,
    )

    response = client.delete(
        "/users/2"
    )

    assert response.status_code == 204
    assert deleted["called"] is True