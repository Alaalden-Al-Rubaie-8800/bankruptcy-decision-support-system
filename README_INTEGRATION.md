# دليل التكامل النهائي للمشروع

## نظام التنبؤ المبكر بمخاطر الإفلاس ودعم القرار

يوضح هذا الملف حالة التكامل النهائية بين مكونات النظام بعد إكمال الربط والاختبارات والتعديلات الأخيرة.

---

## 1. المكونات المدمجة

تم دمج المكونات التالية داخل النظام:

- Frontend باستخدام Next.js + TypeScript + Tailwind CSS.
- Backend باستخدام FastAPI + Pydantic + SQLAlchemy.
- PostgreSQL Database.
- LangGraph Intelligent Workflow.
- Machine Learning Prediction.
- Explainable AI.
- Decision Support System.
- Rule-Based Recommendation Engine.
- Knowledge Base.
- HTML Report Generation + PostgreSQL Report Storage.
- Analysis History.
- Admin Dashboard.
- JWT Authentication and Authorization.

---

## 2. التدفق النهائي للنظام

التدفق المتكامل الحالي هو:

```text
User
  ↓
Authentication
  ↓
Company
  ↓
Financial Record
  ↓
Analysis Request
  ↓
LangGraph Intelligent Workflow
  ↓
Financial Data Validation
  ↓
Machine Learning Prediction
  ↓
Explainable AI
  ↓
Decision Support
  ↓
Rules + Knowledge Base
  ↓
Preventive Recommendations
  ↓
Report Generation
  ↓
Report Persistence in PostgreSQL
  ↓
Prediction Persistence
  ↓
Recommendation Persistence
  ↓
Analysis History
  ↓
Protected Report View / Download
```

---

## 3. LangGraph Intelligent Workflow

يستخدم المشروع LangGraph لتنظيم خطوات التحليل بترتيب واضح ومحدد.

المسار الحالي:

```text
START
  ↓
load_financial_data
  ↓
validate_financial_data
  ↓
predict_bankruptcy
  ↓
explain_prediction
  ↓
generate_recommendations
  ↓
save_analysis_results
  ↓
save_analysis_history
  ↓
END
```

إذا حدث خطأ في أي مرحلة وتم تغيير حالة Workflow إلى:

```text
failed
```

يتوقف التنفيذ ولا تستمر بقية المراحل ببيانات غير صحيحة.

> LangGraph في هذا المشروع يعمل كـIntelligent Workflow منظم لخطوات التحليل، وليس كوكيل LLM مستقل ذاتيًا.

---

## 4. Machine Learning Integration

يتوقع نموذج Machine Learning:

```text
21 Financial Ratios
×
3 Years
=
63 Ordered Features
```

أكواد المؤشرات المستخدمة:

```text
ROA
ROE
ROS
L1
L2
L3
ATD
DTR
TAT
ITD
DA
DE
FL
ROI
DIR
DCR
ACR
LP
BL
LRR
WAR
```

النموذج الحالي يعيد:

```text
Bankruptcy Probability
Predicted Class
Risk Level
Model Version
```

مستويات الخطر:

```text
Low
Medium
High
```

---

## 5. Explainable AI

طريقة Explainable AI الحالية لا تستخدم SHAP.

الطريقة المستخدمة هي:

```text
single-feature median replacement
```

حيث يتم استبدال خاصية واحدة بقيمة Median المحسوبة من بيانات التدريب ثم إعادة التنبؤ وقياس الفرق في الاحتمال.

يتم استخدام النتيجة لتحديد:

- Risk Factors.
- Protective Factors.
- أهم المؤشرات المؤثرة على التنبؤ.

ثم ترسل هذه العوامل إلى نظام دعم القرار.

---

## 6. Decision Support Integration

يستقبل نظام دعم القرار:

```text
bankruptcy_probability
risk_level
top_risk_factors
```

ثم يستخدم:

```text
Rules
+
Knowledge Base
```

لإنتاج توصيات وقائية وتصحيحية.

التدفق:

```text
ML Prediction
      ↓
XAI Risk Factors
      ↓
Decision Support
      ↓
Rules
      ↓
Knowledge Base
      ↓
Recommendations
      ↓
Report
```

---

## 7. التقارير

بعد نجاح التحليل يتم إنشاء تقرير HTML تلقائيًا، ثم يُحفظ محتوى التقرير داخل PostgreSQL في جدول `reports`.

أهم الحقول في جدول التقارير:

```text
id
report_id
prediction_id
filename
status
html_content
created_at
```

- `report_id` معرف فريد للتقرير.
- `prediction_id` مرتبط بنتيجة التنبؤ في جدول `predictions`.
- `html_content` يحتوي محتوى التقرير النهائي بصيغة HTML.
- `filename` هو الاسم الذي يستخدم عند تنزيل التقرير.
- `status` يوضح حالة إنشاء التقرير.

مثال للبيانات المرجعة إلى Frontend:

```json
{
  "report": {
    "report_id": "REP-20260814-94E2C94E",
    "status": "generated",
    "filename": "REP-20260814-94E2C94E.html",
    "view_url": "/analysis/reports/REP-20260814-94E2C94E",
    "download_url": "/analysis/reports/REP-20260814-94E2C94E/download"
  }
}
```

لا يتم إرسال `html_content` ضمن استجابة `/analysis/run`.

عند عرض التقرير أو تنزيله، يقوم Backend بقراءة محتوى HTML من جدول `reports` في PostgreSQL بعد التحقق من ملكية المستخدم.

لم يعد مجلد `generated_reports` هو مصدر التخزين الأساسي للتقارير.

---

## 8. حماية التقارير

عرض وتنزيل التقارير محميان بواسطة JWT.

يتم التحقق من ملكية التقرير باستخدام:

```text
user_id + report_id
```

داخل `analysis_history`.

بعد نجاح التحقق من الملكية، يتم جلب التقرير نفسه من جدول `reports` باستخدام `report_id`.

المسارات:

```http
GET /analysis/reports/{report_id}
GET /analysis/reports/{report_id}/download
```

إذا حاول مستخدم الوصول إلى تقرير لا يخصه، يرجع Backend:

```text
404 Not Found
```

كما يتم التحقق من صيغة Report ID لمنع استخدام مسارات غير صالحة.

---

## 9. حماية البيانات المالية

كل سجل مالي مرتبط بشركة المستخدم.

يتم التحقق من ملكية السجل قبل السماح بعرضه أو تعديله أو حذفه.

كما يتم منع تكرار السنة المالية لنفس الشركة على مستويين:

```text
Application Validation
+
Database UNIQUE(company_id, fiscal_year)
```

---

## 10. علاقة المستخدم بالشركة

قاعدة البيانات تحتوي على Unique Constraint على:

```text
companies.user_id
```

وبذلك لا يمكن ربط أكثر من شركة واحدة بنفس المستخدم عندما تكون قيمة `user_id` غير فارغة.

---

## 11. المصادقة والصلاحيات

يستخدم النظام JWT Authentication.

مدة Access Token الحالية:

```text
480 minutes = 8 hours
```

وهي متوافقة مع مدة Authentication Cookie في Frontend.

الأدوار الحالية:

```text
financial_user
admin
```

المستخدم العادي يستطيع:

- إدارة حسابه.
- إدارة شركته.
- إدارة سجلاته المالية.
- تشغيل التحليل.
- مشاهدة سجل التحليلات.
- عرض وتحميل تقاريره.

Admin يستطيع بالإضافة إلى ذلك:

- عرض المستخدمين.
- تفعيل المستخدمين.
- تعطيل المستخدمين.
- حذف المستخدمين.

Role الحالي يعرض في لوحة الإدارة لكنه لا يعدل من الواجهة الحالية.

---

## 12. Frontend Integration

المسارات الرئيسية:

```text
/login
/register
/dashboard
/company
/financial-records
/history
/account
/admin
```

الصفحات المحمية تتحقق من الجلسة عبر Backend قبل عرضها.

إذا كانت الجلسة غير صالحة أو منتهية يتم التحويل إلى:

```text
/login
```

صفحة `/admin` تتحقق كذلك من Role.

---

## 13. تشغيل Backend

من داخل مجلد:

```text
backend
```

على Windows PowerShell:

```powershell
$env:PYTHONPATH=".."
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

يعمل Backend عادة على:

```text
http://127.0.0.1:8000
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

---

## 14. تشغيل Frontend

من داخل مجلد:

```text
frontend
```

شغل:

```powershell
npm install
npm run dev
```

ثم افتح:

```text
http://localhost:3000
```

---

## 15. قاعدة البيانات وAlembic

لتطبيق Migrations:

```powershell
cd backend
alembic upgrade head
```

آخر Head تم التحقق منه:

```text
c2f6a4e9d8b1 (head)
```

---

## 16. الاختبارات الآلية

تم التحقق من Backend Tests:

```text
Authentication Tests        5
Financial Records Tests     4
Analysis Report Tests       5
Admin Users Tests           4
------------------------------
Total                      18
```

النتيجة:

```text
18 passed
```

ظهر تحذير Starlette TestClient Deprecation واحد غير مانع للتشغيل.

---

## 17. اختبار Machine Learning

تم تشغيل Smoke Test بنجاح:

```text
ML smoke test passed successfully.
```

---

## 18. اختبار Frontend Production Build

تم التحقق من:

```powershell
npm run build
```

بنجاح.

تم اجتياز:

```text
Compilation
TypeScript Verification
Production Build
```

---

## 19. الاختبار الفعلي End-to-End

تم اختبار النظام من الواجهة بشكل كامل:

```text
Login
→ Company
→ Financial Records
→ Dashboard
→ Smart Analysis
→ Machine Learning
→ Explainable AI
→ Recommendations
→ Analysis History
→ Report
→ Account
→ Admin Dashboard
```

كما تم التحقق من:

```text
View Report              ✅
Download Report          ✅
Database Report Storage  ✅
Analysis History         ✅
Admin Dashboard          ✅
```

---

## 19.1 التحقق من تخزين التقرير في PostgreSQL

تم التحقق عمليًا من إنشاء تقرير جديد وحفظه داخل قاعدة البيانات.

نتيجة التحقق:

```text
id            = 1
report_id     = REP-20260814-94E2C94E
prediction_id = 16
filename      = REP-20260814-94E2C94E.html
status        = generated
html_length   = 5161
```

كما تم التحقق من:

```text
View Report      ✅
Download Report  ✅
```

وبذلك أصبح مسار التقارير الحالي:

```text
Report Generator
→ HTML Content
→ PostgreSQL reports table
→ Protected View / Download
```

---

## 20. حالة التكامل النهائية

```text
Authentication                  ✅
User Registration               ✅
User Account                    ✅
Company Management              ✅
Financial Records CRUD          ✅
Duplicate Year Protection       ✅
Database Unique Constraints     ✅
LangGraph Intelligent Workflow  ✅
Machine Learning                ✅
Explainable AI                  ✅
Decision Support                ✅
Knowledge Base                  ✅
Recommendations                 ✅
Report Generation               ✅
Report Storage in PostgreSQL     ✅
Analysis History                ✅
Report Ownership Protection     ✅
Admin Role Protection           ✅
Admin Dashboard                 ✅
Backend Automated Tests         ✅
Frontend Production Build       ✅
Manual UI End-to-End Flow       ✅
Protected Report View/Download  ✅
```

---

## ملاحظة أخيرة

هذا الملف يمثل **حالة التكامل الحالية النهائية** للمشروع.

لم يعد هناك حاجة إلى تعليمات قديمة مثل:

```text
انسخ ZIP
استبدل ملفات Student 4
اختبر بعد النسخ
```

لأن التغييرات تم دمجها محليًا داخل المشروع واختبارها بنجاح. يتم تنفيذ Commit وPush بعد إكمال المراجعة النهائية للتوثيق.

للتوثيق التفصيلي للـAPI راجع:

```text
docs/API_CONTRACT.md
```

ولشرح المشروع بالكامل راجع:

```text
README.md
```
