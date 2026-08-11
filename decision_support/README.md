# Decision Support — Recommendations & Reports

قسم التوصيات والتقارير بعد تهيئته للتكامل مع Backend ونتائج Machine Learning.

## الوظائف
- استقبال `bankruptcy_probability` و`risk_level` و`predicted_class`.
- استخدام `top_risk_factors` الحقيقية القادمة من ML.
- اختيار توصيات حسب مستوى الخطر وفئة المؤشرات المؤثرة.
- إخراج توصيات متوافقة مع حقول Backend: `title`, `description`, `priority`, `action_category`.
- إنشاء تقرير HTML عربي منظم.

## المدخل المتوقع
`top_risk_factors` يمكن أن تكون قائمة Dictionaries من ML مثل:

```json
{
  "ratio_code": "L1",
  "ratio_name": "Cash Ratio",
  "category": "Liquidity",
  "year_offset": "t_minus_2",
  "value": 0.01
}
```

## التشغيل من جذر المجلد الأب

```bash
python -m decision_support.examples.run_example
```

## الاختبار

```bash
pytest decision_support/tests -q
```

## ملاحظة
التوصيات أداة دعم قرار تعليمية وليست استشارة مالية أو قانونية نهائية.

## التكامل النهائي مع AI Agent

في النسخة المدمجة، يقوم LangGraph باستدعاء `process_prediction()` بعد مرحلة التفسير مباشرة. تعاد التوصيات في حقول Backend المعتمدة، ويولد التقرير في الخادم. الواجهة تستقبل `report_id` وروابط API فقط ولا تستقبل مسار الملف المحلي.
