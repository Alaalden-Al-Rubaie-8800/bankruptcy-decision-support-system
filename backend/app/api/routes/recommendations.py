"""مسارات API الخاصة بالتوصيات مع حماية JWT."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.dependencies import get_current_user
from app.database.session import get_db
from app.schemas.recommendation import RecommendationCreate, RecommendationResponse
from app.services.recommendation_service import (
    create_recommendation,
    delete_recommendation,
    get_prediction_recommendations,
    get_recommendation,
    update_recommendation,
)

router = APIRouter(
    prefix="/recommendations",
    tags=["Recommendations"],
    dependencies=[Depends(get_current_user)],
)

@router.post("/", response_model=RecommendationResponse, status_code=201)
def create(data: RecommendationCreate, db: Session = Depends(get_db)):
    return create_recommendation(db, data)

@router.get("/{recommendation_id}", response_model=RecommendationResponse)
def get_one(recommendation_id: int, db: Session = Depends(get_db)):
    recommendation = get_recommendation(db, recommendation_id)

    if not recommendation:
        raise HTTPException(status_code=404, detail="Recommendation not found")

    return recommendation

@router.get(
    "/prediction/{prediction_id}",
    response_model=list[RecommendationResponse],
)
def get_by_prediction(prediction_id: int, db: Session = Depends(get_db)):
    return get_prediction_recommendations(db, prediction_id)

@router.put("/{recommendation_id}", response_model=RecommendationResponse)
def update(
    recommendation_id: int,
    data: RecommendationCreate,
    db: Session = Depends(get_db),
):
    recommendation = get_recommendation(db, recommendation_id)

    if not recommendation:
        raise HTTPException(status_code=404, detail="Recommendation not found")

    return update_recommendation(
        db,
        recommendation,
        data.title,
        data.description,
        data.priority,
        data.action_category,
    )

@router.delete("/{recommendation_id}", status_code=204)
def delete(recommendation_id: int, db: Session = Depends(get_db)):
    recommendation = get_recommendation(db, recommendation_id)

    if not recommendation:
        raise HTTPException(status_code=404, detail="Recommendation not found")

    delete_recommendation(db, recommendation)