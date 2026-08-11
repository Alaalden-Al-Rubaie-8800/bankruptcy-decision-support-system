# Data Dictionary - Student 1 ML Module

هذا الملف يوضح معنى `feature_01 ... feature_21` الذي كان ناقصًا في النسخة الأصلية.

مصدر البيانات هو **Dataset of financial ratios of Slovak companies** (Mendeley Data, V2, DOI: 10.17632/j89csb932y.2)، والمقال المرافق DOI: `10.1016/j.dib.2019.104360`.

المودل في هذا المشروع يستخدم قطاع **Manufacturing** فقط، وكل تنبؤ يعتمد على 21 مؤشرًا ماليًا لثلاث سنوات سابقة، أي 63 قيمة.

| Feature | Code | Financial Ratio |
|---|---|---|
| feature_01 | ROA | Return on Assets |
| feature_02 | ROE | Return on Equity |
| feature_03 | ROS | Return on Sales |
| feature_04 | L1 | Cash Ratio |
| feature_05 | L2 | Quick Ratio |
| feature_06 | L3 | Current Ratio |
| feature_07 | ATD | Asset Turnover Days |
| feature_08 | DTR | Days Total Receivables Outstanding |
| feature_09 | TAT | Total Asset Turnover |
| feature_10 | ITD | Inventory Turnover Days |
| feature_11 | DA | Debt-to-Assets Ratio |
| feature_12 | DE | Debt-to-Equity Ratio |
| feature_13 | FL | Financial Leverage |
| feature_14 | ROI | Return on Investment |
| feature_15 | DIR | Debt to Income Ratio |
| feature_16 | DCR | Debt Service Coverage Ratio |
| feature_17 | ACR | Asset Coverage Ratio |
| feature_18 | LP | Labor Productivity |
| feature_19 | BL | Bank Liabilities to Debt Ratio |
| feature_20 | LRR | Labor-to-Revenue Ratio |
| feature_21 | WAR | Wages to Added Value Ratio |

تتكرر نفس الخريطة لكل سنة:

- `t_minus_3_*`: قبل سنة التقييم بثلاث سنوات.
- `t_minus_2_*`: قبل سنة التقييم بسنتين.
- `t_minus_1_*`: السنة السابقة مباشرة للتقييم.

## ملاحظة مهمة عن الوحدات

وقت الربط يجب تمرير المؤشرات بنفس تعريف ووحدة بيانات التدريب الأصلية. لا يجوز تكوين الـ63 Feature من سبعة حقول مالية عامة فقط، لأن حساب المؤشرات الـ21 يحتاج معلومات مالية إضافية. لذلك واجهة التكامل الجديدة تستقبل المؤشرات الـ21 المسماة لكل سنة وتحوّلها آليًا إلى ترتيب المودل.
