
وضح لي الرسايل ليش هكذا يطلع 


نص واحد ملصق (20260821-193326).txt
مستند
هذا هوه لي طلع لي 




1f08c522-dff1-4208-9068-cc1d6675baaa.png

b97c3e56-13bc-4742-b65e-4806d4836e5d.png

a25cc7cb-5e79-4d6d-8b21-e4120bd979be.png

87326fc3-02c2-48ef-a698-6f4eed55624f.png

c5588ca4-8484-4e5c-8499-4cc74a63fa7d.png

181d942f-5c71-48d5-8235-8a6beb79c3c8.png
كذاا

d85b00fe-af3c-4978-92c5-2ab463dfefbe.png

532e07b7-1ef6-4ba8-8c9f-102d900da2fa.png

e2c0125c-1a4a-4315-b2a6-25569a49c5f2.png
منين

7cee4e35-e89f-40d0-973f-b285da274497.png

ee18dfa4-54fc-4cec-a4c9-f797c5be4d32.png

2330308e-5a4e-422e-bfb3-343f7b177cd4.png

أيوه، إذا هدفك الآن تصحيح جزء الهيكلة داخل README.md الموجود في جذر المشروع، فهذه هي المجلدات والملفات الصحيحة الموجودة فعلًا في جذر المشروع على فرع main:

bankruptcy-decision-support-system/
│
├── backend/
├── decision_support/
├── docs/
├── frontend/
├── machine_learning/
│
├── .gitignore
├── README.md
└── README_INTEGRATION.md
وهذا مؤكد من GitHub الحالي بعد الدمج إلى main.

إذا كنت تريد تعطيه هيكلة أوضح قليلًا داخل README، استخدم هذه:

bankruptcy-decision-support-system/
│
├── backend/                 # FastAPI backend, database, agent workflow
│   ├── app/
│   ├── migrations/
│   └── tests/
│
├── decision_support/        # Recommendations and report generation
│   ├── examples/
│   ├── recommendations/
│   ├── reports/
│   └── tests/
│
├── docs/                    # API and project documentation
│
├── frontend/                # Next.js frontend
│   ├── app/
│   ├── components/
│   ├── docs/
│   ├── lib/
│   └── types/
│
├── machine_learning/        # ML model, dataset, training and evaluation
│   ├── artifacts/
│   ├── data/
│   ├── results/
│   └── src/
│
├── .gitignore
├── README.md
└── README_INTEGRATION.md
والتفاصيل هنا أيضًا صحيحة: backend يحتوي app, migrations, tests، وdecision_support مستقل وفيه examples, recommendations, reports, tests.

المهم: إذا وجدت في README القديم شيئًا مثل:

backend/
└── decision_support/
فهذا غلط.

الصحيح:

backend/
decision_support/
يعني الاثنين في جذر المشروع وبنفس المستوى.

إذا ترسل لي الآن جزء Project Structure الموجود داخل README.md، أرجعه لك مصححًا كاملًا وجاهزًا للاستبدال بدون ما نغير بقية التوثيق.


انا ارسلك الملف كامل وانت شف ورسلي التعديل الكامل 

تمام، أرسل لي ملف README.md كاملًا هنا.

سأعمل لك عليه بهذا الشكل:

أراجع التوثيق كاملًا.

أحدد أي جزء في Project Structure أو أسماء المجلدات والملفات صار قديم أو غلط.

أعدّل الهيكلة لتطابق فرع main الحالي في GitHub.

أحافظ على بقية التوثيق كما هو قدر الإمكان، ولا أغيّر محتوى لا يحتاج تعديل.

أرجع لك الملف كاملًا بعد التصحيح وجاهز للنسخ والاستبدال، وليس فقط الجزء المعدل.

أرسله الآن، وأبدأ عليه مباشرة.



تم لصق markdown(7).md
الملف
هذا هوه

راجعت الملف كاملًا، وليس فقط قسم الهيكلة. كان فيه فعلًا أكثر من شيء قديم بعد الدمج الأخير إلى main، وليس الهيكل فقط. 


صححت لك أهم النقاط:

هيكل المشروع كاملًا ليطابق GitHub الحالي.

أزلت deployment/ من الهيكل لأنه لم يعد موجودًا على main.

صححت الفرع الحالي من feature/frontend-core إلى main، ووضحت أن develop فرع التطوير. الملف القديم كان لا يزال يطلب الانتقال إلى feature/frontend-core. 


أضفت دعم التقرير العربي/الإنجليزي بصياغة متوافقة مع النظام الحالي.

صححت قسم Git/GitHub بعد عمليات الدمج التي عملناها.

حذفت من Future Improvements البنود التي أصبحت مطبقة فعلًا، مثل Unique Constraints، لأن الملف القديم كان لا يزال يعتبرها مستقبلية. 


عالجت التعارض الموجود في عدد الاختبارات؛ الملف كان يذكر مرة 18 passed ومرة 17 passed. 


نظفت تنسيق Markdown أيضًا.

هذا هو الملف الكامل المعدل الجاهز ليحل محل README.md الموجود في جذر المشروع:

تحميل README المصحح كاملًا

الأفضل الآن لا ترفعه مباشرة قبل ما نعمل مراجعة نهائية سريعة للتوثيق نفسه؛ لأن الهيكل أصبح صحيحًا، لكن أقدر في الخطوة التالية أقارن كل ادعاء في README مع الكود الحالي على main وأعطيك نسخة Final موثوقة للتسليم. 


README_CORRECTED.md
مستند


المكتبة
/
README_CORRECTED.md


نظام ذكي للتنبؤ المبكر بمخاطر الإفلاس ودعم القرار
نظرة عامة على المشروع
هذا المشروع عبارة عن **نظام ذكي للتنبؤ المبكر بمخاطر الإفلاس ودعم القرار** تم تطويره كمشروع أكاديمي ضمن مقرر هندسة البرمجيات.

يهدف النظام إلى مساعدة الشركات الصناعية الصغيرة والمتوسطة على تحليل بياناتها المالية، والتنبؤ المبكر باحتمالية التعرض لمخاطر الإفلاس، وفهم العوامل المالية المؤثرة على هذا التنبؤ، ثم تقديم توصيات وقائية وتصحيحية تساعد في دعم القرار المالي.

يعتمد النظام على مجموعة من التقنيات المترابطة، أهمها:

Machine Learning

Explainable AI

LangGraph

Decision Support System

FastAPI

Next.js

PostgreSQL

ويقدم النظام كذلك وظائف متكاملة لإدارة المستخدمين، الشركات، السجلات المالية، نتائج التحليل، التقارير، وسجل التحليلات السابقة.

---

أهم خصائص النظام
يوفر النظام مجموعة من الوظائف الرئيسية، منها:

تسجيل مستخدم جديد.

تسجيل الدخول باستخدام JWT.

تشفير كلمات المرور.

إدارة حساب المستخدم.

إدارة أدوار المستخدمين.

دعم دور المستخدم العادي ودور المسؤول Admin.

إنشاء وإدارة بيانات الشركة.

إضافة السجلات المالية.

عرض السجلات المالية.

تعديل السجلات المالية.

حذف السجلات المالية.

منع تكرار السجل المالي لنفس السنة المالية.

التنبؤ باحتمالية الإفلاس باستخدام Machine Learning.

تحديد مستوى الخطر.

تفسير نتيجة التنبؤ باستخدام Explainable AI.

تحديد أهم العوامل المالية المؤثرة في النتيجة.

استخدام LangGraph لتنظيم خطوات التحليل.

استخدام نظام دعم قرار قائم على القواعد.

استخدام Knowledge Base لإنتاج التوصيات.

تقديم توصيات وقائية وتصحيحية.

إنشاء تقارير HTML تلقائيًا وحفظ محتواها داخل PostgreSQL.

دعم إنشاء التقرير باللغة الإنجليزية أو العربية حسب اختيار المستخدم، مع حفظ تقرير واحد باللغة المختارة لكل تحليل.

حماية التقارير من الوصول غير المصرح.

عرض وتحميل التقارير.

الاحتفاظ بسجل التحليلات السابقة.

توفير لوحة إدارة للمسؤول.

تمكين المسؤول من تفعيل أو تعطيل المستخدمين.

تمكين المسؤول من حذف المستخدمين.

واجهة Frontend حديثة باستخدام Next.js.

اختبارات آلية للـBackend.

التحقق من Production Build الخاص بالـFrontend.

---

معمارية النظام
يتبع المشروع معمارية Modular Architecture، بحيث يتم فصل مسؤوليات النظام إلى طبقات ومكونات مستقلة.

التدفق العام للنظام هو:


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

الطبقات الرئيسية في النظام هي:

طبقة الواجهة Frontend Layer.

طبقة Backend API.

طبقة Authentication and Authorization.

طبقة قاعدة البيانات.

طبقة Intelligent Workflow.

طبقة Machine Learning.

طبقة Explainable AI.

طبقة Decision Support.

طبقة Recommendation Engine.

طبقة Reports.

---

التقنيات المستخدمة
الواجهة الأمامية Frontend
Next.js

React

TypeScript

Tailwind CSS

الواجهة الخلفية Backend
FastAPI

Python

Pydantic

SQLAlchemy

Alembic

قاعدة البيانات
PostgreSQL

الذكاء الاصطناعي
LangGraph

Scikit-learn

Machine Learning

Explainable AI

نظام دعم القرار
Rule-Based Recommendation Engine

Knowledge Base

Preventive Recommendation Rules

Risk-Based Decision Logic

أدوات التطوير والاختبار
Pytest

Git

GitHub

VS Code

npm

Python Virtual Environment

---

هيكلة المشروع
bankruptcy-decision-support-system/
│
├── .gitignore
├── README.md
├── README_INTEGRATION.md
│
├── backend/
│   ├── .env.example
│   ├── README.md
│   ├── alembic.ini
│   ├── requirements.txt
│   │
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   │
│   │   ├── agents/
│   │   │   ├── __init__.py
│   │   │   ├── nodes.py
│   │   │   ├── state.py
│   │   │   └── workflow.py
│   │   │
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   └── routes/
│   │   │       ├── __init__.py
│   │   │       ├── analysis.py
│   │   │       ├── auth.py
│   │   │       ├── companies.py
│   │   │       ├── financial_records.py
│   │   │       ├── predictions.py
│   │   │       ├── recommendations.py
│   │   │       └── users.py
│   │   │
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── config.py
│   │   │   ├── dependencies.py
│   │   │   └── security.py
│   │   │
│   │   ├── database/
│   │   │   ├── __init__.py
│   │   │   └── session.py
│   │   │
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── analysis_history.py
│   │   │   ├── company.py
│   │   │   ├── financial_record.py
│   │   │   ├── prediction.py
│   │   │   ├── recommendation.py
│   │   │   ├── report.py
│   │   │   └── user.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── analysis_history.py
│   │   │   ├── company.py
│   │   │   ├── financial_record.py
│   │   │   ├── prediction.py
│   │   │   ├── recommendation.py
│   │   │   ├── report.py
│   │   │   └── user.py
│   │   │
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── analysis_history_service.py
│   │   │   ├── company_service.py
│   │   │   ├── financial_record_service.py
│   │   │   ├── prediction_service.py
│   │   │   ├── recommendation_service.py
│   │   │   ├── report_service.py
│   │   │   └── user_service.py
│   │   │
│   │   └── utils/
│   │       └── __init__.py
│   │
│   ├── migrations/
│   │   ├── README
│   │   ├── env.py
│   │   ├── script.py.mako
│   │   └── versions/
│   │       ├── 1f45749f42d9_add_unique_constraint_to_financial_.py
│   │       ├── 4440b8e26e34_add_unique_constraint_to_companies_user_.py
│   │       ├── 62fedf1baccb_add_report_id_to_analysis_history.py
│   │       ├── 8b0dfba33489_add_user_id_to_companies.py
│   │       ├── 9d74d01b3bf4_create_initial_database_tables.py
│   │       ├── bac533003a9f_add_role_to_users.py
│   │       ├── c2f6a4e9d8b1_add_reports_table.py
│   │       └── ddd53b9ceebb_add_analysis_history_table.py
│   │
│   └── tests/
│       ├── __init__.py
│       ├── test_admin_users.py
│       ├── test_analysis_reports.py
│       ├── test_auth.py
│       └── test_financial_records.py
│
├── decision_support/
│   ├── BACKEND_INTEGRATION.md
│   ├── README.md
│   ├── __init__.py
│   ├── decision_support_service.py
│   ├── requirements.txt
│   │
│   ├── examples/
│   │   ├── prediction_input_example.json
│   │   └── run_example.py
│   │
│   ├── recommendations/
│   │   ├── __init__.py
│   │   ├── knowledge_base.json
│   │   ├── recommendation_engine.py
│   │   └── rules.py
│   │
│   ├── reports/
│   │   ├── __init__.py
│   │   ├── generated_reports/
│   │   │   └── .gitkeep
│   │   ├── report_generator.py
│   │   ├── report_template.html
│   │   ├── report_template_ar.html
│   │   └── report_template_en.html
│   │
│   └── tests/
│       └── test_decision_support.py
│
├── docs/
│   ├── API_CONTRACT.md
│   ├── README.md
│   └── prediction_response_example.json
│
├── frontend/
│   ├── .gitignore
│   ├── README.md
│   ├── eslint.config.mjs
│   ├── next-env.d.ts
│   ├── next.config.ts
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── tsconfig.json
│   │
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── account/page.tsx
│   │   ├── admin/page.tsx
│   │   ├── company/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── financial-records/page.tsx
│   │   ├── history/page.tsx
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── api/
│   │       ├── account/me/route.ts
│   │       ├── admin/users/route.ts
│   │       ├── admin/users/[userId]/route.ts
│   │       ├── analysis/history/route.ts
│   │       ├── analysis/run/route.ts
│   │       ├── auth/login/route.ts
│   │       ├── auth/logout/route.ts
│   │       ├── auth/register/route.ts
│   │       ├── auth/session/route.ts
│   │       ├── company/me/route.ts
│   │       ├── financial-records/route.ts
│   │       ├── financial-records/[recordId]/route.ts
│   │       ├── reports/[reportId]/route.ts
│   │       └── reports/[reportId]/download/route.ts
│   │
│   ├── components/
│   │   ├── AccountForm.tsx
│   │   ├── AdminUsersTable.tsx
│   │   ├── AgentProgress.tsx
│   │   ├── AnalysisWorkspace.tsx
│   │   ├── AppShell.tsx
│   │   ├── CompanyForm.tsx
│   │   ├── FinancialRecordsWorkspace.tsx
│   │   ├── HistoryTable.tsx
│   │   ├── LoginForm.tsx
│   │   └── ResultPanel.tsx
│   │
│   ├── docs/
│   │   └── FRONTEND_INTEGRATION.md
│   │
│   ├── lib/
│   │   ├── backend.ts
│   │   ├── http.ts
│   │   └── ratios.ts
│   │
│   └── types/
│       └── analysis.ts
│
└── machine_learning/
    ├── DATA_DICTIONARY.md
    ├── DATA_SOURCE.md
    ├── README.md
    ├── README_VSCODE.md
    ├── RUN_ALL_VSCODE.bat
    ├── VALIDATION_REPORT.md
    ├── requirements-runtime.txt
    ├── requirements.txt
    ├── run_all.py
    │
    ├── artifacts/
    │   ├── README.md
    │   ├── bankruptcy_model.joblib
    │   ├── feature_definitions.json
    │   ├── feature_names.json
    │   ├── model_metadata.json
    │   ├── threshold.json
    │   └── training_medians.json
    │
    ├── data/
    │   ├── README.md
    │   ├── raw/
    │   │   └── original_dataset.csv
    │   └── processed/
    │       ├── cleaned_dataset.csv
    │       ├── test.csv
    │       ├── train.csv
    │       └── validation.csv
    │
    ├── results/
    │   ├── cleaning_report.json
    │   ├── confusion_matrix.png
    │   ├── feature_importance.csv
    │   ├── feature_importance.png
    │   ├── metrics.json
    │   ├── model_comparison.csv
    │   ├── precision_recall_curve.png
    │   ├── roc_curve.png
    │   └── test_predictions.csv
    │
    └── src/
        ├── README.md
        ├── __init__.py
        ├── data_processing.py
        ├── evaluate_model.py
        ├── explain.py
        ├── feature_adapter.py
        ├── integration_example.py
        ├── ml_service.py
        ├── predict.py
        ├── smoke_test.py
        ├── train_model.py
        └── utils/
            ├── __init__.py
            ├── model_utils.py
            └── preprocessing_utils.py
---

المتطلبات الأساسية لتشغيل المشروع
قبل تشغيل المشروع يجب تثبيت:

Python 3.12 أو إصدار متوافق.

Node.js.

npm.

PostgreSQL.

Git.

VS Code أو أي محرر أكواد مناسب.

---

تحميل المشروع من GitHub
يمكن تحميل المشروع باستخدام:


git clone https://github.com/Alaalden-Al-Rubaie-8800/bankruptcy-decision-support-system.git

ثم الدخول إلى مجلد المشروع:


cd bankruptcy-decision-support-system

النسخة المتكاملة النهائية الحالية من المشروع موجودة على الفرع الرئيسي:

main
وللحصول على أحدث نسخة:

git checkout main
git pull origin main
يستخدم فرع develop لاستمرار التطوير ودمج التعديلات قبل نقل النسخ المستقرة إلى main.

---

إعداد Backend
ادخل إلى مجلد Backend:


cd backend

أنشئ Virtual Environment:


python -m venv .venv

على Windows PowerShell قم بتفعيل البيئة:


.\\.venv\Scripts\Activate.ps1

ثم ثبت المكتبات المطلوبة:


pip install -r requirements.txt

---

إعداد ملف Environment
أنشئ ملف .env من الملف النموذجي:


Copy-Item .env.example .env

ثم عدل القيم المطلوبة داخل .env.

يجب عدم رفع ملف .env الحقيقي إلى GitHub.

ويجب الحفاظ على سرية البيانات التالية:

Database Passwords

JWT Secret Keys

API Keys

Production Credentials

---

إعداد قاعدة البيانات
يستخدم المشروع PostgreSQL كقاعدة بيانات رئيسية.

يتم التعامل مع جداول قاعدة البيانات باستخدام:

SQLAlchemy

Alembic

أهم الجداول في قاعدة البيانات:

Users

Companies

Financial Records

Predictions

Recommendations

Analysis History

Reports

لتطبيق جميع Migrations:


alembic upgrade head

---

تشغيل Backend
من داخل مجلد backend شغل:


uvicorn app.main:app --reload

يعمل الـBackend افتراضيًا على:


http://127.0.0.1:8000

Swagger API Documentation:


http://127.0.0.1:8000/docs

ReDoc Documentation:


http://127.0.0.1:8000/redoc

---

إعداد Frontend
افتح Terminal جديد ثم ادخل إلى:


cd frontend

ثبت الحزم:


npm install

ثم شغل المشروع:


npm run dev

يعمل Frontend عادة على:


http://localhost:3000

---

التحقق من Production Build
للتأكد من أن Frontend جاهز للـProduction:


npm run build

تم التحقق سابقًا من أن المشروع يمر بنجاح من عملية Production Build الخاصة بـNext.js.

---

تشغيل النظام كاملًا
التسلسل المقترح لتشغيل النظام هو:


1\. تشغيل PostgreSQL.

2\. تطبيق Alembic Migrations.

3\. تشغيل FastAPI Backend.

4\. تشغيل Next.js Frontend.

5\. تسجيل مستخدم جديد أو تسجيل الدخول.

6\. إنشاء بيانات الشركة.

7\. إضافة السجلات المالية.

8\. تشغيل تحليل مخاطر الإفلاس.

9\. مراجعة نتيجة التنبؤ.

10\. مراجعة Explainable AI Risk Factors.

11\. مراجعة توصيات Decision Support.

12\. عرض التقرير الناتج.

13\. مراجعة التحليلات السابقة من Analysis History.

---

المصادقة والصلاحيات
يستخدم النظام JWT Authentication.

بعد تسجيل الدخول بنجاح، يقوم Frontend بحفظ Access Token داخل HttpOnly Cookie.

جميع Backend Endpoints المحمية تتحقق من صحة المستخدم قبل السماح بالوصول.

يوجد نوعان رئيسيان من المستخدمين:


financial_user

admin

المستخدم العادي يستطيع:

إدارة حسابه.

إدارة شركته.

إدارة سجلاته المالية.

تشغيل التحليلات.

عرض سجل التحليلات.

الوصول إلى تقاريره.

المسؤول Admin يستطيع:

الوصول إلى لوحة الإدارة.

عرض المستخدمين.

تفعيل المستخدم.

تعطيل المستخدم.

حذف المستخدم.

الحماية الحقيقية للصلاحيات تتم داخل FastAPI Backend.

---

إدارة الشركة
يستطيع المستخدم إنشاء وإدارة بيانات شركته.

ترتبط بيانات الشركة بالمستخدم المسجل.

يتحقق Backend من ملكية الشركة قبل السماح بالوصول إلى البيانات.

تشمل وظائف الشركة:

إنشاء الشركة.

عرض بيانات الشركة.

تعديل بيانات الشركة.

---

السجلات المالية
تحتوي السجلات المالية على البيانات المستخدمة في عملية تحليل مخاطر الإفلاس.

يدعم النظام:

إضافة سجل مالي.

عرض السجلات المالية.

تعديل السجل المالي.

حذف السجل المالي.

يقوم Backend بمنع تكرار السجل المالي لنفس الشركة ونفس السنة المالية على مستوى التطبيق.

كما يتم التحقق من ملكية السجل المالي قبل السماح للمستخدم بالوصول إليه.

---

LangGraph Intelligent Workflow
يستخدم المشروع LangGraph لتنظيم خطوات التحليل الذكي.

مسار التحليل الحالي هو:


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

كل مرحلة مسؤولة عن وظيفة محددة.

إذا حدث خطأ في أي مرحلة وتم تغيير حالة Workflow إلى:


failed

فإن التحليل يتوقف ولا يستمر ببيانات غير صحيحة.

يعمل LangGraph في المشروع كمنسق بين:

Financial Data

Machine Learning

Explainable AI

Decision Support

Recommendations

Reports

Database Persistence

---

Machine Learning
يقوم قسم Machine Learning بالتنبؤ باحتمالية الإفلاس اعتمادًا على البيانات المالية.

يحتوي هذا القسم على:

Original Dataset

Cleaned Dataset

Training Dataset

Validation Dataset

Testing Dataset

Data Preprocessing

Feature Preparation

Model Training

Model Evaluation

Saved Model Artifacts

Prediction Service

Explainability Logic

يعيد المودل معلومات مثل:


Bankruptcy Probability

Predicted Class

Risk Level

Model Version

وتم دمج المودل مع Backend من خلال LangGraph Workflow.

---

ملفات Machine Learning Artifacts
الملفات الناتجة عن تدريب المودل موجودة داخل:


machine_learning/artifacts/

ومنها:


bankruptcy_model.joblib

feature_definitions.json

feature_names.json

model_metadata.json

threshold.json

training_medians.json

تسمح هذه الملفات باستخدام المودل المدرب بدون إعادة التدريب في كل مرة يتم فيها تشغيل النظام.

---

نتائج تقييم Machine Learning
نتائج تقييم المودل موجودة داخل:


machine_learning/results/

ومن أمثلتها:

Metrics

Confusion Matrix

ROC Curve

Precision-Recall Curve

Feature Importance

Model Comparison

Test Predictions

---

Explainable AI
تهدف Explainable AI إلى مساعدة المستخدم في فهم الأسباب التي أدت إلى نتيجة التنبؤ.

يقوم النظام بتحديد العوامل المالية التي تؤثر على احتمالية الإفلاس.

يستخدم النظام الحالي تحليل تأثير الخصائص Feature-Impact Analysis لمعرفة مدى تأثير كل مؤشر مالي على التنبؤ.

ويتم استخراج:

عوامل تزيد من مستوى الخطر.

عوامل تقلل من مستوى الخطر.

أهم العوامل المؤثرة على النتيجة.

ثم يتم إرسال هذه العوامل إلى Decision Support System.

يجب وصف الطريقة الحالية بأنها Feature-Impact Explainability ولا يجب وصفها بأنها SHAP إلا إذا تم تنفيذ SHAP بشكل منفصل.

---

نظام دعم القرار Decision Support System
يقوم نظام دعم القرار بتحويل نتائج Machine Learning وExplainable AI إلى توصيات عملية.

يعتمد على:


Bankruptcy Probability

Risk Level

Top Risk Factors

Rules

Knowledge Base

المسار العام هو:


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

تم فصل Decision Support System عن Machine Learning حتى تكون قواعد التوصيات مستقلة وقابلة للتعديل.

---

Knowledge Base
يوجد ملف Knowledge Base في:


decision_support/recommendations/knowledge_base.json

ويحتوي على بيانات التوصيات المستخدمة من Recommendation Engine.

---

Recommendation Engine
يقوم Recommendation Engine بتحليل:

Bankruptcy Probability

Risk Level

Top Risk Factors

ثم يطبق القواعد المناسبة.

قد تشمل التوصيات:

تحسين السيولة.

إدارة الديون.

إعداد خطة تصحيح مالي.

تحسين الكفاءة التشغيلية.

مراقبة المؤشرات المالية.

تقليل المخاطر.

إعادة التقييم الدوري.

وتحتوي التوصية على بيانات مثل:


Recommendation ID

Title

Description

Priority

Priority Rank

Action Category

Time Horizon

Risk Level

---

التقارير
بعد نجاح التحليل يقوم النظام بإنشاء تقرير HTML.

يمكن للمستخدم اختيار لغة التقرير قبل تشغيل التحليل:

English
Arabic
ويتم إنشاء تقرير واحد فقط باللغة المختارة، ثم حفظ محتواه داخل الحقل الحالي reports.html_content في PostgreSQL دون إنشاء جداول أو أعمدة إضافية خاصة باللغة.

يحتوي التقرير على معلومات مثل:

Bankruptcy Probability.

Risk Level.

Prediction Explanation.

Important Risk Factors.

Preventive Recommendations.

يتم إنشاء Report ID فريد لكل تقرير.

صيغة Report ID:


REP-YYYYMMDD-XXXXXXXX

يمكن عرض التقرير أو تحميله باستخدام Backend Endpoints محمية.

---

حماية التقارير
يتم التحقق من ملكية التقرير قبل إرساله للمستخدم.

يعتمد النظام على:


user_id

+

report_id

التدفق الأمني:


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

بالتالي لا يستطيع مستخدم الوصول إلى تقرير مستخدم آخر حتى لو كان يعرف Report ID.

يتم تطبيق نفس الحماية على:

View Report.

Download Report.

---

سجل التحليلات Analysis History
يتم حفظ التحليلات المكتملة داخل Analysis History.

قد يحتوي سجل التحليل على:


user_id

company_id

financial_record_id

prediction_id

report_id

status

created_at

يسمح ذلك للمستخدم بالرجوع إلى التحليلات السابقة والوصول إلى التقارير المرتبطة بها.

السجلات القديمة التي تم إنشاؤها قبل إضافة Report Ownership قد تحتوي على:


report_id = null

---

لوحة الإدارة Admin Dashboard
يحتوي المشروع على لوحة إدارة خاصة بالمسؤول.

توفر لوحة الإدارة:

عرض المستخدمين.

عرض Role الخاص بكل مستخدم.

عرض حالة الحساب.

تفعيل المستخدم.

تعطيل المستخدم.

حذف المستخدم.

صفحة:


/admin

تتحقق من Role المستخدم.

إذا كان المستخدم:


financial_user

يتم منعه من دخول صفحة الإدارة.

أما المستخدم:


admin

فيسمح له بالوصول.

كما يتم تطبيق صلاحيات Admin داخل Backend وليس Frontend فقط.

---

الأمان Security
يحتوي المشروع على مجموعة من آليات الحماية:

JWT Authentication.

Password Hashing.

Role-Based Authorization.

Admin Authorization.

User-Specific Company Access.

Company-Specific Financial Record Access.

Cross-User Access Protection.

Report Ownership Validation.

Report ID Validation.

HttpOnly Authentication Cookies.

Environment Variables.

استبعاد .env من Git.

Server-Side Admin Page Verification.

حتى لو حاول المستخدم تجاوز Frontend، يظل FastAPI Backend هو المسؤول الأساسي عن التحقق من الصلاحيات.

يجب عدم رفع أي معلومات حساسة مثل:

Passwords

API Keys

JWT Secrets

Database Credentials

Production Environment Files

إلى GitHub.

---

API Documentation
يوجد توثيق تفصيلي للـAPI داخل:


docs/API_CONTRACT.md

ويشمل:

Authentication.

Users.

Company.

Financial Records.

Analysis.

Analysis History.

Reports.

Admin Endpoints.

Frontend API Proxy Routes.

Security Rules.

Error Responses.

ويمكن كذلك استخدام Swagger أثناء تشغيل Backend:


http://127.0.0.1:8000/docs

---

الاختبارات Testing
الاختبارات الآلية الخاصة بالـBackend موجودة داخل:


backend/tests/

وتشمل:

Authentication Tests
تسجيل دخول صحيح.

بيانات دخول غير صحيحة.

كلمة مرور خاطئة.

حساب غير فعال.

بريد إلكتروني غير صالح.

Financial Records Tests
إنشاء سجل مالي.

منع السنة المالية المكررة.

عرض السجلات المالية.

منع الوصول إلى سجلات شركة أخرى.

Analysis Report Tests
وصول صاحب التقرير.

منع مستخدم آخر من عرض التقرير.

منع مستخدم آخر من تحميل التقرير.

التحقق من Report ID غير الصحيح.

Admin Tests
عرض المستخدمين بواسطة Admin.

منع المستخدم العادي من الوصول إلى Admin endpoints.

تعطيل المستخدم.

حذف المستخدم.

يجب اعتماد عدد الاختبارات الناجحة من آخر تشغيل فعلي لأمر Pytest قبل التسليم النهائي، لأن العدد قد يتغير عند إضافة أو تعديل Test Cases.

لتشغيل الاختبارات من داخل مجلد Backend:


$env:PYTHONPATH=".."

.\\.venv\Scripts\python.exe -m pytest tests -v

الاختبارات الحالية تركز بشكل أساسي على Backend Route Tests وUnit-Level Verification.

---

صفحات Frontend
تشمل صفحات التطبيق الرئيسية:


/

/login

/register

/dashboard

/company

/financial-records

/history

/account

/admin

الصفحات المحمية تتطلب تسجيل الدخول.

صفحة Admin تتطلب كذلك Role:


admin

---

Frontend API Proxy Routes
يستخدم Next.js مجموعة من Server-Side API Proxy Routes بين Browser وFastAPI.

منها:


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

تسمح هذه الطبقة لـNext.js بإدارة Authentication Cookies، ثم إرسال Token إلى Backend.

---

معالجة الأخطاء Error Handling
يتعامل النظام مع مجموعة من الأخطاء، مثل:

بيانات تسجيل دخول خاطئة.

حساب غير نشط.

عدم تسجيل الدخول.

عدم توفر الصلاحية.

عدم إنشاء الشركة.

عدم وجود سجلات مالية.

بيانات مالية غير صحيحة.

سنة مالية مكررة.

Report ID غير صحيح.

محاولة الوصول إلى تقرير مستخدم آخر.

فشل الاتصال بالـBackend.

فشل LangGraph Workflow.

فشل Machine Learning Analysis.

كما تقوم Frontend API Routes بتحويل بعض Backend Errors إلى رسائل مناسبة للمستخدم.

---

حالة المشروع الحالية

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

---

النتائج التي تم التحقق منها
تم تشغيل اختبارات Backend آليًا بنجاح خلال مراحل تطوير المشروع.

ولتجنب تعارض أرقام الاختبارات عند إضافة أو تعديل Test Cases، يجب اعتماد نتيجة آخر تشغيل فعلي لـPytest عند التسليم النهائي.

نتيجة Frontend Production Build التي تم التحقق منها:

Compiled successfully
TypeScript verification completed
Production build completed
---

Deployment
لا يحتوي الفرع main الحالي على مجلد deployment/ أو إعداد Production Deployment مكتمل.

في الحالة الحالية، أسلوب التشغيل الذي تم التحقق منه فعليًا يعتمد على:

PostgreSQL
FastAPI
Next.js
ويمكن تشغيل النظام محليًا، أو إتاحته للأجهزة الأخرى داخل نفس الشبكة عند تشغيل Frontend وBackend على عناوين الشبكة المناسبة.

لا يجب وصف Docker أو CI/CD أو أي Production Deployment Infrastructure بأنه مكتمل إلا بعد إضافة ملفات الإعداد المطلوبة والتحقق منها فعليًا.

---

Git وGitHub
يستخدم المشروع Git وGitHub لإدارة الإصدارات والتعاون بين أعضاء الفريق.

تم تقسيم العمل إلى Branches وCommits وPull Requests لدعم ممارسات Software Engineering.

تم دمج التعديلات المتكاملة من:

feature/frontend-core
إلى:

develop
ثم تم دمج النسخة المستقرة من:

develop
إلى:

main
الفرع main هو النسخة المتكاملة النهائية الحالية التي يجب اعتمادها في التوثيق والتسليم، بينما يستخدم develop لاستمرار التطوير قبل دمج أي تحديثات مستقبلية إلى main.

---

فريق المشروع والأدوار
تم تطوير المشروع بشكل تعاوني ضمن مقرر هندسة البرمجيات.

تشمل المسؤوليات الرئيسية:


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

يمكن إضافة أسماء الطلاب ومسؤوليات كل طالب حسب متطلبات التسليم النهائي:


الطالب الأول:

المهام: __________________________________

الطالب الثاني:

المهام: __________________________________

الطالب الثالث:

المهام: __________________________________

الطالب الرابع:

المهام: __________________________________

---

القيود والتحسينات المستقبلية
يمكن تحسين المشروع مستقبلًا من خلال:

إضافة Integration Tests إضافية.

إضافة Frontend Component Tests.

إضافة End-to-End Tests باستخدام Browser Automation.

توحيد مدة JWT مع مدة Authentication Cookie عند الحاجة.

تحسين Session Expiration Handling.

إضافة تقنيات Explainable AI إضافية مع الحفاظ على الطريقة الحالية كمرجع.

إضافة PDF Report Generation بجانب تقارير HTML.

إضافة Production Deployment Configuration.

إضافة Docker Deployment إذا كان مطلوبًا.

إضافة CI/CD.

توسيع خصائص Admin.

تحسين مراقبة الأخطاء Logging and Monitoring.

---

الهدف الأكاديمي
تم تطوير هذا النظام لأغراض تعليمية وأكاديمية ضمن مشروع هندسة البرمجيات.

تهدف نتائج التنبؤ والتفسيرات والتوصيات إلى دعم عملية اتخاذ القرار.

ولا تعتبر النتائج بديلًا عن:

الاستشارات المحاسبية.

التدقيق المالي.

الاستشارات المالية.

الاستشارات القانونية.

---

رابط المشروع
GitHub Repository:


https://github.com/Alaalden-Al-Rubaie-8800/bankruptcy-decision-support-system

---

الترخيص
المشروع حاليًا مخصص للاستخدام الأكاديمي والتعليمي.

