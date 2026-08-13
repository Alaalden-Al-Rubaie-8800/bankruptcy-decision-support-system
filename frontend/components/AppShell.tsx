"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ReactNode,
  useEffect,
  useState,
} from "react";


const navItems = [
  {
    href: "/dashboard",
    label: "لوحة التحليل",
  },
  {
    href: "/history",
    label: "سجل التحليلات",
  },
  {
    href: "/company",
    label: "بيانات الشركة",
  },
  {
    href: "/financial-records",
    label: "السجلات المالية",
  },
  {
    href: "/account",
    label: "حسابي",
  },
];


const adminNavItem = {
  href: "/admin",
  label: "لوحة الإدارة",
};


export default function AppShell({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [busy, setBusy] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);


  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const response = await fetch(
          "/api/account/me",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          return;
        }

        const user = await response.json();

        setIsAdmin(
          user?.role === "admin"
        );
      } catch {
        setIsAdmin(false);
      }
    }

    void loadCurrentUser();
  }, []);


  const visibleNavItems = isAdmin
    ? [
        ...navItems,
        adminNavItem,
      ]
    : navItems;


  async function logout() {
    setBusy(true);

    try {
      await fetch(
        "/api/auth/logout",
        {
          method: "POST",
        }
      );

      router.replace("/login");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }


  function closeMenu() {
    setMenuOpen(false);
  }


  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed right-0 top-0 hidden h-screen w-72 border-l border-slate-800 bg-slate-950 px-5 py-7 text-white lg:block">
        <div className="mb-8">
          <p className="text-xs font-semibold text-sky-300">
            AI Decision Support
          </p>

          <h1 className="mt-2 text-lg font-bold leading-7">
            نظام التنبؤ المبكر بمخاطر الإفلاس
          </h1>
        </div>


        <nav className="space-y-2">
          {visibleNavItems.map(
            (item) => (
              <Link
                key={item.href}
                className={`nav-link ${
                  pathname === item.href
                    ? "nav-link-active"
                    : ""
                }`}
                href={item.href}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>


        <div className="absolute bottom-6 left-5 right-5 rounded-xl border border-slate-800 bg-slate-900 p-4 text-xs leading-6 text-slate-300">
          ML + XAI + LangGraph Agent + Decision Support
        </div>
      </aside>


      <main className="lg:mr-72">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur md:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="hidden text-sm text-slate-500 sm:block">
                نظام دعم قرار ذكي للشركات الصناعية الصغيرة والمتوسطة
              </p>

              <p className="truncate text-sm font-bold sm:text-base">
                تحليل مخاطر الإفلاس والتوصيات الوقائية
              </p>
            </div>


            <div className="flex shrink-0 items-center gap-2">
              <button
                className="btn-secondary lg:hidden"
                type="button"
                onClick={() =>
                  setMenuOpen(
                    (current) =>
                      !current
                  )
                }
              >
                {menuOpen
                  ? "إغلاق"
                  : "القائمة"}
              </button>


              <button
                className="btn-secondary"
                type="button"
                disabled={busy}
                onClick={logout}
              >
                {busy
                  ? "جارٍ الخروج..."
                  : "تسجيل الخروج"}
              </button>
            </div>
          </div>


          {menuOpen && (
            <nav className="mx-auto mt-4 max-w-7xl rounded-2xl border border-slate-200 bg-white p-3 shadow-sm lg:hidden">
              <div className="grid gap-2 sm:grid-cols-2">
                {visibleNavItems.map(
                  (item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMenu}
                      className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                        pathname === item.href
                          ? "bg-slate-900 text-white"
                          : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </div>
            </nav>
          )}
        </header>


        <div className="mx-auto max-w-7xl p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}