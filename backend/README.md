# Automotive Sentiment Analytics Backend

FastAPI-powered Aspect-Based Sentiment Analysis (ABSA) NLP backend for the **AI-Based Automotive Review and Customer Sentiment Analytics** system.

---

## 📁 Backend Directory Structure

```
backend/
├── main.py                     # FastAPI application & API endpoints
├── requirements.txt            # Python dependencies
├── models/
│   ├── __init__.py
│   └── schemas.py              # Pydantic data schemas (ReviewRequest, Response, Health)
├── services/
│   ├── __init__.py
│   ├── aspect_service.py       # 9-aspect automotive entity extraction
│   ├── sentiment_service.py    # Transformer RoBERTa sentiment classifier
│   └── pipeline_service.py     # Master review analysis orchestrator
├── utils/
│   ├── __init__.py
│   └── text_preprocessor.py    # Normalization, contraction expander, clause splitter
├── data/
│   ├── aspect_taxonomy.json    # Automotive ontology keywords & regex patterns
│   └── automotive_reviews_dataset.json  # Benchmark dataset
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Start the Backend Server
```bash
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

---

## 📡 API Endpoints

### 1. Health Check
- **Endpoint**: `GET /health`
- **Response**:
```json
{
  "status": "healthy",
  "service": "Automotive Sentiment Analytics Backend",
  "version": "1.0.0",
  "model_status": "ready",
  "supported_aspects": [
    "Vehicle",
    "Engine",
    "Battery",
    "Mileage",
    "Safety",
    "Comfort",
    "Service",
    "Infotainment",
    "Price"
  ]
}
```

---

### 2. Analyze Review
- **Endpoint**: `POST /analyze`
- **Request Body**:
```json
{
  "review": "The battery range is excellent, but the charging time is too long."
}
```

- **Response Body**:
```json
{
  "overall_sentiment": "positive",
  "overall_confidence": 0.91,
  "aspects": [
    {
      "aspect": "battery range",
      "sentiment": "positive",
      "confidence": 0.94,
      "category": "Battery",
      "context_clause": "The battery range is excellent"
    },
    {
      "aspect": "charging time",
      "sentiment": "negative",
      "confidence": 0.89,
      "category": "Battery",
      "context_clause": "the charging time is too long."
    }
  ],
  "original_text": "The battery range is excellent, but the charging time is too long.",
  "processing_time_ms": 142.5
}
```

---

## 🧪 Interactive API Documentation

Visit `http://localhost:8000/docs` for the interactive Swagger UI.
