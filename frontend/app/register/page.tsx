"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!fullName || !email || !password || !confirmPassword) {
      setError("جميع الحقول مطلوبة");
      return;
    }

    if (password.length < 8) {
      setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      return;
    }

    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail ?? "تعذر إنشاء الحساب");
        return;
      }

      router.push("/login?registered=1");
    } catch {
      setError("حدث خطأ أثناء إنشاء الحساب");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-md">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <div className="mb-7 text-center">
            <h1 className="text-2xl font-bold text-slate-900">
              إنشاء حساب جديد
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              أنشئ حسابك للبدء في تحليل بيانات شركتك
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                الاسم الكامل
              </label>

              <input
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                placeholder="أدخل اسمك الكامل"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                البريد الإلكتروني
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                placeholder="example@email.com"
                dir="ltr"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                كلمة المرور
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                placeholder="8 أحرف على الأقل"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                تأكيد كلمة المرور
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                placeholder="أعد كتابة كلمة المرور"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 font-bold text-white disabled:opacity-60"
            >
              {loading ? "جارٍ إنشاء الحساب..." : "إنشاء الحساب"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            لديك حساب بالفعل؟{" "}
            <Link
              href="/login"
              className="font-bold text-slate-900 hover:underline"
            >
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}