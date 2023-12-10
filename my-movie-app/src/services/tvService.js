export const BASE_URL = "https://api.themoviedb.org/3";
export const API_KEY = process.env.REACT_APP_TMBD_API_KEY;

export const fetchTVShowDetails = async (id) => {
  if (!id) {
    console.error("TV Show ID is undefined");
    return null;
  }

  try {
    const url = `${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=en-US`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Network response was not ok, status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching TV show details:", error);
    return null;
  }
};

export const fetchPopularTVShows = async () => {
  try {
    const url = `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=en-US`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching popular TV shows:", error);
    return [];
  }
};
