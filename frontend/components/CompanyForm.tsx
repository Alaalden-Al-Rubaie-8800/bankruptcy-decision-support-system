"use client";

import { FormEvent, useEffect, useState } from "react";

type Company = {
  id: number;
  name: string;
  industry: string;
  registration_number: string | null;
  created_at: string;
};


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


export default function CompanyForm() {
  const [company, setCompany] =
    useState<Company | null>(null);

  const [name, setName] =
    useState("");

  const [industry, setIndustry] =
    useState("");

  const [
    registrationNumber,
    setRegistrationNumber,
  ] = useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  useEffect(() => {
    async function loadCompany() {
      try {
        const response = await fetch(
          "/api/company/me",
          {
            cache: "no-store",
          }
        );

        if (response.status === 401) {
          window.location.href = "/login";
          return;
        }

        const data =
          await response.json();

        if (!response.ok) {
          setError(
            data.detail ??
              "Unable to load company information."
          );
          return;
        }

        if (data.company) {
          setCompany(data.company);
          setName(data.company.name);
          setIndustry(
            data.company.industry
          );
          setRegistrationNumber(
            data.company
              .registration_number ??
              ""
          );
        }

      } catch {
        setError(
          "An unexpected error occurred while loading company information."
        );

      } finally {
        setLoading(false);
      }
    }

    void loadCompany();
  }, []);


  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError(
        "Please enter the company name."
      );
      return;
    }

    if (!industry.trim()) {
      setError(
        "Please enter the company industry."
      );
      return;
    }

    setSaving(true);

    const body = {
      name: name.trim(),
      industry:
        industry.trim(),
      registration_number:
        registrationNumber.trim() ||
        null,
    };

    try {
      const response = await fetch(
        "/api/company/me",
        {
          method: company
            ? "PUT"
            : "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            body
          ),
        }
      );

      if (response.status === 401) {
        window.location.href =
          "/login";
        return;
      }

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.detail ??
            "Unable to save company information."
        );
        return;
      }

      setCompany(data);
      setName(data.name);
      setIndustry(data.industry);
      setRegistrationNumber(
        data.registration_number ??
          ""
      );

      setSuccess(
        company
          ? "Company information updated successfully."
          : "Company profile created successfully."
      );

    } catch {
      setError(
        "An unexpected error occurred while saving company information."
      );

    } finally {
      setSaving(false);
    }
  }


  if (loading) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">

        <div className="flex min-h-56 flex-col items-center justify-center text-center">

          <div className="mb-4 h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-sky-900" />

          <h2 className="text-lg font-bold text-slate-900">
            Loading Company Information
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Please wait while the company profile is loaded.
          </p>

        </div>

      </section>
    );
  }


  return (
    <div className="mx-auto max-w-5xl space-y-4">

      {/* Header */}
      <section>

        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">
          Company Information
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage the company profile used for financial analysis and reporting.
        </p>

      </section>


      {/* Summary */}
      {company && (
        <section className="grid gap-3 md:grid-cols-2">

          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-[0_4px_16px_rgba(15,23,42,0.04)]">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-800">

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
                  <path d="M3 21h18" />
                  <path d="M6 21V7l6-4 6 4v14" />
                  <path d="M9 9h1" />
                  <path d="M14 9h1" />
                </svg>

              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Company ID
                </p>

                <p className="mt-0.5 text-lg font-bold text-slate-900">
                  #{company.id}
                </p>
              </div>

            </div>

          </div>


          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-[0_4px_16px_rgba(15,23,42,0.04)]">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">

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

              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Created Date
                </p>

                <p className="mt-0.5 text-sm font-bold text-slate-900">
                  {formatDate(
                    company.created_at
                  )}
                </p>
              </div>

            </div>

          </div>

        </section>
      )}


      {/* Details */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)] md:p-6">

        <div className="mb-5">

          <h2 className="text-xl font-bold text-slate-950">
            {company
              ? "Company Details"
              : "Create Company Profile"}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {company
              ? "Update the company information linked to your account."
              : "Add the company information required to begin financial analysis."}
          </p>

        </div>


        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* Company Name */}
          <div>

            <label
              htmlFor="companyName"
              className="mb-1.5 block text-sm font-semibold text-slate-700"
            >
              Company Name
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <input
              id="companyName"
              type="text"
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
              placeholder="Enter company name"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
              required
            />

          </div>


          {/* Industry */}
          <div>

            <label
              htmlFor="industry"
              className="mb-1.5 block text-sm font-semibold text-slate-700"
            >
              Industry
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <input
              id="industry"
              type="text"
              value={industry}
              onChange={(event) =>
                setIndustry(
                  event.target.value
                )
              }
              placeholder="Enter company industry"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
              required
            />

            <p className="mt-1.5 text-xs text-slate-400">
              Example: Food Manufacturing
            </p>

          </div>


          {/* Registration */}
          <div>

            <div className="mb-1.5 flex items-center justify-between">

              <label
                htmlFor="registrationNumber"
                className="text-sm font-semibold text-slate-700"
              >
                Commercial Registration Number
              </label>

              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                Optional
              </span>

            </div>

            <input
              id="registrationNumber"
              type="text"
              value={registrationNumber}
              onChange={(event) =>
                setRegistrationNumber(
                  event.target.value
                )
              }
              placeholder="Enter registration number"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
            />

          </div>


          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold">
                !
              </span>

              <span className="font-medium">
                {error}
              </span>

            </div>
          )}


          {success && (
            <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">

              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold">
                ✓
              </span>

              <span className="font-medium">
                {success}
              </span>

            </div>
          )}


          {/* Save */}
          <div className="flex justify-end border-t border-slate-200 pt-4">

            <button
              type="submit"
              disabled={saving}
              className="inline-flex min-w-40 items-center justify-center rounded-xl bg-sky-950 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : company
                  ? "Save Changes"
                  : "Create Company"}
            </button>

          </div>

        </form>

      </section>

    </div>
  );
}