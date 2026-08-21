# Bankruptcy Decision Support Frontend

واجهة المستخدم الرسمية لنظام دعم القرار للتنبؤ المبكر بمخاطر الإفلاس.

## التقنية

- Next.js App Router
- TypeScript
- Tailwind CSS
- Next.js Route Handlers كطبقة BFF/Proxy
- HttpOnly Cookie لحفظ JWT بدل localStorage
- CSV/XLSX import for 21 ratios × 3 years

## التشغيل

1. تأكد أن Backend يعمل على `http://127.0.0.1:8000`.
2. انسخ `.env.local.example` إلى `.env.local`.
3. نفذ:

```bash
npm install
npm run dev
```

4. افتح `http://localhost:3000`.

## الربط الحقيقي

الواجهة لا تحتوي على نتائج Mock. المسارات المستخدمة:

- `POST /auth/login`
- `POST /analysis/run`
- `GET /analysis/history`
- `GET /analysis/reports/{report_id}`
- `GET /analysis/reports/{report_id}/download`

المتصفح يتصل بمسارات `/api/*` داخل Next.js، وهي تضيف JWT المحمي ثم تتصل بـFastAPI.

## ملف CSV/XLSX

يجب أن يحتوي على ثلاثة صفوف. يفضل وجود عمود `year` بالقيم:

- `t_minus_3`
- `t_minus_2`
- `t_minus_1`

وبقية الأعمدة هي أكواد المؤشرات الـ21: `ROA, ROE, ... WAR`.
