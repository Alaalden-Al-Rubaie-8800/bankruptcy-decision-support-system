"use client";

import { useEffect, useState } from "react";


type AdminUser = {
  id: number;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
};


export default function AdminUsersTable() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState<number | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  async function loadCurrentUser() {
    try {
      const response = await fetch(
        "/api/account/me",
        {
          cache: "no-store",
        }
      );

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      setCurrentUserId(data.id);
    } catch {
      // لا نوقف تحميل لوحة الإدارة إذا تعذر هذا الطلب
    }
  }


  async function loadUsers() {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        "/api/admin/users",
        {
          cache: "no-store",
        }
      );

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (response.status === 403) {
        window.location.href = "/dashboard";
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.detail ??
            "تعذر تحميل المستخدمين"
        );
        return;
      }

      setUsers(
        Array.isArray(data)
          ? data
          : []
      );
    } catch {
      setError(
        "حدث خطأ أثناء تحميل المستخدمين"
      );
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    void Promise.all([
      loadCurrentUser(),
      loadUsers(),
    ]);
  }, []);


  async function toggleUserStatus(
    user: AdminUser
  ) {
    if (user.id === currentUserId) {
      setError(
        "لا يمكنك تعطيل حسابك الإداري الحالي"
      );
      setSuccess("");
      return;
    }

    setWorkingId(user.id);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `/api/admin/users/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            is_active: !user.is_active,
          }),
        }
      );

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (response.status === 403) {
        window.location.href = "/dashboard";
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.detail ??
            "تعذر تحديث حالة المستخدم"
        );
        return;
      }

      setUsers((current) =>
        current.map((item) =>
          item.id === user.id
            ? data
            : item
        )
      );

      setSuccess(
        data.is_active
          ? "تم تفعيل المستخدم بنجاح"
          : "تم تعطيل المستخدم بنجاح"
      );
    } catch {
      setError(
        "حدث خطأ أثناء تحديث حالة المستخدم"
      );
    } finally {
      setWorkingId(null);
    }
  }


  async function deleteUser(
    user: AdminUser
  ) {
    if (user.id === currentUserId) {
      setError(
        "لا يمكنك حذف حسابك الإداري الحالي"
      );
      setSuccess("");
      return;
    }

    const confirmed = window.confirm(
      `هل أنت متأكد من حذف المستخدم ${user.full_name}؟`
    );

    if (!confirmed) {
      return;
    }

    setWorkingId(user.id);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `/api/admin/users/${user.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (response.status === 403) {
        window.location.href = "/dashboard";
        return;
      }

      if (!response.ok) {
        let message =
          "تعذر حذف المستخدم";

        try {
          const data =
            await response.json();

          message =
            data.detail ?? message;
        } catch {
          // لا يوجد JSON
        }

        setError(message);
        return;
      }

      setUsers((current) =>
        current.filter(
          (item) =>
            item.id !== user.id
        )
      );

      setSuccess(
        "تم حذف المستخدم بنجاح"
      );
    } catch {
      setError(
        "حدث خطأ أثناء حذف المستخدم"
      );
    } finally {
      setWorkingId(null);
    }
  }


  if (loading) {
    return (
      <section className="card">
        جارٍ تحميل المستخدمين...
      </section>
    );
  }


  return (
    <section className="card">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="section-title">
            المستخدمون
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            جميع الحسابات المسجلة في النظام.
          </p>
        </div>

        <button
          type="button"
          className="btn-secondary"
          onClick={() => {
            void loadUsers();
          }}
        >
          تحديث
        </button>
      </div>


      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}


      {success && (
        <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-700">
          {success}
        </div>
      )}


      {!users.length ? (
        <div className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
          لا يوجد مستخدمون.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>الاسم</th>
                <th>البريد الإلكتروني</th>
                <th>الدور</th>
                <th>الحالة</th>
                <th>تاريخ الإنشاء</th>
                <th>الإجراءات</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => {
                const isCurrentUser =
                  user.id === currentUserId;

                const isWorking =
                  workingId === user.id;

                return (
                  <tr key={user.id}>
                    <td>
                      <div className="font-medium">
                        {user.full_name}
                      </div>

                      {isCurrentUser && (
                        <div className="mt-1 text-xs text-sky-700">
                          حسابك الحالي
                        </div>
                      )}
                    </td>

                    <td>
                      {user.email}
                    </td>

                    <td>
                      {user.role === "admin"
                        ? "مدير النظام"
                        : "مستخدم مالي"}
                    </td>

                    <td>
                      <span
                        className={
                          user.is_active
                            ? "status-chip status-ok"
                            : "rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700"
                        }
                      >
                        {user.is_active
                          ? "نشط"
                          : "معطل"}
                      </span>
                    </td>

                    <td>
                      {new Date(
                        user.created_at
                      ).toLocaleString(
                        "ar-YE"
                      )}
                    </td>

                    <td>
                      {isCurrentUser ? (
                        <span className="text-sm text-slate-400">
                          لا يمكن تعديل الحالة أو الحذف
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={isWorking}
                            className="btn-secondary"
                            onClick={() =>
                              void toggleUserStatus(
                                user
                              )
                            }
                          >
                            {isWorking
                              ? "جارٍ التنفيذ..."
                              : user.is_active
                                ? "تعطيل"
                                : "تفعيل"}
                          </button>

                          <button
                            type="button"
                            disabled={isWorking}
                            className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                            onClick={() =>
                              void deleteUser(
                                user
                              )
                            }
                          >
                            حذف
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}