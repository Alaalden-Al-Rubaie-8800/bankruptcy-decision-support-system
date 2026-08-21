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
    label: "Dashboard",
  },
  {
    href: "/history",
    label: "Analysis History",
  },
  {
    href: "/company",
    label: "Company Information",
  },
  {
    href: "/financial-records",
    label: "Financial Records",
  },
  {
    href: "/account",
    label: "My Account",
  },
];


const adminNavItem = {
  href: "/admin",
  label: "Admin Panel",
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
      <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r border-slate-800 bg-slate-950 px-5 py-7 text-white lg:block">
        <div className="mb-8">
          <p className="text-xs font-semibold text-sky-300">
            Decision Support System
          </p>

          <h1 className="mt-2 text-lg font-bold leading-7">
            Bankruptcy Risk Prediction
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
      </aside>


      <main className="lg:ml-72">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur md:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate text-base font-bold text-slate-900">
                Financial Decision Support
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
                  ? "Close"
                  : "Menu"}
              </button>


              <button
                className="btn-secondary"
                type="button"
                disabled={busy}
                onClick={logout}
              >
                {busy
                  ? "Signing out..."
                  : "Sign Out"}
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