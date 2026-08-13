import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import AppShell from "@/components/AppShell";
import AccountForm from "@/components/AccountForm";

export default async function AccountPage() {
  const cookieStore = await cookies();

  if (!cookieStore.has("access_token")) {
    redirect("/login");
  }

  return (
    <AppShell>
      <AccountForm />
    </AppShell>
  );
}