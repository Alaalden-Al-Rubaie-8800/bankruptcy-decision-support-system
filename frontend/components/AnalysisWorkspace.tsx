"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import * as XLSX from "xlsx";
import AgentProgress from "@/components/AgentProgress";
import ResultPanel from "@/components/ResultPanel";
import { emptyYearlyRatios, ratioLabels, validateYearlyRatios, yearLabels } from "@/lib/ratios";
import { AnalysisResult, RATIO_CODES, YearKey, YearlyRatios } from "@/types/analysis";

const years: YearKey[] = ["t_minus_3", "t_minus_2", "t_minus_1"];

export default function AnalysisWorkspace() {
  const [recordId, setRecordId] = useState("2");
  const [ratios, setRatios] = useState<YearlyRatios>(emptyYearlyRatios());
  const [activeYear, setActiveYear] = useState<YearKey>("t_minus_3");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [fileName, setFileName] = useState("");

  function updateRatio(year: YearKey, code: (typeof RATIO_CODES)[number], raw: string) {
    const value = raw === "" ? Number.NaN : Number(raw);
    setRatios((current) => ({ ...current, [year]: { ...current[year], [code]: value } }));
  }

  async function importFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
      if (rows.length < 3) throw new Error("الملف يجب أن يحتوي على ثلاثة صفوف على الأقل: t_minus_3 وt_minus_2 وt_minus_1.");

      const next = emptyYearlyRatios();
      years.forEach((year, index) => {
        const row = rows.find((item) => String(item.year ?? item.Year ?? item.period ?? "").trim() === year) ?? rows[index];
        RATIO_CODES.forEach((code) => {
          const value = Number(row[code]);
          if (!Number.isFinite(value)) throw new Error(`القيمة ${code} غير موجودة أو غير رقمية في ${year}.`);
          next[year][code] = value;
        });
      });
      setRatios(next);
      setFileName(file.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر قراءة الملف");
    } finally {
      event.target.value = "";
    }
  }

  async function runAnalysis(event: FormEvent) {
    event.preventDefault();
    setError("");
    setResult(null);
    const id = Number(recordId);
    if (!Number.isInteger(id) || id <= 0) return setError("رقم السجل المالي يجب أن يكون رقمًا صحيحًا أكبر من صفر.");
    const validationErrors = validateYearlyRatios(ratios);
    if (validationErrors.length) return setError(validationErrors[0]);

    setBusy(true);
    try {
      const response = await fetch("/api/analysis/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ financial_record_id: id, yearly_ratios: ratios }),
      });
      const body = await response.json();
      if (response.status === 401) { window.location.href = "/login"; return; }
      if (!response.ok) throw new Error(typeof body?.detail === "string" ? body.detail : body?.error ?? "فشل التحليل");
      if (body?.status !== "completed" || body?.error) throw new Error(body?.error ?? "لم يكتمل التحليل");
      setResult(body as AnalysisResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع أثناء التحليل");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <section>
        <p className="eyebrow">AI Agent Workspace</p>
        <h1 className="page-title">تحليل مخاطر الإفلاس</h1>
        <p className="page-subtitle">أدخل المؤشرات المالية لثلاث سنوات أو استورد ملف CSV/XLSX، ثم شغّل دورة الوكيل الذكي كاملة.</p>
      </section>

      <form className="space-y-5" onSubmit={runAnalysis}>
        <section className="card">
          <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
            <div>
              <label className="field-label" htmlFor="record-id">رقم السجل المالي</label>
              <input className="field-input" id="record-id" min="1" step="1" type="number" value={recordId} onChange={(e) => setRecordId(e.target.value)} />
              <p className="mt-2 text-xs leading-5 text-slate-500">يجب أن يكون السجل موجودًا في قاعدة بيانات الـBackend ومسموحًا للمستخدم الحالي.</p>
            </div>
            <div>
              <label className="field-label">استيراد المؤشرات من ملف</label>
              <label className="flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center text-sm font-semibold text-slate-600 hover:border-sky-400 hover:bg-sky-50">
                <input className="hidden" accept=".csv,.xlsx,.xls" type="file" onChange={importFile} />
                {fileName ? `تم تحميل: ${fileName}` : "اختر CSV أو Excel يحتوي 21 مؤشرًا × 3 سنوات"}
              </label>
            </div>
          </div>
        </section>

        <section className="card">
          <div className="mb-5 flex flex-wrap gap-2">{years.map((year) => <button className={`year-tab ${activeYear === year ? "year-tab-active" : ""}`} key={year} onClick={() => setActiveYear(year)} type="button">{yearLabels[year]}</button>)}</div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{RATIO_CODES.map((code) => (
            <div key={code}>
              <label className="field-label" htmlFor={`${activeYear}-${code}`}>{code} <span className="font-normal text-slate-400">— {ratioLabels[code]}</span></label>
              <input className="field-input" id={`${activeYear}-${code}`} step="any" type="number" value={Number.isNaN(ratios[activeYear][code]) ? "" : ratios[activeYear][code]} onChange={(e) => updateRatio(activeYear, code, e.target.value)} />
            </div>
          ))}</div>
        </section>

        {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 font-medium text-red-700">{error}</div>}
        <div className="flex justify-end"><button className="btn-primary min-w-48" disabled={busy} type="submit">{busy ? "الوكيل يحلل البيانات..." : "تشغيل التحليل الذكي"}</button></div>
      </form>

      <AgentProgress running={busy} completed={Boolean(result)} />
      {result && <ResultPanel result={result} />}
    </div>
  );
}
