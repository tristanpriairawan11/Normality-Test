from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
from scipy import stats
from services.statistics import clean_data

router = APIRouter()

class HistogramRequest(BaseModel):
    data: List[float]
    bins: Optional[int] = None

class HistogramResponse(BaseModel):
    bin_edges: List[float]
    frequencies: List[int]
    normal_curve_x: List[float]
    normal_curve_y: List[float]

class QQPlotRequest(BaseModel):
    data: List[float]

class QQPlotResponse(BaseModel):
    theoretical_quantiles: List[float]
    sample_quantiles: List[float]
    slope: float
    intercept: float
    r_value: float

@router.post("/histogram", response_model=HistogramResponse)
def get_histogram(req: HistogramRequest):
    cleaned = clean_data(req.data)
    n = len(cleaned)
    if n < 3:
        raise HTTPException(status_code=400, detail="Minimal diperlukan 3 data.")
        
    x = np.array(cleaned)
    
    # Calculate bins
    bins_count = req.bins
    if not bins_count:
        # Sturges rule: k = ceil(1 + log2(n))
        bins_count = int(np.ceil(1 + np.log2(n)))
        
    frequencies, bin_edges = np.histogram(x, bins=bins_count)
    
    # Calculate normal curve points
    mean = np.mean(x)
    std = np.std(x, ddof=1)
    
    # Generate x points for the smooth normal curve
    x_min, x_max = min(x), max(x)
    padding = (x_max - x_min) * 0.1
    x_curve = np.linspace(x_min - padding, x_max + padding, 100)
    
    # Calculate PDF (probability density function)
    # Scale by (n * bin_width) to match histogram frequency scale
    bin_width = bin_edges[1] - bin_edges[0]
    if std == 0:
        y_curve = np.zeros_like(x_curve)
    else:
        y_curve = stats.norm.pdf(x_curve, loc=mean, scale=std) * n * bin_width
    
    return HistogramResponse(
        bin_edges=bin_edges.tolist(),
        frequencies=frequencies.tolist(),
        normal_curve_x=x_curve.tolist(),
        normal_curve_y=y_curve.tolist()
    )

@router.post("/qqplot", response_model=QQPlotResponse)
def get_qqplot(req: QQPlotRequest):
    cleaned = clean_data(req.data)
    if len(cleaned) < 3:
        raise HTTPException(status_code=400, detail="Minimal diperlukan 3 data.")
        
    x = np.array(cleaned)
    
    # Use probplot to get quantiles and line fit
    # probplot returns (osm, osr), (slope, intercept, r)
    # osm = theoretical quantiles, osr = ordered data
    (osm, osr), (slope, intercept, r) = stats.probplot(x, dist="norm")
    
    return QQPlotResponse(
        theoretical_quantiles=osm.tolist(),
        sample_quantiles=osr.tolist(),
        slope=slope,
        intercept=intercept,
        r_value=r
    )
