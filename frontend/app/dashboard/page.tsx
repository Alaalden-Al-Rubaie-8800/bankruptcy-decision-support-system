import { redirect } from "next/navigation";

import AppShell from "@/components/AppShell";
import AnalysisWorkspace from "@/components/AnalysisWorkspace";
import { backendFetch } from "@/lib/backend";

export default async function DashboardPage() {
  const response = await backendFetch("/users/me");

  if (response.status === 401) {
    redirect("/login");
  }

  if (!response.ok) {
    redirect("/login");
  }

  return (
    <AppShell>
      <AnalysisWorkspace />
    </AppShell>
  );
}