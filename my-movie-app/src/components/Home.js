// import React from "react";
// import MovieList from "./MovieList/MovieList";
// import TrendingMovies from "./TrendingMovies";
// import PopularMovies from "./PopularMovies";

// function Home({ searchResults }) {
//   return (
//     <div className="home">
//       <TrendingMovies />
//       <PopularMovies />
//     </div>
//   );
// }

import React from "react";
import TrendingMovies from "./TrendingMovies";
import PopularMovies from "./PopularMovies";
import "bootstrap/dist/css/bootstrap.min.css";

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
          <h2>Popular</h2>
          <PopularMovies />
        </div>
      </div>
    </div>
  );
}

export default Home;
