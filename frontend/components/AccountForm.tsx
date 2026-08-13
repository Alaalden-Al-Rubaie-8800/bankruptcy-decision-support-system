"use client";

import { FormEvent, useEffect, useState } from "react";

type UserAccount = {
  id: number;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
};

function translateRole(role: string) {
  if (role === "admin") return "مدير النظام";
  if (role === "financial_user") return "مستخدم مالي";

  return role;
}

export default function AccountForm() {
  const [user, setUser] = useState<UserAccount | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadAccount() {
      try {
        const response = await fetch("/api/account/me", {
          cache: "no-store",
        });

        if (response.status === 401) {
          window.location.href = "/login";
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          setError(
            data.detail ?? "تعذر تحميل بيانات الحساب"
          );
          return;
        }

        setUser(data);
        setFullName(data.full_name);
        setEmail(data.email);
      } catch {
        setError("حدث خطأ أثناء تحميل بيانات الحساب");
      } finally {
        setLoading(false);
      }
    }

    loadAccount();
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!fullName.trim()) {
      setError("الاسم الكامل مطلوب");
      return;
    }

    if (!email.trim()) {
      setError("البريد الإلكتروني مطلوب");
      return;
    }

    if (password && password.length < 8) {
      setError(
        "كلمة المرور يجب أن تكون 8 أحرف على الأقل"
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }

    setSaving(true);

    const body: {
      full_name: string;
      email: string;
      password?: string;
    } = {
      full_name: fullName.trim(),
      email: email.trim(),
    };

    if (password) {
      body.password = password;
    }

    try {
      const response = await fetch("/api/account/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.detail ?? "تعذر تحديث بيانات الحساب"
        );
        return;
      }

      setUser(data);
      setFullName(data.full_name);
      setEmail(data.email);

      setPassword("");
      setConfirmPassword("");

      setSuccess("تم تحديث بيانات الحساب بنجاح");
    } catch {
      setError("حدث خطأ أثناء تحديث الحساب");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="card">
        جارٍ تحميل بيانات الحساب...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-2xl bg-red-50 p-5 text-red-700">
        {error || "تعذر تحميل بيانات الحساب"}
      </div>
    );
  }

  const createdAt = new Date(
    user.created_at
  ).toLocaleString("ar-YE");

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="page-title">
          حسابي
        </h1>

        <p className="page-subtitle">
          عرض وتعديل بيانات حسابك في النظام
        </p>
      </div>

      <section className="card">
        <h2 className="section-title">
          معلومات الحساب
        </h2>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div>
            <span className="text-sm text-slate-500">
              رقم المستخدم
            </span>

            <p className="mt-1 font-bold text-slate-900">
              {user.id}
            </p>
          </div>

          <div>
            <span className="text-sm text-slate-500">
              نوع الحساب
            </span>

            <p className="mt-1 font-bold text-slate-900">
              {translateRole(user.role)}
            </p>
          </div>

          <div>
            <span className="text-sm text-slate-500">
              حالة الحساب
            </span>

            <p
              className={`mt-1 font-bold ${
                user.is_active
                  ? "text-green-700"
                  : "text-red-700"
              }`}
            >
              {user.is_active ? "نشط" : "غير نشط"}
            </p>
          </div>

          <div>
            <span className="text-sm text-slate-500">
              تاريخ إنشاء الحساب
            </span>

            <p className="mt-1 font-bold text-slate-900">
              {createdAt}
            </p>
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="section-title">
          تعديل البيانات
        </h2>

        <form
          onSubmit={handleSubmit}
          className="mt-5 space-y-5"
        >
          <div>
            <label
              className="field-label"
              htmlFor="fullName"
            >
              الاسم الكامل
            </label>

            <input
              id="fullName"
              className="field-input"
              type="text"
              value={fullName}
              onChange={(event) =>
                setFullName(event.target.value)
              }
              required
            />
          </div>

          <div>
            <label
              className="field-label"
              htmlFor="email"
            >
              البريد الإلكتروني
            </label>

            <input
              id="email"
              className="field-input"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              dir="ltr"
              required
            />
          </div>

          <div className="border-t border-slate-200 pt-5">
            <h3 className="font-bold text-slate-900">
              تغيير كلمة المرور
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              اترك الحقلين فارغين إذا لا تريد تغيير كلمة المرور.
            </p>
          </div>

          <div>
            <label
              className="field-label"
              htmlFor="password"
            >
              كلمة المرور الجديدة
            </label>

            <input
              id="password"
              className="field-input"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete="new-password"
            />
          </div>

          <div>
            <label
              className="field-label"
              htmlFor="confirmPassword"
            >
              تأكيد كلمة المرور الجديدة
            </label>

            <input
              id="confirmPassword"
              className="field-input"
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              autoComplete="new-password"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl bg-green-50 p-3 text-sm font-medium text-green-700">
              {success}
            </div>
          )}

          <button
            className="btn-primary"
            type="submit"
            disabled={saving}
          >
            {saving
              ? "جارٍ حفظ التغييرات..."
              : "حفظ التغييرات"}
          </button>
        </form>
      </section>
    </div>
  );
}