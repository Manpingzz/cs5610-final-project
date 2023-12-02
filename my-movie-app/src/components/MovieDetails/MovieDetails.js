import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../styles/main.css";
import "./index.css";
import { FaRegHeart, FaStar, FaPlus, FaPlay } from "react-icons/fa";
import SubmitCommentForm from "../SubmitCommentForm";

export const BASE_URL = "https://api.themoviedb.org/3";
export const API_KEY = process.env.REACT_APP_TMBD_API_KEY;

function MovieDetails() {
  const [movie, setMovie] = useState({});
  const [credits, setCredits] = useState({});
  const { id } = useParams();

  console.log("ID is 77:", id);

  const [reviews, setReviews] = useState([]);

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
  const addToWatchList = () => {
    console.log("Add to watch list", movie.id);
    // 在这里添加将电影添加到观看列表的逻辑
  };

  // 处理评分
  const rateMovie = (rating) => {
    console.log("Rate movie", movie.id, "with rating", rating);
    // 在这里添加评分逻辑
  };

  // 处理标记为最爱
  const markAsFavourite = () => {
    console.log("Mark as favorite", movie.id);
    // 在这里添加标记为最爱的逻辑
  };

  // 播放预告片
  const playTrailer = () => {
    console.log("Play trailer for movie", movie.id);
    // 在这里添加播放预告片的逻辑
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
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const handleCommentSubmit = async () => {
    // 重新获取评论
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_API_URL}/api/comments/:movieId`
      );
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
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
                <button onClick={rateMovie} className="btn btn-rate">
                  <FaStar /> Rate It
                </button>
                <button onClick={markAsFavourite} className="btn btn-favourite">
                  <FaRegHeart /> Mark as Favourite
                </button>
                <button onClick={playTrailer} className="btn btn-trailer">
                  <FaPlay /> Play Trailer
                </button>
              </div>
            </div>
            <br />
            <h2>Overview</h2>
            <p>{movie.overview}</p>

            {/* <h2>Cast</h2>
            <ul>
              {credits.cast?.slice(0, 10).map((actor) => (
                <li key={actor.cast_id}>
                  {actor.name} as {actor.character}
                </li>
              ))}
            </ul> */}
          </div>
        </div>
      </div>

      {/* <div className="row">
        <div className="col-12">
          <h2 className="text-center mt-4">Top Billed Cast</h2>
        </div>
      </div>
      <div className="row">
        {credits.cast?.slice(0, 10).map((actor) => (
          <div
            key={actor.cast_id}
            className="col-lg-2 col-md-3 col-sm-4 col-6 mb-3"
          >
            <div className="card card-cast">
              <img
                src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                alt={actor.name}
                className="card-img-top"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "default_actor.png";
                }}
              />
              <div className="card-body p-2">
                <h6 className="card-title mb-1">{actor.name}</h6>
                <p className="card-text">{actor.character}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} */}

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
          <div key={review.id} className="review">
            <p>{review.comment}</p>
            <p>Rating: {review.rating}</p>
            <p>
              By: <a href={`/user/${review.userId}`}>{review.username}</a>
            </p>
          </div>
        ))}
      </div>
      <SubmitCommentForm movieId={id} onCommentSubmit={handleCommentSubmit} />
      {/* 评论列表 */}
      <h2 className="mt-4">Reviews</h2>
      <div className="reviews-container">
        {reviews.map((review) => (
          <div key={review.id} className="review">
            {/* ...展示评论的内容... */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MovieDetails;
