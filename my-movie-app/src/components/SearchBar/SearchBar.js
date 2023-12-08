import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import "../../styles/main.css";

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("movie");

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Searching for:", searchTerm);
    onSearch(searchTerm, searchType);
    const searchUrl = `/search?criteria=${searchTerm}&type=${searchType}`;

    navigate(searchUrl);
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search movies, TV shows, person..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: "6px" }}
        />
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="movie">Movies</option>
          <option value="tv">TV Shows</option>
          <option value="person">People</option>
        </select>
        <button type="submit" style={{ marginLeft: "8px" }}>
          Search
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
