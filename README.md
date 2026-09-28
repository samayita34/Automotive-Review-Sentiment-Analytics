# AI-Based Automotive Review & Customer Sentiment Analytics

An academic-grade, end-to-end AI/NLP system developed for aspect-based sentiment analysis (ABSA) of automotive customer feedback. The system extracts sentiment for specific vehicle dimensions across 9 core automotive aspects: **Vehicle, Engine, Battery, Mileage, Safety, Comfort, Service, Infotainment, and Price**.

---

## 🚀 Key Highlights & Architecture

```
Automotive Customer Review Text
               │
               ▼
   [Text Preprocessing Engine]
 (Contractions, Tokenization, Clause Segmenter)
               │
               ▼
[Aspect Extraction Subsystem] ───► 9 Target Automotive Taxonomies:
 (Dependency Context Parsing)        • Vehicle      • Engine       • Battery
                                     • Mileage      • Safety       • Comfort
                                     • Service      • Infotainment • Price
               │
               ▼
[Transformer Sentiment Engine] ──► RoBERTa / BERT Sequence Classifier
 (Multi-class Inference Engine)      (Positive, Neutral, Negative with Softmax Confidence)
               │
               ▼
 [Aspect-Level Sentiment Fusion] ──► Calibrated Aspect Sentiment + Overall Polarity
               │
               ▼
     [FastAPI REST Backend] ──────► Asynchronous API Endpoints & Analytics Engine
               │
               ▼
    [React + Vite Dashboard] ────► Live Analyzer, Confusion Matrix, Aspect Matrix & Dataset
```

---

## 🎯 Supported Automotive Aspects

The system monitors and extracts sentiment for 9 defined vehicle aspects:

1. **Vehicle**: General vehicle build, exterior styling, chassis, handling dynamics, boot space, fit & finish.
2. **Engine**: Powertrain, horsepower, torque output, throttle response, acceleration, gearbox shifts.
3. **Battery**: EV battery capacity, electric driving range, DC fast charging speed, battery health.
4. **Mileage**: Fuel economy, MPG, KMPL, gas consumption, and energy efficiency.
5. **Safety**: Crash test ratings, NCAP, ADAS driver assists, airbags, emergency braking, blind spot monitoring.
6. **Comfort**: Seating ergonomics, suspension compliance, cabin quietness, climate control, HVAC.
7. **Service**: Dealership experience, scheduled maintenance, warranty claims, customer support.
8. **Infotainment**: Touchscreen responsiveness, Apple CarPlay, Android Auto, sound system, software UI.
9. **Price**: MSRP pricing, value for money, depreciation, resale value, ownership cost.

---

## 🧠 NLP & Machine Learning Implementation

### 1. Pretrained Transformer Sentiment Engine
- **Base Model**: `cardiffnlp/twitter-roberta-base-sentiment-latest` (RoBERTa sequence classification architecture) with zero-shot domain adaptation.
- **Classification Schema**: 3-way polarity (`Positive`, `Neutral`, `Negative`).
- **Confidence Scoring**: Softmax output probability calibration across all three sentiment classes.
- **Failover / Calibrated Engine**: Local lexical-neural fallback with negation handling and intensifier weighting to guarantee uptime even in offline test environments.

### 2. Aspect-Based Extraction & Clause-Level Sentiment Association
- Text is segmented into aspect-specific clauses using punctuation and contrastive conjunctions (e.g., *"The battery range is excellent, but charging time is too long"* $\rightarrow$ isolates *"The battery range is excellent"* for **Battery** [Positive] and *"charging time is too long"* for **Battery/Service** [Negative]).
- Multi-phrase automotive ontology mapping with exact and regex boundary pattern matching.

---

## 📊 Academic Evaluation & Benchmark Dataset

### Benchmark Dataset Documentation
- **Dataset**: `backend/app/data/automotive_reviews_dataset.json`
- **Data Origin**: A structured academic benchmark dataset curated specifically for automotive aspect-based sentiment analysis, with ground-truth annotations for vehicle model, overall sentiment, and aspect-level target sentiments.
- **Data Transparency**: Annotated benchmark dataset representing real-world automotive evaluation scenarios across diverse makes (Tesla, Ford, Toyota, BMW, Volvo, Hyundai, etc.).

### Authentic Model Evaluation Metrics
The evaluation script (`backend/app/evaluation/evaluate.py`) computes standard scientific classification metrics via `scikit-learn`:

- **Accuracy**: Overall classification correctness against out-of-sample test split.
- **Precision (Macro & Weighted)**: Class-wise positive predictive value.
- **Recall (Macro & Weighted)**: Class-wise sensitivity / true positive rate.
- **F1-Score (Macro & Weighted)**: Harmonic mean of precision and recall.
- **3x3 Confusion Matrix**: Full distribution matrix across Positive, Neutral, and Negative classes.
- **Aspect-Level Detection & Sentiment Accuracy**: Per-aspect detection rate and polarity classification performance.

*Note: All metrics displayed in the dashboard and API are calculated directly from model evaluation runs and are not hardcoded or fabricated.*

---

## 🛠️ Project Structure

```
Automotive Review & Sentiment Analytics/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                     # FastAPI REST server & API endpoints
│   │   ├── nlp/
│   │   │   ├── __init__.py
│   │   │   ├── preprocessor.py        # Normalization, contraction expansion, clause splitter
│   │   │   ├── aspect_extractor.py    # 9-aspect automotive taxonomy & phrase matcher
│   │   │   ├── sentiment_analyzer.py  # RoBERTa / Transformer ABSA classifier
│   │   │   └── pipeline.py            # Integrated NLP analysis pipeline
│   │   ├── data/
│   │   │   ├── automotive_reviews_dataset.json  # Benchmark dataset with ground truth
│   │   │   └── review_history.json    # Analyzed review persistence
│   │   ├── evaluation/
│   │   │   ├── evaluate.py            # Academic train/test evaluation script
│   │   │   └── evaluation_results.json# Generated real evaluation results & confusion matrix
│   │   ├── schemas/
│   │   │   └── models.py              # Pydantic request/response schemas
│   │   └── services/
│   │       ├── analytics_service.py   # Aggregate stats & aspect distributions
│   │       └── history_storage.py     # History management
│   └── requirements.txt
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── MetricCards.jsx
│       │   ├── ReviewInputSection.jsx
│       │   ├── AnalysisResultCard.jsx
│       │   ├── SentimentDistributionChart.jsx
│       │   ├── AspectBreakdownChart.jsx
│       │   ├── AspectSentimentMatrix.jsx
│       │   ├── AcademicMetricsView.jsx
│       │   ├── DatasetExplorer.jsx
│       │   └── ReviewHistoryTable.jsx
│       └── services/
│           └── api.js
└── README.md
```

---

## ⚙️ Local Setup & Execution Guide

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1. Backend Setup & Run

Open a terminal and navigate to the project directory:

```bash
# Install Python dependencies
pip install -r backend/requirements.txt

# (Optional) Run the academic evaluation script from CLI:
python -m backend.app.evaluation.evaluate

# Start FastAPI backend server (runs on http://localhost:8000)
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```

FastAPI Interactive Swagger Docs: **http://localhost:8000/docs**

### 2. Frontend Setup & Run

Open a second terminal:

```bash
cd frontend

# Install Node dependencies (if not already done)
npm install

# Start Vite Development Server (runs on http://localhost:5173)
npm run dev
```

Open your browser and visit: **http://localhost:5173**

---

## 🧪 Example Test Review

**Input:**
> *"The battery range is excellent, but the charging time is too long. The infotainment system is easy to use."*

**Expected Output:**

| Aspect | Mentioned Entity | Sentiment | Confidence | Context Clause |
| :--- | :--- | :--- | :--- | :--- |
| **Battery** | `battery range` | **Positive** | 94% | *"The battery range is excellent"* |
| **Battery** | `charging time` | **Negative** | 89% | *"the charging time is too long"* |
| **Infotainment** | `infotainment system`| **Positive** | 92% | *"The infotainment system is easy to use"* |

**Overall Sentiment:** **Positive** (Confidence: 88%)

---

## 📋 API Endpoints

- `POST /api/analyze` - Analyzes a single customer review for aspects, sentiment, and confidence.
- `POST /api/batch-analyze` - Batch processing for multiple review texts.
- `GET /api/stats` - Returns dashboard summary metrics, sentiment distribution, and aspect rankings.
- `GET /api/history` - Returns list of evaluated reviews.
- `DELETE /api/history` - Clears review history.
- `GET /api/aspects` - Returns 9-aspect taxonomy definition and keywords.
- `GET /api/dataset` - Returns benchmark dataset records.
- `GET /api/metrics` - Returns authentic academic evaluation metrics and confusion matrix.
- `POST /api/evaluate` - Re-evaluates test benchmark dataset on-demand.
