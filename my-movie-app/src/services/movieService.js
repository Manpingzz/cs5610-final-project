export const BASE_URL = "https://api.themoviedb.org/3";
export const API_KEY = process.env.REACT_APP_TMBD_API_KEY;

// Trending
export const fetchTrendingMovies = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log("Data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    return null;
  }
};

// Popular
export const fetchPopularMovies = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    return [];
  }
};

// search
export const searchMovies = async (query) => {
  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        query
      )}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error searching movies:", error);
    return [];
  }
};

export const searchPeople = async (searchTerm) => {
  try {
    const response = await fetch(
      `${BASE_URL}/search/person?api_key=${API_KEY}&query=${encodeURIComponent(
        searchTerm
      )}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching people:", error);
  }
};

// search TV shows
export const searchTVShows = async (query) => {
  const url = `${BASE_URL}/search/tv?api_key=${API_KEY}&language=en-US&page=1&query=${encodeURIComponent(
    query
  )}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data.results;
};

// upcoming movies
export const fetchUpcomingMovies = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/upcoming?api_key=${API_KEY}`
    );
    console.log("response upcoming:", response);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching upcoming movies:", error);
  }
};
