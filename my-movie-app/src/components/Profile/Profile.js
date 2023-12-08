import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import * as client from "../client.js";
import "./index.css";

function Profile() {
  const { auth } = useContext(AuthContext);
  // console.log("AuthContext:", auth);

  const [userData, setUserData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [userRatings, setUserRatings] = useState([]);
  const [watchList, setWatchList] = useState([]);
  const [userComments, setUserComments] = useState([]);
  const [editedText, setEditedText] = useState("");
  const [editModeReview, setEditModeReview] = useState({});

  useEffect(() => {
    console.log("Profile component mounted or auth.user changed");
    // console.log("auth.user:", auth.user);

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

    const fetchUserComments = async () => {
      if (auth.user && auth.user._id) {
        try {
          const comments = await client.getUserComments(auth.user._id);

          const commentsWithMovieDetails = await Promise.all(
            comments.map(async (comment) => {
              try {
                const movieDetails = await client.getMovieDetails(
                  comment.movieId
                );
                return { ...comment, movieDetails };
              } catch (error) {
                console.error(
                  `Error fetching details for movie ${comment.movieId}:`,
                  error
                );
                return { ...comment, movieDetails: null };
              }
            })
          );

          setUserComments(commentsWithMovieDetails);
        } catch (error) {
          console.error("Error fetching user comments:", error);
        }
      }
    };

    const fetchFavoritesData = async () => {
      console.log("fetchFavoritesData called");
      if (auth.user && auth.user.favorites) {
        try {
          const favorites = auth.user.favorites;
          console.log("Fetched favorites from auth.user:", favorites);

          const favoritesInfo = await Promise.all(
            favorites.map(async (movieId) => {
              const movieData = await client.getMovieDetails(movieId);
              console.log(`Fetched movie data for ID ${movieId}:`, movieData);
              return movieData;
            })
          );
          console.log("Processed favorites info:", favoritesInfo);
          setWatchList(favoritesInfo);
          console.log("Updated watchList state:", favoritesInfo);
        } catch (error) {
          console.error("Error fetching favorites data:", error);
        }
      } else {
        console.log(
          "No favorites found in auth.user or auth.user is undefined"
        );
      }
    };

    fetchUserData();
    fetchUserRatings();
    fetchUserComments();

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

  const handleDeleteComment = async (commentId) => {
    try {
      await client.deleteComment(commentId);
      const updatedComments = userComments.filter(
        (comment) => comment._id !== commentId
      );
      setUserComments(updatedComments);
      alert("Comment deleted successfully.");
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment.");
    }
  };

  const handleEditClick = (commentId) => {
    setEditedText(
      userComments.find((comment) => comment._id === commentId).comment
    );
    setEditModeReview((prevModes) => ({
      ...prevModes,
      [commentId]: true,
    }));
  };

  const handleEditComment = async (commentId, updatedText) => {
    try {
      await client.updateComment(commentId, { text: updatedText });
      const updatedComments = userComments.map((comment) =>
        comment._id === commentId ? { ...comment, text: updatedText } : comment
      );
      setUserComments(updatedComments);
      alert("Comment updated successfully.");
    } catch (error) {
      console.error("Error updating comment:", error);
      alert("Failed to update comment.");
    }
  };

  const handleSaveComment = async (commentId) => {
    try {
      console.log("Saving comment:", commentId, editedText);
      const updatedCommentData = { comment: editedText };
      const response = await client.updateComment(
        commentId,
        updatedCommentData
      );
      const updatedComment = response.updatedComment;

      const updatedComments = userComments.map((comment) =>
        comment._id === commentId ? { ...comment, ...updatedComment } : comment
      );
      setUserComments(updatedComments);

      setEditModeReview((prevModes) => ({
        ...prevModes,
        [commentId]: false,
      }));
      setEditedText("");

      alert("Comment updated successfully.");
    } catch (error) {
      console.error("Error updating comment:", error);
      alert("Failed to update comment.");
    }
  };

  return (
    <div className="profile-container">
      <h1>My Profile</h1>
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
        <button
          className={activeTab === "reviews" ? "active" : ""}
          onClick={() => setActiveTab("reviews")}
        >
          Reviews
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
        {activeTab === "watchlist" &&
          console.log("Rendering watchlist with data:", watchList)}
        {activeTab === "watchlist" && (
          <div className="watchlist-section">
            {watchList.map((movie) => {
              if (
                !movie.id ||
                !movie.poster_path ||
                !movie.title ||
                !movie.release_date ||
                !movie.vote_average
              ) {
                console.error("Missing properties in movie object:", movie);
                return null;
              }

              return (
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
                        <span className="star-icon">⭐</span>{" "}
                        {movie.vote_average}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {activeTab === "ratings" && (
          <div className="ratings-section">
            <h5>My Ratings</h5>
            {userRatings.length > 0 ? (
              <div>
                {userRatings
                  .filter((rating) => rating.rating > 0)
                  .map((rating, index) => (
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
        {/* {activeTab === "reviews" && (
          <div className="reviews-section">
            <h5>My Reviews</h5>
            {userComments.length > 0 ? (
              <ul className="user-comments-list">
                {userComments.map((comment) => (
                  <li key={comment._id} className="comment-item">
                    {console.log("Rendering comment:", comment)}
                    <Link to={`/movie/${comment.movieId}`}>
                      {comment.movieDetails && (
                        <img
                          src={`https://image.tmdb.org/t/p/w154/${comment.movieDetails.poster_path}`}
                          alt={comment.movieDetails.title}
                          className="movie-poster"
                        />
                      )}
                    </Link>
                    <div>
                      <h6>
                        {comment.movieDetails
                          ? comment.movieDetails.title
                          : "Movie Title"}
                      </h6>
                      {editModeReview[comment._id] ? (
                        <>
                          <input
                            type="text"
                            value={editedText}
                            onChange={(e) => setEditedText(e.target.value)}
                          />
                          <button
                            onClick={() => handleSaveComment(comment._id)}
                          >
                            Save
                          </button>
                          <button
                            onClick={() =>
                              setEditModeReview((prevModes) => ({
                                ...prevModes,
                                [comment._id]: false,
                              }))
                            }
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <p className="comment-text">{comment.comment}</p>

                          <button
                            onClick={() => {
                              setEditedText(comment.comment);
                              setEditModeReview((prevModes) => ({
                                ...prevModes,
                                [comment._id]: true,
                              }));
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No comments available.</p>
            )}
          </div>
        )} */}
        {activeTab === "reviews" && (
          <div className="reviews-section">
            <h5>My Reviews</h5>
            <ul className="user-comments-list">
              {userComments.map(
                (comment) =>
                  comment.comment &&
                  comment.comment &&
                  comment.comment.trim() !== "" &&
                  comment.comment !== "No comment" && (
                    <li key={comment._id} className="comment-item">
                      <Link to={`/movie/${comment.movieId}`} className="mx-3">
                        {comment.movieDetails && (
                          <img
                            src={`https://image.tmdb.org/t/p/w154/${comment.movieDetails.poster_path}`}
                            alt={comment.movieDetails.title}
                            className="movie-poster"
                          />
                        )}
                      </Link>
                      <div>
                        <h6 className="mx-3">
                          {comment.movieDetails
                            ? comment.movieDetails.title
                            : "Movie Title"}
                        </h6>
                        {editModeReview[comment._id] ? (
                          <>
                            <input
                              type="text"
                              value={editedText}
                              onChange={(e) => setEditedText(e.target.value)}
                            />
                            <button
                              onClick={() => handleSaveComment(comment._id)}
                            >
                              Save
                            </button>
                            <button
                              onClick={() =>
                                setEditModeReview((prevModes) => ({
                                  ...prevModes,
                                  [comment._id]: false,
                                }))
                              }
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <p className="comment-text mx-3">
                              {comment.comment}
                            </p>
                            <br />
                            <button
                              className="btn-edit mx-2"
                              onClick={() => {
                                setEditedText(comment.comment);
                                setEditModeReview((prevModes) => ({
                                  ...prevModes,
                                  [comment._id]: true,
                                }));
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="btn-danger"
                              onClick={() => handleDeleteComment(comment._id)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </li>
                  )
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
