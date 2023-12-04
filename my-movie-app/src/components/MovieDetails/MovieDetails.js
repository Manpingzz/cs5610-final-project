import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import "../../styles/main.css";
import "./index.css";
import { FaPen, FaStar, FaPlus, FaPlay } from "react-icons/fa";
import SubmitCommentForm from "../SubmitCommentForm";
import { AuthContext } from "../../context/AuthContext";
import * as client from "../client.js";
import { Modal, Button } from "react-bootstrap";
import { faStar } from "react-icons/fa";

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
  const { auth } = useContext(AuthContext);
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

  const handleRatingSubmit = async (rating) => {
    console.log("Submitting rating...", rating);
    // 检查用户信息和认证令牌
    if (!user || !user._id || !auth.token) {
      console.error("User is not authenticated.");
      return;
    }

    try {
      // 发送POST请求到后端
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
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      // 处理响应数据
      const data = await response.json();
      console.log("Rating submitted successfully:", data);
      setShowRatingModal(false); // 关闭模态框
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

  // 处理添加到观看列表
  const addToWatchList = async () => {
    if (!user || !user._id || !auth.token) {
      console.error("User is not logged in or user data is incomplete.");
      return;
    }

    console.log("Add to watch list", movie.id);
    const isMovieInWatchlist = watchlist.some((item) => item.id === movie.id);

    if (!isMovieInWatchlist) {
      try {
        const response = await client.addToWatchlist(user._id, movie.id);
        console.log("Movie added to watch list successfully", response);
        setWatchlist([...watchlist, movie]);
        setIsAlreadyInWatchlist(false);
        setShowAddSuccess(true);
        setTimeout(() => setShowAddSuccess(false), 3000);
      } catch (error) {
        console.error("Error adding movie to watch list:", error);
      }
    } else {
      console.log("Movie is already in watchlist");
      setIsAlreadyInWatchlist(true);
    }
  };

  // 处理评分
  // const rateMovie = async (rating) => {
  //   console.log("Rate movie", movie.id, "with rating", rating);
  //   try {
  //     const response = await fetch(
  //       `${process.env.REACT_APP_BASE_API_URL}/api/rateMovie`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${user.token}`,
  //         },
  //         body: JSON.stringify({
  //           movieId: movie.id,
  //           rating,
  //         }),
  //       }
  //     );

  //     if (response.ok) {
  //       console.log("Movie rated successfully");
  //     } else {
  //       console.error("Failed to rate movie");
  //     }
  //   } catch (error) {
  //     console.error("Error rating movie:", error);
  //   }
  // };

  // 处理标记为最爱
  // const markAsFavourite = async () => {
  //   console.log("Mark as favorite", movie.id);
  //   try {
  //     const response = await fetch(
  //       `${process.env.REACT_APP_BASE_API_URL}/api/favorite`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${user.token}`,
  //         },
  //         body: JSON.stringify({
  //           movieId: movie.id,
  //         }),
  //       }
  //     );

  //     if (response.ok) {
  //       console.log("Movie marked as favorite successfully");
  //     } else {
  //       console.error("Failed to mark movie as favorite");
  //     }
  //   } catch (error) {
  //     console.error("Error marking movie as favorite:", error);
  //   }
  // };

  // 播放预告片
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
          fetch(
            // `https://api.themoviedb.org/3/movie/${id}?api_key=YOUR_API_KEY&language=en-US`
            `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`
          ),
          fetch(
            // `https://api.themoviedb.org/3/movie/${id}/credits?api_key=YOUR_API_KEY&language=en-US`
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

        console.log("Reviews data:", reviewsData);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const handleCommentSubmit = async () => {
    try {
      console.log("Submitting comment...");
      const response = await fetch(
        `${process.env.REACT_APP_BASE_API_URL}/api/comments/:movieId`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            movieId: id,
            comment: commentText,
            userId: user._id,
          }),
        }
      );

      if (response.ok) {
        // 成功提交评论后，更新评论列表
        const newComment = await response.json();
        setReviews([...reviews, newComment]);
        console.log("Comment submitted successfully:", newComment);
      } else {
        // 处理错误情况
        console.error("Error submitting comment");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
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
    : "default_poster.jpg"; // If there is no poster，using default image.

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
                  className="btn btn-primary"
                >
                  <FaStar /> Rate It
                </button>{" "}
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="btn btn-review"
                >
                  <FaPen /> Write a Review
                </button>
                {/* <button onClick={markAsFavourite} className="btn btn-favourite">
                  <FaRegHeart /> Mark as Favourite
                </button> */}
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
            </div>
          ))}
        </div>
      </div>

      <h2 className="mt-4">Reviews</h2>

      <div className="reviews-container">
        {reviews.map((review) => (
          <div key={review._id} className="review">
            <p>
              By:{" "}
              <a href={`/user/${review.userId}`}>{review.userId.username}</a>
            </p>
            <p>{review.comment}</p>
            <p>Rating: {review.rating}</p>
          </div>
        ))}
      </div>
      {console.log("reviews 999:", reviews)}
      <SubmitCommentForm movieId={id} onCommentSubmit={handleCommentSubmit} />
      {/* 评论列表 */}
    </div>
  );
}

export default MovieDetails;
