import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import "../../styles/main.css";
import "./index.css";
import { FaPen, FaStar, FaPlus, FaPlay } from "react-icons/fa";
import SubmitCommentForm from "../SubmitCommentForm";
import { AuthContext } from "../../context/AuthContext";
import * as client from "../client.js";
import { Modal, Button } from "react-bootstrap";
import { faStar } from "react-icons/fa";
import withAuth from "../withAuth.js";
export const BASE_URL = "https://api.themoviedb.org/3";
export const API_KEY = process.env.REACT_APP_TMBD_API_KEY;

// rating
const StarRating = ({ onRatingSelected }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  return (
    <div className="star-rating">
      {[...Array(5)].map((star, index) => {
        index += 1;
        return (
          <button
            type="button"
            key={index}
            className={index <= (hover || rating) ? "star on" : "star off"}
            onClick={() => {
              setRating(index);
              onRatingSelected(index);
            }}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(rating)}
          >
            <FaStar />
          </button>
        );
      })}
    </div>
  );
};

function MovieDetails() {
  // const { user } = useContext(AuthContext);
  const { auth, setAuth } = useContext(AuthContext);
  // const { auth } = useContext(AuthContext);
  useEffect(() => {
    console.log("MovieDetails: ", auth);
  }, [auth]);
  const user = auth.user;
  const [watchlist, setWatchlist] = useState([]);
  const [isAlreadyInWatchlist, setIsAlreadyInWatchlist] = useState(false);
  const [showAddSuccess, setShowAddSuccess] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [movie, setMovie] = useState({});
  const [credits, setCredits] = useState({});

  const { id } = useParams();
  const [commentText, setCommentText] = useState("");
  const [reviews, setReviews] = useState([]);
  const [showRatingModal, setShowRatingModal] = useState(false);

  const scrollToReviewForm = () => {
    const reviewFormSection = document.querySelector("#reviewsSection");
    if (reviewFormSection) {
      reviewFormSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleRatingSubmit = async (rating) => {
    console.log("Submitting rating...", rating);
    if (!user) {
      alert("Please login to rate this movie.");
      setShowRatingModal(false);
      return;
    }
    if (!user || !user._id || !auth.token) {
      console.error("User is not authenticated.");
      return;
    }

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
            movieId: id,
            userId: user._id,
            rating,
            comment: commentText || "No comment",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const data = await response.json();
      console.log("Rating submitted successfully:", data);
      setShowRatingModal(false);
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  // play trailer
  const [trailerUrl, setTrailerUrl] = useState("");

  useEffect(() => {
    const fetchTrailerUrl = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}&language=en-US`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch trailer");
        }
        const data = await response.json();
        const trailer = data.results.find(
          (video) => video.type === "Trailer" && video.site === "YouTube"
        );
        setTrailerUrl(
          trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : ""
        );
      } catch (error) {
        console.error("Error fetching trailer:", error);
      }
    };

    fetchTrailerUrl();
  }, [id]);

  // add to watchlist
  const addToWatchList = async () => {
    if (!user || !user._id || !auth.token) {
      console.error("User is not logged in or user data is incomplete.");
      alert("Please login to add movies to your watchlist.");
      return;
    }

    console.log("Add to watch list", movie.id);
    const isMovieInWatchlist = watchlist.some((item) => item.id === movie.id);

    if (!isMovieInWatchlist) {
      try {
        const response = await client.addToWatchlist(user._id, movie.id);
        console.log("Movie added to watch list successfully", response);

        const movieDetails = await client.getMovieDetails(movie.id);
        setWatchlist([...watchlist, movieDetails]);
        setIsAlreadyInWatchlist(false);
        setShowAddSuccess(true);
        setTimeout(() => setShowAddSuccess(false), 3000);
        setAuth((prevAuth) => ({
          ...prevAuth,
          user: {
            ...prevAuth.user,
            favorites: [...prevAuth.user.favorites, movie.id],
          },
        }));
      } catch (error) {
        console.error("Error adding movie to watch list:", error);
      }
    } else {
      console.log("Movie is already in watchlist");
      setIsAlreadyInWatchlist(true);
    }
  };

  // play trailer
  const playTrailer = () => {
    console.log("Play trailer for movie", movie.id);
    if (trailerUrl) {
      window.open(trailerUrl, "_blank");
    } else {
      console.log("No trailer available");
    }
  };

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (id && id !== "undefined") {
        try {
          const response = await fetch(
            `${BASE_URL}/movie/${id}?api_key=${API_KEY}`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setMovie(data);
        } catch (error) {
          console.error("Error fetching movie details:", error);
        }
      }
      try {
        const [movieRes, creditsRes] = await Promise.all([
          fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`),
          fetch(
            `${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}&language=en-US`
          ),
        ]);

        if (!movieRes.ok || !creditsRes.ok) {
          throw new Error("Network response was not ok");
        }

        const movieData = await movieRes.json();
        const creditsData = await creditsRes.json();

        setMovie(movieData);
        setCredits(creditsData);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }

      try {
        const reviewsResponse = await fetch(
          `${process.env.REACT_APP_BASE_API_URL}/api/comments/${id}`
        );

        if (!reviewsResponse.ok) {
          console.error("Error response status:", reviewsResponse.status);
          console.error(
            "Error response status text:",
            reviewsResponse.statusText
          );
          throw new Error("Network response was not ok");
        }
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const handleCommentSubmit = async (movieId, commentText, userId, token) => {
    console.log("handleCommentSubmit called with:", {
      movieId,
      commentText,
      userId,
      token,
    });

    if (!user) {
      alert("Please login to submit a review.");
      return;
    }

    if (!movieId || !commentText || !userId || !token) {
      console.error("Missing parameters in handleCommentSubmit", {
        movieId,
        commentText,
        userId,
        token,
      });
      return;
    }

    try {
      const requestData = {
        movieId: movieId,
        comment: commentText,
        userId: userId,
      };

      const response = await fetch(
        `${process.env.REACT_APP_BASE_API_URL}/api/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestData),
        }
      );

      if (response.ok) {
        const newComment = await response.json();
        setReviews((prevReviews) => {
          const updatedReviews = [...prevReviews, newComment];
          return updatedReviews;
        });
      } else {
        console.error(
          "Error submitting comment, response status:",
          response.status
        );
        const errorResponse = await response.json();
        console.error("Error details:", errorResponse);
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      await client.deleteComment(commentId);

      const updatedReviews = reviews.filter(
        (comment) => comment._id !== commentId
      );
      setReviews(updatedReviews);
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment");
    }
  };

  const handleUserLinkClick = (event, username) => {
    if (!user) {
      event.preventDefault();
      alert("Please login to view user profiles.");
    }
  };

  function formatRuntime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  const director = credits.crew?.find((member) => member.job === "Director");

  // poster URL
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
    : "default_poster.jpg";

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-4">
          <img
            src={posterUrl}
            alt={movie.title || "Movie Poster"}
            className="img-fluid"
          />
        </div>
        <div className="col-md-8">
          <div className="details-info">
            <h2>
              {movie.title} ({new Date(movie.release_date).getFullYear()})
            </h2>
            <br />
            <div className="details-meta">
              <span>
                {movie.genres?.map((genre) => genre.name).join(", ")} &middot;
              </span>
              <span>
                {movie.runtime ? formatRuntime(movie.runtime) : "N/A"};
              </span>
              <br />

              <div className="movie-details-actions">
                <button onClick={addToWatchList} className="btn btn-watchlist">
                  <FaPlus /> Add to Watchlist
                </button>
                <button
                  onClick={() => setShowRatingModal(true)}
                  className="btn btn-rate"
                >
                  <FaStar /> Rate It
                </button>{" "}
                <button onClick={scrollToReviewForm} className="btn btn-review">
                  <FaPen /> Write a Review
                </button>
                <button onClick={playTrailer} className="btn btn-trailer">
                  <FaPlay /> Play Trailer
                </button>
              </div>
              <Modal
                show={showRatingModal}
                onHide={() => setShowRatingModal(false)}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Rate the Movie</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <StarRating
                    onRatingSelected={(rating) => handleRatingSubmit(rating)}
                  />
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={() => setShowRatingModal(false)}
                  >
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
            <br />
            <h2>Overview</h2>
            <p>{movie.overview}</p>
          </div>
          {showAddSuccess && (
            <div className="alert alert-success" role="alert">
              Movie added to watchlist successfully!
            </div>
          )}
          {isAlreadyInWatchlist && (
            <div className="alert alert-warning" role="alert">
              This movie is already in your watchlist.
            </div>
          )}
        </div>
      </div>

      <h2 className="mt-4">Top Billed Cast</h2>
      <div className="cast-scrolling-container">
        <div className="row flex-nowrap">
          {credits.cast?.map((actor) => (
            <div key={actor.cast_id} className="col">
              <Link to={`/people/${actor.id}`}>
                <div className="card card-cast">
                  <img
                    src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                    alt={actor.name}
                    className="card-img-top"
                  />
                  <div className="card-body">
                    <h6 className="card-title">{actor.name}</h6>
                    <p className="card-text">{actor.character}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <h2 className="mt-4">Reviews</h2>

      <div className="reviews-container mt-4">
        {reviews.map((review) => (
          <div key={review._id} className="card mb-3">
            <div className="comment-content">
              <h5 className="detail-card-title">
                <Link
                  to={`/user/${review.userId.username}`}
                  // onClick={(e) =>
                  //   handleUserLinkClick(e, review.userId.username)
                  // }
                  className="text-primary"
                >
                  {review.userId.username}
                  {review.userId.role === "CRITIC" && (
                    <span className="critic-badge">Critic</span>
                  )}
                </Link>
              </h5>

              {review.rating && (
                <h6 className="card-subtitle mb-2 text-muted">
                  Rating: {review.rating}
                </h6>
              )}
              <p className="detail-card-text">{review.comment}</p>
              {/* {(user._id === review.userId._id || user.role === "ADMIN") && ( */}
              {user &&
                (user._id === review.userId._id || user.role === "ADMIN") && (
                  <button
                    onClick={() => handleDeleteComment(review._id)}
                    className="delete-comment-btn"
                  >
                    Delete Review
                  </button>
                )}
            </div>
          </div>
        ))}
        <div id="reviewsSection" className="submit-comment-form mt-4">
          <h2 className="mb-3">Leave a Comment</h2>
          <SubmitCommentForm
            movieId={id}
            onCommentSubmit={(responseData) => {
              const newComment = {
                ...responseData,
                user: { username: user.username, _id: user._id },
              };
              setReviews((prevReviews) => [...prevReviews, newComment]);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
