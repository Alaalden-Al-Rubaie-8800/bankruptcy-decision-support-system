"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed right-0 top-0 hidden h-screen w-72 border-l border-slate-800 bg-slate-950 px-5 py-7 text-white lg:block">
        <div className="mb-8">
          <p className="text-xs font-semibold text-sky-300">AI Decision Support</p>
          <h1 className="mt-2 text-lg font-bold leading-7">نظام التنبؤ المبكر بمخاطر الإفلاس</h1>
        </div>
        <nav className="space-y-2">
          <Link className={`nav-link ${pathname === "/dashboard" ? "nav-link-active" : ""}`} href="/dashboard">لوحة التحليل</Link>
          <Link className={`nav-link ${pathname === "/history" ? "nav-link-active" : ""}`} href="/history">سجل التحليلات</Link>
        </nav>
        <div className="absolute bottom-6 left-5 right-5 rounded-xl border border-slate-800 bg-slate-900 p-4 text-xs leading-6 text-slate-300">
          ML + XAI + LangGraph Agent + Decision Support
        </div>
      </aside>
      <main className="lg:mr-72">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur md:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">نظام دعم قرار ذكي للشركات الصناعية الصغيرة والمتوسطة</p>
              <p className="font-bold">تحليل مخاطر الإفلاس والتوصيات الوقائية</p>
            </div>
            <div className="flex items-center gap-2">
              <Link className="btn-secondary lg:hidden" href={pathname === "/history" ? "/dashboard" : "/history"}>{pathname === "/history" ? "التحليل" : "السجل"}</Link>
              <button className="btn-secondary" disabled={busy} onClick={logout}>{busy ? "..." : "تسجيل الخروج"}</button>
            </div>
          </div>
        </header>
        <div className="mx-auto max-w-7xl p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
