export const BASE_URL = "https://api.themoviedb.org/3";
export const API_KEY = process.env.REACT_APP_TMBD_API_KEY;

export const fetchPersonDetails = async (id) => {
  try {
    const response = await fetch(
      `${BASE_URL}/person/${id}?api_key=${API_KEY}&language=en-US`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching person details:", error);
    return null;
  }
};
