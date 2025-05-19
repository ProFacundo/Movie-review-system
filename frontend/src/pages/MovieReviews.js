import React, { useState, useEffect } from "react";
import axios from "axios";

function MovieReviews({ movieId }) {
  const [reviews, setReviews] = useState([]);
  const [review, setReview] = useState({ rating: "", comment: "" });
  const [editingReview, setEditingReview] = useState(null);
  const [averageRating, setAverageRating] = useState(0);

  const token = localStorage.getItem("access");
  const username = localStorage.getItem("username");

  useEffect(() => {
    if (!movieId) return;

    axios
      .get(`http://127.0.0.1:8000/api/reviews/?movie_id=${movieId}`)
      .then((response) => setReviews(response.data))
      .catch((error) => console.error("Error fetching reviews:", error));

    axios
      .get(`http://127.0.0.1:8000/api/reviews/average/${movieId}/`)
      .then((response) => setAverageRating(response.data.average_rating))
      .catch((error) => console.error("Error fetching average rating:", error));
  }, [movieId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingReview) {
        await axios.put(
          `http://127.0.0.1:8000/api/reviews/${editingReview.id}/`,
          {
            movie: movieId,
            rating: review.rating,
            comment: review.comment,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setReviews(
          reviews.map((r) =>
            r.id === editingReview.id
              ? { ...r, rating: review.rating, comment: review.comment }
              : r
          )
        );
        setEditingReview(null);
      } else {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/reviews/",
          {
            movie: movieId,
            rating: review.rating,
            comment: review.comment,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setReviews([...reviews, response.data]);
      }
      setReview({ rating: "", comment: "" });
    } catch (error) {
      console.error("Error submitting review", error.response?.data || error);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/reviews/${reviewId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(reviews.filter((r) => r.id !== reviewId));
    } catch (error) {
      console.error("Error deleting review", error);
    }
  };

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 text-black dark:text-white rounded-lg">
      <h3 className="text-xl font-bold mb-2">User Reviews</h3>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        ⭐ Average Rating: {averageRating.toFixed(1)} / 5
      </p>

      {reviews.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No reviews yet. Be the first to review!
        </p>
      ) : (
        <div className="space-y-4">
          {[...reviews].reverse().map((r) => (
            <div
              key={r.id}
              className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow border border-gray-300 dark:border-gray-600"
            >
              <div className="flex justify-between items-center">
                <p className="font-semibold">
                  {r.user} - {r.rating} ⭐
                </p>
              </div>
              <p className="text-gray-600 dark:text-gray-200 mt-1">
                {r.comment}
              </p>
              {r.user === username && (
                <div className="flex mt-3 space-x-2">
                  <button
                    onClick={() => {
                      setEditingReview(r);
                      setReview({ rating: r.rating, comment: r.comment });
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {token ? (
        <>
          <h3 className="text-lg font-bold mt-6">
            {editingReview ? "Edit Your Review" : "Leave a Review"}
          </h3>
          <form onSubmit={handleSubmit} className="mt-3 space-y-2">
            <select
              value={review.rating}
              onChange={(e) =>
                setReview({ ...review, rating: e.target.value })
              }
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">Select Rating</option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num} Stars
                </option>
              ))}
            </select>
            <textarea
              value={review.comment}
              onChange={(e) =>
                setReview({ ...review, comment: e.target.value })
              }
              placeholder="Write your review..."
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              required
            />
            <button
              type="submit"
              className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              {editingReview ? "Update Review" : "Submit Review"}
            </button>
          </form>
        </>
      ) : (
        <p className="text-sm text-red-500 mt-4 font-semibold">
          🔒 Please{" "}
          <a href="/login" className="underline text-blue-600">
            log in
          </a>{" "}
          to leave a review.
        </p>
      )}
    </div>
  );
}

export default MovieReviews;
