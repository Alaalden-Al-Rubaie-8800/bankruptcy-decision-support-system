"""مسارات API الخاصة بالتنبؤات مع حماية JWT."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.dependencies import get_current_user
from app.database.session import get_db
from app.schemas.prediction import PredictionCreate, PredictionResponse
from app.services.prediction_service import (
    create_prediction,
    delete_prediction,
    get_company_predictions,
    get_latest_company_prediction,
    get_prediction,
)

router = APIRouter(
    prefix="/predictions",
    tags=["Predictions"],
    dependencies=[Depends(get_current_user)],
)

@router.post("/", response_model=PredictionResponse, status_code=status.HTTP_201_CREATED)
def create(data: PredictionCreate, db: Session = Depends(get_db)):
    return create_prediction(db, data)

@router.get("/{prediction_id}", response_model=PredictionResponse)
def get_one(prediction_id: int, db: Session = Depends(get_db)):
    prediction = get_prediction(db, prediction_id)

    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")

    return prediction

@router.get("/company/{company_id}", response_model=list[PredictionResponse])
def get_by_company(company_id: int, db: Session = Depends(get_db)):
    return get_company_predictions(db, company_id)

@router.get("/company/{company_id}/latest", response_model=PredictionResponse)
def get_latest(company_id: int, db: Session = Depends(get_db)):
    prediction = get_latest_company_prediction(db, company_id)

    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")

    return prediction

@router.delete("/{prediction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(prediction_id: int, db: Session = Depends(get_db)):
    prediction = get_prediction(db, prediction_id)

    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")

    delete_prediction(db, prediction)