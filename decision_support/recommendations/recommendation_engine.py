"""Generate recommendation data for the backend using rules and the knowledge base."""

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
    """
    Load the bilingual recommendation knowledge base.
    """

    return json.loads(
        KNOWLEDGE_BASE_PATH.read_text(
            encoding="utf-8"
        )
    )


def generate_recommendations(
    bankruptcy_probability: float,
    risk_level: str,
    top_risk_factors: list[Any] | None = None,
) -> list[dict[str, Any]]:
    """
    Generate preventive recommendations.

    The recommendation contains both Arabic and English text.

    The generic `title` and `description` fields use English by default
    for the current English user interface.

    Arabic and English versions remain available separately for
    bilingual report generation.
    """

    p = float(bankruptcy_probability)

    if not 0 <= p <= 1:
        raise ValueError(
            "bankruptcy_probability must be between 0 and 1"
        )

    risk = normalize_risk_level(
        risk_level
    )

    factors = list(
        top_risk_factors or []
    )[:5]

    kb = load_knowledge_base()

    ids = get_recommendation_ids(
        risk,
        p,
        factors,
    )

    output: list[
        dict[str, Any]
    ] = []

    for rec_id in ids:
        if rec_id not in kb:
            raise KeyError(
                f"Missing {rec_id} in knowledge_base.json"
            )

        source = kb[rec_id]

        priority_rank = int(
            source["priority"]
        )

        # Validate bilingual recommendation text
        required_text_fields = {
            "title_ar",
            "description_ar",
            "title_en",
            "description_en",
        }

        missing_fields = (
            required_text_fields
            - source.keys()
        )

        if missing_fields:
            raise KeyError(
                f"{rec_id} is missing bilingual fields: "
                f"{sorted(missing_fields)}"
            )

        item = {
            # Recommendation identity
            "id": rec_id,

            # Default UI text: English
            "title": source["title_en"],
            "description": source[
                "description_en"
            ],

            # English version
            "title_en": source[
                "title_en"
            ],
            "description_en": source[
                "description_en"
            ],

            # Arabic version
            "title_ar": source[
                "title_ar"
            ],
            "description_ar": source[
                "description_ar"
            ],

            # Recommendation metadata
            "priority": PRIORITY_LABELS.get(
                priority_rank,
                "Medium",
            ),
            "priority_rank": priority_rank,

            "action_category": source[
                "category"
            ],

            "time_horizon": source[
                "time_horizon"
            ],

            "risk_level": risk.title(),
        }

        if factors:
            item[
                "related_risk_factors"
            ] = factors

        output.append(
            item
        )

    output.sort(
        key=lambda item: (
            item[
                "priority_rank"
            ],
            item["id"],
        )
    )

    return output