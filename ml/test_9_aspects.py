import requests
import json

BASE = 'http://127.0.0.1:8000'

aspect_tests = [
    ('Vehicle', 'The overall build quality, exterior styling, and chassis handling of this vehicle are outstanding.'),
    ('Engine', 'The V8 powertrain engine horsepower and instant throttle acceleration are sensational.'),
    ('Battery', 'The 80 kWh EV battery pack offers 320 miles of driving range with fast DC charging speed.'),
    ('Mileage', 'The car achieves incredible fuel economy with over 52 mpg highway gas mileage.'),
    ('Safety', 'The 5-star crash test rating, dual front airbags, and ADAS emergency braking ensure top safety.'),
    ('Comfort', 'The plush seating comfort, quiet cabin insulation, and smooth air suspension make long trips effortless.'),
    ('Service', 'The dealership staff was polite, maintenance costs were reasonable, and customer support was prompt.'),
    ('Infotainment', 'The 14-inch touchscreen display, Apple CarPlay connectivity, and high-end audio sound system work flawlessly.'),
    ('Price', 'The sticker price is a true bargain and offers exceptional value for money compared to competitors.')
]

def test_all_aspects():
    print("=" * 75)
    print("       VERIFYING 9 INDIVIDUAL AUTOMOTIVE ASPECT CATEGORIES")
    print("=" * 75)
    
    for cat, text in aspect_tests:
        r = requests.post(f'{BASE}/analyze', json={'review': text})
        data = r.json()
        aspects = data.get('aspects', [])
        detected_cats = [a.get('category') for a in aspects]
        
        print(f"\n[Category: {cat.upper():12}]")
        print(f"Review: \"{text}\"")
        print(f"Overall Sentiment: {data.get('overall_sentiment')} (Confidence: {round(data.get('overall_confidence', 0)*100)}%)")
        print(f"Detected Categories: {detected_cats}")
        for a in aspects:
            print(f"  • Aspect Entity: '{a.get('aspect')}' | Category: {a.get('category')} | Sentiment: {a.get('sentiment')} | Conf: {round(a.get('confidence', 0)*100)}%")
        
        assert cat in detected_cats, f"Failed to detect category {cat}"

    print("\n" + "=" * 75)
    print("ALL 9 ASPECT CATEGORIES CONFIRMED AND WORKING!")
    print("=" * 75)

if __name__ == '__main__':
    test_all_aspects()
