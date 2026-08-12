from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from services.transformation import transform_data
from services.statistics import clean_data

router = APIRouter()

class TransformRequest(BaseModel):
    data: List[float]
    method: str

class TransformResponse(BaseModel):
    transformed_data: List[float]
    lambda_value: Optional[float]
    method: str

@router.post("/transform", response_model=TransformResponse)
def transform_endpoint(req: TransformRequest):
    # Clean data similarly to the other endpoints
    cleaned = clean_data(req.data)
    
    if len(cleaned) == 0:
        raise HTTPException(status_code=400, detail="Data tidak boleh kosong.")
        
    try:
        transformed, lmbda = transform_data(cleaned, req.method)
        return TransformResponse(
            transformed_data=transformed,
            lambda_value=lmbda,
            method=req.method
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Terjadi kesalahan saat transformasi: {str(e)}")
