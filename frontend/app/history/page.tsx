import { redirect } from "next/navigation";

import AppShell from "@/components/AppShell";
import HistoryTable from "@/components/HistoryTable";
import { backendFetch } from "@/lib/backend";

export default async function HistoryPage() {
  const response = await backendFetch("/users/me");

  if (!response.ok) {
    redirect("/login");
  }

  return (
    <AppShell>
      <HistoryTable />
    </AppShell>
  );
}