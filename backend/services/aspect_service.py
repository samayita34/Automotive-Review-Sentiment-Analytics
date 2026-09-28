"""
Aspect Extraction Service for Automotive Domain.
Loads 9-aspect taxonomy and extracts clause-targeted aspect entities.
"""

import os
import json
import re
from typing import List, Dict, Any, Optional

TAXONOMY_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "aspect_taxonomy.json")


class AspectService:
    """Extracts automotive aspects from review text clauses."""

    def __init__(self):
        self.taxonomy = self._load_taxonomy()
        self.compiled_patterns = {}
        for category, data in self.taxonomy.items():
            patterns = [re.compile(p, re.IGNORECASE) for p in data.get("patterns", [])]
            keywords = sorted(data.get("keywords", []), key=len, reverse=True)
            self.compiled_patterns[category] = {
                "patterns": patterns,
                "keywords": keywords,
                "description": data.get("description", "")
            }

    def _load_taxonomy(self) -> Dict[str, Any]:
        """Loads domain taxonomy from JSON file."""
        if os.path.exists(TAXONOMY_FILE):
            try:
                with open(TAXONOMY_FILE, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                pass
        return {}

    def extract_aspects_from_clause(self, clause: str) -> List[Dict[str, Any]]:
        """Extracts aspects mentioned within a specific clause."""
        if not clause or len(clause.strip()) < 2:
            return []

        lower_clause = clause.lower()
        extracted: List[Dict[str, Any]] = []

        for category, compiled in self.compiled_patterns.items():
            matched = False

            # 1. Regex patterns (high priority)
            for pattern in compiled["patterns"]:
                match = pattern.search(clause)
                if match:
                    term = match.group(0).strip().lower()
                    extracted.append({
                        "aspect": term,
                        "category": category,
                        "context_clause": clause.strip(),
                        "confidence": 0.95
                    })
                    matched = True
                    break

            # 2. Keyword exact matches
            if not matched:
                for kw in compiled["keywords"]:
                    kw_pattern = r'\b' + re.escape(kw) + r'\b'
                    if re.search(kw_pattern, lower_clause):
                        extracted.append({
                            "aspect": kw.lower(),
                            "category": category,
                            "context_clause": clause.strip(),
                            "confidence": 0.90
                        })
                        break

        return extracted

    def extract_aspects(self, clauses: List[str], full_text: str = "") -> List[Dict[str, Any]]:
        """
        Extracts all unique aspects across clauses of a review.
        Returns empty list if no recognized automotive aspects exist.
        """
        results: List[Dict[str, Any]] = []
        seen = set()

        for clause in clauses:
            clause_aspects = self.extract_aspects_from_clause(clause)
            for item in clause_aspects:
                key = (item["aspect"], item["context_clause"].lower())
                if key not in seen:
                    seen.add(key)
                    results.append(item)

        # Fallback to full text search if clause splitter produced no items
        if not results and full_text:
            text_aspects = self.extract_aspects_from_clause(full_text)
            for item in text_aspects:
                key = (item["aspect"], item["context_clause"].lower())
                if key not in seen:
                    seen.add(key)
                    results.append(item)

        return results

    def get_supported_categories(self) -> List[str]:
        """Returns list of 9 supported automotive categories."""
        return list(self.taxonomy.keys())
