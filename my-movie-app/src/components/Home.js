import React from "react";
import TrendingMovies from "./TrendingMovies";
import PopularMovies from "./PopularMovies";
import "bootstrap/dist/css/bootstrap.min.css";
import UpcomingMovies from "./UpcomingMovies";

function Home() {
  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-12">
          <h2>Trending</h2>
          <TrendingMovies />
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-12">
          <UpcomingMovies />
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-12">
          <h2>Popular</h2>
          <PopularMovies />
        </div>
      </div>
    </div>
  );
}

export default Home;
