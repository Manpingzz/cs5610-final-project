import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from "./components/Navbar/Navbar";
import SearchBar from "./components/SearchBar/SearchBar";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import "./styles/main.css";
import MovieDetails from "./components/MovieDetails/MovieDetails";
import { BASE_URL, API_KEY } from "./services/movieService";
import {
  searchMovies,
  searchPeople,
  searchTVShows,
} from "./services/movieService";
import PeopleList from "./components/PeopleList/PeopleList";
import SearchResults from "./components/SearchResults";
import SearchBarWrapper from "./components/SearchBarWrapper";
import PersonDetails from "./components/PersonDetails";
import TVShowDetails from "./components/TVShowDetails/TVShowDetails";

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [searchType, setSearchType] = useState("movie");

  const handleSearch = async (searchTerm, type) => {
    setSearchType(type);
    let results;
    if (type === "movie") {
      results = await searchMovies(searchTerm);
    } else if (type === "person") {
      results = await searchPeople(searchTerm);
    } else if (type === "tv") {
      results = await searchTVShows(searchTerm);
    }
    setSearchResults(results);
  };

  return (
    <Router>
      <Navbar />
      <div className="app">
        <SearchBarWrapper onSearch={handleSearch} />
        <Routes>
          <Route path="/" element={<Home searchResults={searchResults} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />

          <Route
            path="/search"
            element={
              <SearchResults results={searchResults} type={searchType} />
            }
          />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/people/:id" element={<PersonDetails />} />
          <Route path="/tv/:id" element={<TVShowDetails />} />

          {/* <Route
            path="/search"
            element={
              <SearchResults results={searchResults} type={searchType} />
            }
          /> */}
          {/* <Route path="/" element={<Home searchResults={searchResults} />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          {searchResults.length > 0 && searchType === "person" && (
            <Route path="/" element={<PeopleList people={searchResults} />} />
          )} */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
