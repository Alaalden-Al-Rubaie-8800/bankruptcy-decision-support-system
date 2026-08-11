# ML Module Validation Report

## Status
Ready as an independent Machine Learning / XAI module and ready to be connected to the AI Agent through `src/ml_service.py`.

## Verified
- Model artifact loads successfully.
- Exactly 63 features are required (21 ratios × 3 prior years).
- Missing features are rejected instead of silently filling a complete missing request.
- Prediction returns probability, class, risk level, threshold, model version, and model name.
- Explanation returns human-readable ratio names and time offsets.
- Named-ratio input converts deterministically to the exact technical feature order expected by the trained model.
- Smoke test passes.
- Integration example passes.
- Python compilation passes.

## Model test metrics from the supplied evaluation artifacts
- ROC-AUC: 0.979978
- PR-AUC: 0.314216
- Precision: 0.181818
- Recall: 0.428571
- F1: 0.255319
- F2: 0.337079
- Test positives: 14 of 5,854 rows

## Important integration boundary
The trained model expects 21 named financial ratios for each of three previous years. The current Backend financial-record schema contains only seven generic accounting fields, so those seven fields are not sufficient to reconstruct all 21 ratios safely. The correct integration is to expand the Backend input/schema to capture the required ratios (or the raw statement fields needed to calculate them) rather than inventing values.

This is a Backend integration task, not a missing component in the corrected ML module.
