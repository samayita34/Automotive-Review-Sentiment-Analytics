"""
Model Training and Fine-Tuning Module.
Trains a supervised machine learning classifier on the automotive dataset training split
and evaluates performance against the test split.
"""

import os
import sys
import json
import joblib
import pandas as pd
import numpy as np

# Add project root
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

DATASET_PATH = os.path.join(os.path.dirname(__file__), "..", "backend", "data", "automotive_reviews_dataset.json")
MODEL_ARTIFACT_PATH = os.path.join(os.path.dirname(__file__), "trained_classifier.joblib")


def train_automotive_classifier():
    """Trains and serializes a domain-adapted automotive sentiment classifier."""
    print("\n=== Training Supervised Automotive Sentiment Classifier ===")
    
    with open(DATASET_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    df = pd.DataFrame(data)
    train_df = df[df['split'] == 'train']
    test_df = df[df['split'] == 'test']

    print(f"Training Samples: {len(train_df)}")
    print(f"Testing Samples:  {len(test_df)}")

    X_train = train_df['text']
    y_train = train_df['ground_truth_overall'].str.lower()

    X_test = test_df['text']
    y_test = test_df['ground_truth_overall'].str.lower()

    # Build NLP Classification Pipeline with n-grams & sublinear TF scaling
    model_pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(
            ngram_range=(1, 2),
            sublinear_tf=True,
            min_df=1,
            stop_words='english'
        )),
        ('clf', LogisticRegression(
            C=2.0,
            max_iter=1000,
            class_weight='balanced',
            random_state=42
        ))
    ])

    print("Fitting model on training split...")
    model_pipeline.fit(X_train, y_train)

    # Evaluate on held-out test split
    y_pred = model_pipeline.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    cm = confusion_matrix(y_test, y_pred, labels=['positive', 'neutral', 'negative'])

    print(f"\nTraining Complete!")
    print(f"Test Accuracy: {acc * 100:.2f}%")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, labels=['positive', 'neutral', 'negative'], zero_division=0))
    print("Confusion Matrix:")
    print(cm)

    # Save artifact
    joblib.dump(model_pipeline, MODEL_ARTIFACT_PATH)
    print(f"\nTrained model artifact saved to: {MODEL_ARTIFACT_PATH}")
    return model_pipeline


if __name__ == "__main__":
    train_automotive_classifier()
