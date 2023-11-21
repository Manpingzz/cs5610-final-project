import React, { useState, useEffect } from "react";
import TVShowCard from "../TVShowCard/TVShowCard";
import {
  fetchTVShowDetails,
  fetchPopularTVShows,
} from "../../services/tvService";
import "./index.css";

function TVShowList() {
  const [shows, setShows] = useState([]);

  useEffect(() => {
    const getTVShows = async () => {
      const data = await fetchPopularTVShows();
      setShows(data);
    };

    getTVShows();
  }, []);

  if (!shows || shows.length === 0) {
    return <p>No TV shows found.</p>;
  }

  return (
    <div className="tv-show-list">
      {shows.map((show) => (
        <TVShowCard key={show.id} show={show} />
      ))}
    </div>
  );
}

export default TVShowList;
