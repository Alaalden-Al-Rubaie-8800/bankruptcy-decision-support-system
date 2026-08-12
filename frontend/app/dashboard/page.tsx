import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import AnalysisWorkspace from "@/components/AnalysisWorkspace";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  if (!cookieStore.has("access_token")) redirect("/login");
  return <AppShell><AnalysisWorkspace /></AppShell>;
}
