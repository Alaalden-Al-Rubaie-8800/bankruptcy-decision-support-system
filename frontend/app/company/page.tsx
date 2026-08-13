import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import AppShell from "@/components/AppShell";
import CompanyForm from "@/components/CompanyForm";

export default async function CompanyPage() {
  const cookieStore = await cookies();

  if (!cookieStore.has("access_token")) {
    redirect("/login");
  }

  return (
    <AppShell>
      <CompanyForm />
    </AppShell>
  );
}