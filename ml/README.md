# Machine Learning & NLP Evaluation Guide

This directory contains the machine learning pipelines, dataset profiling, and academic evaluation modules for the **AI-Based Automotive Review and Customer Sentiment Analytics** project.

---

## 📊 Dataset Profile & Specifications

- **File**: `backend/data/automotive_reviews_dataset.json`
- **Total Annotated Samples**: 50 detailed automotive customer reviews
- **Dataset Origin**: A curated academic benchmark dataset containing domain-specific automotive customer feedback modeled after real-world car reviews.
- **Dataset Splits**:
  - **Train Split**: 23 samples (~46%)
  - **Test Split**: 27 samples (~54%) for unbiased out-of-sample evaluation
- **Sentiment Classes**: 3 balanced classes (`positive`, `neutral`, `negative`)
- **Monitored 9 Automotive Aspects**: `Vehicle`, `Engine`, `Battery`, `Mileage`, `Safety`, `Comfort`, `Service`, `Infotainment`, `Price`
- **Relevant Fields**:
  - `id`: Unique sample identifier
  - `split`: `"train"` or `"test"`
  - `vehicle_model`: Car make & model (e.g. *Tesla Model 3, Ford Mustang, Volvo XC90*)
  - `text`: Complete customer review text
  - `ground_truth_overall`: Verified overall sentiment
  - `ground_truth_aspects`: Aspect-level ground truth dictionary (e.g. `{"Battery": "positive", "Infotainment": "positive"}`)

---

## 🔬 Model Architectures & Evaluation Methodology

### 1. Pretrained Transformer Model (RoBERTa)
- **Model**: `cardiffnlp/twitter-roberta-base-sentiment-latest` (RoBERTa sequence classification)
- **Aspect Extraction**: 9-Aspect automotive ontology pattern matching with clause-level dependency mapping.
- **Aspect-Level Sentiment**: Evaluates targeted context clauses for each detected entity.

### 2. Fine-Tuned Domain Classifier
- **Model**: TF-IDF N-Gram Vectorizer (unigrams + bigrams, sublinear term frequency) + Balanced Logistic Regression with probability calibration.
- **Training Script**: `ml/train_finetune.py`

---

## 🚀 How to Execute Evaluation & Training

### 1. Run Complete Academic Model Evaluation
```bash
python ml/evaluate_model.py
```

This generates:
- **`ml/evaluation_results.json`**: Complete metrics, per-class reports, and sample evaluations.
- **`ml/confusion_matrix.png`**: 3x3 Confusion matrix heatmap.
- **`ml/sentiment_distribution.png`**: True vs Predicted sentiment class distribution bar chart.
- **`ml/aspect_performance.png`**: 9-Aspect detection and sentiment accuracy chart.

### 2. Train / Fine-Tune the Domain Classifier
```bash
python ml/train_finetune.py
```
This trains on the `train` split and evaluates against the held-out `test` split, saving `ml/trained_classifier.joblib`.
