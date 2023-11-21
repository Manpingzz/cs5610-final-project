import React, { useState, useEffect } from "react";
import MovieCard from "./MovieCard/MovieCard";
import { fetchPopularMovies } from "../services/movieService";

function PopularMovies() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPopularMovies();
        if (data && data.results) {
          setMovies(data.results);
        } else {
          // Handle the scenario where data is not in the expected format
          console.error("Data is not in the expected format", data);
        }
      } catch (error) {
        console.error("Error fetching popular movies:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="movie-list">
      {/* <h2>Popular</h2> */}
      {Array.isArray(movies) ? (
        movies.map((movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            date={movie.release_date}
            poster={movie.poster_path}
            rating={movie.vote_average}
          />
        ))
      ) : (
        <div>No popular movies to display</div>
      )}
    </div>
  );
}

export default PopularMovies;
