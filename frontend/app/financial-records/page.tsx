import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import AppShell from "@/components/AppShell";
import FinancialRecordsWorkspace from "@/components/FinancialRecordsWorkspace";

export default async function FinancialRecordsPage() {
  const cookieStore = await cookies();

  if (!cookieStore.has("access_token")) {
    redirect("/login");
  }

  return (
    <AppShell>
      <FinancialRecordsWorkspace />
    </AppShell>
  );
}