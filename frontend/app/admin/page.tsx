import { redirect } from "next/navigation";

import AppShell from "@/components/AppShell";
import AdminUsersTable from "@/components/AdminUsersTable";
import { backendFetch } from "@/lib/backend";


export default async function AdminPage() {
  const response = await backendFetch("/users/me");

  if (response.status === 401) {
    redirect("/login");
  }

  if (!response.ok) {
    redirect("/account");
  }

  const user = await response.json();

  if (user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl">
        <AdminUsersTable />
      </div>
    </AppShell>
  );
}