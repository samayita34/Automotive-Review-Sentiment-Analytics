"""
Pydantic Data Models and Schemas for Automotive Sentiment Analytics API.
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field, model_validator


class ReviewRequest(BaseModel):
    """Input payload for analyzing an automotive review."""
    review: Optional[str] = Field(None, description="Automotive customer review text to analyze")
    text: Optional[str] = Field(None, description="Alternative key for review text")

    @model_validator(mode='before')
    @classmethod
    def check_review_text(cls, data: Any) -> Any:
        if isinstance(data, dict):
            review_val = data.get('review') or data.get('text')
            if not review_val or not str(review_val).strip():
                raise ValueError("Review text cannot be empty. Please provide 'review' string.")
            data['review'] = str(review_val).strip()
        return data


class AspectItem(BaseModel):
    """Detected vehicle aspect with sentiment polarity and confidence."""
    aspect: str = Field(..., description="Detected vehicle aspect or sub-aspect entity (e.g. battery, charging time, infotainment)")
    sentiment: str = Field(..., description="Sentiment label (positive, neutral, negative)")
    confidence: float = Field(..., description="Classification confidence score between 0.0 and 1.0")
    category: Optional[str] = Field(None, description="Top-level taxonomy category (Vehicle, Engine, Battery, Mileage, Safety, Comfort, Service, Infotainment, Price)")
    context_clause: Optional[str] = Field(None, description="Targeted contextual clause in which the aspect appeared")


class ReviewAnalysisResponse(BaseModel):
    """Complete sentiment analysis output response."""
    overall_sentiment: str = Field(..., description="Overall review sentiment: positive, neutral, or negative")
    overall_confidence: float = Field(..., description="Overall sentiment confidence score")
    aspects: List[AspectItem] = Field(default_factory=list, description="List of detected aspects and aspect-level sentiments")
    original_text: Optional[str] = Field(None, description="Original input review text")
    processing_time_ms: Optional[float] = Field(None, description="Inference execution latency in milliseconds")


class HealthResponse(BaseModel):
    """Health check status response."""
    status: str
    service: str
    version: str
    model_status: str
    supported_aspects: List[str]
