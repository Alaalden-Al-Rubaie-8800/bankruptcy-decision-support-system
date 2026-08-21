"use client";

import { AnalysisResult } from "@/types/analysis";


function normalizeRisk(level: string) {
  return level.toLowerCase();
}


function riskLabel(level: string) {
  const value = normalizeRisk(level);

  if (value === "high") {
    return "High";
  }

  if (value === "medium") {
    return "Medium";
  }

  if (value === "low") {
    return "Low";
  }

  return level;
}


function riskTextClass(level: string) {
  const value = normalizeRisk(level);

  if (value === "high") {
    return "text-red-600";
  }

  if (value === "medium") {
    return "text-amber-600";
  }

  return "text-emerald-600";
}


function riskBadgeClass(level: string) {
  const value = normalizeRisk(level);

  if (
    value === "critical" ||
    value === "high"
  ) {
    return value === "critical"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-orange-200 bg-orange-50 text-orange-700";
  }

  if (value === "medium") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-emerald-200 bg-emerald-50 text-emerald-700";
}


function recommendationAccentClass(
  level: string
) {
  const value =
    normalizeRisk(level);

  if (value === "critical") {
    return "bg-red-500";
  }

  if (value === "high") {
    return "bg-orange-500";
  }

  if (value === "medium") {
    return "bg-amber-500";
  }

  return "bg-emerald-500";
}


function formatPriority(
  value: string
) {
  const normalized =
    value.toLowerCase();

  if (
    normalized === "critical"
  ) {
    return "Critical";
  }

  if (
    normalized === "high"
  ) {
    return "High";
  }

  if (
    normalized === "medium"
  ) {
    return "Medium";
  }

  if (
    normalized === "low"
  ) {
    return "Low";
  }

  return value;
}


function formatYear(year: string) {
  if (
    year === "t_minus_1"
  ) {
    return "Latest Year";
  }

  if (
    year === "t_minus_2"
  ) {
    return "Previous Year";
  }

  if (
    year === "t_minus_3"
  ) {
    return "Oldest Year";
  }

  return year;
}


function formatCategory(
  category: string
) {
  const categories: Record<
    string,
    string
  > = {
    Activity: "Activity",
    Liquidity: "Liquidity",
    Profitability:
      "Profitability",
    Solvency: "Solvency",

    monitoring:
      "Monitoring",

    stability:
      "Financial Stability",

    liabilities:
      "Liabilities",

    corrective_plan:
      "Corrective Plan",

    financial_review:
      "Financial Review",

    liquidity:
      "Liquidity",
  };

  return (
    categories[category] ??
    category
  );
}


function formatTimeHorizon(
  value?: string
) {
  if (!value) {
    return "";
  }

  const horizons: Record<
    string,
    string
  > = {
    immediate: "Immediate",
    short_term: "Short Term",
    medium_term: "Medium Term",
    long_term: "Long Term",
    ongoing: "Ongoing",
  };

  return (
    horizons[value] ??
    value
  );
}


function formatRatioName(
  code: string,
  name: string
) {
  const ratios: Record<
    string,
    string
  > = {
    ROA: "Return on Assets",
    ROE: "Return on Equity",
    ROS: "Return on Sales",

    L1: "Cash Liquidity Ratio",
    L2: "Quick Ratio",
    L3: "Current Ratio",

    ATD: "Asset Turnover Days",

    DTR:
      "Receivables Collection Days",

    TAT:
      "Total Asset Turnover",

    ITD:
      "Inventory Turnover Days",

    DA: "Debt to Assets",

    DE:
      "Debt to Equity",

    FL:
      "Financial Leverage",

    ROI:
      "Return on Investment",

    DIR:
      "Debt Burden Ratio",

    DCR:
      "Debt Service Coverage",

    ACR:
      "Asset Coverage Ratio",

    LP:
      "Labor Productivity",

    BL:
      "Bank Liabilities Ratio",

    LRR:
      "Labor Cost to Revenue",

    WAR:
      "Wages to Added Value",
  };

  return (
    ratios[code] ??
    name
  );
}


function formatImpact(
  value: number | null | undefined
) {
  if (
    value == null ||
    !Number.isFinite(value)
  ) {
    return "—";
  }

  return value.toFixed(6);
}


export default function ResultPanel({
  result,
}: {
  result: AnalysisResult;
}) {
  const probability =
    Math.max(
      0,
      Math.min(
        100,
        result.bankruptcy_probability *
          100
      )
    );


  const factors =
    result.top_risk_factors ??
    [];


  const maxImpact =
    Math.max(
      ...factors.map(
        (factor) =>
          Math.abs(
            factor.probability_delta ??
              0
          )
      ),
      0.000001
    );


  async function openReport(
    download = false
  ) {
    const endpoint =
      `/api/reports/${encodeURIComponent(
        result.report.report_id
      )}` +
      `${
        download
          ? "/download"
          : ""
      }`;


    if (download) {
      const response =
        await fetch(
          endpoint
        );


      if (!response.ok) {
        alert(
          "Unable to download the report."
        );

        return;
      }


      const blob =
        await response.blob();

      const url =
        URL.createObjectURL(
          blob
        );

      const anchor =
        document.createElement(
          "a"
        );

      anchor.href = url;

      anchor.download =
        result.report.filename;

      anchor.click();

      URL.revokeObjectURL(
        url
      );

      return;
    }


    window.open(
      endpoint,
      "_blank",
      "noopener,noreferrer"
    );
  }


  return (
    <div className="space-y-5">

      {/* =========================
          RESULT OVERVIEW
      ========================== */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        {/* Probability */}
        <article className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.05)]">

          <div className="absolute left-0 top-0 h-full w-1 bg-sky-500" />


          <div className="flex items-start justify-between gap-3">

            <div>

              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Bankruptcy Probability
              </p>


              <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950">
                {probability.toFixed(
                  2
                )}
                %
              </p>

            </div>


            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700">

              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 3v18h18" />
                <path d="m7 15 4-4 3 3 5-7" />
              </svg>

            </div>

          </div>


          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">

            <div
              className="h-full rounded-full bg-sky-600 transition-all"
              style={{
                width: `${probability}%`,
              }}
            />

          </div>


          <p className="mt-2 text-xs text-slate-400">
            Model probability score
          </p>

        </article>


        {/* Risk Level */}
        <article className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.05)]">

          <div
            className={`absolute left-0 top-0 h-full w-1 ${
              normalizeRisk(
                result.risk_level
              ) === "high"
                ? "bg-red-500"
                : normalizeRisk(
                      result.risk_level
                    ) === "medium"
                  ? "bg-amber-500"
                  : "bg-emerald-500"
            }`}
          />


          <div className="flex items-start justify-between gap-3">

            <div>

              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Risk Level
              </p>


              <p
                className={`mt-3 text-3xl font-extrabold ${riskTextClass(
                  result.risk_level
                )}`}
              >
                {riskLabel(
                  result.risk_level
                )}
              </p>

            </div>


            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                normalizeRisk(
                  result.risk_level
                ) === "high"
                  ? "bg-red-50 text-red-600"
                  : normalizeRisk(
                        result.risk_level
                      ) === "medium"
                    ? "bg-amber-50 text-amber-600"
                    : "bg-emerald-50 text-emerald-600"
              }`}
            >

              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
                <path d="M10.3 2.9 1.8 17a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 2.9a2 2 0 0 0-3.4 0Z" />
              </svg>

            </div>

          </div>


          <p className="mt-4 text-xs text-slate-400">
            Overall bankruptcy risk assessment
          </p>

        </article>


        {/* Classification */}
        <article className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.05)]">

          <div
            className={`absolute left-0 top-0 h-full w-1 ${
              result.predicted_class ===
              1
                ? "bg-orange-500"
                : "bg-emerald-500"
            }`}
          />


          <div className="flex items-start justify-between gap-3">

            <div>

              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Classification
              </p>


              <p
                className={`mt-3 text-xl font-extrabold leading-7 ${
                  result.predicted_class ===
                  1
                    ? "text-orange-600"
                    : "text-emerald-600"
                }`}
              >
                {result.predicted_class ===
                1
                  ? "At Risk of Bankruptcy"
                  : "Low Bankruptcy Risk"}
              </p>

            </div>


            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                result.predicted_class ===
                1
                  ? "bg-orange-50 text-orange-600"
                  : "bg-emerald-50 text-emerald-600"
              }`}
            >

              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              </svg>

            </div>

          </div>


          <p className="mt-4 text-xs text-slate-400">
            Prediction classification
          </p>

        </article>


        {/* Model Version */}
        <article className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.05)]">

          <div className="absolute left-0 top-0 h-full w-1 bg-indigo-500" />


          <div className="flex items-start justify-between gap-3">

            <div>

              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Model Version
              </p>


              <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950">
                {
                  result.model_version
                }
              </p>

            </div>


            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">

              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m12 2 8 4-8 4-8-4 8-4Z" />
                <path d="m4 10 8 4 8-4" />
                <path d="m4 14 8 4 8-4" />
              </svg>

            </div>

          </div>


          <p className="mt-4 text-xs text-slate-400">
            Current prediction model
          </p>

        </article>

      </section>


      {/* =========================
          RESULT EXPLANATION
      ========================== */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">

        <div className="flex items-start gap-4">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">

            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18h6" />
              <path d="M10 22h4" />
              <path d="M8.5 14.5A6 6 0 1 1 15.5 14.5C14.5 15.3 14 16 14 17h-4c0-1-.5-1.7-1.5-2.5Z" />
            </svg>

          </div>


          <div className="min-w-0 flex-1">

            <div className="flex flex-wrap items-center justify-between gap-3">

              <div>

                <h2 className="text-lg font-bold text-slate-950">
                  Result Explanation
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Key financial drivers behind the prediction.
                </p>

              </div>


              <span
                className={`rounded-full border px-3 py-1 text-xs font-bold ${riskBadgeClass(
                  result.risk_level
                )}`}
              >
                {riskLabel(
                  result.risk_level
                )}{" "}
                Risk
              </span>

            </div>


            <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3">

              <p className="text-sm leading-7 text-slate-700">

                The model identified a{" "}

                <strong
                  className={riskTextClass(
                    result.risk_level
                  )}
                >
                  {riskLabel(
                    result.risk_level
                  ).toLowerCase()}
                </strong>

                {" "}bankruptcy risk.

                The most influential financial indicators include{" "}

                <strong className="font-semibold text-slate-900">
                  {factors
                    .slice(0, 5)
                    .map(
                      (
                        factor
                      ) =>
                        `${formatRatioName(
                          factor.ratio_code,
                          factor.ratio_name
                        )} (${factor.ratio_code}) — ${formatYear(
                          factor.year_offset
                        )}`
                    )
                    .join(", ")}
                </strong>
                .

              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          FACTORS + RECOMMENDATIONS
      ========================== */}
      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">

        {/* Factors */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)]">

          <div className="border-b border-slate-200 px-5 py-4">

            <h2 className="text-lg font-bold text-slate-950">
              Top Influencing Factors
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Financial indicators with the strongest effect on the prediction.
            </p>

          </div>


          <div className="overflow-x-auto">

            <table className="w-full min-w-[760px] border-collapse">

              <thead>

                <tr className="border-b border-slate-200 bg-slate-50/80">

                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Indicator
                  </th>

                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Code
                  </th>

                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Year
                  </th>

                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Value
                  </th>

                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Impact
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-slate-100">

                {factors.map(
                  (
                    factor,
                    index
                  ) => {
                    const impact =
                      Math.abs(
                        factor.probability_delta ??
                          0
                      );

                    const width =
                      Math.max(
                        4,
                        Math.min(
                          100,
                          (impact /
                            maxImpact) *
                            100
                        )
                      );


                    return (
                      <tr
                        key={`${factor.feature}-${index}`}
                        className="transition hover:bg-slate-50/70"
                      >

                        <td className="px-4 py-3">

                          <p className="text-sm font-semibold text-slate-900">
                            {formatRatioName(
                              factor.ratio_code,
                              factor.ratio_name
                            )}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            {formatCategory(
                              factor.category
                            )}
                          </p>

                        </td>


                        <td className="px-4 py-3">

                          <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">
                            {
                              factor.ratio_code
                            }
                          </span>

                        </td>


                        <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                          {formatYear(
                            factor.year_offset
                          )}
                        </td>


                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-800">
                          {
                            factor.value
                          }
                        </td>


                        <td className="min-w-36 px-4 py-3">

                          <div className="flex items-center gap-3">

                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">

                              <div
                                className="h-full rounded-full bg-sky-600"
                                style={{
                                  width: `${width}%`,
                                }}
                              />

                            </div>


                            <span className="w-16 text-right text-xs font-semibold tabular-nums text-slate-600">
                              {formatImpact(
                                factor.probability_delta
                              )}
                            </span>

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        </div>


        {/* Recommendations */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)]">

          <div className="border-b border-slate-200 px-5 py-4">

            <h2 className="text-lg font-bold text-slate-950">
              Preventive Recommendations
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Prioritized actions generated by the decision support engine.
            </p>

          </div>


          <div className="space-y-3 p-4">

            {result.recommendations.map(
              (
                item,
                index
              ) => (

                <article
                  key={
                    item.id ??
                    index
                  }
                  className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm"
                >

                  <div
                    className={`absolute left-0 top-0 h-full w-1 ${recommendationAccentClass(
                      item.priority
                    )}`}
                  />


                  <div className="flex items-start justify-between gap-3">

                    <div className="min-w-0">

                      <h3 className="font-bold leading-6 text-slate-900">
                        {item.title}
                      </h3>


                      <p className="mt-1.5 text-sm leading-6 text-slate-600">
                        {
                          item.description
                        }
                      </p>

                    </div>


                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold ${riskBadgeClass(
                        item.priority
                      )}`}
                    >
                      {formatPriority(
                        item.priority
                      )}
                    </span>

                  </div>


                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-100 pt-3 text-xs text-slate-500">

                    <span>
                      <strong className="font-semibold text-slate-700">
                        Category:
                      </strong>{" "}
                      {formatCategory(
                        item.action_category
                      )}
                    </span>


                    {item.time_horizon && (
                      <span>

                        <strong className="font-semibold text-slate-700">
                          Time Horizon:
                        </strong>{" "}

                        {formatTimeHorizon(
                          item.time_horizon
                        )}

                      </span>
                    )}

                  </div>

                </article>

              )
            )}

          </div>

        </div>

      </section>


      {/* =========================
          REPORT
      ========================== */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div className="flex min-w-0 items-center gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">

              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
                <path d="M8 13h8" />
                <path d="M8 17h8" />
              </svg>

            </div>


            <div className="min-w-0">

              <h2 className="text-lg font-bold text-slate-950">
                Decision Support Report
              </h2>

              <p
                className="mt-1 truncate text-sm text-slate-500"
                title={
                  result.report.filename
                }
              >
                {
                  result.report.filename
                }
              </p>

            </div>

          </div>


          <div className="flex flex-wrap gap-2">

            <button
              type="button"
              onClick={() =>
                openReport(
                  false
                )
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >

              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                />
              </svg>

              View Report

            </button>


            <button
              type="button"
              onClick={() =>
                openReport(
                  true
                )
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-900"
            >

              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3v12" />
                <path d="m7 10 5 5 5-5" />
                <path d="M5 21h14" />
              </svg>

              Download Report

            </button>

          </div>

        </div>

      </section>

    </div>
  );
}