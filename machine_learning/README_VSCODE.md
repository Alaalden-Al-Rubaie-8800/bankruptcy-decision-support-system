# Machine Learning - VS Code Version

## التشغيل

1. افتح مجلد `machine_learning_vscode`.
2. افتح Terminal.
3. ثبّت المكتبات:

```bash
python -m pip install -r requirements.txt
```

4. شغّل الاختبار السريع:

```bash
python src/smoke_test.py
```

5. لتشغيل التدريب والتقييم من البداية:

```bash
python run_all.py
```

## ملفات الربط مع Backend

- `src/ml_service.py`
- `src/feature_adapter.py`
- `src/predict.py`
- `src/explain.py`
- `artifacts/bankruptcy_model.joblib`
- `artifacts/threshold.json`
- `artifacts/model_metadata.json`
- `artifacts/training_medians.json`
- `artifacts/feature_definitions.json`

المودل محفوظ ومدرّب بالفعل، لذلك لا تحتاج لإعادة التدريب لمجرد تشغيل Backend.
