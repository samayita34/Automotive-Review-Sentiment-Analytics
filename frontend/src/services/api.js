/**
 * API Client for Automotive Review & Customer Sentiment Analytics Backend.
 * Connects to FastAPI endpoints (/analyze, /health, /stats, /history).
 */

const API_BASE = '';

export async function analyzeReview(reviewText) {
  const response = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ review: reviewText, text: reviewText })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({ detail: 'Failed to analyze review.' }));
    let errorMsg = 'Failed to analyze review';
    if (typeof errData.detail === 'string') {
      errorMsg = errData.detail;
    } else if (Array.isArray(errData.detail) && errData.detail[0]?.msg) {
      errorMsg = errData.detail[0].msg;
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export async function checkBackendHealth() {
  const response = await fetch(`${API_BASE}/health`);
  if (!response.ok) {
    throw new Error('Backend service is unreachable');
  }
  return response.json();
}
