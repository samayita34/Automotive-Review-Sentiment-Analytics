"""
FastAPI Main Application for Automotive Review and Customer Sentiment Analytics.

Provides endpoints:
- POST /analyze   : Analyzes review text for overall and aspect-level sentiments
- GET /health     : Health check and service readiness status
- GET /           : Root API info
"""

import logging
from contextlib import asynccontextmanager
from typing import Dict, Any

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.models.schemas import (
    ReviewRequest,
    ReviewAnalysisResponse,
    HealthResponse
)
from backend.services.pipeline_service import PipelineService
from backend.services.aspect_service import AspectService

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("automotive_sentiment_backend")

# Pipeline singleton
pipeline: PipelineService = None
aspect_service: AspectService = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initializes ML models on application startup."""
    global pipeline, aspect_service
    logger.info("Initializing Automotive Sentiment NLP Pipeline...")
    pipeline = PipelineService()
    aspect_service = AspectService()
    logger.info("Backend services successfully initialized.")
    yield
    logger.info("Shutting down backend services.")


# Create FastAPI App
app = FastAPI(
    title="Automotive Review & Customer Sentiment Analytics API",
    description="NLP Aspect-Based Sentiment Analysis Backend for Automotive Customer Reviews",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for React Frontend (allows localhost:5173, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Root"])
def root():
    """Root info endpoint."""
    return {
        "project": "AI-Based Automotive Review and Customer Sentiment Analytics",
        "version": "1.0.0",
        "status": "online",
        "endpoints": {
            "health": "GET /health",
            "analyze": "POST /analyze",
            "docs": "GET /docs"
        }
    }


@app.get("/health", response_model=HealthResponse, tags=["Health"])
def health_check():
    """
    Health check endpoint returning service health, model status,
    and list of supported 9 automotive aspect categories.
    """
    is_ready = pipeline is not None
    supported_aspects = aspect_service.get_supported_categories() if aspect_service else [
        "Vehicle", "Engine", "Battery", "Mileage", "Safety",
        "Comfort", "Service", "Infotainment", "Price"
    ]

    return HealthResponse(
        status="healthy" if is_ready else "initializing",
        service="Automotive Sentiment Analytics Backend",
        version="1.0.0",
        model_status="ready" if is_ready else "loading",
        supported_aspects=supported_aspects
    )


@app.post("/analyze", response_model=ReviewAnalysisResponse, tags=["Sentiment Analysis"])
def analyze_review(request: ReviewRequest):
    """
    Analyzes an automotive customer review.
    
    Accepts review text, runs text preprocessing, extracts automotive aspects,
    computes aspect-level sentiment & confidence scores, and computes overall sentiment.
    
    Example payload:
    {
      "review": "The battery range is excellent, but the charging time is too long."
    }
    """
    review_text = request.review or request.text

    if not review_text or not review_text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Review text cannot be empty."
        )

    try:
        result = pipeline.analyze_review(review_text)
        return result
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err)
        )
    except Exception as e:
        logger.error(f"Error analyzing review: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal NLP pipeline error: {str(e)}"
        )


# Also support /api/analyze for backward compatibility with frontend proxy
@app.post("/api/analyze", response_model=ReviewAnalysisResponse, include_in_schema=False)
def analyze_review_proxy(request: ReviewRequest):
    return analyze_review(request)
