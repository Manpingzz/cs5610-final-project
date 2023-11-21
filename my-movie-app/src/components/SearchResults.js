import React, { useState } from "react";
import MovieList from "./MovieList/MovieList";
import PeopleList from "./PeopleList/PeopleList";
import TVShowList from "./TVShowList/TVShowList";

function SearchResults({ results, type }) {
  const [filter, setFilter] = useState("all");

  const filteredResults = () => {
    switch (filter) {
      case "movies":
        return results.filter((item) => item.media_type === "movie");
      case "tv":
        return results.filter((item) => item.media_type === "tv");
      case "people":
        return results.filter((item) => item.media_type === "person");
      default:
        return results;
    }
  };
  console.log("Filtered Results:", filteredResults());

  return (
    <div>
      {/* <div className="filters">
        <button onClick={() => setFilter("movies")}>Movies</button>
        <button onClick={() => setFilter("tv")}>TV Shows</button>
        <button onClick={() => setFilter("people")}>People</button>
      </div>

      {filter === "people" ? (
        <PeopleList people={filteredResults()} />
      ) : filter === "tv" ? (
        <TVShowList shows={filteredResults()} />
      ) : (
        <MovieList movies={filteredResults()} />
      )} */}

      {type === "movie" && <MovieList movies={results} />}
      {type === "tv" && <TVShowList shows={results} />}
      {type === "person" && <PeopleList people={results} />}
    </div>
  );
}

export default SearchResults;
