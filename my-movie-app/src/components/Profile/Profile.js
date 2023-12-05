import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import * as client from "../client.js";
import "./index.css";

function Profile() {
  const { auth } = useContext(AuthContext);
  console.log("AuthContext:", auth);

  const [userData, setUserData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [userRatings, setUserRatings] = useState([]);
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

    // user rating
    // const fetchUserRatings = async () => {
    //   if (auth.user && auth.user._id) {
    //     try {
    //       const ratings = await client.getUserRatings(auth.user._id);
    //       console.log("ratings:", ratings);
    //       setUserRatings(ratings);
    //     } catch (error) {
    //       console.error("Error fetching user ratings:", error);
    //     }
    //   }
    // };
    const fetchUserRatings = async () => {
      if (auth.user && auth.user._id) {
        try {
          const ratings = await client.getUserRatings(auth.user._id);

          const ratingsWithDetails = await Promise.all(
            ratings.map(async (rating) => {
              try {
                const movieDetails = await client.getMovieDetails(
                  rating.movieId
                );
                return { ...rating, movieDetails };
              } catch (error) {
                console.error(
                  `Error fetching details for movie ${rating.movieId}:`,
                  error
                );
                return { ...rating, movieDetails: null };
              }
            })
          );

          setUserRatings(ratingsWithDetails);
        } catch (error) {
          console.error("Error fetching user ratings:", error);
        }
      }
    };

    fetchUserRatings();

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

  const fetchUserRatings = async () => {
    if (auth.user && auth.user._id) {
      try {
        const ratings = await client.getUserRatings(auth.user._id);
        const ratingsWithDetails = await Promise.all(
          ratings.map(async (rating) => {
            const movieDetails = await client.getMovieDetails(rating.movieId);
            return { ...rating, movieDetails };
          })
        );
        setUserRatings(ratingsWithDetails);
      } catch (error) {
        console.error("Error fetching user ratings:", error);
      }
    }
  };

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

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmNewPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await client.updateUser(auth.user._id, {
        ...userData,
        password: newPassword,
      });
      alert("Password updated successfully.");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Failed to update password.");
    }
  };

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
        <button
          className={activeTab === "ratings" ? "active" : ""}
          onClick={() => setActiveTab("ratings")}
        >
          Ratings
        </button>
      </div>
      <div className="profile-details">
        {activeTab === "personal" && (
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <p>
                <strong>Username:</strong> {userData.username}
              </p>
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
        )}
        {activeTab === "security" && (
          <div className="security-section">
            <p>
              <strong>Username:</strong> {userData.username}
            </p>

            <div className="form-group mt-3 mb-3">
              <label>New Password:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="form-group mt-3 mb-3">
              <label>Confirm New Password:</label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </div>
            <button className="btn" onClick={handlePasswordUpdate}>
              Update Password
            </button>
          </div>
        )}
        {activeTab === "watchlist" && (
          <div className="watchlist-section">
            {watchList.map((movie) => (
              <Link
                to={`/movie/${movie.id}`}
                key={movie.id}
                className="watch-movie-card-link"
              >
                <div className="watch-movie-card">
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    alt={movie.title}
                    className="watch-movie-image"
                  />
                  <div className="movie-info">
                    <h3>{movie.title}</h3>
                    <p>{movie.release_date}</p>
                    <p>
                      <span className="star-icon">⭐</span> {movie.vote_average}
                    </p>
                    {/* <p>{movie.overview}</p> */}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {activeTab === "ratings" && (
          <div className="ratings-section">
            <h5>My Ratings</h5>
            {userRatings.length > 0 ? (
              <div>
                {userRatings.map((rating, index) => (
                  <div key={index} className="watch-movie-card">
                    <Link to={`/movie/${rating.movieId}`}>
                      <img
                        src={`https://image.tmdb.org/t/p/w500/${rating.movieDetails.poster_path}`}
                        alt={rating.movieDetails.title}
                        className="watch-movie-image"
                      />
                      <div className="movie-info">
                        <Link to={`/movie/${rating.movieId}`}>
                          <h3>{rating.movieDetails.title}</h3>
                        </Link>
                        <p>Rating: {rating.rating}</p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p>No ratings available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
