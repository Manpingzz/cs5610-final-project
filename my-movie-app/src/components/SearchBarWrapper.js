import React from "react";
import { useLocation } from "react-router-dom";
import SearchBar from "./SearchBar/SearchBar";

function SearchBarWrapper({ onSearch }) {
  const location = useLocation();

  if (["/login", "/register"].includes(location.pathname)) {
    return null; // Don't display the SearchBar on these routes
  }

  return <SearchBar onSearch={onSearch} />;
}

export default SearchBarWrapper;
