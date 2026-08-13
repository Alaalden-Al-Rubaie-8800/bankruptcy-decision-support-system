"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { AnalysisHistoryItem } from "@/types/analysis";


function translateStatus(status: string) {
  const value = status.toLowerCase();

  if (value === "completed") {
    return "مكتمل";
  }

  if (value === "failed") {
    return "فشل";
  }

  if (value === "running") {
    return "قيد التنفيذ";
  }

  return status;
}


function statusClass(status: string) {
  const value = status.toLowerCase();

  if (value === "completed") {
    return "status-chip status-ok";
  }

  if (value === "failed") {
    return "rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700";
  }

  return "rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700";
}


export default function HistoryTable() {
  const [items, setItems] = useState<AnalysisHistoryItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);


  async function load() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/analysis/history",
        {
          cache: "no-store",
        }
      );

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      const body = await response.json();

      if (!response.ok) {
        throw new Error(
          body?.detail ??
            "تعذر تحميل سجل التحليلات"
        );
      }

      setItems(
        Array.isArray(body)
          ? body
          : []
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "تعذر تحميل سجل التحليلات"
      );
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    void load();
  }, []);


  if (loading) {
    return (
      <div className="card">
        جارٍ تحميل سجل التحليلات...
      </div>
    );
  }


  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
        {error}
      </div>
    );
  }


  return (
    <section className="card">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="section-title">
            سجل التحليلات
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            جميع عمليات التحليل السابقة الخاصة بحسابك.
          </p>
        </div>

        <button
          className="btn-secondary"
          onClick={load}
          type="button"
        >
          تحديث السجل
        </button>
      </div>

      {!items.length ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <h3 className="font-bold text-slate-800">
            لا توجد تحليلات سابقة
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            شغّل أول تحليل لشركتك وسيظهر هنا تلقائيًا.
          </p>

          <Link
            href="/dashboard"
            className="btn-primary mt-5 inline-block"
          >
            تشغيل تحليل جديد
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>رقم التحليل</th>
                <th>الحالة</th>
                <th>تاريخ التحليل</th>
                <th>التقرير</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    #{item.id}
                  </td>

                  <td>
                    <span
                      className={statusClass(
                        item.status
                      )}
                    >
                      {translateStatus(
                        item.status
                      )}
                    </span>
                  </td>

                  <td>
                    {new Date(
                      item.created_at
                    ).toLocaleString(
                      "ar-YE"
                    )}
                  </td>

                  <td>
                    {item.report_id ? (
                      <Link
                        href={`/api/reports/${item.report_id}`}
                        target="_blank"
                        className="btn-secondary inline-block"
                      >
                        عرض التقرير
                      </Link>
                    ) : (
                      <span className="text-sm text-slate-400">
                        غير متوفر
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {items.length > 0 && (
        <div className="mt-5 flex justify-end">
          <Link
            href="/dashboard"
            className="btn-primary"
          >
            تشغيل تحليل جديد
          </Link>
        </div>
      )}
    </section>
  );
}