"""
Text Preprocessor and Clause Splitter Utility for Automotive Reviews.
Handles contraction expansion, text normalization, sentence tokenization,
and contrastive clause segmentation.
"""

import re
from typing import List, Dict, Any

# Common English contractions dictionary
CONTRACTIONS = {
    "ain't": "am not", "aren't": "are not", "can't": "cannot", "can't've": "cannot have",
    "'cause": "because", "could've": "could have", "couldn't": "could not", "didn't": "did not",
    "doesn't": "does not", "don't": "do not", "hadn't": "had not", "hasn't": "has not",
    "haven't": "have not", "he'd": "he would", "he'll": "he will", "he's": "he is",
    "how'd": "how did", "how'll": "how will", "how's": "how is", "i'd": "i would",
    "i'll": "i will", "i'm": "i am", "i've": "i have", "isn't": "is not",
    "it'd": "it would", "it'll": "it will", "it's": "it is", "let's": "let us",
    "mightn't": "might not", "mustn't": "must not", "shan't": "shall not", "she'd": "she would",
    "she'll": "she will", "she's": "she is", "should've": "should have", "shouldn't": "should not",
    "that's": "that is", "there's": "there is", "they'd": "they would", "they'll": "they will",
    "they're": "they are", "they've": "they have", "wasn't": "was not", "we'd": "we would",
    "we'll": "we will", "we're": "we are", "we've": "we have", "weren't": "were not",
    "what'll": "what will", "what're": "what are", "what's": "what is", "what've": "what have",
    "where's": "where is", "who'd": "who would", "who'll": "who will", "who's": "who is",
    "won't": "will not", "wouldn't": "would not", "you'd": "you would", "you'll": "you will",
    "you're": "you are", "you've": "you have"
}

CONTRACTION_RE = re.compile(r'\b(' + '|'.join(re.escape(k) for k in CONTRACTIONS.keys()) + r')\b', re.IGNORECASE)

# Conjunctions that isolate contrasting or distinct aspect clauses
SPLIT_CONJUNCTIONS = [
    r'\bbut\b', r'\bhowever\b', r'\balthough\b', r'\bthough\b',
    r'\bwhile\b', r'\byet\b', r'\bwhereas\b', r'\bon the other hand\b',
    r'\bnevertheless\b', r'\bin contrast\b', r'\bdespite\b',
    r'\band\b', r';'
]
CONJUNCTION_SPLIT_PATTERN = re.compile(r'(?:' + '|'.join(SPLIT_CONJUNCTIONS) + r')', re.IGNORECASE)


class TextPreprocessor:
    """Preprocesses raw review text for ABSA analysis."""

    def expand_contractions(self, text: str) -> str:
        """Expands common English contractions."""
        def replace(match):
            word = match.group(0)
            expanded = CONTRACTIONS.get(word.lower(), word)
            if word.isupper():
                return expanded.upper()
            if word[0].isupper():
                return expanded.capitalize()
            return expanded
        return CONTRACTION_RE.sub(replace, text)

    def clean_text(self, text: str) -> str:
        """Removes noise, URLs, and normalizes whitespaces."""
        if not text:
            return ""
        text = re.sub(r'http\S+|www\.\S+', '', text)
        text = re.sub(r'\s+', ' ', text).strip()
        return text

    def preprocess(self, text: str) -> str:
        """Cleans text and expands contractions."""
        if not text:
            return ""
        cleaned = self.clean_text(text)
        return self.expand_contractions(cleaned)

    def split_into_sentences(self, text: str) -> List[str]:
        """Splits review into sentences."""
        if not text:
            return []
        raw = re.split(r'(?<=[.!?])\s+', text.strip())
        return [s.strip() for s in raw if s.strip()]

    def split_into_clauses(self, text: str) -> List[str]:
        """
        Splits review into aspect-targeted clauses across sentences and contrastive conjunctions.
        """
        if not text:
            return []
        sentences = self.split_into_sentences(text)
        clauses = []
        for sentence in sentences:
            parts = CONJUNCTION_SPLIT_PATTERN.split(sentence)
            for part in parts:
                cleaned_part = part.strip().strip(",").strip()
                if len(cleaned_part) > 2:
                    clauses.append(cleaned_part)
        return clauses if clauses else [text.strip()]
