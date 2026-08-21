"""Generate a professional single-language HTML decision support report."""

from datetime import datetime
from pathlib import Path
from typing import Any
import html
import uuid


BASE_DIR = Path(__file__).resolve().parent

TEMPLATE_PATHS = {
    "en": BASE_DIR / "report_template_en.html",
    "ar": BASE_DIR / "report_template_ar.html",
}


RISK_LABELS = {
    "en": {
        "low": "Low",
        "medium": "Medium",
        "high": "High",
    },
    "ar": {
        "low": "منخفض",
        "medium": "متوسط",
        "high": "مرتفع",
    },
}


PRIORITY_LABELS = {
    "en": {
        "critical": "Critical",
        "high": "High",
        "medium": "Medium",
        "low": "Low",
    },
    "ar": {
        "critical": "حرجة",
        "high": "مرتفعة",
        "medium": "متوسطة",
        "low": "منخفضة",
    },
}


YEAR_LABELS = {
    "en": {
        "t_minus_1": "Latest Year",
        "t_minus_2": "Previous Year",
        "t_minus_3": "Oldest Year",
    },
    "ar": {
        "t_minus_1": "أحدث سنة",
        "t_minus_2": "السنة السابقة",
        "t_minus_3": "السنة الأقدم",
    },
}


CATEGORY_LABELS = {
    "en": {
        "Activity": "Activity",
        "Liquidity": "Liquidity",
        "Profitability": "Profitability",
        "Solvency": "Solvency",
        "activity": "Activity",
        "liquidity": "Liquidity",
        "profitability": "Profitability",
        "solvency": "Solvency",
        "monitoring": "Monitoring",
        "stability": "Financial Stability",
        "liabilities": "Liabilities",
        "corrective_plan": "Corrective Plan",
        "financial_review": "Financial Review",
        "escalation": "Escalation",
        "contingency": "Contingency Planning",
    },
    "ar": {
        "Activity": "النشاط",
        "Liquidity": "السيولة",
        "Profitability": "الربحية",
        "Solvency": "الملاءة المالية",
        "activity": "النشاط",
        "liquidity": "السيولة",
        "profitability": "الربحية",
        "solvency": "الملاءة المالية",
        "monitoring": "المراقبة",
        "stability": "الاستقرار المالي",
        "liabilities": "الالتزامات",
        "corrective_plan": "الخطة التصحيحية",
        "financial_review": "المراجعة المالية",
        "escalation": "التصعيد",
        "contingency": "خطة الطوارئ",
    },
}


TIME_HORIZON_LABELS = {
    "en": {
        "immediate": "Immediate",
        "short_term": "Short Term",
        "medium_term": "Medium Term",
        "long_term": "Long Term",
        "ongoing": "Ongoing",
    },
    "ar": {
        "immediate": "فوري",
        "short_term": "قصير الأجل",
        "medium_term": "متوسط الأجل",
        "long_term": "طويل الأجل",
        "ongoing": "مستمر",
    },
}


RATIO_LABELS = {
    "en": {
        "ROA": "Return on Assets",
        "ROE": "Return on Equity",
        "ROS": "Return on Sales",
        "L1": "Cash Liquidity Ratio",
        "L2": "Quick Ratio",
        "L3": "Current Ratio",
        "ATD": "Asset Turnover Days",
        "DTR": "Receivables Collection Days",
        "TAT": "Total Asset Turnover",
        "ITD": "Inventory Turnover Days",
        "DA": "Debt to Assets",
        "DE": "Debt to Equity",
        "FL": "Financial Leverage",
        "ROI": "Return on Investment",
        "DIR": "Debt Burden Ratio",
        "DCR": "Debt Service Coverage",
        "ACR": "Asset Coverage Ratio",
        "LP": "Labor Productivity",
        "BL": "Bank Liabilities Ratio",
        "LRR": "Labor Cost to Revenue",
        "WAR": "Wages to Added Value",
    },
    "ar": {
        "ROA": "العائد على الأصول",
        "ROE": "العائد على حقوق الملكية",
        "ROS": "العائد على المبيعات",
        "L1": "نسبة السيولة النقدية",
        "L2": "النسبة السريعة",
        "L3": "النسبة الجارية",
        "ATD": "أيام دوران الأصول",
        "DTR": "أيام تحصيل الذمم المدينة",
        "TAT": "دوران إجمالي الأصول",
        "ITD": "أيام دوران المخزون",
        "DA": "نسبة الدين إلى الأصول",
        "DE": "نسبة الدين إلى حقوق الملكية",
        "FL": "الرافعة المالية",
        "ROI": "العائد على الاستثمار",
        "DIR": "نسبة الدين إلى الدخل",
        "DCR": "نسبة تغطية خدمة الدين",
        "ACR": "نسبة تغطية الأصول",
        "LP": "إنتاجية العمل",
        "BL": "نسبة الالتزامات البنكية إلى الدين",
        "LRR": "نسبة تكلفة العمل إلى الإيرادات",
        "WAR": "نسبة الأجور إلى القيمة المضافة",
    },
}


def _safe(value: Any) -> str:
    return html.escape(str(value))


def _validate_language(language: str) -> str:
    language = str(language).strip().lower()

    if language not in {"en", "ar"}:
        raise ValueError(
            "language must be 'en' or 'ar'"
        )

    return language


def _format_priority(
    value: Any,
    language: str,
) -> str:
    key = str(value).strip().lower()

    return PRIORITY_LABELS[
        language
    ].get(
        key,
        str(value),
    )


def _priority_class(
    value: Any,
) -> str:
    key = str(value).strip().lower()

    if key == "critical":
        return "priority-critical"

    if key == "high":
        return "priority-high"

    if key == "medium":
        return "priority-medium"

    return "priority-low"


def _format_year(
    value: Any,
    language: str,
) -> str:
    key = str(value).strip()

    return YEAR_LABELS[
        language
    ].get(
        key,
        key,
    )


def _format_category(
    value: Any,
    language: str,
) -> str:
    key = str(value).strip()

    return CATEGORY_LABELS[
        language
    ].get(
        key,
        key,
    )


def _format_time_horizon(
    value: Any,
    language: str,
) -> str:
    key = str(value).strip()

    return TIME_HORIZON_LABELS[
        language
    ].get(
        key,
        key,
    )


def _format_ratio(
    code: Any,
    fallback: Any,
    language: str,
) -> str:
    ratio_code = str(
        code
    ).strip()

    return RATIO_LABELS[
        language
    ].get(
        ratio_code,
        str(fallback),
    )


def _number_html(
    value: Any,
) -> str:
    if value is None:
        return "-"

    return (
        "<bdi dir='ltr' "
        "class='numeric-value'>"
        f"{_safe(value)}"
        "</bdi>"
    )


def _render_risk_factors(
    factors: list[Any],
    language: str,
) -> str:
    if not factors:
        text = (
            "لا توجد عوامل خطر تفسيرية متاحة."
            if language == "ar"
            else
            "No explanatory risk factors are available."
        )

        return (
            "<div class='empty-state'>"
            f"{text}"
            "</div>"
        )

    rows: list[str] = []

    for index, factor in enumerate(
        factors[:5],
        start=1,
    ):
        if not isinstance(
            factor,
            dict,
        ):
            continue

        code = (
            factor.get("ratio_code")
            or factor.get("code")
            or "-"
        )

        fallback_name = (
            factor.get("ratio_name")
            or factor.get("feature")
            or (
                "عامل مالي"
                if language == "ar"
                else "Financial Indicator"
            )
        )

        name = _format_ratio(
            code,
            fallback_name,
            language,
        )

        year = _format_year(
            factor.get(
                "year_offset",
                "",
            ),
            language,
        )

        category = _format_category(
            factor.get(
                "category",
                "",
            ),
            language,
        )

        value = factor.get(
            "value"
        )

        rows.append(
            "<tr>"

            f"<td class='rank-cell'>{index}</td>"

            "<td>"
            "<div class='factor-name'>"
            f"{_safe(name)}"
            "</div>"
            "<div class='factor-category'>"
            f"{_safe(category)}"
            "</div>"
            "</td>"

            "<td>"
            "<span class='code-badge'>"
            f"{_safe(code)}"
            "</span>"
            "</td>"

            f"<td>{_safe(year)}</td>"

            f"<td>{_number_html(value)}</td>"

            "</tr>"
        )

    if language == "ar":
        headings = (
            "<th>#</th>"
            "<th>المؤشر المالي</th>"
            "<th>الرمز</th>"
            "<th>السنة</th>"
            "<th>القيمة</th>"
        )
    else:
        headings = (
            "<th>#</th>"
            "<th>Financial Indicator</th>"
            "<th>Code</th>"
            "<th>Year</th>"
            "<th>Value</th>"
        )

    return (
        "<div class='table-wrapper'>"
        "<table class='risk-table'>"

        "<thead>"
        "<tr>"
        f"{headings}"
        "</tr>"
        "</thead>"

        "<tbody>"
        f"{''.join(rows)}"
        "</tbody>"

        "</table>"
        "</div>"
    )


def _render_recommendations(
    recommendations: list[
        dict[str, Any]
    ],
    language: str,
) -> str:
    if not recommendations:
        text = (
            "لا توجد توصيات وقائية."
            if language == "ar"
            else
            "No preventive recommendations were generated."
        )

        return (
            "<div class='empty-state'>"
            f"{text}"
            "</div>"
        )

    parts: list[str] = []

    for index, item in enumerate(
        recommendations,
        start=1,
    ):
        raw_priority = item.get(
            "priority",
            "Medium",
        )

        priority = _format_priority(
            raw_priority,
            language,
        )

        priority_css = _priority_class(
            raw_priority
        )

        category = _format_category(
            item.get(
                "action_category",
                "",
            ),
            language,
        )

        time_horizon = _format_time_horizon(
            item.get(
                "time_horizon",
                "-",
            ),
            language,
        )

        if language == "ar":
            title = (
                item.get("title_ar")
                or item.get("title")
                or "توصية"
            )

            description = (
                item.get("description_ar")
                or item.get("description")
                or ""
            )

            action_label = (
                "الإجراء المقترح"
            )

            priority_label = (
                "الأولوية"
            )

            category_label = (
                "الفئة"
            )

            horizon_label = (
                "الإطار الزمني"
            )

        else:
            title = (
                item.get("title_en")
                or item.get("title")
                or "Recommendation"
            )

            description = (
                item.get("description_en")
                or item.get("description")
                or ""
            )

            action_label = (
                "Recommended Action"
            )

            priority_label = (
                "Priority"
            )

            category_label = (
                "Category"
            )

            horizon_label = (
                "Time Horizon"
            )

        parts.append(
            "<article class='recommendation-card'>"

            "<div class='recommendation-top'>"

            "<div class='recommendation-number'>"
            f"{index:02d}"
            "</div>"

            "<div class='recommendation-heading'>"
            f"<h3>{_safe(title)}</h3>"
            "</div>"

            "<span class='priority-badge "
            f"{priority_css}'>"
            f"{_safe(priority)}"
            "</span>"

            "</div>"

            "<div class='recommendation-action-label'>"

            "<svg "
            "viewBox='0 0 24 24' "
            "fill='none' "
            "stroke='currentColor' "
            "stroke-width='2'>"

            "<path d='M5 12h14'/>"
            "<path d='m13 6 6 6-6 6'/>"

            "</svg>"

            f"{_safe(action_label)}"

            "</div>"

            "<p class='recommendation-description'>"
            f"{_safe(description)}"
            "</p>"

            "<div class='recommendation-meta'>"

            "<span class='meta-chip'>"
            f"<strong>{priority_label}:</strong> "
            f"{_safe(priority)}"
            "</span>"

            "<span class='meta-chip'>"
            f"<strong>{category_label}:</strong> "
            f"{_safe(category)}"
            "</span>"

            "<span class='meta-chip'>"
            f"<strong>{horizon_label}:</strong> "
            f"{_safe(time_horizon)}"
            "</span>"

            "</div>"

            "</article>"
        )

    return "".join(
        parts
    )


def _build_executive_summary(
    risk: str,
    probability: float,
    language: str,
) -> str:
    probability_text = (
        f"{probability * 100:.2f}%"
    )

    if language == "ar":
        if risk == "high":
            return (
                "تشير نتائج التحليل إلى وجود "
                "<strong>مستوى مرتفع من مخاطر الإفلاس</strong> "
                "ويتطلب الوضع اهتمامًا ماليًا عاجلًا. "
                "بلغ احتمال الإفلاس المقدر "
                f"<strong>{probability_text}</strong>. "
                "ينبغي إعطاء الأولوية لمراجعة السيولة "
                "والالتزامات والعوامل المالية الأكثر تأثيرًا."
            )

        if risk == "medium":
            return (
                "تشير نتائج التحليل إلى وجود "
                "<strong>مستوى متوسط من مخاطر الإفلاس</strong>. "
                "بلغ احتمال الإفلاس المقدر "
                f"<strong>{probability_text}</strong>. "
                "يوصى بمتابعة المؤشرات المالية عن قرب "
                "واتخاذ إجراءات وقائية مبكرة."
            )

        return (
            "تشير نتائج التحليل إلى أن الشركة تقع حاليًا ضمن "
            "<strong>مستوى منخفض من مخاطر الإفلاس</strong>. "
            "بلغ احتمال الإفلاس المقدر "
            f"<strong>{probability_text}</strong>. "
            "يوصى بالمحافظة على الانضباط المالي "
            "ومواصلة المراقبة الدورية."
        )

    if risk == "high":
        return (
            "The analysis indicates a "
            "<strong>high level of bankruptcy risk</strong> "
            "that requires immediate financial attention. "
            "The estimated bankruptcy probability is "
            f"<strong>{probability_text}</strong>. "
            "Priority should be given to liquidity, liabilities, "
            "and the most influential financial indicators."
        )

    if risk == "medium":
        return (
            "The analysis indicates a "
            "<strong>medium level of bankruptcy risk</strong>. "
            "The estimated bankruptcy probability is "
            f"<strong>{probability_text}</strong>. "
            "Financial indicators should be monitored closely "
            "and early preventive actions should be considered."
        )

    return (
        "The analysis indicates that the company currently has a "
        "<strong>low level of bankruptcy risk</strong>. "
        "The estimated bankruptcy probability is "
        f"<strong>{probability_text}</strong>. "
        "Maintaining financial discipline and regular monitoring "
        "is recommended."
    )


def _build_decision_summary(
    recommendations: list[
        dict[str, Any]
    ],
    risk: str,
    language: str,
) -> str:
    count = len(
        recommendations
    )

    if language == "ar":
        if risk == "high":
            message = (
                "ينبغي التعامل مع الحالة كأولوية مالية، "
                "والبدء فورًا بتنفيذ التوصيات ذات الأولوية "
                "الحرجة والمرتفعة قبل الانتقال إلى الإجراءات "
                "المتوسطة وطويلة المتابعة."
            )

        elif risk == "medium":
            message = (
                "ينبغي تنفيذ الإجراءات الوقائية قصيرة الأجل "
                "ومراقبة المؤشرات المالية بصورة متكررة لمنع "
                "انتقال الحالة إلى مستوى خطر أعلى."
            )

        else:
            message = (
                "ينبغي المحافظة على الممارسات المالية الحالية "
                "مع الاستمرار في المراقبة وإعادة التقييم عند "
                "توفر بيانات مالية أحدث."
            )

        return (
            f"تم توليد <strong>{count}</strong> توصية وقائية "
            "بناءً على نتيجة التنبؤ وأهم عوامل الخطر المؤثرة. "
            f"{message}"
        )

    if risk == "high":
        message = (
            "The case should be treated as a financial priority. "
            "Critical and high-priority recommendations should be "
            "addressed before medium and ongoing actions."
        )

    elif risk == "medium":
        message = (
            "Short-term preventive actions should be implemented "
            "and financial indicators reviewed frequently."
        )

    else:
        message = (
            "Current financial practices should be maintained "
            "while continuing periodic monitoring and reassessment."
        )

    return (
        f"<strong>{count}</strong> preventive recommendations "
        "were generated based on the prediction and the most "
        f"influential risk factors. {message}"
    )


def generate_report(
    company: dict[str, Any],
    prediction: dict[str, Any],
    recommendations: list[
        dict[str, Any]
    ],
    output_dir: str | Path | None = None,
    language: str = "en",
) -> dict[str, str]:

    language = _validate_language(
        language
    )

    required = {
        "bankruptcy_probability",
        "predicted_class",
        "risk_level",
    }

    missing = (
        required
        - prediction.keys()
    )

    if missing:
        raise ValueError(
            "Missing prediction fields: "
            f"{sorted(missing)}"
        )

    probability = float(
        prediction[
            "bankruptcy_probability"
        ]
    )

    if not 0 <= probability <= 1:
        raise ValueError(
            "bankruptcy_probability must "
            "be between 0 and 1"
        )

    risk = str(
        prediction[
            "risk_level"
        ]
    ).strip().lower()

    if risk not in {
        "low",
        "medium",
        "high",
    }:
        raise ValueError(
            "risk_level must be "
            "low, medium, or high"
        )

    predicted_class = int(
        prediction[
            "predicted_class"
        ]
    )

    if predicted_class not in {
        0,
        1,
    }:
        raise ValueError(
            "predicted_class must be 0 or 1"
        )

    template_path = (
        TEMPLATE_PATHS[
            language
        ]
    )

    if not template_path.exists():
        raise FileNotFoundError(
            f"Missing report template: "
            f"{template_path.name}"
        )

    template = (
        template_path.read_text(
            encoding="utf-8"
        )
    )

    report_id = (
        f"REP-{datetime.now():%Y%m%d}-"
        f"{uuid.uuid4().hex[:8].upper()}"
    )

    generated_at = (
        datetime.now().strftime(
            "%Y-%m-%d %H:%M:%S"
        )
    )

    if language == "ar":
        classification = (
            "معرض لخطر الإفلاس"
            if predicted_class == 1
            else
            "مخاطر إفلاس منخفضة"
        )

        company_default = (
            "غير محدد"
        )

    else:
        classification = (
            "At Risk of Bankruptcy"
            if predicted_class == 1
            else
            "Low Bankruptcy Risk"
        )

        company_default = (
            "Not Specified"
        )

    model_version = (
        prediction.get(
            "model_version",
            "N/A",
        )
    )

    risk_factors = list(
        prediction.get(
            "top_risk_factors",
            [],
        )
    )

    executive_summary = (
        _build_executive_summary(
            risk=risk,
            probability=probability,
            language=language,
        )
    )

    decision_summary = (
        _build_decision_summary(
            recommendations=recommendations,
            risk=risk,
            language=language,
        )
    )

    values = {
        "{{REPORT_ID}}":
            report_id,

        "{{GENERATED_AT}}":
            generated_at,

        "{{COMPANY_NAME}}":
            _safe(
                company.get(
                    "name",
                    company_default,
                )
            ),

        "{{COMPANY_ID}}":
            _safe(
                company.get(
                    "id",
                    company_default,
                )
            ),

        "{{PROBABILITY_PERCENT}}":
            f"{probability * 100:.2f}",

        "{{PROBABILITY_WIDTH}}":
            f"{probability * 100:.2f}",

        "{{RISK_CLASS}}":
            risk,

        "{{RISK_LEVEL}}":
            RISK_LABELS[
                language
            ][risk],

        "{{PREDICTED_CLASS}}":
            classification,

        "{{MODEL_VERSION}}":
            _safe(
                model_version
            ),

        "{{EXECUTIVE_SUMMARY}}":
            executive_summary,

        "{{RISK_FACTORS_HTML}}":
            _render_risk_factors(
                risk_factors,
                language,
            ),

        "{{RECOMMENDATIONS_HTML}}":
            _render_recommendations(
                recommendations,
                language,
            ),

        "{{DECISION_SUMMARY}}":
            decision_summary,
    }

    rendered = template

    for key, value in values.items():
        rendered = rendered.replace(
            key,
            value,
        )

    filename = (
        f"{report_id}-"
        f"{language}.html"
    )

    return {
        "report_id":
            report_id,

        "status":
            "generated",

        "filename":
            filename,

        "language":
            language,

        "html_content":
            rendered,
    }