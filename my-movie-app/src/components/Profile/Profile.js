import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import * as client from "../client.js";
import "./index.css";

function Profile() {
  const { auth } = useContext(AuthContext);
  console.log("AuthContext:", auth);

  const [userData, setUserData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [watchList, setWatchList] = useState([]);

  useEffect(() => {
    console.log("auth.user:", auth.user);

    const fetchUserData = async () => {
      if (auth.user && auth.user.username) {
        try {
          const data = await client.getUserData(auth.user.username);
          setUserData(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();

    //watchlist
    const fetchFavoritesData = async () => {
      if (auth.user && auth.user.favorites) {
        try {
          const favorites = auth.user.favorites;
          console.log("favorites:", favorites);
          const favoritesInfo = await Promise.all(
            favorites.map(async (movieId) => {
              const movieData = await client.getMovieDetails(movieId);
              console.log("movieData:", movieData);
              return movieData;
            })
          );
          setWatchList(favoritesInfo);
        } catch (error) {
          console.error("Error fetching favorites data:", error);
        }
      }
    };
    fetchFavoritesData();
  }, [auth.user]);

  const handleUpdate = async (event) => {
    event.preventDefault();
    const userId = auth.user._id;

    try {
      await client.updateUser(userId, userData);
      alert("Profile updated successfully.");
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  if (!auth.user) {
    return <div>Please login to view this page.</div>;
  }

  return (
    <div className="profile-container">
      <h1>User Profile</h1>
      <div className="profile-tabs">
        <button
          className={activeTab === "personal" ? "active" : ""}
          onClick={() => setActiveTab("personal")}
        >
          Personal Information
        </button>
        <button
          className={activeTab === "security" ? "active" : ""}
          onClick={() => setActiveTab("security")}
        >
          Security
        </button>
        <button
          className={activeTab === "watchlist" ? "active" : ""}
          onClick={() => setActiveTab("watchlist")}
        >
          Watchlist
        </button>
      </div>
      <div className="profile-details">
        {activeTab === "personal" ? (
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <p>
                <strong>Username:</strong> {userData.username}
              </p>
              {/* <input
                type="text"
                value={userData.username}
                onChange={(e) =>
                  setUserData({ ...userData, username: e.target.value })
                }
              /> */}
            </div>
            <div className="form-group mt-3 mb-3">
              <label>Email:</label>
              <input
                type="email"
                value={userData.email}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
              />
            </div>
            <div className="form-group mt-3 mb-3">
              <label>First Name:</label>
              <input
                type="text"
                value={userData.firstName}
                onChange={(e) =>
                  setUserData({ ...userData, firstName: e.target.value })
                }
              />
            </div>
            <div className="form-group mt-3 mb-3">
              <label>Last Name:</label>
              <input
                type="text"
                value={userData.lastName}
                onChange={(e) =>
                  setUserData({ ...userData, lastName: e.target.value })
                }
              />
            </div>
            <button className="btn" type="submit">
              Save Changes
            </button>
          </form>
        ) : activeTab === "security" ? (
          <div className="security-section">
            <h2>Security</h2>
            <p>
              <strong>Username:</strong> {userData.username}
            </p>
            <p>
              <strong>Password:</strong> ********
            </p>
            <button className="btn" onClick={() => alert("Change Password")}>
              Change Password
            </button>
          </div>
        ) : (
          <div className="watchlist-section">
            <h2>Watchlist</h2>
            <ul>
              {watchList.map((movie) => (
                <li key={movie.id}>
                  <h3>{movie.title}</h3>
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    alt={movie.title}
                  />
                  <p>{movie.description}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
