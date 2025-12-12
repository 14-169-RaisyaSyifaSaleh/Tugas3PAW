import React, { useState } from "react";
import "./ReviewForm.css";

function ReviewForm({ onSubmit, loading }) {
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (reviewText.trim().length < 10) {
      setError("Review must be at least 10 characters long");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess(false);

      await onSubmit(reviewText);

      setReviewText("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="review-form-container">
      <h2>Submit a Review</h2>
      <form onSubmit={handleSubmit} className="review-form">
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Ceritakan pengalaman serumu dengan produk ini di sini..."
          rows="8"
          disabled={submitting || loading}
          className="review-textarea"
        />

        <div className="form-footer">
          <span className="char-count">{reviewText.length} characters</span>
          <button
            type="submit"
            disabled={submitting || loading || reviewText.trim().length < 10}
            className="submit-button"
          >
            {submitting ? "Analyzing..." : " Mulailah Deteksi Perasaan ! "}
          </button>
        </div>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">yay sudah sukses loh!</div>}
      </form>
    </div>
  );
}

export default ReviewForm;
