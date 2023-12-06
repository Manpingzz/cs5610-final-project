import axios from "axios";

const request = axios.create({
  withCredentials: true,
});

export const BASE_API =
  process.env.REACT_APP_BASE_API_URL || "http://localhost:4000";
export const USERS_API = `${BASE_API}/api/users`;
const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.REACT_APP_TMBD_API_KEY;

export const signin = async (credentials) => {
  const response = await request.post(`${USERS_API}/signin`, credentials);
  return response.data;
};
export const signout = async () => {
  const response = await request.post(`${USERS_API}/signout`);
  return response.data;
};

export const signup = async (credentials) => {
  // const response = await request.post(`${USERS_API}/signup`, credentials);
  // return response.data;

  console.log("Sending signup request with credentials:", credentials);
  try {
    const response = await request.post(`${USERS_API}/signup`, credentials);
    console.log("Received response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Signup request failed:", error);
    throw error;
  }
};

export const account = async () => {
  const response = await request.post(`${USERS_API}/account`);
  return response.data;
};

export const findAllUsers = async () => {
  const response = await request.get(USERS_API);
  return response.data;
};

export const findUserById = async (id) => {
  const response = await request.get(`${USERS_API}/${id}`);
  return response.data;
};
export const createUser = async (user) => {
  const response = await request.post(`${USERS_API}`, user);
  return response.data;
};
export const updateUser = async (id, user) => {
  // const response = await request.put(`${USERS_API}/${id}`, user);
  const url = `${USERS_API}/${id}`;
  console.log(`Sending update request to URL: ${url}`, user);

  const response = await request.put(url, user);

  return response.data;
};

export const deleteUser = async (id) => {
  const response = await request.delete(`${USERS_API}/${id}`);
  return response.data;
};

export const getUserData = async (username) => {
  try {
    const response = await request.get(
      `${USERS_API}/profile/username/${username}`
    );
    console.log("Received user data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const verifyToken = async (token) => {
  try {
    const response = await fetch("/api/verifyToken", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new TypeError("Received response is not in JSON format");
    }

    const result = await response.json();
    return result.valid;
  } catch (error) {
    console.error("Error during token verification:", error);
    return false;
  }
};

export const addToWatchlist = async (userId, movieId) => {
  try {
    const response = await request.post(`${USERS_API}/${userId}/watchlist`, {
      movieId,
    });
    console.log("Response for adding to watchlist:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding to watchlist:", error);
    throw error;
  }
};

export const getWatchList = async (userId) => {
  try {
    const response = await axios.get(`${USERS_API}/${userId}/watchlist`);

    return response.data;
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    throw error;
  }
};

export const getMovieDetails = async (movieId) => {
  try {
    const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`;
    const response = await axios.get(url);
    console.log("getMovieDetails:", response);

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to fetch movie details");
    }
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};

export const getUserRatings = async (userId) => {
  try {
    const response = await request.get(`${BASE_API}/api/userRatings/${userId}`);
    console.log("Received user ratings:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching user ratings:", error);
    throw error;
  }
};

export const createComment = async (commentData) => {
  const response = await request.post(`${BASE_API}/api/comments`, commentData);
  return response.data;
};

export const getUserComments = async (userId) => {
  try {
    const response = await axios.get(`${BASE_API}/api/comments/user/${userId}`);
    console.log("User comments:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching user comments:", error);
    throw error;
  }
};

export const deleteComment = async (commentId) => {
  try {
    const response = await axios.delete(
      `${BASE_API}/api/comments/${commentId}`
    );
    return response.data; // response.status === 200
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};

export const updateComment = async (commentId, commentData) => {
  try {
    console.log(`Updating comment at /api/comments/${commentId}`, commentData);
    const response = await axios.put(
      `${BASE_API}/api/comments/${commentId}`,
      commentData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating comment:", error);
    throw error;
  }
};
export const getUserDataByUsername = async (username) => {
  console.log("API URL being called:", `${USERS_API}/username/${username}`);
  try {
    const response = await request.get(`${USERS_API}/username/${username}`);
    console.log("Received user data by username:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data by username:", error);
    throw error;
  }
};
