"""إنشاء تقرير HTML من نتيجة التنبؤ والتوصيات."""

from datetime import datetime
from pathlib import Path
from typing import Any
import html
import uuid

BASE_DIR = Path(__file__).resolve().parent
TEMPLATE_PATH = BASE_DIR / "report_template.html"
GENERATED_REPORTS_DIR = BASE_DIR / "generated_reports"
GENERATED_REPORTS_DIR.mkdir(parents=True, exist_ok=True)

RISK_AR = {
    "low": "منخفض",
    "medium": "متوسط",
    "high": "مرتفع",
}


def _safe(value: Any) -> str:
    return html.escape(str(value))


def _render_risk_factors(factors: list[Any]) -> str:
    if not factors:
        return "<p>لا توجد عوامل تفسيرية مرفقة.</p>"

    items: list[str] = []

    for factor in factors[:5]:
        if isinstance(factor, dict):
            name = factor.get("ratio_name") or factor.get("feature") or "عامل مالي"
            code = factor.get("ratio_code")
            year = factor.get("year_offset")
            category = factor.get("category")
            value = factor.get("value")

            label = _safe(name)
            if code:
                label += f" ({_safe(code)})"
            if year:
                label += f" - {_safe(year)}"
            if category:
                label += f" | {_safe(category)}"
            if value is not None:
                label += f" | القيمة: {_safe(value)}"

            items.append(f"<li>{label}</li>")
        else:
            items.append(f"<li>{_safe(factor)}</li>")

    return "<ul>" + "".join(items) + "</ul>"


def _render_recommendations(recommendations: list[dict[str, Any]]) -> str:
    if not recommendations:
        return "<p>لا توجد توصيات.</p>"

    parts: list[str] = []

    for item in recommendations:
        parts.append(
            "<div class='recommendation'>"
            f"<strong>{_safe(item.get('title', 'توصية'))}</strong>"
            f"<div>{_safe(item.get('description', ''))}</div>"
            f"<small>الأولوية: {_safe(item.get('priority', '-'))} | "
            f"الإطار الزمني: {_safe(item.get('time_horizon', '-'))}</small>"
            "</div>"
        )

    return "".join(parts)


def generate_report(
    company: dict[str, Any],
    prediction: dict[str, Any],
    recommendations: list[dict[str, Any]],
    output_dir: str | Path | None = None,
) -> dict[str, str]:
    required = {
        "bankruptcy_probability",
        "predicted_class",
        "risk_level",
    }
    missing = required - prediction.keys()

    if missing:
        raise ValueError(f"Missing prediction fields: {sorted(missing)}")

    p = float(prediction["bankruptcy_probability"])
    if not 0 <= p <= 1:
        raise ValueError("bankruptcy_probability must be between 0 and 1")

    risk = str(prediction["risk_level"]).strip().lower()
    if risk not in RISK_AR:
        raise ValueError("risk_level must be low, medium, or high")

    template = TEMPLATE_PATH.read_text(encoding="utf-8")
    report_id = f"REP-{datetime.now():%Y%m%d}-{uuid.uuid4().hex[:8].upper()}"
    generated_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    predicted_class = int(prediction["predicted_class"])

    if predicted_class not in {0, 1}:
        raise ValueError("predicted_class must be 0 or 1")

    class_ar = "معرض للخطر" if predicted_class == 1 else "غير معرض للخطر"

    values = {
        "{{REPORT_ID}}": report_id,
        "{{GENERATED_AT}}": generated_at,
        "{{COMPANY_NAME}}": _safe(company.get("name", "غير محدد")),
        "{{COMPANY_ID}}": _safe(company.get("id", "غير محدد")),
        "{{PROBABILITY_PERCENT}}": f"{p * 100:.2f}",
        "{{RISK_CLASS}}": risk,
        "{{RISK_LEVEL_AR}}": RISK_AR[risk],
        "{{PREDICTED_CLASS_AR}}": class_ar,
        "{{RISK_FACTORS_HTML}}": _render_risk_factors(
            list(prediction.get("top_risk_factors", []))
        ),
        "{{RECOMMENDATIONS_HTML}}": _render_recommendations(recommendations),
    }

    rendered = template
    for key, value in values.items():
        rendered = rendered.replace(key, value)

    target = Path(output_dir) if output_dir else GENERATED_REPORTS_DIR
    target.mkdir(parents=True, exist_ok=True)

    filename = f"{report_id}.html"
    path = target / filename
    path.write_text(rendered, encoding="utf-8")

    return {
        "report_id": report_id,
        "status": "generated",
        "filename": filename,
        "report_path": str(path.resolve()),
    }
