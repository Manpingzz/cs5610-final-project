import React from "react";
import { Link } from "react-router-dom";
import "./index.css";

function TVShowCard({ show }) {
  return (
    <Link to={`/tv/${show.id}`} className="tv-show-card-link">
      <div className="tv-show-card">
        <img
          src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
          alt={show.name}
        />
        <div className="tv-show-card-body">
          <h3>{show.name}</h3>
          <p>{show.overview}</p>
        </div>
      </div>
    </Link>
  );
}

export default TVShowCard;
