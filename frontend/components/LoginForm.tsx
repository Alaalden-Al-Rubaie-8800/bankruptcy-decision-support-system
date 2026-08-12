"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();

    setError("");
    setBusy(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail ?? "تعذر تسجيل الدخول"
        );
      }

      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "تعذر تسجيل الدخول"
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/50 md:p-9"
    >
      <div className="mb-7 text-center">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-sky-950 text-xl font-black text-white">
          AI
        </div>

        <h1 className="text-2xl font-extrabold">
          تسجيل الدخول
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          ادخل بحساب النظام للوصول إلى التحليل الذكي
          والنتائج والتقارير.
        </p>
      </div>

      <label
        className="field-label"
        htmlFor="email"
      >
        البريد الإلكتروني
      </label>

      <input
        id="email"
        className="field-input mb-4"
        type="email"
        autoComplete="username"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label
        className="field-label"
        htmlFor="password"
      >
        كلمة المرور
      </label>

      <input
        id="password"
        className="field-input mb-4"
        type="password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <button
        className="btn-primary w-full"
        disabled={busy}
        type="submit"
      >
        {busy ? "جارٍ التحقق..." : "دخول آمن"}
      </button>

      <div className="mt-5 text-center text-sm text-slate-500">
        ليس لديك حساب؟{" "}
        <Link
          href="/register"
          className="font-bold text-sky-900 hover:underline"
        >
          إنشاء حساب جديد
        </Link>
      </div>

      <p className="mt-4 text-center text-xs leading-5 text-slate-400">
        يتم حفظ رمز الدخول في Cookie محمية HTTP-only
        داخل طبقة Next.js، وليس في localStorage.
      </p>
    </form>
  );
}