import React from "react";
import MovieCard from "../MovieCard/MovieCard";
import "./index.css";
import "../../styles/main.css";

function MovieList({ movies }) {
  console.log("Movies:", movies);

  return (
    <div className="movie-list">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          id={movie.id}
          title={movie.title}
          description={movie.overview}
          poster={movie.poster_path}
          director={movie.director}
          rating={movie.vote_average}
        />
      ))}
      {/* {movies.map((movie) => (
        <MovieCard key={movie.id} {...movie} />
      ))} */}
    </div>
  );
}

export default MovieList;
