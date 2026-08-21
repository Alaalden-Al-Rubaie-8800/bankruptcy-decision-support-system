"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnalysisHistoryItem } from "@/types/analysis";

function formatStatus(status: string) {
  const value = status.toLowerCase();

  if (value === "completed") {
    return "Completed";
  }

  if (value === "failed") {
    return "Failed";
  }

  if (value === "running") {
    return "Running";
  }

  return status;
}


function statusClass(status: string) {
  const value = status.toLowerCase();

  if (value === "completed") {
    return "inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700";
  }

  if (value === "failed") {
    return "inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700";
  }

  return "inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700";
}

function statusDotClass(status: string) {
  const value = status.toLowerCase();

  if (value === "completed") {
    return "h-1.5 w-1.5 rounded-full bg-emerald-500";
  }

  if (value === "failed") {
    return "h-1.5 w-1.5 rounded-full bg-red-500";
  }

  return "h-1.5 w-1.5 rounded-full bg-amber-500";
}

function formatDate(date: string) {
  return new Date(date).toLocaleString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

export default function HistoryTable() {
  const [items, setItems] =
    useState<AnalysisHistoryItem[]>([]);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(true);

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

      const body =
        await response.json();

      if (!response.ok) {
        throw new Error(
          body?.detail ??
            "Unable to load analysis history."
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
          : "Unable to load analysis history."
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
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">

        <div className="flex min-h-64 flex-col items-center justify-center text-center">

          <div className="mb-4 h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-sky-900" />

          <h2 className="text-lg font-bold text-slate-900">
            Loading Analysis History
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Please wait while your previous analyses are loaded.
          </p>

        </div>

      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-3xl border border-red-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">

        <div className="rounded-2xl bg-red-50 p-5">

          <div className="flex items-start gap-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 font-bold text-red-700">
              !
            </div>

            <div className="flex-1">

              <h2 className="font-bold text-red-900">
                Unable to Load History
              </h2>

              <p className="mt-1 text-sm text-red-700">
                {error}
              </p>

              <button
                type="button"
                onClick={load}
                className="mt-4 rounded-xl bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800"
              >
                Try Again
              </button>

            </div>

          </div>

        </div>

      </section>
    );
  }

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <section className="flex flex-wrap items-end justify-between gap-4">

        <div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">
            Analysis History
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Review previous bankruptcy risk analyses and access generated reports.
          </p>

        </div>


        <button
          type="button"
          onClick={load}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
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
            <path d="M20 11a8.1 8.1 0 0 0-15.5-2M4 4v5h5" />
            <path d="M4 13a8.1 8.1 0 0 0 15.5 2M20 20v-5h-5" />
          </svg>

          Refresh

        </button>

      </section>


      {/* History Card */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]">

        {!items.length ? (

          <div className="flex min-h-96 flex-col items-center justify-center px-6 py-12 text-center">

            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50 text-sky-800">

              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 3v18h18" />
                <path d="m7 16 4-4 3 3 5-6" />
              </svg>

            </div>

            <h2 className="text-xl font-bold text-slate-900">
              No Analysis History Yet
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              Run your first bankruptcy risk analysis and the result will appear here automatically.
            </p>

            <Link
              href="/dashboard"
              className="mt-6 rounded-xl bg-sky-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-900"
            >
              Run New Analysis
            </Link>

          </div>

        ) : (

          <>
            {/* Card Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-6 py-5">

              <div>

                <h2 className="text-lg font-bold text-slate-900">
                  Previous Analyses
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {items.length}{" "}
                  {items.length === 1
                    ? "analysis"
                    : "analyses"}{" "}
                  found
                </p>

              </div>


              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-sky-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-900"
              >
                <span className="text-lg leading-none">
                  +
                </span>

                New Analysis
              </Link>

            </div>


            {/* Table */}
            <div className="overflow-x-auto">

              <table className="w-full min-w-[760px] border-collapse">

                <thead>

                  <tr className="border-b border-slate-200 bg-slate-50/80">

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Analysis ID
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Analysis Date
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                      Report
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-slate-100">

                  {items.map((item) => (

                    <tr
                      key={item.id}
                      className="transition hover:bg-slate-50/70"
                    >

                      {/* Analysis ID */}
                      <td className="px-6 py-5">

                        <span className="text-sm font-bold text-slate-900">
                          #{item.id}
                        </span>

                      </td>


                      {/* Status */}
                      <td className="px-6 py-5">

                        <span
                          className={statusClass(
                            item.status
                          )}
                        >

                          <span
                            className={statusDotClass(
                              item.status
                            )}
                          />

                          {formatStatus(
                            item.status
                          )}

                        </span>

                      </td>


                      {/* Date */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">

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
                              <rect
                                width="18"
                                height="18"
                                x="3"
                                y="4"
                                rx="2"
                              />
                              <path d="M16 2v4" />
                              <path d="M8 2v4" />
                              <path d="M3 10h18" />
                            </svg>

                          </div>

                          <span className="text-sm font-medium text-slate-700">
                            {formatDate(
                              item.created_at
                            )}
                          </span>

                        </div>

                      </td>


                      {/* Report */}
                      <td className="px-6 py-5 text-right">

                        {item.report_id ? (

                          <Link
                            href={`/api/reports/${item.report_id}`}
                            target="_blank"
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-900"
                          >

                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M14 3h7v7" />
                              <path d="M10 14 21 3" />
                              <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
                            </svg>

                            View Report

                          </Link>

                        ) : (

                          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-400">
                            Not Available
                          </span>

                        )}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </>

        )}

      </section>

    </div>
  );
}