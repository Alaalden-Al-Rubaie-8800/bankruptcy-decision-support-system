"use client";

import { AnalysisResult } from "@/types/analysis";

function riskClass(level: string) {
  const normalized = level.toLowerCase();

  if (normalized === "high") return "risk-high";
  if (normalized === "medium") return "risk-medium";

  return "risk-low";
}

function translateRiskLevel(level: string) {
  const value = level.toLowerCase();

  if (value === "high") return "مرتفع";
  if (value === "medium") return "متوسط";
  if (value === "low") return "منخفض";

  return level;
}

function translateYear(year: string) {
  if (year === "t_minus_1") return "أحدث سنة";
  if (year === "t_minus_2") return "السنة السابقة";
  if (year === "t_minus_3") return "السنة الأقدم";

  return year;
}

function translateCategory(category: string) {
  const categories: Record<string, string> = {
    Activity: "النشاط",
    Liquidity: "السيولة",
    Profitability: "الربحية",
    Solvency: "الملاءة المالية",
    monitoring: "المراقبة",
    stability: "الاستقرار المالي",
    liabilities: "الالتزامات",
    corrective_plan: "الخطة التصحيحية",
  };

  return categories[category] ?? category;
}

function translateTimeHorizon(value?: string) {
  if (!value) return "";

  const horizons: Record<string, string> = {
    immediate: "فوري",
    short_term: "قصير الأجل",
    medium_term: "متوسط الأجل",
    long_term: "طويل الأجل",
    ongoing: "مستمر",
  };

  return horizons[value] ?? value;
}

function translateRatioName(code: string, name: string) {
  const ratios: Record<string, string> = {
    ROA: "العائد على الأصول",
    ROE: "العائد على حقوق الملكية",
    ROS: "العائد على المبيعات",
    L1: "نسبة السيولة النقدية",
    L2: "النسبة السريعة",
    L3: "النسبة الجارية",
    ATD: "أيام دوران الأصول",
    DTR: "أيام تحصيل الذمم المدينة",
    TAT: "دوران إجمالي الأصول",
    ITD: "أيام دوران المخزون",
    DA: "نسبة الدين إلى الأصول",
    DE: "نسبة الدين إلى حقوق الملكية",
    FL: "الرافعة المالية",
    ROI: "العائد على الاستثمار",
    DIR: "نسبة الدين إلى الدخل",
    DCR: "نسبة تغطية خدمة الدين",
    ACR: "نسبة تغطية الأصول",
    LP: "إنتاجية العمل",
    BL: "نسبة الالتزامات البنكية إلى الدين",
    LRR: "نسبة تكلفة العمل إلى الإيرادات",
    WAR: "نسبة الأجور إلى القيمة المضافة",
  };

  return ratios[code] ?? name;
}

export default function ResultPanel({
  result,
}: {
  result: AnalysisResult;
}) {
  const probability = Math.max(
    0,
    Math.min(100, result.bankruptcy_probability * 100)
  );

  async function openReport(download = false) {
    const endpoint =
      `/api/reports/${encodeURIComponent(result.report.report_id)}` +
      `${download ? "/download" : ""}`;

    if (download) {
      const response = await fetch(endpoint);

      if (!response.ok) {
        alert("تعذر تحميل التقرير");
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");

      anchor.href = url;
      anchor.download = result.report.filename;
      anchor.click();

      URL.revokeObjectURL(url);
      return;
    }

    window.open(endpoint, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-4">
        <div className="metric-card">
          <span>احتمالية الإفلاس</span>
          <strong>{probability.toFixed(2)}%</strong>
        </div>

        <div className="metric-card">
          <span>مستوى الخطر</span>
          <strong className={riskClass(result.risk_level)}>
            {translateRiskLevel(result.risk_level)}
          </strong>
        </div>

        <div className="metric-card">
          <span>التصنيف</span>
          <strong>
            {result.predicted_class === 1
              ? "معرض لخطر الإفلاس"
              : "غير معرض لخطر الإفلاس"}
          </strong>
        </div>

        <div className="metric-card">
          <span>إصدار النموذج</span>
          <strong>{result.model_version}</strong>
        </div>
      </section>

      <section className="card">
        <h2 className="section-title">تفسير النتيجة</h2>

        <p className="mt-3 leading-8 text-slate-700">
          مستوى الخطر {translateRiskLevel(result.risk_level)}. أكثر العوامل
          المالية تأثيرًا هي:{" "}
          {result.top_risk_factors
            .slice(0, 5)
            .map(
              (factor) =>
                `${translateRatioName(
                  factor.ratio_code,
                  factor.ratio_name
                )} (${factor.ratio_code}) - ${translateYear(
                  factor.year_offset
                )}`
            )
            .join("، ")}
          .
        </p>
      </section>

      <section className="card">
        <h2 className="section-title">أكثر العوامل تأثيرًا</h2>

        <div className="mt-4 overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>المؤشر</th>
                <th>الكود</th>
                <th>الفئة</th>
                <th>السنة</th>
                <th>القيمة</th>
                <th>فرق الاحتمال</th>
              </tr>
            </thead>

            <tbody>
              {result.top_risk_factors.map((factor, index) => (
                <tr key={`${factor.feature}-${index}`}>
                  <td>
                    {translateRatioName(
                      factor.ratio_code,
                      factor.ratio_name
                    )}
                  </td>

                  <td>{factor.ratio_code}</td>

                  <td>{translateCategory(factor.category)}</td>

                  <td>{translateYear(factor.year_offset)}</td>

                  <td>{factor.value}</td>

                  <td>
                    {factor.probability_delta == null
                      ? "—"
                      : factor.probability_delta.toFixed(6)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <h2 className="section-title">التوصيات الوقائية</h2>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {result.recommendations.map((item, index) => (
            <article
              key={item.id ?? index}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-bold">{item.title}</h3>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">
                  {translateRiskLevel(item.priority)}
                </span>
              </div>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                {item.description}
              </p>

              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                <span>
                  الفئة: {translateCategory(item.action_category)}
                </span>

                {item.time_horizon && (
                  <span>
                    • المدى: {translateTimeHorizon(item.time_horizon)}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="card flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="section-title">تقرير دعم القرار</h2>

          <p className="mt-1 text-sm text-slate-500">
            {result.report.filename}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            className="btn-secondary"
            onClick={() => openReport(false)}
          >
            عرض التقرير
          </button>

          <button
            className="btn-primary"
            onClick={() => openReport(true)}
          >
            تحميل التقرير
          </button>
        </div>
      </section>
    </div>
  );
}