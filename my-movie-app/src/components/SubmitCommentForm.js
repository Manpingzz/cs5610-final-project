import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function SubmitCommentForm({ movieId, onCommentSubmit }) {
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { auth } = useContext(AuthContext);
  const user = auth.user;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!user || !user._id || !auth.token) {
      console.error("User is not authenticated.");
      setIsSubmitting(false);
      return;
    }

    console.log("Submitting comment:", commentText);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_API_URL}/api/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
          body: JSON.stringify({
            movieId,
            comment: commentText,
            userId: user._id,
          }),
        }
      );

      if (response.ok) {
        console.log("Comment submitted successfully");
        setCommentText("");
        onCommentSubmit();
      } else {
        console.error(
          "Error submitting comment, response status:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <textarea
          className="form-control"
          rows="3"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write your comment here..."
          required
        />
      </div>
      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
        Submit Comment
      </button>
    </form>
  );
}

export default SubmitCommentForm;
