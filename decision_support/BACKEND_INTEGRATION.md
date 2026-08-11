# Backend Integration

يستقبل هذا القسم نتيجة الـML/Agent بالشكل الحالي.

```python
from decision_support.decision_support_service import process_prediction

final_result = process_prediction(
    company={"id": company.id, "name": company.name},
    prediction={
        "bankruptcy_probability": state["bankruptcy_probability"],
        "predicted_class": state["predicted_class"],
        "risk_level": state["risk_level"],
        "model_version": state["model_version"],
        "top_risk_factors": state.get("top_risk_factors", []),
    },
)
```

التوصيات الناتجة تحتوي الحقول التي يحتاجها Backend للحفظ:

- `title`
- `description`
- `priority`
- `action_category`

والتقرير يعيد:

- `report_id`
- `status`
- `filename`
- `report_path`

يفضل أن يضيف الـBackend لاحقًا Endpoint لتحميل/عرض التقرير بدل إرسال المسار المحلي للواجهة مباشرة.
