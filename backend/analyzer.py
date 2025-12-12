from transformers import pipeline
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

class ReviewAnalyzer:
    def __init__(self):
        print("Initializing Hugging Face model...")
        # Initialize Hugging Face sentiment analysis
        self.sentiment_analyzer = pipeline(
            "sentiment-analysis",
            model="distilbert-base-uncased-finetuned-sst-2-english"
        )
        print("Hugging Face model loaded!")
        
        print("Initializing Gemini...")
        # Initialize Gemini
        genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
        self.gemini_model = genai.GenerativeModel('gemini-pro')
        print("Gemini loaded!")
    
    def analyze_sentiment(self, text):
        """Analyze sentiment using Hugging Face"""
        try:
            result = self.sentiment_analyzer(text[:512])[0]
            
            label = result['label']
            score = result['score']
            
            if label == 'POSITIVE' and score > 0.8:
                sentiment = 'positive'
            elif label == 'NEGATIVE' and score > 0.8:
                sentiment = 'negative'
            else:
                sentiment = 'neutral'
            
            print(f"Sentiment: {sentiment}, Score: {score}")
            return {
                'sentiment': sentiment,
                'score': score
            }
        except Exception as e:
            print(f"Sentiment analysis error: {e}")
            return {
                'sentiment': 'neutral',
                'score': 0.5
            }
    
    def extract_key_points(self, text):
        """Extract key points using Gemini"""
        try:
            prompt = f"""
            Analyze this product review and extract 3-5 key points in bullet format.
            Focus on specific features, pros, cons, and main opinions.
            
            Review: {text}
            
            Format: Return only bullet points, one per line, starting with "-"
            """
            
            response = self.gemini_model.generate_content(prompt)
            print(f"Key points extracted!")
            return response.text.strip()
        except Exception as e:
            print(f"Key points extraction error: {e}")
            return "- Could not extract key points"