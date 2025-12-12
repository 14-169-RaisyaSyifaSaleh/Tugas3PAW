from flask import Flask, request, jsonify
from flask_cors import CORS
from models import init_db, SessionLocal, Review
from analyzer import ReviewAnalyzer

app = Flask(__name__)
CORS(app)

print("Initializing database...")
init_db()
print("Database initialized!")

print("Loading AI models (this may take a few minutes)...")
analyzer = ReviewAnalyzer()
print("All systems ready!")

@app.route('/api/analyze-review', methods=['POST'])
def analyze_review():
    try:
        data = request.get_json()
        review_text = data.get('review_text', '').strip()
        
        if not review_text:
            return jsonify({'error': 'Review text is required'}), 400
        
        if len(review_text) < 10:
            return jsonify({'error': 'Review text too short (minimum 10 characters)'}), 400
        
        print(f"\n=== Analyzing review: {review_text[:50]}... ===")
        
        # Analyze sentiment
        print("Step 1: Analyzing sentiment...")
        sentiment_result = analyzer.analyze_sentiment(review_text)
        
        # Extract key points
        print("Step 2: Extracting key points...")
        key_points = analyzer.extract_key_points(review_text)
        
        # Save to database
        print("Step 3: Saving to database...")
        db = SessionLocal()
        try:
            review = Review(
                review_text=review_text,
                sentiment=sentiment_result['sentiment'],
                sentiment_score=sentiment_result['score'],
                key_points=key_points
            )
            db.add(review)
            db.commit()
            db.refresh(review)
            
            print(f"✓ Review saved with ID: {review.id}\n")
            
            return jsonify({
                'success': True,
                'data': review.to_dict()
            }), 201
        finally:
            db.close()
            
    except Exception as e:
        print(f"ERROR: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/reviews', methods=['GET'])
def get_reviews():
    try:
        db = SessionLocal()
        try:
            reviews = db.query(Review).order_by(Review.created_at.desc()).all()
            print(f"Retrieved {len(reviews)} reviews")
            return jsonify({
                'success': True,
                'data': [review.to_dict() for review in reviews]
            }), 200
        finally:
            db.close()
    except Exception as e:
        print(f"ERROR: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    print("\n" + "="*50)
    print("🚀 Backend server starting...")
    print("Server will run on: http://localhost:5000")
    print("="*50 + "\n")
    app.run(debug=True, port=5000)