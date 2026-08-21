"""تحويل المؤشرات المالية المسماة إلى ترتيب الـ63 Feature الذي يستخدمه المودل."""

from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
DEFINITIONS_PATH = ROOT / "artifacts" / "feature_definitions.json"

with DEFINITIONS_PATH.open("r", encoding="utf-8") as f:
    DEFINITIONS = json.load(f)

RATIO_DEFINITIONS = DEFINITIONS["feature_order"]
RATIO_CODES = [item["code"] for item in RATIO_DEFINITIONS]
RATIO_BY_INDEX = {item["index"]: item for item in RATIO_DEFINITIONS}
RATIO_BY_CODE = {item["code"]: item for item in RATIO_DEFINITIONS}
YEAR_KEYS = ("t_minus_3", "t_minus_2", "t_minus_1")


def build_model_features(yearly_ratios: dict) -> dict[str, float | None]:
    """تحويل 21 مؤشرًا لثلاث سنوات إلى أسماء Features التقنية المطلوبة للمودل."""

    if not isinstance(yearly_ratios, dict):
        raise TypeError("yearly_ratios must be a dictionary")

    missing_years = [year for year in YEAR_KEYS if year not in yearly_ratios]
    if missing_years:
        raise ValueError(
            "Missing required years: " + ", ".join(missing_years)
        )

    features = {}

    for year in YEAR_KEYS:
        ratios = yearly_ratios[year]

        if not isinstance(ratios, dict):
            raise TypeError(f"{year} must contain a dictionary of financial ratios")

        missing_ratios = [code for code in RATIO_CODES if code not in ratios]
        if missing_ratios:
            raise ValueError(
                f"{year} is missing {len(missing_ratios)} ratios. "
                f"First missing: {', '.join(missing_ratios[:5])}"
            )

        for index, code in enumerate(RATIO_CODES, start=1):
            features[f"{year}_feature_{index:02d}"] = ratios[code]

    return features


def technical_features_to_ratios(features: dict) -> dict[str, dict[str, float | None]]:
    """تحويل الـ63 Feature التقنية إلى أسماء المؤشرات المالية المقروءة."""

    if not isinstance(features, dict):
        raise TypeError("features must be a dictionary")

    result = {}

    for year in YEAR_KEYS:
        ratios = {}

        for index, code in enumerate(RATIO_CODES, start=1):
            feature = f"{year}_feature_{index:02d}"
            if feature not in features:
                raise ValueError(f"Missing required feature: {feature}")
            ratios[code] = features[feature]

        result[year] = ratios

    return result


def describe_feature(feature_name: str) -> dict:
    """إرجاع الاسم المالي الحقيقي المقابل لأي Feature تقني."""

    for year in YEAR_KEYS:
        prefix = f"{year}_feature_"
        if feature_name.startswith(prefix):
            try:
                index = int(feature_name.removeprefix(prefix))
            except ValueError as exc:
                raise ValueError(f"Invalid feature name: {feature_name}") from exc

            definition = RATIO_BY_INDEX.get(index)
            if not definition:
                raise ValueError(f"Invalid feature index: {index}")

            return {
                "feature": feature_name,
                "year_offset": year,
                "ratio_code": definition["code"],
                "ratio_name": definition["name"],
                "category": definition["category"],
            }

    raise ValueError(f"Invalid feature name: {feature_name}")
