import axios from "axios";

const request = axios.create({
  withCredentials: true,
});

export const BASE_API =
  process.env.REACT_APP_BASE_API_URL || "http://localhost:4000";
export const USERS_API = `${BASE_API}/api/users`;

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
