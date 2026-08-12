import numpy as np
from scipy import stats
from typing import List, Tuple

def transform_data(data: List[float], method: str) -> Tuple[List[float], float]:
    """
    Transforms the data using the specified method.
    Returns the transformed data and the lambda value used.
    """
    arr = np.array(data)
    
    if method == "box-cox":
        if np.any(arr <= 0):
            raise ValueError("Box-Cox transformation requires all data to be strictly positive.")
        # Box-Cox transformation
        transformed, lmbda = stats.boxcox(arr)
        return transformed.tolist(), lmbda
        
    elif method == "yeo-johnson":
        # Yeo-Johnson transformation
        transformed, lmbda = stats.yeojohnson(arr)
        return transformed.tolist(), lmbda
        
    else:
        raise ValueError(f"Unknown transformation method: {method}")
