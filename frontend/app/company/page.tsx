import { redirect } from "next/navigation";

import AppShell from "@/components/AppShell";
import CompanyForm from "@/components/CompanyForm";
import { backendFetch } from "@/lib/backend";

export default async function CompanyPage() {
  const response = await backendFetch("/users/me");

  if (!response.ok) {
    redirect("/login");
  }

  return (
    <AppShell>
      <CompanyForm />
    </AppShell>
  );
}