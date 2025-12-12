from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

Base = declarative_base()

class Review(Base):
    __tablename__ = 'reviews'
    
    id = Column(Integer, primary_key=True)
    review_text = Column(Text, nullable=False)
    sentiment = Column(String(20), nullable=False)
    sentiment_score = Column(Float)
    key_points = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'review_text': self.review_text,
            'sentiment': self.sentiment,
            'sentiment_score': self.sentiment_score,
            'key_points': self.key_points,
            'created_at': self.created_at.isoformat()
        }

# Database setup
DATABASE_URL = os.getenv('DATABASE_URL')
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

def init_db():
    Base.metadata.create_all(engine)