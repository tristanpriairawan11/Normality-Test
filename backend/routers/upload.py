from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd
import io

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")
        
    ext = file.filename.split('.')[-1].lower()
    if ext not in ['csv', 'xls', 'xlsx']:
        raise HTTPException(status_code=400, detail="Unsupported file format. Please upload CSV or Excel.")
        
    contents = await file.read()
    
    try:
        if ext == 'csv':
            # Try to read csv, handle different separators if needed
            try:
                df = pd.read_csv(io.BytesIO(contents))
            except:
                df = pd.read_csv(io.BytesIO(contents), sep=';')
        else:
            df = pd.read_excel(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error parsing file: {str(e)}")
        
    # Identify numeric columns
    numeric_cols = df.select_dtypes(include=['number']).columns.tolist()
    
    if not numeric_cols:
        raise HTTPException(status_code=400, detail="No numeric columns found in the file.")
        
    # Get top 5 rows for preview
    preview = df.head(5).fillna("").to_dict(orient="records")
    
    # We also want to send the actual data for each numeric column so the frontend doesn't need to re-upload
    # or the frontend can just keep the file and send the column data to /calculate.
    # To make it simple for the frontend, let's send the full data for numeric columns as a dictionary.
    
    # However, for very large files this might be big. We'll send it anyway to simplify frontend logic.
    # Convert numeric data, replace NaN with None
    column_data = {}
    for col in numeric_cols:
        col_list = df[col].tolist()
        # Convert NaN to None for JSON serialization
        column_data[col] = [x if pd.notna(x) else None for x in col_list]
        
    return {
        "filename": file.filename,
        "columns": df.columns.tolist(),
        "numeric_columns": numeric_cols,
        "preview": preview,
        "column_data": column_data
    }
