# نظام ذكي للتنبؤ المبكر بمخاطر الإفلاس ودعم القرار

## نظرة عامة على المشروع

هذا المشروع عبارة عن **نظام ذكي للتنبؤ المبكر بمخاطر الإفلاس ودعم القرار** تم تطويره كمشروع أكاديمي ضمن مقرر هندسة البرمجيات.

يهدف النظام إلى مساعدة الشركات الصناعية الصغيرة والمتوسطة على تحليل بياناتها المالية، والتنبؤ المبكر باحتمالية التعرض لمخاطر الإفلاس، وفهم العوامل المالية المؤثرة على هذا التنبؤ، ثم تقديم توصيات وقائية وتصحيحية تساعد في دعم القرار المالي.

يعتمد النظام على مجموعة من التقنيات المترابطة، أهمها:

- Machine Learning
- Explainable AI
- LangGraph
- Decision Support System
- FastAPI
- Next.js
- PostgreSQL

ويقدم النظام كذلك وظائف متكاملة لإدارة المستخدمين، الشركات، السجلات المالية، نتائج التحليل، التقارير، وسجل التحليلات السابقة.

---

## أهم خصائص النظام

يوفر النظام مجموعة من الوظائف الرئيسية، منها:

- تسجيل مستخدم جديد.
- تسجيل الدخول باستخدام JWT.
- تشفير كلمات المرور.
- إدارة حساب المستخدم.
- إدارة أدوار المستخدمين.
- دعم دور المستخدم العادي ودور المسؤول Admin.
- إنشاء وإدارة بيانات الشركة.
- إضافة السجلات المالية.
- عرض السجلات المالية.
- تعديل السجلات المالية.
- حذف السجلات المالية.
- منع تكرار السجل المالي لنفس السنة المالية.
- التنبؤ باحتمالية الإفلاس باستخدام Machine Learning.
- تحديد مستوى الخطر.
- تفسير نتيجة التنبؤ باستخدام Explainable AI.
- تحديد أهم العوامل المالية المؤثرة في النتيجة.
- استخدام LangGraph لتنظيم خطوات التحليل.
- استخدام نظام دعم قرار قائم على القواعد.
- استخدام Knowledge Base لإنتاج التوصيات.
- تقديم توصيات وقائية وتصحيحية.
- إنشاء تقارير HTML تلقائيًا وحفظ محتواها داخل PostgreSQL.
- حماية التقارير من الوصول غير المصرح.
- عرض وتحميل التقارير.
- الاحتفاظ بسجل التحليلات السابقة.
- توفير لوحة إدارة للمسؤول.
- تمكين المسؤول من تفعيل أو تعطيل المستخدمين.
- تمكين المسؤول من حذف المستخدمين.
- واجهة Frontend حديثة باستخدام Next.js.
- اختبارات آلية للـBackend.
- التحقق من Production Build الخاص بالـFrontend.

---

## معمارية النظام

يتبع المشروع معمارية Modular Architecture، بحيث يتم فصل مسؤوليات النظام إلى طبقات ومكونات مستقلة.

التدفق العام للنظام هو:

```text
المستخدم
   ↓
Next.js Frontend
   ↓
FastAPI Backend
   ↓
Authentication & Authorization
   ↓
إدارة الشركة
   ↓
السجلات المالية
   ↓
LangGraph Intelligent Workflow
   ↓
التحقق من البيانات المالية
   ↓
Machine Learning Prediction
   ↓
Explainable AI
   ↓
Decision Support System
   ↓
Rules + Knowledge Base
   ↓
Preventive Recommendations
   ↓
Report Generation
   ↓
Predictions + Recommendations + Analysis History
   ↓
PostgreSQL Database
```

الطبقات الرئيسية في النظام هي:

- طبقة الواجهة Frontend Layer.
- طبقة Backend API.
- طبقة Authentication and Authorization.
- طبقة قاعدة البيانات.
- طبقة Intelligent Workflow.
- طبقة Machine Learning.
- طبقة Explainable AI.
- طبقة Decision Support.
- طبقة Recommendation Engine.
- طبقة Reports.

---

## التقنيات المستخدمة

### الواجهة الأمامية Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### الواجهة الخلفية Backend

- FastAPI
- Python
- Pydantic
- SQLAlchemy
- Alembic

### قاعدة البيانات

- PostgreSQL

### الذكاء الاصطناعي

- LangGraph
- Scikit-learn
- Machine Learning
- Explainable AI

### نظام دعم القرار

- Rule-Based Recommendation Engine
- Knowledge Base
- Preventive Recommendation Rules
- Risk-Based Decision Logic

### أدوات التطوير والاختبار

- Pytest
- Git
- GitHub
- VS Code
- npm
- Python Virtual Environment

---

## هيكلة المشروع

```text
bankruptcy-decision-support-system/
│
├── backend/
│   ├── app/
│   │   ├── agents/
│   │   ├── api/
│   │   ├── core/
│   │   ├── database/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── utils/
│   │
│   ├── migrations/
│   │   └── versions/
│   │
│   ├── tests/
│   ├── requirements.txt
│   ├── alembic.ini
│   └── .env.example
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── types/
│   ├── public/
│   ├── package.json
│   └── next.config.ts
│
├── machine_learning/
│   ├── artifacts/
│   ├── data/
│   │   ├── raw/
│   │   └── processed/
│   ├── results/
│   ├── src/
│   ├── run_all.py
│   ├── requirements.txt
│   └── requirements-runtime.txt
│
├── decision_support/
│   ├── recommendations/
│   │   ├── knowledge_base.json
│   │   ├── recommendation_engine.py
│   │   └── rules.py
│   │
│   ├── reports/
│   │   ├── generated_reports/
│   │   ├── report_generator.py
│   │   └── report_template.html
│   │
│   ├── tests/
│   └── decision_support_service.py
│
├── docs/
│   ├── API_CONTRACT.md
│   └── prediction_response_example.json
│
├── deployment/
│   └── README.md
│
├── README.md
└── README_INTEGRATION.md
```

---

## المتطلبات الأساسية لتشغيل المشروع

قبل تشغيل المشروع يجب تثبيت:

- Python 3.12 أو إصدار متوافق.
- Node.js.
- npm.
- PostgreSQL.
- Git.
- VS Code أو أي محرر أكواد مناسب.

---

## تحميل المشروع من GitHub

يمكن تحميل المشروع باستخدام:

```bash
git clone https://github.com/Alaalden-Al-Rubaie-8800/bankruptcy-decision-support-system.git
```

ثم الدخول إلى مجلد المشروع:

```bash
cd bankruptcy-decision-support-system
```

النسخة المتكاملة الحالية من المشروع موجودة على الفرع:

```text
feature/frontend-core
```

للانتقال إليه:

```bash
git checkout feature/frontend-core
```

---

# إعداد Backend

ادخل إلى مجلد Backend:

```bash
cd backend
```

أنشئ Virtual Environment:

```bash
python -m venv .venv
```

على Windows PowerShell قم بتفعيل البيئة:

```powershell
.\.venv\Scripts\Activate.ps1
```

ثم ثبت المكتبات المطلوبة:

```bash
pip install -r requirements.txt
```

---

## إعداد ملف Environment

أنشئ ملف `.env` من الملف النموذجي:

```powershell
Copy-Item .env.example .env
```

ثم عدل القيم المطلوبة داخل `.env`.

يجب عدم رفع ملف `.env` الحقيقي إلى GitHub.

ويجب الحفاظ على سرية البيانات التالية:

- Database Passwords
- JWT Secret Keys
- API Keys
- Production Credentials

---

## إعداد قاعدة البيانات

يستخدم المشروع PostgreSQL كقاعدة بيانات رئيسية.

يتم التعامل مع جداول قاعدة البيانات باستخدام:

- SQLAlchemy
- Alembic

أهم الجداول في قاعدة البيانات:

- Users
- Companies
- Financial Records
- Predictions
- Recommendations
- Analysis History
- Reports

لتطبيق جميع Migrations:

```bash
alembic upgrade head
```

---

## تشغيل Backend

من داخل مجلد `backend` شغل:

```bash
uvicorn app.main:app --reload
```

يعمل الـBackend افتراضيًا على:

```text
http://127.0.0.1:8000
```

Swagger API Documentation:

```text
http://127.0.0.1:8000/docs
```

ReDoc Documentation:

```text
http://127.0.0.1:8000/redoc
```

---

# إعداد Frontend

افتح Terminal جديد ثم ادخل إلى:

```bash
cd frontend
```

ثبت الحزم:

```bash
npm install
```

ثم شغل المشروع:

```bash
npm run dev
```

يعمل Frontend عادة على:

```text
http://localhost:3000
```

---

## التحقق من Production Build

للتأكد من أن Frontend جاهز للـProduction:

```bash
npm run build
```

تم التحقق سابقًا من أن المشروع يمر بنجاح من عملية Production Build الخاصة بـNext.js.

---

# تشغيل النظام كاملًا

التسلسل المقترح لتشغيل النظام هو:

```text
1. تشغيل PostgreSQL.
2. تطبيق Alembic Migrations.
3. تشغيل FastAPI Backend.
4. تشغيل Next.js Frontend.
5. تسجيل مستخدم جديد أو تسجيل الدخول.
6. إنشاء بيانات الشركة.
7. إضافة السجلات المالية.
8. تشغيل تحليل مخاطر الإفلاس.
9. مراجعة نتيجة التنبؤ.
10. مراجعة Explainable AI Risk Factors.
11. مراجعة توصيات Decision Support.
12. عرض التقرير الناتج.
13. مراجعة التحليلات السابقة من Analysis History.
```

---

# المصادقة والصلاحيات

يستخدم النظام JWT Authentication.

بعد تسجيل الدخول بنجاح، يقوم Frontend بحفظ Access Token داخل HttpOnly Cookie.

جميع Backend Endpoints المحمية تتحقق من صحة المستخدم قبل السماح بالوصول.

يوجد نوعان رئيسيان من المستخدمين:

```text
financial_user
admin
```

المستخدم العادي يستطيع:

- إدارة حسابه.
- إدارة شركته.
- إدارة سجلاته المالية.
- تشغيل التحليلات.
- عرض سجل التحليلات.
- الوصول إلى تقاريره.

المسؤول Admin يستطيع:

- الوصول إلى لوحة الإدارة.
- عرض المستخدمين.
- تفعيل المستخدم.
- تعطيل المستخدم.
- حذف المستخدم.

الحماية الحقيقية للصلاحيات تتم داخل FastAPI Backend.

---

# إدارة الشركة

يستطيع المستخدم إنشاء وإدارة بيانات شركته.

ترتبط بيانات الشركة بالمستخدم المسجل.

يتحقق Backend من ملكية الشركة قبل السماح بالوصول إلى البيانات.

تشمل وظائف الشركة:

- إنشاء الشركة.
- عرض بيانات الشركة.
- تعديل بيانات الشركة.

---

# السجلات المالية

تحتوي السجلات المالية على البيانات المستخدمة في عملية تحليل مخاطر الإفلاس.

يدعم النظام:

- إضافة سجل مالي.
- عرض السجلات المالية.
- تعديل السجل المالي.
- حذف السجل المالي.

يقوم Backend بمنع تكرار السجل المالي لنفس الشركة ونفس السنة المالية على مستوى التطبيق.

كما يتم التحقق من ملكية السجل المالي قبل السماح للمستخدم بالوصول إليه.

---

# LangGraph Intelligent Workflow

يستخدم المشروع LangGraph لتنظيم خطوات التحليل الذكي.

مسار التحليل الحالي هو:

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

كل مرحلة مسؤولة عن وظيفة محددة.

إذا حدث خطأ في أي مرحلة وتم تغيير حالة Workflow إلى:

```text
failed
```

فإن التحليل يتوقف ولا يستمر ببيانات غير صحيحة.

يعمل LangGraph في المشروع كمنسق بين:

- Financial Data
- Machine Learning
- Explainable AI
- Decision Support
- Recommendations
- Reports
- Database Persistence

---

# Machine Learning

يقوم قسم Machine Learning بالتنبؤ باحتمالية الإفلاس اعتمادًا على البيانات المالية.

يحتوي هذا القسم على:

- Original Dataset
- Cleaned Dataset
- Training Dataset
- Validation Dataset
- Testing Dataset
- Data Preprocessing
- Feature Preparation
- Model Training
- Model Evaluation
- Saved Model Artifacts
- Prediction Service
- Explainability Logic

يعيد المودل معلومات مثل:

```text
Bankruptcy Probability
Predicted Class
Risk Level
Model Version
```

وتم دمج المودل مع Backend من خلال LangGraph Workflow.

---

## ملفات Machine Learning Artifacts

الملفات الناتجة عن تدريب المودل موجودة داخل:

```text
machine_learning/artifacts/
```

ومنها:

```text
bankruptcy_model.joblib
feature_definitions.json
feature_names.json
model_metadata.json
threshold.json
training_medians.json
```

تسمح هذه الملفات باستخدام المودل المدرب بدون إعادة التدريب في كل مرة يتم فيها تشغيل النظام.

---

## نتائج تقييم Machine Learning

نتائج تقييم المودل موجودة داخل:

```text
machine_learning/results/
```

ومن أمثلتها:

- Metrics
- Confusion Matrix
- ROC Curve
- Precision-Recall Curve
- Feature Importance
- Model Comparison
- Test Predictions

---

# Explainable AI

تهدف Explainable AI إلى مساعدة المستخدم في فهم الأسباب التي أدت إلى نتيجة التنبؤ.

يقوم النظام بتحديد العوامل المالية التي تؤثر على احتمالية الإفلاس.

يستخدم النظام الحالي تحليل تأثير الخصائص Feature-Impact Analysis لمعرفة مدى تأثير كل مؤشر مالي على التنبؤ.

ويتم استخراج:

- عوامل تزيد من مستوى الخطر.
- عوامل تقلل من مستوى الخطر.
- أهم العوامل المؤثرة على النتيجة.

ثم يتم إرسال هذه العوامل إلى Decision Support System.

يجب وصف الطريقة الحالية بأنها Feature-Impact Explainability ولا يجب وصفها بأنها SHAP إلا إذا تم تنفيذ SHAP بشكل منفصل.

---

# نظام دعم القرار Decision Support System

يقوم نظام دعم القرار بتحويل نتائج Machine Learning وExplainable AI إلى توصيات عملية.

يعتمد على:

```text
Bankruptcy Probability
Risk Level
Top Risk Factors
Rules
Knowledge Base
```

المسار العام هو:

```text
Machine Learning Prediction
        ↓
Explainable AI Risk Factors
        ↓
Decision Support System
        ↓
Rules
        ↓
Knowledge Base
        ↓
Preventive Recommendations
        ↓
Report Generation
```

تم فصل Decision Support System عن Machine Learning حتى تكون قواعد التوصيات مستقلة وقابلة للتعديل.

---

## Knowledge Base

يوجد ملف Knowledge Base في:

```text
decision_support/recommendations/knowledge_base.json
```

ويحتوي على بيانات التوصيات المستخدمة من Recommendation Engine.

---

## Recommendation Engine

يقوم Recommendation Engine بتحليل:

- Bankruptcy Probability
- Risk Level
- Top Risk Factors

ثم يطبق القواعد المناسبة.

قد تشمل التوصيات:

- تحسين السيولة.
- إدارة الديون.
- إعداد خطة تصحيح مالي.
- تحسين الكفاءة التشغيلية.
- مراقبة المؤشرات المالية.
- تقليل المخاطر.
- إعادة التقييم الدوري.

وتحتوي التوصية على بيانات مثل:

```text
Recommendation ID
Title
Description
Priority
Priority Rank
Action Category
Time Horizon
Risk Level
```

---

# التقارير

بعد نجاح التحليل يقوم النظام بإنشاء تقرير HTML.

يحتوي التقرير على معلومات مثل:

- Bankruptcy Probability.
- Risk Level.
- Prediction Explanation.
- Important Risk Factors.
- Preventive Recommendations.

يتم إنشاء Report ID فريد لكل تقرير.

صيغة Report ID:

```text
REP-YYYYMMDD-XXXXXXXX
```

يمكن عرض التقرير أو تحميله باستخدام Backend Endpoints محمية.

---

# حماية التقارير

يتم التحقق من ملكية التقرير قبل إرساله للمستخدم.

يعتمد النظام على:

```text
user_id
+
report_id
```

التدفق الأمني:

```text
Authenticated User
       ↓
Report ID
       ↓
Analysis History
       ↓
هل user_id + report_id متطابقان؟
       ↓
YES → عرض التقرير
NO  → Report Not Found
```

بالتالي لا يستطيع مستخدم الوصول إلى تقرير مستخدم آخر حتى لو كان يعرف Report ID.

يتم تطبيق نفس الحماية على:

- View Report.
- Download Report.

---

# سجل التحليلات Analysis History

يتم حفظ التحليلات المكتملة داخل Analysis History.

قد يحتوي سجل التحليل على:

```text
user_id
company_id
financial_record_id
prediction_id
report_id
status
created_at
```

يسمح ذلك للمستخدم بالرجوع إلى التحليلات السابقة والوصول إلى التقارير المرتبطة بها.

السجلات القديمة التي تم إنشاؤها قبل إضافة Report Ownership قد تحتوي على:

```text
report_id = null
```

---

# لوحة الإدارة Admin Dashboard

يحتوي المشروع على لوحة إدارة خاصة بالمسؤول.

توفر لوحة الإدارة:

- عرض المستخدمين.
- عرض Role الخاص بكل مستخدم.
- عرض حالة الحساب.
- تفعيل المستخدم.
- تعطيل المستخدم.
- حذف المستخدم.

صفحة:

```text
/admin
```

تتحقق من Role المستخدم.

إذا كان المستخدم:

```text
financial_user
```

يتم منعه من دخول صفحة الإدارة.

أما المستخدم:

```text
admin
```

فيسمح له بالوصول.

كما يتم تطبيق صلاحيات Admin داخل Backend وليس Frontend فقط.

---

# الأمان Security

يحتوي المشروع على مجموعة من آليات الحماية:

- JWT Authentication.
- Password Hashing.
- Role-Based Authorization.
- Admin Authorization.
- User-Specific Company Access.
- Company-Specific Financial Record Access.
- Cross-User Access Protection.
- Report Ownership Validation.
- Report ID Validation.
- HttpOnly Authentication Cookies.
- Environment Variables.
- استبعاد `.env` من Git.
- Server-Side Admin Page Verification.

حتى لو حاول المستخدم تجاوز Frontend، يظل FastAPI Backend هو المسؤول الأساسي عن التحقق من الصلاحيات.

يجب عدم رفع أي معلومات حساسة مثل:

- Passwords
- API Keys
- JWT Secrets
- Database Credentials
- Production Environment Files

إلى GitHub.

---

# API Documentation

يوجد توثيق تفصيلي للـAPI داخل:

```text
docs/API_CONTRACT.md
```

ويشمل:

- Authentication.
- Users.
- Company.
- Financial Records.
- Analysis.
- Analysis History.
- Reports.
- Admin Endpoints.
- Frontend API Proxy Routes.
- Security Rules.
- Error Responses.

ويمكن كذلك استخدام Swagger أثناء تشغيل Backend:

```text
http://127.0.0.1:8000/docs
```

---

# الاختبارات Testing

الاختبارات الآلية الخاصة بالـBackend موجودة داخل:

```text
backend/tests/
```

وتشمل:

## Authentication Tests

- تسجيل دخول صحيح.
- بيانات دخول غير صحيحة.
- كلمة مرور خاطئة.
- حساب غير فعال.
- بريد إلكتروني غير صالح.

## Financial Records Tests

- إنشاء سجل مالي.
- منع السنة المالية المكررة.
- عرض السجلات المالية.
- منع الوصول إلى سجلات شركة أخرى.

## Analysis Report Tests

- وصول صاحب التقرير.
- منع مستخدم آخر من عرض التقرير.
- منع مستخدم آخر من تحميل التقرير.
- التحقق من Report ID غير الصحيح.

## Admin Tests

- عرض المستخدمين بواسطة Admin.
- منع المستخدم العادي من الوصول إلى Admin endpoints.
- تعطيل المستخدم.
- حذف المستخدم.

النتيجة الحالية التي تم التحقق منها:

```text
18 passed
```

لتشغيل الاختبارات من داخل مجلد Backend:

```powershell
$env:PYTHONPATH=".."
.\.venv\Scripts\python.exe -m pytest tests -v
```

الاختبارات الحالية تركز بشكل أساسي على Backend Route Tests وUnit-Level Verification.

---

# صفحات Frontend

تشمل صفحات التطبيق الرئيسية:

```text
/
/login
/register
/dashboard
/company
/financial-records
/history
/account
/admin
```

الصفحات المحمية تتطلب تسجيل الدخول.

صفحة Admin تتطلب كذلك Role:

```text
admin
```

---

# Frontend API Proxy Routes

يستخدم Next.js مجموعة من Server-Side API Proxy Routes بين Browser وFastAPI.

منها:

```text
/api/account/me
/api/admin/users
/api/admin/users/[userId]
/api/analysis/history
/api/analysis/run
/api/auth/login
/api/auth/logout
/api/auth/register
/api/auth/session
/api/company/me
/api/financial-records
/api/financial-records/[recordId]
/api/reports/[reportId]
/api/reports/[reportId]/download
```

تسمح هذه الطبقة لـNext.js بإدارة Authentication Cookies، ثم إرسال Token إلى Backend.

---

# معالجة الأخطاء Error Handling

يتعامل النظام مع مجموعة من الأخطاء، مثل:

- بيانات تسجيل دخول خاطئة.
- حساب غير نشط.
- عدم تسجيل الدخول.
- عدم توفر الصلاحية.
- عدم إنشاء الشركة.
- عدم وجود سجلات مالية.
- بيانات مالية غير صحيحة.
- سنة مالية مكررة.
- Report ID غير صحيح.
- محاولة الوصول إلى تقرير مستخدم آخر.
- فشل الاتصال بالـBackend.
- فشل LangGraph Workflow.
- فشل Machine Learning Analysis.

كما تقوم Frontend API Routes بتحويل بعض Backend Errors إلى رسائل مناسبة للمستخدم.

---

# حالة المشروع الحالية

```text
Authentication                 مكتمل
User Registration              مكتمل
User Account Management        مكتمل
Role-Based Authorization       مكتمل
Company Management             مكتمل
Financial Records CRUD         مكتمل
Duplicate Year Protection      مكتمل
Machine Learning               مكتمل
Explainable AI                 مكتمل
LangGraph Workflow             مكتمل
Decision Support System        مكتمل
Knowledge Base                 مكتمل
Recommendations                مكتمل
Report Generation              مكتمل
Analysis History               مكتمل
Report Ownership Protection    مكتمل
Admin Role Protection          مكتمل
Admin Dashboard                مكتمل
Backend Automated Tests        مكتمل
Frontend Production Build      مكتمل
API Documentation              مكتمل
```

---

# النتائج التي تم التحقق منها

نتيجة Backend Tests:

```text
17 passed
```

نتيجة Frontend Production Build:

```text
Compiled successfully
TypeScript verification completed
Production build completed
```

---

# Deployment

يوجد مجلد:

```text
deployment/
```

مخصص للتوثيق وملفات Deployment المستقبلية.

في الحالة الحالية، التشغيل المحلي باستخدام:

```text
PostgreSQL
FastAPI
Next.js
```

هو الأسلوب الذي تم التحقق منه فعليًا.

لا يجب وصف Docker أو أي Deployment Infrastructure بأنه مكتمل إلا عند إضافة ملفات الإعداد المطلوبة والتحقق منها فعليًا.

---

# Git وGitHub

يستخدم المشروع Git وGitHub لإدارة الإصدارات والتعاون بين أعضاء الفريق.

تم تقسيم العمل إلى Branches وCommits لدعم ممارسات Software Engineering.

النسخة المتكاملة الحالية من المشروع موجودة على:

```text
feature/frontend-core
```

قبل التسليم النهائي يمكن دمج النسخة التي تمت مراجعتها إلى Final Branch المناسب حسب طريقة العمل المعتمدة لدى الفريق.

---

# فريق المشروع والأدوار

تم تطوير المشروع بشكل تعاوني ضمن مقرر هندسة البرمجيات.

تشمل المسؤوليات الرئيسية:

```text
Backend Development
Database Design
Authentication and Authorization
AI Workflow Development
Machine Learning
Explainable AI
Decision Support System
Recommendation Engine
Frontend Development
System Integration
Testing
Documentation
Version Control
```

يمكن إضافة أسماء الطلاب ومسؤوليات كل طالب حسب متطلبات التسليم النهائي:

```text
الطالب الأول:
المهام: __________________________________

الطالب الثاني:
المهام: __________________________________

الطالب الثالث:
المهام: __________________________________

الطالب الرابع:
المهام: __________________________________
```

---

# القيود والتحسينات المستقبلية

يمكن تحسين المشروع مستقبلًا من خلال:

- إضافة Unique Constraints مباشرة داخل قاعدة البيانات.
- إضافة Unique Constraint للعلاقة بين User وCompany.
- إضافة Unique Constraint على Company + Fiscal Year.
- إضافة Integration Tests إضافية.
- إضافة Frontend Component Tests.
- إضافة End-to-End Tests باستخدام Browser Automation.
- توحيد مدة JWT مع مدة Authentication Cookie.
- تحسين Session Expiration Handling.
- إضافة تقنيات Explainable AI إضافية.
- إضافة PDF Report Generation.
- إضافة Production Deployment Configuration.
- إضافة Docker Deployment إذا كان مطلوبًا.
- إضافة CI/CD.
- توسيع خصائص Admin.
- تحسين مراقبة الأخطاء Logging and Monitoring.

---

# الهدف الأكاديمي

تم تطوير هذا النظام لأغراض تعليمية وأكاديمية ضمن مشروع هندسة البرمجيات.

تهدف نتائج التنبؤ والتفسيرات والتوصيات إلى دعم عملية اتخاذ القرار.

ولا تعتبر النتائج بديلًا عن:

- الاستشارات المحاسبية.
- التدقيق المالي.
- الاستشارات المالية.
- الاستشارات القانونية.

---

# رابط المشروع

GitHub Repository:

```text
https://github.com/Alaalden-Al-Rubaie-8800/bankruptcy-decision-support-system
```

---

## الترخيص

المشروع حاليًا مخصص للاستخدام الأكاديمي والتعليمي.