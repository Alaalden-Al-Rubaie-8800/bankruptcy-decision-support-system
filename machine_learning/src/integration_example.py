"""مثال حقيقي يوضح استدعاء الـML من الـBackend باستخدام أسماء المؤشرات المالية."""

from pathlib import Path
import sys

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

from feature_adapter import technical_features_to_ratios
from ml_service import analyze_financial_ratios
from predict import FEATURES


test = pd.read_csv(ROOT / "data" / "processed" / "test.csv")
technical_features = test.iloc[0][FEATURES].to_dict()
yearly_ratios = technical_features_to_ratios(technical_features)
result = analyze_financial_ratios(yearly_ratios)

print("Prediction:")
print(result["prediction"])
print("\nExplanation:")
print(result["explanation"])
