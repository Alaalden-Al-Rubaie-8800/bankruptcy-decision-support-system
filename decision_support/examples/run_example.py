"""مثال تشغيل قسم دعم القرار."""

import json
from pathlib import Path

from decision_support.decision_support_service import process_prediction

DATA_PATH = Path(__file__).with_name("prediction_input_example.json")

data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
result = process_prediction(data["company"], data["prediction"])
print(json.dumps(result, ensure_ascii=False, indent=2))
