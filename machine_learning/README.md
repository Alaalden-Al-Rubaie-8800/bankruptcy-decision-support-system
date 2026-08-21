# Machine Learning Module — Bankruptcy Early Warning System

هذا المجلد يحتوي على قسم Machine Learning الخاص بالتنبؤ المبكر بمخاطر الإفلاس للشركات الصناعية الصغيرة والمتوسطة.

## ما الذي أصبح جاهزًا؟

- نموذج Random Forest مدرّب ومحفوظ.
- تنظيف البيانات ومنع Data Leakage عند حساب Median.
- تقسيم زمني: Training 2013–2014، Validation 2015، Test 2016.
- Threshold مختار من Validation فقط باستخدام F2.
- Prediction حقيقي واحتمال إفلاس ومستوى خطر.
- تفسير محلي للعوامل المؤثرة.
- خريطة موثقة تربط `feature_01 ... feature_21` بأسماء المؤشرات المالية الحقيقية.
- Adapter يحول 21 مؤشرًا لثلاث سنوات إلى 63 Feature تلقائيًا.
- واجهة `ml_service.py` جاهزة ليستدعيها Backend أو AI Agent.
- Smoke Test للتأكد من أن ملفات المودل والربط تعمل معًا.

## مصدر البيانات

Dataset of financial ratios of Slovak companies — Mendeley Data V2  
DOI: `10.17632/j89csb932y.2`

المقال المرافق: Small- and medium-enterprises bankruptcy dataset  
DOI: `10.1016/j.dib.2019.104360`

المودل الحالي يستخدم بيانات قطاع Manufacturing.

## المؤشرات

كل تنبؤ يحتاج 21 مؤشرًا ماليًا لثلاث سنوات سابقة = 63 Feature.

راجع:

```text
DATA_DICTIONARY.md
artifacts/feature_definitions.json
```

## الملفات المهمة

- `src/data_processing.py`: تنظيف وتجهيز البيانات.
- `src/train_model.py`: تدريب ومقارنة النماذج.
- `src/evaluate_model.py`: تقييم النموذج النهائي.
- `src/predict.py`: التنبؤ المباشر من الـ63 Feature.
- `src/feature_adapter.py`: تحويل المؤشرات المالية المسماة إلى الـ63 Feature.
- `src/explain.py`: تفسير نتيجة التنبؤ بأسماء المؤشرات الحقيقية.
- `src/ml_service.py`: واجهة واحدة جاهزة للـBackend والـAI Agent.
- `src/integration_example.py`: مثال تكامل يعمل على صف حقيقي من Test.
- `src/smoke_test.py`: اختبار سريع شامل.
- `artifacts/`: النموذج وملفات الإعداد.
- `results/`: نتائج التقييم والرسومات.

## نتائج Test الحالية

- Precision: 0.1818
- Recall: 0.4286
- F1: 0.2553
- F2: 0.3371
- ROC-AUC: 0.9800
- PR-AUC: 0.3142
- Confusion Matrix: `[[5813, 27], [8, 6]]`

فئة الإفلاس نادرة جدًا، لذلك لا نعتمد على Accuracy وحدها.

## التشغيل الكامل

```bash
pip install -r requirements.txt
python run_all.py
```

وقت تشغيل الـBackend فقط:

```bash
pip install -r requirements-runtime.txt
```

## اختبار الجاهزية

```bash
python src/smoke_test.py
```

النتيجة الصحيحة:

```text
ML smoke test passed successfully.
```

## الربط الصحيح مع Backend / AI Agent

الـBackend لا يحتاج التعامل مع أسماء `feature_01` يدويًا.

```python
from src.ml_service import analyze_financial_ratios

result = analyze_financial_ratios({
    "t_minus_3": {
        "ROA": 1.0,
        "ROE": 2.0,
        "ROS": 1.5,
        "L1": 0.3,
        "L2": 1.0,
        "L3": 1.4,
        "ATD": 250.0,
        "DTR": 60.0,
        "TAT": 80.0,
        "ITD": 75.0,
        "DA": 0.6,
        "DE": 1.2,
        "FL": 2.0,
        "ROI": 10.0,
        "DIR": 50.0,
        "DCR": 15.0,
        "ACR": 1.3,
        "LP": 15000.0,
        "BL": 5.0,
        "LRR": 12.0,
        "WAR": 50.0
    },
    "t_minus_2": {"...": "نفس 21 مؤشرًا"},
    "t_minus_1": {"...": "نفس 21 مؤشرًا"}
})
```

في التطبيق الحقيقي يجب إرسال جميع المؤشرات الـ21 في كل سنة، وبنفس تعريف ووحدة بيانات التدريب.

## ملاحظة التكامل مع قاعدة البيانات الحالية

قاعدة البيانات الحالية في المشروع تحتوي على عدد أقل من الحقول المالية من المطلوب لحساب جميع المؤشرات الـ21. لذلك عند دمج ML مع Backend سنوسع عقد الإدخال/قاعدة البيانات أو نستقبل المؤشرات الـ21 من CSV/Excel. لا يتم اختراع قيم ناقصة أو تحويل سبعة حقول إلى 63 Feature بشكل غير صحيح.
