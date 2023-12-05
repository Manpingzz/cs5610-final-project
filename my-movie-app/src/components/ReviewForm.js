import React, { useState } from "react";

function ReviewForm({ movieId, onSubmit }) {
  const [comment, setComment] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(comment);
    setComment("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your review here"
      />
      <button type="submit">Submit Review</button>
    </form>
  );
}

export default ReviewForm;
