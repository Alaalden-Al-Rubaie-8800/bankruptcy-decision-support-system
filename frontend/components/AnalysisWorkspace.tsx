"use client";

import {
  ChangeEvent,
  FormEvent,
  useState,
} from "react";

import * as XLSX from "xlsx";

import AgentProgress from "@/components/AgentProgress";
import ResultPanel from "@/components/ResultPanel";

import {
  emptyYearlyRatios,
  ratioLabels,
  validateYearlyRatios,
  yearLabels,
} from "@/lib/ratios";

import {
  AnalysisResult,
  RATIO_CODES,
  RatioCode,
  YearKey,
  YearlyRatios,
} from "@/types/analysis";


const years: YearKey[] = [
  "t_minus_3",
  "t_minus_2",
  "t_minus_1",
];


const ratioGroups: {
  name: string;
  codes: RatioCode[];
}[] = [
  {
    name: "Profitability",
    codes: [
      "ROA",
      "ROE",
      "ROS",
      "ROI",
    ],
  },
  {
    name: "Liquidity",
    codes: [
      "L1",
      "L2",
      "L3",
    ],
  },
  {
    name: "Efficiency",
    codes: [
      "ATD",
      "DTR",
      "TAT",
      "ITD",
    ],
  },
  {
    name: "Debt & Leverage",
    codes: [
      "DA",
      "DE",
      "FL",
      "DIR",
      "DCR",
      "ACR",
      "BL",
    ],
  },
  {
    name: "Other Indicators",
    codes: [
      "LP",
      "LRR",
      "WAR",
    ],
  },
];


export default function AnalysisWorkspace() {
  const [ratios, setRatios] =
    useState<YearlyRatios>(
      emptyYearlyRatios()
    );

  const [activeYear, setActiveYear] =
    useState<YearKey>(
      "t_minus_3"
    );

  const [activeGroup, setActiveGroup] =
    useState(
      "Profitability"
    );

  const [
    manualEntryOpen,
    setManualEntryOpen,
  ] = useState(false);

  const [busy, setBusy] =
    useState(false);

  const [error, setError] =
    useState("");

  const [result, setResult] =
    useState<AnalysisResult | null>(
      null
    );

  const [fileName, setFileName] =
    useState("");

  /*
   * Report language.
   *
   * English is the default language.
   * The selected value is sent with
   * the analysis request.
   */
  const [
    reportLanguage,
    setReportLanguage,
  ] = useState<"en" | "ar">(
    "en"
  );


  function updateRatio(
    year: YearKey,
    code: (typeof RATIO_CODES)[number],
    raw: string
  ) {
    const value =
      raw === ""
        ? Number.NaN
        : Number(raw);

    setRatios(
      (current) => ({
        ...current,
        [year]: {
          ...current[year],
          [code]: value,
        },
      })
    );
  }


  async function importFile(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");

    try {
      const buffer =
        await file.arrayBuffer();

      const workbook =
        XLSX.read(
          buffer,
          {
            type: "array",
          }
        );

      const sheet =
        workbook.Sheets[
          workbook.SheetNames[0]
        ];

      const rows =
        XLSX.utils.sheet_to_json<
          Record<string, unknown>
        >(
          sheet,
          {
            defval: "",
          }
        );

      if (
        rows.length < 3
      ) {
        throw new Error(
          "The file must contain at least three rows: t_minus_3, t_minus_2, and t_minus_1."
        );
      }

      const next =
        emptyYearlyRatios();

      years.forEach(
        (
          year,
          index
        ) => {
          const row =
            rows.find(
              (item) =>
                String(
                  item.year ??
                    item.Year ??
                    item.period ??
                    ""
                ).trim() ===
                year
            ) ??
            rows[index];

          RATIO_CODES.forEach(
            (code) => {
              const value =
                Number(
                  row[code]
                );

              if (
                !Number.isFinite(
                  value
                )
              ) {
                throw new Error(
                  `${code} is missing or invalid for ${year}.`
                );
              }

              next[year][code] =
                value;
            }
          );
        }
      );

      setRatios(next);

      setFileName(
        file.name
      );

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to read the file."
      );

    } finally {
      event.target.value =
        "";
    }
  }


  async function runAnalysis(
    event: FormEvent
  ) {
    event.preventDefault();

    setError("");

    setResult(null);

    const validationErrors =
      validateYearlyRatios(
        ratios
      );

    if (
      validationErrors.length
    ) {
      setError(
        validationErrors[0]
      );

      return;
    }

    setBusy(true);

    try {
      const response =
        await fetch(
          "/api/analysis/run",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                yearly_ratios:
                  ratios,

                report_language:
                  reportLanguage,
              }),
          }
        );

      const body =
        await response.json();

      if (
        response.status === 401
      ) {
        window.location.href =
          "/login";

        return;
      }

      if (
        !response.ok
      ) {
        let message =
          typeof body?.detail ===
          "string"
            ? body.detail
            : body?.error ??
              "Analysis failed.";

        if (
          message ===
          "Create your company first"
        ) {
          message =
            "Please create your company profile before running an analysis.";
        }

        if (
          message ===
          "No financial records found for your company"
        ) {
          message =
            "No financial records were found for your company.";
        }

        throw new Error(
          message
        );
      }

      if (
        body?.status !==
          "completed" ||
        body?.error
      ) {
        throw new Error(
          body?.error ??
            "The analysis could not be completed."
        );
      }

      setResult(
        body as AnalysisResult
      );

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during the analysis."
      );

    } finally {
      setBusy(false);
    }
  }


  const currentGroup =
    ratioGroups.find(
      (group) =>
        group.name ===
        activeGroup
    ) ??
    ratioGroups[0];


  const canRunAnalysis =
    Boolean(fileName) ||
    manualEntryOpen;


  return (
    <div className="space-y-6">

      {/* =========================
          PAGE HEADER
      ========================== */}
      <section className="space-y-1">

        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">
          Bankruptcy Risk Analysis
        </h1>

        <p className="max-w-2xl text-sm leading-6 text-slate-500">
          Choose how you want to provide the company&apos;s financial data.
        </p>

      </section>


      <form
        className="space-y-6"
        onSubmit={
          runAnalysis
        }
      >

        {/* =========================
            MAIN INPUT OPTIONS
        ========================== */}
        <div className="grid items-stretch gap-6 lg:grid-cols-2">

          {/* Upload Card */}
          <section className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(15,23,42,0.09)]">

            <div className="mb-5 flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">

                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 16V4" />
                  <path d="m7 9 5-5 5 5" />
                  <path d="M5 20h14" />
                </svg>

              </div>


              <div>

                <h2 className="text-lg font-bold text-slate-950">
                  Upload Financial Data
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Import financial ratios from a CSV or Excel file.
                </p>

              </div>

            </div>


            <label className="flex min-h-56 flex-1 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-7 text-center transition hover:border-sky-500 hover:bg-sky-50/70">

              <input
                className="hidden"
                accept=".csv,.xlsx,.xls"
                type="file"
                onChange={
                  importFile
                }
              />


              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-sky-700 shadow-sm">

                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 16V4" />
                  <path d="m7 9 5-5 5 5" />
                  <path d="M5 20h14" />
                </svg>

              </div>


              <span className="text-base font-bold text-slate-900">

                {fileName
                  ? fileName
                  : "Upload File"}

              </span>


              <span className="mt-2 text-xs font-medium text-slate-500">
                CSV, XLSX or XLS
              </span>


              <span className="mt-4 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm">
                21 ratios × 3 years
              </span>

            </label>


            {fileName && (
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">

                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold">
                  ✓
                </span>


                <div className="min-w-0">

                  <p className="font-semibold">
                    File ready
                  </p>

                  <p className="truncate text-xs text-emerald-600">
                    Financial data loaded successfully
                  </p>

                </div>

              </div>
            )}

          </section>


          {/* Manual Entry Card */}
          <section className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(15,23,42,0.09)]">

            <div className="mb-5 flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 ring-1 ring-slate-200">

                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>

              </div>


              <div>

                <h2 className="text-lg font-bold text-slate-950">
                  Manual Entry
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Enter the financial ratios directly into the system.
                </p>

              </div>

            </div>


            <div className="flex min-h-56 flex-1 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-6 py-7 text-center">

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm">

                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h10" />
                </svg>

              </div>


              <p className="max-w-sm text-sm leading-6 text-slate-500">
                Enter 21 financial ratios for each of the three years.
              </p>


              <button
                type="button"
                onClick={() =>
                  setManualEntryOpen(
                    (current) =>
                      !current
                  )
                }
                className="mt-5 rounded-xl bg-sky-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-300"
              >
                {manualEntryOpen
                  ? "Hide Manual Entry"
                  : "Enter Data Manually"}
              </button>

            </div>

          </section>

        </div>


        {/* =========================
            REPORT LANGUAGE
        ========================== */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)]">

          <div className="flex flex-col gap-5 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-4">

              {/* Icon */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">

                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                  />

                  <path d="M2 12h20" />

                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
                </svg>

              </div>


              <div>

                <div className="flex flex-wrap items-center gap-2">

                  <h2 className="text-base font-bold text-slate-950">
                    Report Language
                  </h2>

                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    HTML Report
                  </span>

                </div>


                <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                  Select the language for the generated decision support report.
                </p>

              </div>

            </div>


            {/* Language Selector */}
            <div className="inline-flex w-fit shrink-0 rounded-xl border border-slate-200 bg-slate-50 p-1">

              <button
                type="button"
                onClick={() =>
                  setReportLanguage(
                    "en"
                  )
                }
                aria-pressed={
                  reportLanguage ===
                  "en"
                }
                className={`min-w-28 rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                  reportLanguage ===
                  "en"
                    ? "bg-sky-950 text-white shadow-sm"
                    : "text-slate-600 hover:bg-white hover:text-slate-900"
                }`}
              >
                English
              </button>


              <button
                type="button"
                onClick={() =>
                  setReportLanguage(
                    "ar"
                  )
                }
                aria-pressed={
                  reportLanguage ===
                  "ar"
                }
                className={`min-w-28 rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                  reportLanguage ===
                  "ar"
                    ? "bg-sky-950 text-white shadow-sm"
                    : "text-slate-600 hover:bg-white hover:text-slate-900"
                }`}
              >
                العربية
              </button>

            </div>

          </div>


          {/* Selected Language Note */}
          <div className="border-t border-slate-100 bg-slate-50/60 px-6 py-3">

            <div className="flex items-center gap-2 text-xs text-slate-500">

              <span
                className={`h-2 w-2 rounded-full ${
                  reportLanguage ===
                  "en"
                    ? "bg-sky-500"
                    : "bg-emerald-500"
                }`}
              />

              {reportLanguage ===
              "en"
                ? "The generated report will be saved in English."
                : "سيتم إنشاء التقرير وحفظه باللغة العربية."}

            </div>

          </div>

        </section>


        {/* =========================
            MANUAL FINANCIAL RATIOS
        ========================== */}
        {manualEntryOpen && (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">

            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">

              <div>

                <h2 className="text-xl font-bold text-slate-950">
                  Manual Financial Ratios
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Select the year and ratio category, then enter the required values.
                </p>

              </div>


              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
                21 ratios × 3 years
              </span>

            </div>


            {/* Select Year */}
            <div>

              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                Select Year
              </p>


              <div className="flex flex-wrap gap-2">

                {years.map(
                  (year) => (

                    <button
                      key={year}
                      type="button"
                      onClick={() =>
                        setActiveYear(
                          year
                        )
                      }
                      className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                        activeYear ===
                        year
                          ? "border-sky-950 bg-sky-950 text-white shadow-sm"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >

                      {
                        yearLabels[
                          year
                        ]
                      }

                    </button>

                  )
                )}

              </div>

            </div>


            {/* Select Category */}
            <div className="mt-5 border-b border-slate-200 pb-5">

              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                Select Category
              </p>


              <div className="flex flex-wrap gap-2">

                {ratioGroups.map(
                  (group) => (

                    <button
                      key={
                        group.name
                      }
                      type="button"
                      onClick={() =>
                        setActiveGroup(
                          group.name
                        )
                      }
                      className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
                        activeGroup ===
                        group.name
                          ? "bg-slate-900 text-white shadow-sm"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {
                        group.name
                      }
                    </button>

                  )
                )}

              </div>

            </div>


            {/* Ratio Inputs */}
            <div className="mt-6 grid gap-x-5 gap-y-5 md:grid-cols-2 xl:grid-cols-3">

              {currentGroup.codes.map(
                (code) => (

                  <div
                    key={code}
                  >

                    <label
                      htmlFor={`${activeYear}-${code}`}
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >

                      {
                        ratioLabels[
                          code
                        ]
                      }

                      <span className="ml-1 font-medium text-slate-400">
                        ({code})
                      </span>

                    </label>


                    <input
                      id={`${activeYear}-${code}`}
                      type="number"
                      step="any"
                      placeholder="Enter value"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
                      value={
                        Number.isNaN(
                          ratios[
                            activeYear
                          ][code]
                        )
                          ? ""
                          : ratios[
                              activeYear
                            ][code]
                      }
                      onChange={(
                        event
                      ) =>
                        updateRatio(
                          activeYear,
                          code,
                          event
                            .target
                            .value
                        )
                      }
                    />

                  </div>

                )
              )}

            </div>


            {/* Manual Run Button */}
            <div className="mt-7 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="text-xs text-slate-500">

                Report:

                <span className="ml-1 font-semibold text-slate-700">

                  {reportLanguage ===
                  "en"
                    ? "English"
                    : "العربية"}

                </span>

              </div>


              <button
                className="rounded-xl bg-sky-950 px-8 py-3 font-semibold text-white shadow-sm transition hover:bg-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={
                  busy
                }
                type="submit"
              >

                {busy
                  ? "Analyzing..."
                  : "Run Analysis"}

              </button>

            </div>

          </section>
        )}


        {/* =========================
            ERROR
        ========================== */}
        {error && (

          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 shadow-sm">

            {error}

          </div>

        )}


        {/* =========================
            FILE ANALYSIS BUTTON
        ========================== */}
        {fileName &&
          !manualEntryOpen && (

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div className="text-xs text-slate-500">

              Report:

              <span className="ml-1 font-semibold text-slate-700">

                {reportLanguage ===
                "en"
                  ? "English"
                  : "العربية"}

              </span>

            </div>


            <button
              className="rounded-xl bg-sky-950 px-8 py-3 font-semibold text-white shadow-sm transition hover:bg-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={
                busy
              }
              type="submit"
            >

              {busy
                ? "Analyzing..."
                : "Run Analysis"}

            </button>

          </div>

        )}

      </form>


      {/* =========================
          AI AGENT WORKFLOW
      ========================== */}
      <AgentProgress
        running={
          busy
        }
        completed={
          Boolean(
            result
          )
        }
      />


      {/* =========================
          ANALYSIS RESULT
      ========================== */}
      {result && (

        <ResultPanel
          result={
            result
          }
        />

      )}

    </div>
  );
}