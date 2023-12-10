import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MovieList from "./MovieList/MovieList";
import PeopleList from "./PeopleList/PeopleList";
import TVShowList from "./TVShowList/TVShowList";
import {
  searchMovies,
  searchPeople,
  searchTVShows,
} from "../services/movieService";

function SearchResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const criteria = searchParams.get("criteria") || "";
  const type = searchParams.get("type") || "all";

  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let fetchedResults = [];

      if (type === "movie") {
        fetchedResults = await searchMovies(criteria);
      } else if (type === "tv") {
        fetchedResults = await searchTVShows(criteria);
      } else if (type === "person") {
        fetchedResults = await searchPeople(criteria);
      }

      setResults(fetchedResults);
      sessionStorage.setItem("searchResults", JSON.stringify(fetchedResults));
      sessionStorage.setItem("searchCriteria", criteria);
    };

    if (criteria) {
      fetchData();
    }
  }, [criteria, type]);

  const renderResults = () => {
    if (type === "movie") {
      return <MovieList movies={results} />;
    } else if (type === "tv") {
      return <TVShowList shows={results} />;
    } else if (type === "person") {
      return <PeopleList people={results} />;
    }
  };

  return <div className="container">{renderResults()}</div>;
}

export default SearchResults;
