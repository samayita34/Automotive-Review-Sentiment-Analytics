"""
Transformer Sentiment Inference Service.
Provides 3-class sentiment prediction (positive, neutral, negative) and confidence calibration.
"""

import math
import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

STRONG_POSITIVE_TERMS = {
    "excellent", "superb", "outstanding", "fantastic", "amazing", "flawless", "loved", "love",
    "great", "smooth", "responsive", "reliable", "comfortable", "spacious", "economical",
    "premium", "quick", "powerful", "best", "brilliant", "perfect", "punchy", "intuitive",
    "peppy", "impressive", "top-notch", "delightful", "efficient", "refined", "gamechanger"
}

MODERATE_POSITIVE_TERMS = {
    "good", "nice", "decent", "fine", "adequate", "satisfactory", "pleasant", "reasonable",
    "solid", "stable", "acceptable", "easy", "clean", "sufficient", "fair"
}

STRONG_NEGATIVE_TERMS = {
    "terrible", "horrible", "awful", "worst", "unacceptable", "broken", "useless", "disaster",
    "nightmare", "faulty", "failed", "unreliable", "dangerous", "hated", "hate", "trash",
    "garbage", "pathetic", "defective", "lemon", "poor", "laggy", "cramped", "sluggish", "noisy"
}

MODERATE_NEGATIVE_TERMS = {
    "bad", "slow", "delayed", "expensive", "costly", "harsh", "stiff", "annoying", "issues",
    "problem", "problems", "disappointing", "disappointed", "glitchy", "lacking", "clunky",
    "hard", "low", "weak", "overpriced", "cheap", "rough", "rattle", "squeak", "confusing", "long"
}

NEGATION_TERMS = {"not", "no", "never", "hardly", "barely", "scarcely", "without", "rarely", "neither", "nor"}


class SentimentService:
    """Classifies sentiment using Hugging Face Transformer or calibrated neural-lexicon engine."""

    def __init__(self, model_name: str = "cardiffnlp/twitter-roberta-base-sentiment-latest"):
        self.model_name = model_name
        self.pipeline = None
        self._model_loaded = False
        self._load_transformer()

    def _load_transformer(self):
        """Initializes Hugging Face Transformer pipeline."""
        try:
            from transformers import pipeline
            logger.info(f"Loading transformer sentiment pipeline: {self.model_name}...")
            self.pipeline = pipeline(
                "sentiment-analysis",
                model=self.model_name,
                top_k=None,
                device="cpu"
            )
            self._model_loaded = True
            logger.info("Transformer model loaded successfully.")
        except Exception as e:
            logger.warning(f"Could not load Hugging Face pipeline ({e}). Using calibrated engine.")
            self._model_loaded = False

    def _map_label(self, raw_label: str) -> str:
        """Normalizes labels to lowercase 'positive', 'neutral', 'negative'."""
        label_lower = raw_label.lower()
        if "pos" in label_lower or label_lower == "label_2":
            return "positive"
        elif "neg" in label_lower or label_lower == "label_0":
            return "negative"
        return "neutral"

    def _fallback_classify(self, text: str) -> Dict[str, Any]:
        """Calibrated rule/lexicon classifier with negation modeling."""
        if not text:
            return {"sentiment": "neutral", "confidence": 0.50}

        words = [w.strip(".,!?\"'()[]") for w in text.lower().split() if w.strip()]
        pos_score = 0.0
        neg_score = 0.0

        for i, word in enumerate(words):
            window = words[max(0, i-3):i]
            is_negated = any(nw in window for nw in NEGATION_TERMS)

            multiplier = 1.0
            if i > 0 and words[i-1] in {"very", "extremely", "super", "highly", "too", "really"}:
                multiplier = 1.5

            if word in STRONG_POSITIVE_TERMS:
                if is_negated:
                    neg_score += 1.6 * multiplier
                else:
                    pos_score += 2.0 * multiplier
            elif word in MODERATE_POSITIVE_TERMS:
                if is_negated:
                    neg_score += 1.0 * multiplier
                else:
                    pos_score += 1.0 * multiplier
            elif word in STRONG_NEGATIVE_TERMS:
                if is_negated:
                    pos_score += 1.4 * multiplier
                else:
                    neg_score += 2.0 * multiplier
            elif word in MODERATE_NEGATIVE_TERMS:
                if is_negated:
                    pos_score += 0.8 * multiplier
                else:
                    neg_score += 1.0 * multiplier

        if pos_score == 0 and neg_score == 0:
            return {"sentiment": "neutral", "confidence": 0.70}

        net = pos_score - neg_score
        exp_pos = math.exp(pos_score * 0.8)
        exp_neg = math.exp(neg_score * 0.8)
        exp_neu = math.exp(0.5 / (abs(net) + 0.5))
        total = exp_pos + exp_neg + exp_neu

        p_pos = round(exp_pos / total, 2)
        p_neg = round(exp_neg / total, 2)
        p_neu = round(exp_neu / total, 2)

        if p_pos > p_neg and p_pos > p_neu:
            return {"sentiment": "positive", "confidence": p_pos}
        elif p_neg > p_pos and p_neg > p_neu:
            return {"sentiment": "negative", "confidence": p_neg}
        else:
            return {"sentiment": "neutral", "confidence": p_neu}

    def predict_sentiment(self, text: str) -> Dict[str, Any]:
        """Classifies text sentiment returning lowercase label and confidence."""
        if not text or not text.strip():
            return {"sentiment": "neutral", "confidence": 0.50}

        if self._model_loaded and self.pipeline:
            try:
                truncated = text[:512]
                res = self.pipeline(truncated)
                scores_list = res[0] if isinstance(res, list) and isinstance(res[0], list) else res

                scores_dict = {"positive": 0.0, "neutral": 0.0, "negative": 0.0}
                for item in scores_list:
                    mapped = self._map_label(item["label"])
                    scores_dict[mapped] = max(scores_dict[mapped], item["score"])

                sorted_labels = sorted(scores_dict.items(), key=lambda x: x[1], reverse=True)
                top_label, top_conf = sorted_labels[0]
                return {
                    "sentiment": top_label,
                    "confidence": round(float(top_conf), 2)
                }
            except Exception as e:
                logger.error(f"Transformer inference error ({e}). Falling back.")

        return self._fallback_classify(text)

    def predict_aspect_sentiments(self, extracted_aspects: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Calculates targeted sentiment for each extracted aspect entity."""
        results = []
        for aspect_item in extracted_aspects:
            aspect_term = aspect_item["aspect"]
            context_clause = aspect_item.get("context_clause", "")
            category = aspect_item.get("category")
            extraction_conf = aspect_item.get("confidence", 0.90)

            sent_res = self.predict_sentiment(context_clause)
            combined_conf = round(float((extraction_conf * 0.4) + (sent_res["confidence"] * 0.6)), 2)

            results.append({
                "aspect": aspect_term,
                "sentiment": sent_res["sentiment"],
                "confidence": combined_conf,
                "category": category,
                "context_clause": context_clause
            })
        return results
