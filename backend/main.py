from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import upload, calculate, visualize, transform
app = FastAPI(title="Normality Test API")

# Setup CORS for the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "*"], # Adjust based on actual frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api", tags=["Upload"])
app.include_router(calculate.router, prefix="/api", tags=["Calculate"])
app.include_router(visualize.router, prefix="/api", tags=["Visualize"])
app.include_router(transform.router, prefix="/api", tags=["Transform"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Normality Test API"}
