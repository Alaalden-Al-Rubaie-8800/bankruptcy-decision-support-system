import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import HistoryTable from "@/components/HistoryTable";

export default async function HistoryPage() {
  const cookieStore = await cookies();
  if (!cookieStore.has("access_token")) redirect("/login");
  return <AppShell><div className="mb-5"><p className="eyebrow">Audit & History</p><h1 className="page-title">سجل التحليلات</h1><p className="page-subtitle">يعرض السجل المحفوظ فعليًا من قاعدة البيانات عبر Backend.</p></div><HistoryTable /></AppShell>;
}
