import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchUpcomingMovies } from "../services/movieService";
import MovieCard from "./MovieCard/MovieCard";

const UpcomingMovies = () => {
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    if (!auth.user) {
      return;
    }

    const getUpcomingMovies = async () => {
      try {
        const data = await fetchUpcomingMovies();
        setUpcomingMovies(data.results);
      } catch (error) {
        console.error("Error fetching upcoming movies:", error);
      }
    };

    getUpcomingMovies();
  }, [auth.user]);

  if (!auth.user) {
    return <div>Please log in to view upcoming movies.</div>;
  }

  return (
    <div className="upcoming-movies">
      <h2>Upcoming</h2>
      <div className="movie-list">
        {upcomingMovies.map((movie) => (
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
    </div>
  );
};

export default UpcomingMovies;
