import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchTVShowDetails } from "../../services/tvService";
import "./index.css";

function TVShowDetails() {
  const [tvShow, setTvShow] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const loadData = async () => {
        const data = await fetchTVShowDetails(id);
        setTvShow(data);
      };
      loadData();
    } else {
      console.error("TV Show ID is undefined");
    }
  }, [id]);

  if (!tvShow) {
    return <div>Loading...</div>;
  }

  return (
    <div className="tv-show-details-container">
      <div className="tv-show-header">
        <img
          src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`}
          alt={tvShow.name}
          className="tv-show-poster"
        />
        <div className="tv-show-info">
          <h1>{tvShow.name}</h1>

          <p>
            <strong>Genres:</strong>{" "}
            {tvShow.genres.map((genre) => genre.name).join(", ")}
          </p>
          <p>
            <strong>Rating:</strong> {tvShow.vote_average}
          </p>
          <p>
            <strong>Number of Seasons:</strong> {tvShow.number_of_seasons}
          </p>
          <br />
          <p>
            <strong>Overview:</strong> {tvShow.overview}
          </p>
        </div>
      </div>
    </div>
  );
}

export default TVShowDetails;
