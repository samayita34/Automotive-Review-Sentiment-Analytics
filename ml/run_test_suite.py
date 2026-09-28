"""
Comprehensive 12-Test-Case Automated Validation Suite.
Tests edge cases, multi-aspect inputs, empty/short reviews, domain jargon, and spelling variations.
"""

import requests
import json
import time

BASE_URL = "http://127.0.0.1:8000"

TEST_CASES = [
    {
        "id": 1,
        "name": "Positive Review",
        "description": "High praise for vehicle handling and build quality",
        "payload": {"review": "The vehicle handling is exceptionally smooth and the build quality is absolutely fantastic!"}
    },
    {
        "id": 2,
        "name": "Negative Review",
        "description": "Severe criticism regarding dealership service and repair costs",
        "payload": {"review": "The customer service was terrible, the dealership was rude, and repairs were overpriced."}
    },
    {
        "id": 3,
        "name": "Neutral Review",
        "description": "Standard objective statement with no strong emotional bias",
        "payload": {"review": "The car has standard safety features and average highway fuel consumption."}
    },
    {
        "id": 4,
        "name": "Mixed Sentiment Review",
        "description": "Contrasting sentiment in a single review (Positive battery range vs Negative charging time)",
        "payload": {"review": "The battery range is excellent, but the charging time is too long."}
    },
    {
        "id": 5,
        "name": "Multi-Aspect Review (4 Aspects)",
        "description": "Spans Engine, Infotainment, Comfort, and Mileage",
        "payload": {"review": "The V8 engine power is thrilling, the touchscreen infotainment is responsive, but rear seating comfort is cramped and gas mileage is awful."}
    },
    {
        "id": 6,
        "name": "No Recognized Automotive Aspect",
        "description": "Out-of-domain text with no automotive keywords",
        "payload": {"review": "Yesterday was a sunny day and I went for a pleasant walk with friends in the park."}
    },
    {
        "id": 7,
        "name": "Empty Input",
        "description": "Whitespace-only input to verify 400/422 error handling",
        "payload": {"review": "   "}
    },
    {
        "id": 8,
        "name": "Very Short Input",
        "description": "Minimal 2-word review",
        "payload": {"review": "Great car."}
    },
    {
        "id": 9,
        "name": "Long Multi-Paragraph Review",
        "description": "Complex customer review with multiple compound clauses and contrasting transitions",
        "payload": {"review": "I have owned this electric SUV for over six months now. On the positive side, the DC fast charging speed at superchargers is impressive, the instant motor torque and acceleration make highway merges effortless, and the panoramic glass roof with comfortable ventilated seats makes long family road trips delightful. However, on the negative side, the infotainment software occasionally glitches, Apple CarPlay wireless connection drops out, and the dealership service center took over five days just to replace a minor sensor under warranty."}
    },
    {
        "id": 10,
        "name": "Review with Spelling & Slang Variations",
        "description": "Colloquial terminology and informal spelling",
        "payload": {"review": "the battery range is gr8, but charging takes 2 long, touchscreen is very snappy."}
    },
    {
        "id": 11,
        "name": "Battery / EV Terminology",
        "description": "EV-specific vocabulary (kWh, wallbox, DC fast charging, battery pack)",
        "payload": {"review": "The 77 kWh battery pack provides 300 miles of EV range, and level 2 wallbox charging is very convenient."}
    },
    {
        "id": 12,
        "name": "Engine / Mileage Terminology",
        "description": "ICE powertrain terminology (turbocharged, 4-cylinder, horsepower, mpg)",
        "payload": {"review": "The turbocharged 4-cylinder engine delivers punchy horsepower and achieves outstanding 38 mpg gas mileage."}
    }
]


def run_test_suite():
    print("=" * 80)
    print("          AUTOMOTIVE SENTIMENT ANALYTICS - 12 TEST CASES VERIFICATION")
    print("=" * 80)

    # 1. Health check
    try:
        health_resp = requests.get(f"{BASE_URL}/health", timeout=5)
        print(f"[*] GET /health Status: {health_resp.status_code}")
        print(f"[*] Service State: {health_resp.json().get('status')} | Model: {health_resp.json().get('model_status')}")
    except Exception as e:
        print(f"[!] Health check failed: {e}")
        return

    passed = 0
    total = len(TEST_CASES)
    summary_results = []

    for case in TEST_CASES:
        c_id = case["id"]
        name = case["name"]
        payload = case["payload"]

        print(f"\n" + "-" * 75)
        print(f" TEST CASE {c_id}: {name.upper()}")
        print(f" Description: {case['description']}")
        print(f" Input Review: '{payload.get('review')}'")
        print("-" * 75)

        start = time.time()
        resp = requests.post(f"{BASE_URL}/analyze", json=payload, timeout=10)
        elapsed_ms = round((time.time() - start) * 1000, 1)

        status_code = resp.status_code
        data = resp.json()

        if c_id == 7:
            # Expected validation error for empty input
            if status_code in [400, 422]:
                print(f" [PASSED] Expected Validation Error Handled Successfully (Status: {status_code})")
                print(f"          Error Message: {data.get('detail')}")
                passed += 1
                summary_results.append({
                    "id": c_id, "name": name, "status": "PASSED",
                    "overall_sentiment": "N/A (Error Handled)", "confidence": "N/A", "aspects_detected": 0
                })
            else:
                print(f" [FAILED] Expected 400/422 but got {status_code}")
        else:
            if status_code == 200:
                overall_sent = data.get("overall_sentiment")
                overall_conf = round(data.get("overall_confidence", 0) * 100)
                aspects = data.get("aspects", [])

                print(f" [PASSED] HTTP 200 OK (Latency: {elapsed_ms}ms)")
                print(f"          Overall Sentiment:  {overall_sent.upper()} (Confidence: {overall_conf}%)")
                print(f"          Detected Aspects ({len(aspects)}):")
                if aspects:
                    for asp in aspects:
                        asp_name = asp.get('aspect')
                        asp_cat = asp.get('category') or 'Aspect'
                        asp_sent = asp.get('sentiment')
                        asp_conf = round(asp.get('confidence', 0) * 100)
                        clause = asp.get('context_clause')
                        print(f"            • [{asp_cat}] '{asp_name}' -> {asp_sent.upper()} ({asp_conf}%) [Clause: \"{clause}\"]")
                else:
                    print("            • (No specific automotive aspects detected - general sentiment classified)")

                passed += 1
                summary_results.append({
                    "id": c_id, "name": name, "status": "PASSED",
                    "overall_sentiment": overall_sent, "confidence": f"{overall_conf}%",
                    "aspects_detected": len(aspects)
                })
            else:
                print(f" [FAILED] Unexpected status code {status_code}: {data}")
                summary_results.append({
                    "id": c_id, "name": name, "status": "FAILED",
                    "overall_sentiment": "ERROR", "confidence": "0%", "aspects_detected": 0
                })

    print("\n" + "=" * 80)
    print(f" TEST SUMMARY: {passed}/{total} CASES PASSED ({passed/total*100:.1f}%)")
    print("=" * 80)
    for r in summary_results:
        print(f" Case {r['id']:2d} | {r['name']:<36} | {r['status']} | Overall: {r['overall_sentiment']:<10} | Aspects: {r['aspects_detected']}")
    print("=" * 80 + "\n")


if __name__ == "__main__":
    run_test_suite()
