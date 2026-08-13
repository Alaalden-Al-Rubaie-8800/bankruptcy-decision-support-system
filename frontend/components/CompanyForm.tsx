"use client";

import { FormEvent, useEffect, useState } from "react";

type Company = {
  id: number;
  name: string;
  industry: string;
  registration_number: string | null;
  created_at: string;
};

export default function CompanyForm() {
  const [company, setCompany] = useState<Company | null>(null);

  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadCompany() {
      try {
        const response = await fetch("/api/company/me", {
          cache: "no-store",
        });

        if (response.status === 401) {
          window.location.href = "/login";
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          setError(
            data.detail ?? "تعذر تحميل بيانات الشركة"
          );
          return;
        }

        if (data.company) {
          setCompany(data.company);
          setName(data.company.name);
          setIndustry(data.company.industry);
          setRegistrationNumber(
            data.company.registration_number ?? ""
          );
        }
      } catch {
        setError("حدث خطأ أثناء تحميل بيانات الشركة");
      } finally {
        setLoading(false);
      }
    }

    loadCompany();
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("اسم الشركة مطلوب");
      return;
    }

    if (!industry.trim()) {
      setError("قطاع الشركة مطلوب");
      return;
    }

    setSaving(true);

    const body = {
      name: name.trim(),
      industry: industry.trim(),
      registration_number:
        registrationNumber.trim() || null,
    };

    try {
      const response = await fetch("/api/company/me", {
        method: company ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.detail ?? "تعذر حفظ بيانات الشركة"
        );
        return;
      }

      setCompany(data);
      setName(data.name);
      setIndustry(data.industry);
      setRegistrationNumber(
        data.registration_number ?? ""
      );

      setSuccess(
        company
          ? "تم تحديث بيانات الشركة بنجاح"
          : "تم إنشاء الشركة وربطها بحسابك بنجاح"
      );
    } catch {
      setError("حدث خطأ أثناء حفظ بيانات الشركة");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="card">
        جارٍ تحميل بيانات الشركة...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="page-title">
          بيانات الشركة
        </h1>

        <p className="page-subtitle">
          أدخل بيانات شركتك حتى ترتبط التحليلات
          والتقارير بالحساب الصحيح.
        </p>
      </div>

      {company && (
        <section className="card">
          <h2 className="section-title">
            معلومات الشركة
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div>
              <span className="text-sm text-slate-500">
                رقم الشركة
              </span>

              <p className="mt-1 font-bold">
                {company.id}
              </p>
            </div>

            <div>
              <span className="text-sm text-slate-500">
                تاريخ الإضافة
              </span>

              <p className="mt-1 font-bold">
                {new Date(
                  company.created_at
                ).toLocaleString("ar-YE")}
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="card">
        <h2 className="section-title">
          {company
            ? "تعديل بيانات الشركة"
            : "إنشاء بيانات الشركة"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="mt-5 space-y-5"
        >
          <div>
            <label
              className="field-label"
              htmlFor="companyName"
            >
              اسم الشركة
            </label>

            <input
              id="companyName"
              className="field-input"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="مثال: شركة الربيعي الصناعية"
              required
            />
          </div>

          <div>
            <label
              className="field-label"
              htmlFor="industry"
            >
              القطاع
            </label>

            <input
              id="industry"
              className="field-input"
              type="text"
              value={industry}
              onChange={(event) =>
                setIndustry(event.target.value)
              }
              placeholder="مثال: الصناعات الغذائية"
              required
            />
          </div>

          <div>
            <label
              className="field-label"
              htmlFor="registrationNumber"
            >
              رقم التسجيل التجاري
            </label>

            <input
              id="registrationNumber"
              className="field-input"
              type="text"
              value={registrationNumber}
              onChange={(event) =>
                setRegistrationNumber(
                  event.target.value
                )
              }
              placeholder="اختياري"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl bg-green-50 p-3 text-sm font-medium text-green-700">
              {success}
            </div>
          )}

          <button
            className="btn-primary"
            type="submit"
            disabled={saving}
          >
            {saving
              ? "جارٍ الحفظ..."
              : company
                ? "حفظ التغييرات"
                : "إنشاء الشركة"}
          </button>
        </form>
      </section>
    </div>
  );
}