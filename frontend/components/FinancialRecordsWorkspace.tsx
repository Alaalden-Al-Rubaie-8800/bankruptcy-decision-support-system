"use client";

import { FormEvent, useEffect, useState } from "react";


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
  fiscal_year: new Date().getFullYear().toString(),
  total_assets: "",
  total_liabilities: "",
  current_assets: "",
  current_liabilities: "",
  total_revenue: "",
  net_income: "",
  operating_cash_flow: "",
};


export default function FinancialRecordsWorkspace() {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  useEffect(() => {
    void loadRecords();
  }, []);


  async function loadRecords() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/financial-records",
        {
          cache: "no-store",
        }
      );

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.detail ??
            "تعذر تحميل السجلات المالية"
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
        "حدث خطأ أثناء تحميل السجلات المالية"
      );
    } finally {
      setLoading(false);
    }
  }


  function updateField(
    field: keyof FormState,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }


  function validateForm() {
    const year = Number(form.fiscal_year);

    if (
      !Number.isInteger(year) ||
      year < 2000 ||
      year > 2100
    ) {
      return "السنة المالية غير صحيحة";
    }

    const fields: Array<keyof FormState> = [
      "total_assets",
      "total_liabilities",
      "current_assets",
      "current_liabilities",
      "total_revenue",
    ];

    for (const field of fields) {
      const value = Number(form[field]);

      if (
        !Number.isFinite(value) ||
        value < 0
      ) {
        return "تأكد من إدخال القيم المالية بشكل صحيح";
      }
    }

    if (
      !Number.isFinite(
        Number(form.net_income)
      )
    ) {
      return "صافي الدخل غير صحيح";
    }

    if (
      !Number.isFinite(
        Number(form.operating_cash_flow)
      )
    ) {
      return "التدفق النقدي التشغيلي غير صحيح";
    }

    return "";
  }


  function resetForm() {
    setEditingId(null);

    setForm({
      ...emptyForm,
      fiscal_year:
        new Date().getFullYear().toString(),
    });

    setError("");
    setSuccess("");
  }


  function startEditing(
    record: FinancialRecord
  ) {
    setEditingId(record.id);

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
      setError(validationError);
      return;
    }

    setSaving(true);

    const body = {
      fiscal_year:
        Number(form.fiscal_year),

      total_assets:
        Number(form.total_assets),

      total_liabilities:
        Number(form.total_liabilities),

      current_assets:
        Number(form.current_assets),

      current_liabilities:
        Number(form.current_liabilities),

      total_revenue:
        Number(form.total_revenue),

      net_income:
        Number(form.net_income),

      operating_cash_flow:
        Number(form.operating_cash_flow),
    };

    try {
      const isEditing =
        editingId !== null;

      const url = isEditing
        ? `/api/financial-records/${editingId}`
        : "/api/financial-records";

      const response = await fetch(
        url,
        {
          method: isEditing
            ? "PUT"
            : "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(body),
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
            (
              isEditing
                ? "تعذر تعديل السجل المالي"
                : "تعذر إنشاء السجل المالي"
            )
        );
        return;
      }

      if (isEditing) {
        setRecords((current) =>
          current.map((record) =>
            record.id === editingId
              ? data
              : record
          )
        );

        setSuccess(
          "تم تعديل السجل المالي بنجاح"
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
        setRecords((current) => [
          data,
          ...current,
        ]);

        setForm({
          ...emptyForm,

          fiscal_year: (
            Number(
              form.fiscal_year
            ) + 1
          ).toString(),
        });

        setSuccess(
          "تم حفظ السجل المالي بنجاح"
        );
      }
    } catch {
      setError(
        editingId !== null
          ? "حدث خطأ أثناء تعديل السجل المالي"
          : "حدث خطأ أثناء حفظ السجل المالي"
      );
    } finally {
      setSaving(false);
    }
  }


  async function handleDelete(
    record: FinancialRecord
  ) {
    const confirmed =
      window.confirm(
        `هل أنت متأكد من حذف السجل المالي لسنة ${record.fiscal_year}؟`
      );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");
    setDeletingId(record.id);

    try {
      const response = await fetch(
        `/api/financial-records/${record.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.status === 401) {
        window.location.href =
          "/login";
        return;
      }

      if (!response.ok) {
        let message =
          "تعذر حذف السجل المالي";

        try {
          const data =
            await response.json();

          message =
            data.detail ?? message;
        } catch {
          // لا يوجد محتوى JSON
        }

        setError(message);
        return;
      }

      setRecords((current) =>
        current.filter(
          (item) =>
            item.id !== record.id
        )
      );

      if (editingId === record.id) {
        resetForm();
      }

      setSuccess(
        "تم حذف السجل المالي بنجاح"
      );
    } catch {
      setError(
        "حدث خطأ أثناء حذف السجل المالي"
      );
    } finally {
      setDeletingId(null);
    }
  }


  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section>
        <p className="eyebrow">
          Financial Records
        </p>

        <h1 className="page-title">
          السجلات المالية
        </h1>

        <p className="page-subtitle">
          أضف البيانات المالية الأساسية لشركتك.
          يستخدم النظام أحدث سجل عند تشغيل التحليل الذكي.
        </p>
      </section>


      <section className="card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="section-title">
            {editingId !== null
              ? "تعديل السجل المالي"
              : "إضافة سجل مالي"}
          </h2>

          {editingId !== null && (
            <button
              type="button"
              className="btn-secondary"
              onClick={resetForm}
              disabled={saving}
            >
              إلغاء التعديل
            </button>
          )}
        </div>


        <form
          onSubmit={handleSubmit}
          className="mt-5 space-y-5"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label
                className="field-label"
                htmlFor="fiscalYear"
              >
                السنة المالية
              </label>

              <input
                id="fiscalYear"
                className="field-input"
                type="number"
                min="2000"
                max="2100"
                value={form.fiscal_year}
                onChange={(event) =>
                  updateField(
                    "fiscal_year",
                    event.target.value
                  )
                }
                required
              />
            </div>


            <div>
              <label
                className="field-label"
                htmlFor="totalAssets"
              >
                إجمالي الأصول
              </label>

              <input
                id="totalAssets"
                className="field-input"
                type="number"
                min="0"
                step="0.01"
                value={form.total_assets}
                onChange={(event) =>
                  updateField(
                    "total_assets",
                    event.target.value
                  )
                }
                required
              />
            </div>


            <div>
              <label
                className="field-label"
                htmlFor="totalLiabilities"
              >
                إجمالي الالتزامات
              </label>

              <input
                id="totalLiabilities"
                className="field-input"
                type="number"
                min="0"
                step="0.01"
                value={form.total_liabilities}
                onChange={(event) =>
                  updateField(
                    "total_liabilities",
                    event.target.value
                  )
                }
                required
              />
            </div>


            <div>
              <label
                className="field-label"
                htmlFor="currentAssets"
              >
                الأصول المتداولة
              </label>

              <input
                id="currentAssets"
                className="field-input"
                type="number"
                min="0"
                step="0.01"
                value={form.current_assets}
                onChange={(event) =>
                  updateField(
                    "current_assets",
                    event.target.value
                  )
                }
                required
              />
            </div>


            <div>
              <label
                className="field-label"
                htmlFor="currentLiabilities"
              >
                الالتزامات المتداولة
              </label>

              <input
                id="currentLiabilities"
                className="field-input"
                type="number"
                min="0"
                step="0.01"
                value={form.current_liabilities}
                onChange={(event) =>
                  updateField(
                    "current_liabilities",
                    event.target.value
                  )
                }
                required
              />
            </div>


            <div>
              <label
                className="field-label"
                htmlFor="totalRevenue"
              >
                إجمالي الإيرادات
              </label>

              <input
                id="totalRevenue"
                className="field-input"
                type="number"
                min="0"
                step="0.01"
                value={form.total_revenue}
                onChange={(event) =>
                  updateField(
                    "total_revenue",
                    event.target.value
                  )
                }
                required
              />
            </div>


            <div>
              <label
                className="field-label"
                htmlFor="netIncome"
              >
                صافي الدخل
              </label>

              <input
                id="netIncome"
                className="field-input"
                type="number"
                step="0.01"
                value={form.net_income}
                onChange={(event) =>
                  updateField(
                    "net_income",
                    event.target.value
                  )
                }
                required
              />
            </div>


            <div>
              <label
                className="field-label"
                htmlFor="operatingCashFlow"
              >
                التدفق النقدي التشغيلي
              </label>

              <input
                id="operatingCashFlow"
                className="field-input"
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
                required
              />
            </div>
          </div>


          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}


          {success && (
            <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-700">
              {success}
            </div>
          )}


          <button
            className="btn-primary"
            type="submit"
            disabled={saving}
          >
            {saving
              ? (
                editingId !== null
                  ? "جارٍ حفظ التعديلات..."
                  : "جارٍ حفظ السجل..."
              )
              : (
                editingId !== null
                  ? "حفظ التعديلات"
                  : "حفظ السجل المالي"
              )}
          </button>
        </form>
      </section>


      <section className="card">
        <div className="flex items-center justify-between gap-3">
          <h2 className="section-title">
            السجلات السابقة
          </h2>

          <button
            className="btn-secondary"
            type="button"
            onClick={loadRecords}
          >
            تحديث
          </button>
        </div>


        {loading ? (
          <p className="mt-4 text-sm text-slate-500">
            جارٍ تحميل السجلات...
          </p>
        ) : records.length === 0 ? (
          <div className="mt-4 rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
            لا توجد سجلات مالية حتى الآن.
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>السنة</th>
                  <th>الأصول</th>
                  <th>الالتزامات</th>
                  <th>الإيرادات</th>
                  <th>صافي الدخل</th>
                  <th>التدفق النقدي</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>


              <tbody>
                {records.map(
                  (record) => (
                    <tr key={record.id}>
                      <td>
                        {record.fiscal_year}
                      </td>

                      <td>
                        {record.total_assets}
                      </td>

                      <td>
                        {
                          record.total_liabilities
                        }
                      </td>

                      <td>
                        {record.total_revenue}
                      </td>

                      <td>
                        {record.net_income}
                      </td>

                      <td>
                        {
                          record.operating_cash_flow
                        }
                      </td>

                      <td>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={() =>
                              startEditing(
                                record
                              )
                            }
                          >
                            تعديل
                          </button>

                          <button
                            type="button"
                            className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={
                              deletingId ===
                              record.id
                            }
                            onClick={() =>
                              void handleDelete(
                                record
                              )
                            }
                          >
                            {deletingId ===
                            record.id
                              ? "جارٍ الحذف..."
                              : "حذف"}
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
  );
}