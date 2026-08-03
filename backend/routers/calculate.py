from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from services.statistics import clean_data, get_recommended_method, calculate_normality

router = APIRouter()

class CalculateRequest(BaseModel):
    data: List[float]
    method: Optional[str] = None
    alpha: float = 0.05

class CalculateResponse(BaseModel):
    n: int
    method_used: str
    is_auto_selected: bool
    test_name: str
    statistic: float
    p_value: float
    alpha: float
    is_normal: bool
    decision_text: str
    conclusion_text: str

@router.post("/calculate", response_model=CalculateResponse)
def calculate(req: CalculateRequest):
    # Clean data
    cleaned = clean_data(req.data)
    n = len(cleaned)
    
    if n < 3:
        raise HTTPException(status_code=400, detail="Minimal diperlukan 3 data untuk melakukan uji normalitas.")
        
    # Determine method
    is_auto = False
    method_to_use = req.method
    
    if not method_to_use or method_to_use == "Otomatis (Disarankan)":
        method_to_use = get_recommended_method(n)
        is_auto = True
        
    try:
        stat, p, test_name = calculate_normality(cleaned, method_to_use)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
        
    is_normal = p >= req.alpha
    
    if is_normal:
        decision = "✅ Gagal menolak H0."
        conclusion = "Data berdistribusi normal."
    else:
        decision = "❌ Tolak H0."
        conclusion = "Data tidak berdistribusi normal."
        
    return CalculateResponse(
        n=n,
        method_used=method_to_use,
        is_auto_selected=is_auto,
        test_name=test_name,
        statistic=stat,
        p_value=p,
        alpha=req.alpha,
        is_normal=is_normal,
        decision_text=decision,
        conclusion_text=conclusion
    )
