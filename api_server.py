import os
import requests
from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from geo_optimizer import GeoOptimizer

app = FastAPI(title="GEO Optimization API", version="1.0.0")

# Enable CORS (allow restriction in production via ALLOWED_ORIGINS env variable)
allowed_origins_raw = os.environ.get("ALLOWED_ORIGINS", "*")
cors_origins = [origin.strip() for origin in allowed_origins_raw.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    name: str
    industry: str
    description: str
    url: str
    strategy: Optional[str] = "Comprehensive"
    apiKey: Optional[str] = None

class PublishRequest(BaseModel):
    webhookUrl: str
    authToken: Optional[str] = None
    payload: Dict[str, Any]

@app.post("/api/analyze")
async def analyze_geo(request: AnalyzeRequest):
    # Determine API key: check request first, then server environment variable
    api_key = request.apiKey or os.environ.get("GEMINI_API_KEY")
    
    if not api_key:
        raise HTTPException(
            status_code=400, 
            detail="Google Gemini API Key is missing. Provide it in the request or set the GEMINI_API_KEY environment variable."
        )
    
    optimizer = GeoOptimizer(api_key=api_key)
    result = optimizer.optimize_content(
        name=request.name,
        industry=request.industry,
        description=request.description,
        url=request.url,
        strategy=request.strategy
    )
    
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
        
    return result

@app.post("/api/publish")
async def publish_assets(request: PublishRequest):
    headers = {"Content-Type": "application/json"}
    if request.authToken:
        headers["Authorization"] = f"Bearer {request.authToken}"
        
    try:
        resp = requests.post(
            request.webhookUrl, 
            json=request.payload, 
            headers=headers, 
            timeout=10
        )
        if resp.status_code in [200, 201, 202, 204]:
            return {"status": "success", "message": "Successfully published assets."}
        else:
            raise HTTPException(
                status_code=resp.status_code, 
                detail=f"Webhook server returned code: {resp.status_code}. Response: {resp.text}"
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to connect to webhook: {str(e)}")

# Mount static frontend build in production mode
frontend_dist_path = os.path.join(os.path.dirname(__file__), "frontend", "dist")
if os.path.exists(frontend_dist_path):
    # Mount assets folder
    assets_path = os.path.join(frontend_dist_path, "assets")
    if os.path.exists(assets_path):
        app.mount("/assets", StaticFiles(directory=assets_path), name="assets")
    
    # Catch-all route to serve React's index.html for scrollytelling routing
    @app.get("/{catchall:path}")
    async def serve_frontend(catchall: str):
        index_file = os.path.join(frontend_dist_path, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"message": "API Server is running. Frontend build not found."}
else:
    @app.get("/")
    async def root():
        return {"message": "GEO Optimization API Server is running. Frontend static files are not compiled yet."}

if __name__ == "__main__":
    import uvicorn
    # Read port from environment (default: 8000)
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("api_server:app", host="0.0.0.0", port=port, reload=True)
