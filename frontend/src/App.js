import React, { useState, useEffect } from "react";
import "./App.css";
import ReviewForm from "./components/ReviewForm";
import ReviewList from "./components/ReviewList";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

function App() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/reviews`);
      setReviews(response.data.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch reviews. Make sure backend is running!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewReview = async (reviewText) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`${API_URL}/analyze-review`, {
        review_text: reviewText,
      });

      setReviews([response.data.data, ...reviews]);
      return response.data.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to analyze review";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1> Review Mind-Reader 🧠</h1>
        <p>Analyze product reviews with AI-powered sentiment analysis</p>
      </header>

      <main className="App-main">
        <ReviewForm onSubmit={handleNewReview} loading={loading} />

        {error && <div className="error-message">⚠️ {error}</div>}

        <ReviewList reviews={reviews} loading={loading} />
      </main>
    </div>
  );
}

export default App;
