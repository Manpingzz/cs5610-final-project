import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function SubmitCommentForm({ movieId, onCommentSubmit }) {
  const [commentText, setCommentText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 提交评论的逻辑
    const response = await fetch("/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ movieId, comment: commentText }),
    });

    if (response.ok) {
      setCommentText("");
      onCommentSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Write your comment here..."
        required
      />
      <button type="submit">Submit Comment</button>
    </form>
  );
}

export default SubmitCommentForm;
