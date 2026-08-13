import { redirect } from "next/navigation";

import AppShell from "@/components/AppShell";
import AccountForm from "@/components/AccountForm";
import { backendFetch } from "@/lib/backend";

export default async function AccountPage() {
  const response = await backendFetch("/users/me");

  if (!response.ok) {
    redirect("/login");
  }

  return (
    <AppShell>
      <AccountForm />
    </AppShell>
  );
}