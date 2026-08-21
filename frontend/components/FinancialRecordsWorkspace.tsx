"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";


type FinancialRecord = {
  id: number;
  company_id: number;
  fiscal_year: number;
  total_assets: string;
  total_liabilities: string;
  current_assets: string;
  current_liabilities: string;
  total_revenue: string;
  net_income: string;
  operating_cash_flow: string;
  created_at: string;
};


type FormState = {
  fiscal_year: string;
  total_assets: string;
  total_liabilities: string;
  current_assets: string;
  current_liabilities: string;
  total_revenue: string;
  net_income: string;
  operating_cash_flow: string;
};


const emptyForm: FormState = {
  fiscal_year:
    new Date().getFullYear().toString(),

  total_assets: "",
  total_liabilities: "",
  current_assets: "",
  current_liabilities: "",
  total_revenue: "",
  net_income: "",
  operating_cash_flow: "",
};


function formatNumber(
  value: string | number
) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return value;
  }

  return new Intl.NumberFormat(
    "en-US",
    {
      maximumFractionDigits: 2,
    }
  ).format(number);
}


export default function FinancialRecordsWorkspace() {
  const [records, setRecords] =
    useState<FinancialRecord[]>([]);

  const [form, setForm] =
    useState<FormState>(
      emptyForm
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [
    deletingId,
    setDeletingId,
  ] = useState<number | null>(
    null
  );

  const [
    editingId,
    setEditingId,
  ] = useState<number | null>(
    null
  );

  const [
    recordToDelete,
    setRecordToDelete,
  ] = useState<FinancialRecord | null>(
    null
  );

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  useEffect(() => {
    void loadRecords();
  }, []);


  async function loadRecords() {
    setLoading(true);
    setError("");

    try {
      const response =
        await fetch(
          "/api/financial-records",
          {
            cache: "no-store",
          }
        );

      if (
        response.status === 401
      ) {
        window.location.href =
          "/login";
        return;
      }

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.detail ??
            "Unable to load financial records."
        );
        return;
      }

      setRecords(
        Array.isArray(data)
          ? data
          : []
      );

    } catch {
      setError(
        "An unexpected error occurred while loading financial records."
      );

    } finally {
      setLoading(false);
    }
  }


  function updateField(
    field: keyof FormState,
    value: string
  ) {
    setForm(
      (current) => ({
        ...current,
        [field]: value,
      })
    );
  }


  function validateForm() {
    const year =
      Number(
        form.fiscal_year
      );

    if (
      !Number.isInteger(year) ||
      year < 2000 ||
      year > 2100
    ) {
      return "Please enter a valid fiscal year between 2000 and 2100.";
    }


    const fields: Array<
      keyof FormState
    > = [
      "total_assets",
      "total_liabilities",
      "current_assets",
      "current_liabilities",
      "total_revenue",
    ];


    for (
      const field of fields
    ) {
      const value =
        Number(
          form[field]
        );

      if (
        !Number.isFinite(value) ||
        value < 0
      ) {
        return "Please enter valid non-negative financial values.";
      }
    }


    if (
      !Number.isFinite(
        Number(
          form.net_income
        )
      )
    ) {
      return "Please enter a valid net income value.";
    }


    if (
      !Number.isFinite(
        Number(
          form.operating_cash_flow
        )
      )
    ) {
      return "Please enter a valid operating cash flow value.";
    }


    return "";
  }


  function resetForm() {
    setEditingId(null);

    setForm({
      ...emptyForm,

      fiscal_year:
        new Date()
          .getFullYear()
          .toString(),
    });

    setError("");
    setSuccess("");
  }


  function startEditing(
    record: FinancialRecord
  ) {
    setEditingId(
      record.id
    );

    setForm({
      fiscal_year:
        record.fiscal_year.toString(),

      total_assets:
        record.total_assets.toString(),

      total_liabilities:
        record.total_liabilities.toString(),

      current_assets:
        record.current_assets.toString(),

      current_liabilities:
        record.current_liabilities.toString(),

      total_revenue:
        record.total_revenue.toString(),

      net_income:
        record.net_income.toString(),

      operating_cash_flow:
        record.operating_cash_flow.toString(),
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }


  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const validationError =
      validateForm();

    if (validationError) {
      setError(
        validationError
      );

      return;
    }

    setSaving(true);


    const body = {
      fiscal_year:
        Number(
          form.fiscal_year
        ),

      total_assets:
        Number(
          form.total_assets
        ),

      total_liabilities:
        Number(
          form.total_liabilities
        ),

      current_assets:
        Number(
          form.current_assets
        ),

      current_liabilities:
        Number(
          form.current_liabilities
        ),

      total_revenue:
        Number(
          form.total_revenue
        ),

      net_income:
        Number(
          form.net_income
        ),

      operating_cash_flow:
        Number(
          form.operating_cash_flow
        ),
    };


    try {
      const isEditing =
        editingId !== null;

      const url =
        isEditing
          ? `/api/financial-records/${editingId}`
          : "/api/financial-records";


      const response =
        await fetch(
          url,
          {
            method:
              isEditing
                ? "PUT"
                : "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                body
              ),
          }
        );


      if (
        response.status === 401
      ) {
        window.location.href =
          "/login";

        return;
      }


      const data =
        await response.json();


      if (!response.ok) {
        setError(
          data.detail ??
            (
              isEditing
                ? "Unable to update the financial record."
                : "Unable to create the financial record."
            )
        );

        return;
      }


      if (isEditing) {
        setRecords(
          (current) =>
            current.map(
              (record) =>
                record.id ===
                editingId
                  ? data
                  : record
            )
        );

        setSuccess(
          "Financial record updated successfully."
        );

        setEditingId(null);

        setForm({
          ...emptyForm,

          fiscal_year:
            new Date()
              .getFullYear()
              .toString(),
        });

      } else {
        setRecords(
          (current) => [
            data,
            ...current,
          ]
        );

        setForm({
          ...emptyForm,

          fiscal_year: (
            Number(
              form.fiscal_year
            ) + 1
          ).toString(),
        });

        setSuccess(
          "Financial record saved successfully."
        );
      }

    } catch {
      setError(
        editingId !== null
          ? "An unexpected error occurred while updating the financial record."
          : "An unexpected error occurred while saving the financial record."
      );

    } finally {
      setSaving(false);
    }
  }


  function requestDelete(
    record: FinancialRecord
  ) {
    setRecordToDelete(
      record
    );
  }


  async function confirmDelete() {
    if (!recordToDelete) {
      return;
    }

    const record =
      recordToDelete;

    setError("");
    setSuccess("");

    setDeletingId(
      record.id
    );

    try {
      const response =
        await fetch(
          `/api/financial-records/${record.id}`,
          {
            method: "DELETE",
          }
        );


      if (
        response.status === 401
      ) {
        window.location.href =
          "/login";

        return;
      }


      if (!response.ok) {
        let message =
          "Unable to delete the financial record.";

        try {
          const data =
            await response.json();

          message =
            data.detail ??
            message;

        } catch {
          // No JSON response body.
        }

        setError(message);

        return;
      }


      setRecords(
        (current) =>
          current.filter(
            (item) =>
              item.id !==
              record.id
          )
      );


      if (
        editingId ===
        record.id
      ) {
        resetForm();
      }


      setSuccess(
        "Financial record deleted successfully."
      );

      setRecordToDelete(
        null
      );

    } catch {
      setError(
        "An unexpected error occurred while deleting the financial record."
      );

    } finally {
      setDeletingId(null);
    }
  }


  return (
    <>
      <div className="mx-auto max-w-6xl space-y-5">

        {/* Page Header */}
        <section>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">
            Financial Records
          </h1>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            Add and manage the company&apos;s core financial data used for analysis.
          </p>
        </section>


        {/* Form */}
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)] md:p-6">

          <div className="mb-5 flex flex-wrap items-start justify-between gap-4">

            <div>
              <h2 className="text-xl font-bold text-slate-950">
                {editingId !== null
                  ? "Edit Financial Record"
                  : "Add Financial Record"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Enter the financial figures for a single fiscal year.
              </p>
            </div>


            {editingId !== null && (
              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel Editing
              </button>
            )}

          </div>


          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Fiscal Year */}
            <div className="max-w-xs">

              <label
                htmlFor="fiscalYear"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                Fiscal Year
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>


              <input
                id="fiscalYear"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{4}"
                maxLength={4}
                dir="ltr"
                lang="en"
                value={
                  form.fiscal_year
                }
                onChange={(
                  event
                ) => {
                  const value =
                    event.target.value
                      .replace(
                        /[^0-9]/g,
                        ""
                      )
                      .slice(
                        0,
                        4
                      );

                  updateField(
                    "fiscal_year",
                    value
                  );
                }}
                placeholder="2026"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-left text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
                style={{
                  fontVariantNumeric:
                    "tabular-nums",
                }}
                required
              />

            </div>


            {/* Main Sections */}
            <div className="grid gap-5 lg:grid-cols-2">

              {/* Balance Sheet */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">

                <div className="mb-4 flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-800">

                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 21h18" />
                      <path d="M5 21V7h14v14" />
                      <path d="M9 10h6" />
                      <path d="M9 14h6" />
                    </svg>

                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      Balance Sheet
                    </h3>

                    <p className="text-xs text-slate-500">
                      Assets and liabilities
                    </p>
                  </div>

                </div>


                <div className="grid gap-4 md:grid-cols-2">

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Total Assets
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={
                        form.total_assets
                      }
                      onChange={(event) =>
                        updateField(
                          "total_assets",
                          event.target.value
                        )
                      }
                      placeholder="Enter amount"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
                      required
                    />
                  </div>


                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Current Assets
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={
                        form.current_assets
                      }
                      onChange={(event) =>
                        updateField(
                          "current_assets",
                          event.target.value
                        )
                      }
                      placeholder="Enter amount"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
                      required
                    />
                  </div>


                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Total Liabilities
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={
                        form.total_liabilities
                      }
                      onChange={(event) =>
                        updateField(
                          "total_liabilities",
                          event.target.value
                        )
                      }
                      placeholder="Enter amount"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
                      required
                    />
                  </div>


                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Current Liabilities
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={
                        form.current_liabilities
                      }
                      onChange={(event) =>
                        updateField(
                          "current_liabilities",
                          event.target.value
                        )
                      }
                      placeholder="Enter amount"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
                      required
                    />
                  </div>

                </div>

              </div>


              {/* Performance */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">

                <div className="mb-4 flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">

                    <svg
                      width="18"
                      height="18"
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

                  <div>
                    <h3 className="font-bold text-slate-900">
                      Financial Performance
                    </h3>

                    <p className="text-xs text-slate-500">
                      Revenue, income and cash flow
                    </p>
                  </div>

                </div>


                <div className="grid gap-4">

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Total Revenue
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={
                        form.total_revenue
                      }
                      onChange={(event) =>
                        updateField(
                          "total_revenue",
                          event.target.value
                        )
                      }
                      placeholder="Enter amount"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
                      required
                    />
                  </div>


                  <div className="grid gap-4 md:grid-cols-2">

                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                        Net Income
                      </label>

                      <input
                        type="number"
                        step="0.01"
                        value={
                          form.net_income
                        }
                        onChange={(event) =>
                          updateField(
                            "net_income",
                            event.target.value
                          )
                        }
                        placeholder="Enter amount"
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
                        required
                      />
                    </div>


                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                        Operating Cash Flow
                      </label>

                      <input
                        type="number"
                        step="0.01"
                        value={
                          form.operating_cash_flow
                        }
                        onChange={(event) =>
                          updateField(
                            "operating_cash_flow",
                            event.target.value
                          )
                        }
                        placeholder="Enter amount"
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
                        required
                      />
                    </div>

                  </div>

                </div>

              </div>

            </div>


            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <span className="font-bold">
                  !
                </span>

                <span>
                  {error}
                </span>
              </div>
            )}


            {success && (
              <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                <span className="font-bold">
                  ✓
                </span>

                <span>
                  {success}
                </span>
              </div>
            )}


            <div className="flex justify-end border-t border-slate-200 pt-4">

              <button
                type="submit"
                disabled={saving}
                className="inline-flex min-w-48 items-center justify-center rounded-xl bg-sky-950 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? (
                      editingId !== null
                        ? "Saving Changes..."
                        : "Saving Record..."
                    )
                  : (
                      editingId !== null
                        ? "Save Changes"
                        : "Save Financial Record"
                    )}
              </button>

            </div>

          </form>

        </section>


        {/* Previous Records */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]">

          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-6 py-5">

            <div>
              <h2 className="text-lg font-bold text-slate-950">
                Previous Records
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {records.length}{" "}
                {records.length === 1
                  ? "record"
                  : "records"}{" "}
                available
              </p>
            </div>


            <button
              type="button"
              onClick={loadRecords}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              ↻ Refresh
            </button>

          </div>


          {loading ? (
            <div className="flex min-h-40 items-center justify-center text-sm text-slate-500">
              Loading financial records...
            </div>

          ) : records.length === 0 ? (

            <div className="flex min-h-48 flex-col items-center justify-center px-6 py-8 text-center">
              <h3 className="font-bold text-slate-900">
                No Financial Records Yet
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Add your first financial record using the form above.
              </p>
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px] border-collapse">

                <thead>

                  <tr className="border-b border-slate-200 bg-slate-50/80">

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Year
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Assets
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Liabilities
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Revenue
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Net Income
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Cash Flow
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-slate-100">

                  {records.map(
                    (record) => (

                      <tr
                        key={record.id}
                        className="transition hover:bg-slate-50/70"
                      >

                        <td className="px-5 py-4 font-bold text-slate-900">
                          {record.fiscal_year}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-700">
                          {formatNumber(
                            record.total_assets
                          )}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-700">
                          {formatNumber(
                            record.total_liabilities
                          )}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-700">
                          {formatNumber(
                            record.total_revenue
                          )}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-700">
                          {formatNumber(
                            record.net_income
                          )}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-700">
                          {formatNumber(
                            record.operating_cash_flow
                          )}
                        </td>


                        <td className="px-5 py-4">

                          <div className="flex justify-end gap-2">

                            <button
                              type="button"
                              onClick={() =>
                                startEditing(
                                  record
                                )
                              }
                              className="rounded-lg border border-sky-200 bg-sky-50 px-3.5 py-2 text-xs font-semibold text-sky-800 transition hover:border-sky-300 hover:bg-sky-100 hover:text-sky-950"
                            >
                              Edit
                            </button>


                            <button
                              type="button"
                              disabled={
                                deletingId ===
                                record.id
                              }
                              onClick={() =>
                                requestDelete(
                                  record
                                )
                              }
                              className="rounded-lg border border-red-200 bg-white px-3.5 py-2 text-xs font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {deletingId ===
                              record.id
                                ? "Deleting..."
                                : "Delete"}
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </div>


      {/* Delete Confirmation Modal */}
      {recordToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
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
                  <path d="M3 6h18" />
                  <path d="M8 6V4h8v2" />
                  <path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v5" />
                  <path d="M14 11v5" />
                </svg>
              </div>


              <div className="flex-1">

                <h2 className="text-lg font-bold text-slate-950">
                  Delete Financial Record?
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  You are about to delete the financial record for fiscal year{" "}
                  <span className="font-bold text-slate-800">
                    {recordToDelete.fiscal_year}
                  </span>.
                  This action cannot be undone.
                </p>

              </div>

            </div>


            <div className="mt-6 flex justify-end gap-3">

              <button
                type="button"
                disabled={
                  deletingId !== null
                }
                onClick={() =>
                  setRecordToDelete(
                    null
                  )
                }
                className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>


              <button
                type="button"
                disabled={
                  deletingId !== null
                }
                onClick={() =>
                  void confirmDelete()
                }
                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingId !== null
                  ? "Deleting..."
                  : "Delete Record"}
              </button>

            </div>

          </div>

        </div>
      )}

    </>
  );
}