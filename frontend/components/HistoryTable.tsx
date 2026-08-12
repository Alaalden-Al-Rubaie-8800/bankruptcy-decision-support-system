"use client";

import { useEffect, useState } from "react";
import { AnalysisHistoryItem } from "@/types/analysis";

export default function HistoryTable() {
  const [items, setItems] = useState<AnalysisHistoryItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/analysis/history", { cache: "no-store" });
      if (response.status === 401) { window.location.href = "/login"; return; }
      const body = await response.json();
      if (!response.ok) throw new Error(body?.detail ?? "تعذر تحميل السجل");
      setItems(Array.isArray(body) ? body : []);
    } catch (err) { setError(err instanceof Error ? err.message : "تعذر تحميل السجل"); }
    finally { setLoading(false); }
  }

  useEffect(() => { void load(); }, []);

  if (loading) return <div className="card">جارٍ تحميل سجل التحليلات...</div>;
  if (error) return <div className="rounded-2xl bg-red-50 p-4 text-red-700">{error}</div>;

  return (
    <section className="card">
      <div className="mb-4 flex items-center justify-between"><h2 className="section-title">التحليلات المحفوظة</h2><button className="btn-secondary" onClick={load}>تحديث</button></div>
      {!items.length ? <p className="text-slate-500">لا توجد تحليلات محفوظة لهذا المستخدم.</p> : <div className="overflow-x-auto"><table className="data-table"><thead><tr><th>#</th><th>الشركة</th><th>السجل المالي</th><th>التنبؤ</th><th>الحالة</th><th>التاريخ</th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td>{item.id}</td><td>{item.company_id}</td><td>{item.financial_record_id}</td><td>{item.prediction_id}</td><td><span className="status-chip status-ok">{item.status}</span></td><td>{new Date(item.created_at).toLocaleString("ar")}</td></tr>)}</tbody></table></div>}
    </section>
  );
}
