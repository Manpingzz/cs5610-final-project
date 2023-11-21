import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import MovieCard from "./MovieCard/MovieCard";
import { fetchTrendingMovies } from "../services/movieService";

function TrendingMovies() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchTrendingMovies();
      console.log("Data Trending:", data);

      setMovies(data.results);
    };

    fetchData();
  }, []);

  return (
    <div className="movie-list">
      {/* <h2>Trending</h2> */}

      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          id={movie.id}
          title={movie.title}
          description={movie.overview}
          date={movie.release_date}
          poster={movie.poster_path}
          rating={movie.vote_average}
        />
      ))}
    </div>
  );
}

export default TrendingMovies;
