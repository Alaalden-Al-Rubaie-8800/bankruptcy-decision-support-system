"""تفسير محلي لنتيجة نموذج التنبؤ بمخاطر الإفلاس."""

import json

try:
    from .feature_adapter import describe_feature
    from .predict import FEATURES, MEDIANS, MODEL, prepare_input
except ImportError:
    from feature_adapter import describe_feature
    from predict import FEATURES, MEDIANS, MODEL, prepare_input


def explain_prediction(features, top_n: int = 5) -> dict:
    """تحديد أكثر المؤشرات التي رفعت أو خفضت احتمال الإفلاس."""

    if top_n < 1:
        raise ValueError("top_n must be at least 1")

    data = prepare_input(features)
    base_probability = float(MODEL.predict_proba(data)[0, 1])
    contributions = []

    for feature in FEATURES:
        changed = data.copy()
        changed.loc[0, feature] = MEDIANS[feature]
        new_probability = float(MODEL.predict_proba(changed)[0, 1])
        delta = base_probability - new_probability
        description = describe_feature(feature)

        contributions.append({
            **description,
            "value": float(data.loc[0, feature]),
            "median_reference": float(MEDIANS[feature]),
            "probability_delta": float(delta),
        })

    risk_factors = sorted(
        [item for item in contributions if item["probability_delta"] > 0],
        key=lambda item: item["probability_delta"],
        reverse=True,
    )[:top_n]

    protective_factors = sorted(
        [item for item in contributions if item["probability_delta"] < 0],
        key=lambda item: item["probability_delta"],
    )[:top_n]

    return {
        "base_probability": base_probability,
        "method": "single-feature median replacement",
        "top_risk_factors": risk_factors,
        "protective_factors": protective_factors,
    }


if __name__ == "__main__":
    sample = {name: MEDIANS[name] for name in FEATURES}
    print(json.dumps(explain_prediction(sample), ensure_ascii=False, indent=2))
