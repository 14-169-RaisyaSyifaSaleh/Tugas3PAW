import React from "react";
import "./ReviewList.css";

function ReviewList({ reviews, loading }) {
  const getSentimentEmoji = (sentiment) => {
    switch (sentiment) {
      case "positive":
        return "😊";
      case "negative":
        return "😞";
      case "neutral":
        return "😐";
      default:
        return "❓";
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case "positive":
        return "#4caf50";
      case "negative":
        return "#f44336";
      case "neutral":
        return "#ff9800";
      default:
        return "#9e9e9e";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading reviews...</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="empty-state">
        <h3>No reviews yet</h3>
        <p>Be the first to submit a review!</p>
      </div>
    );
  }

  return (
    <div className="review-list-container">
      <h2>Review History ({reviews.length})</h2>
      <div className="review-list">
        {reviews.map((review) => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <div
                className="sentiment-badge"
                style={{ backgroundColor: getSentimentColor(review.sentiment) }}
              >
                {getSentimentEmoji(review.sentiment)}{" "}
                {review.sentiment.toUpperCase()}
              </div>
              <span className="review-date">
                {formatDate(review.created_at)}
              </span>
            </div>

            <div className="review-content">
              <p className="review-text">"{review.review_text}"</p>

              <div className="sentiment-score">
                <strong>Confidence Score:</strong>{" "}
                {(review.sentiment_score * 100).toFixed(1)}%
                <div className="score-bar">
                  <div
                    className="score-fill"
                    style={{
                      width: `${review.sentiment_score * 100}%`,
                      backgroundColor: getSentimentColor(review.sentiment),
                    }}
                  ></div>
                </div>
              </div>

              <div className="key-points">
                <strong>📌 Key Points:</strong>
                <div className="key-points-content">
                  {review.key_points
                    ?.split("\n")
                    .map(
                      (point, index) =>
                        point.trim() && <p key={index}>{point}</p>
                    )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewList;
