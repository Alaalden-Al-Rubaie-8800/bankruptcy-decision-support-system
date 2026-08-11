"""توليد توصيات جاهزة للـBackend اعتمادًا على القواعد وقاعدة المعرفة."""

import json
from pathlib import Path
from typing import Any

from .rules import get_recommendation_ids, normalize_risk_level

BASE_DIR = Path(__file__).resolve().parent
KNOWLEDGE_BASE_PATH = BASE_DIR / "knowledge_base.json"

PRIORITY_LABELS = {
    1: "Critical",
    2: "High",
    3: "Medium",
    4: "Low",
    5: "Low",
}


def load_knowledge_base() -> dict[str, dict[str, Any]]:
    return json.loads(KNOWLEDGE_BASE_PATH.read_text(encoding="utf-8"))


def generate_recommendations(
    bankruptcy_probability: float,
    risk_level: str,
    top_risk_factors: list[Any] | None = None,
) -> list[dict[str, Any]]:
    p = float(bankruptcy_probability)
    if not 0 <= p <= 1:
        raise ValueError("bankruptcy_probability must be between 0 and 1")

    risk = normalize_risk_level(risk_level)
    factors = list(top_risk_factors or [])[:5]
    kb = load_knowledge_base()
    ids = get_recommendation_ids(risk, p, factors)

    output: list[dict[str, Any]] = []

    for rec_id in ids:
        if rec_id not in kb:
            raise KeyError(f"Missing {rec_id} in knowledge_base.json")

        source = kb[rec_id]
        priority_rank = int(source["priority"])

        item = {
            "id": rec_id,
            "title": source["title_ar"],
            "description": source["description_ar"],
            "priority": PRIORITY_LABELS.get(priority_rank, "Medium"),
            "priority_rank": priority_rank,
            "action_category": source["category"],
            "time_horizon": source["time_horizon"],
            "risk_level": risk.title(),
        }

        if factors:
            item["related_risk_factors"] = factors

        output.append(item)

    output.sort(key=lambda item: (item["priority_rank"], item["id"]))
    return output
