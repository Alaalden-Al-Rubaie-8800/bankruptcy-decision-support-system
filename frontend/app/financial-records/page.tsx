import { redirect } from "next/navigation";

import AppShell from "@/components/AppShell";
import FinancialRecordsWorkspace from "@/components/FinancialRecordsWorkspace";
import { backendFetch } from "@/lib/backend";

export default async function FinancialRecordsPage() {
  const response = await backendFetch("/users/me");

  if (!response.ok) {
    redirect("/login");
  }

  return (
    <AppShell>
      <FinancialRecordsWorkspace />
    </AppShell>
  );
}