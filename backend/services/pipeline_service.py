"""
Pipeline Service for Automotive Sentiment and Aspect Analysis.
Coordinates Preprocessing, Aspect Extraction, Aspect Sentiment, and Overall Sentiment.
"""

import time
from typing import Dict, Any, List
from backend.utils.text_preprocessor import TextPreprocessor
from backend.services.aspect_service import AspectService
from backend.services.sentiment_service import SentimentService
from backend.models.schemas import ReviewAnalysisResponse, AspectItem


class PipelineService:
    """Master AI/NLP review analysis pipeline."""

    def __init__(self):
        self.preprocessor = TextPreprocessor()
        self.aspect_service = AspectService()
        self.sentiment_service = SentimentService()

    def analyze_review(self, review_text: str) -> Dict[str, Any]:
        """
        Processes an automotive review text and produces the full structured output.
        Handles:
        - Reviews with multiple aspects
        - Reviews with no recognized aspects
        - Confidence calibration
        """
        start_time = time.time()

        if not review_text or not review_text.strip():
            raise ValueError("Review text cannot be empty.")

        # 1. Preprocessing
        cleaned = self.preprocessor.preprocess(review_text)
        clauses = self.preprocessor.split_into_clauses(cleaned)

        # 2. Aspect Extraction
        extracted_aspects = self.aspect_service.extract_aspects(clauses, full_text=cleaned)

        # 3. Aspect-Level Sentiment Analysis
        aspect_results = []
        if extracted_aspects:
            aspect_sentiments = self.sentiment_service.predict_aspect_sentiments(extracted_aspects)
            for item in aspect_sentiments:
                aspect_results.append(
                    AspectItem(
                        aspect=item["aspect"],
                        sentiment=item["sentiment"],
                        confidence=item["confidence"],
                        category=item.get("category"),
                        context_clause=item.get("context_clause")
                    )
                )

        # 4. Overall Review Sentiment Analysis
        overall = self.sentiment_service.predict_sentiment(cleaned)
        overall_sentiment = overall["sentiment"]
        overall_confidence = overall["confidence"]

        # If aspects exist, calibrate overall polarity if conflicting
        if aspect_results:
            pos_aspects = sum(1 for a in aspect_results if a.sentiment == "positive")
            neg_aspects = sum(1 for a in aspect_results if a.sentiment == "negative")

            if overall_sentiment == "neutral":
                if pos_aspects > neg_aspects and pos_aspects >= 1:
                    overall_sentiment = "positive"
                    overall_confidence = max(overall_confidence, 0.85)
                elif neg_aspects > pos_aspects and neg_aspects >= 1:
                    overall_sentiment = "negative"
                    overall_confidence = max(overall_confidence, 0.85)

        elapsed_ms = round((time.time() - start_time) * 1000, 2)

        return {
            "overall_sentiment": overall_sentiment,
            "overall_confidence": overall_confidence,
            "aspects": [a.model_dump() for a in aspect_results],
            "original_text": review_text,
            "processing_time_ms": elapsed_ms
        }
