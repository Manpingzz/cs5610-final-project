import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import * as client from "../client";
import "./index.css";
import { Tab, Nav } from "react-bootstrap";

function UserProfile() {
  const { username } = useParams();
  const { auth } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [userRatings, setUserRatings] = useState([]);
  const [userComments, setUserComments] = useState([]);

  const fetchUserData = async () => {
    try {
      const data = await client.getUserDataByUsername(username);
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchUserRatings = async (userId) => {
    try {
      const ratings = await client.getUserRatings(userId);
      const ratingsWithDetails = await Promise.all(
        ratings.map(async (rating) => {
          try {
            const movieDetails = await client.getMovieDetails(rating.movieId);
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
  };

  const fetchUserComments = async (userId) => {
    try {
      const comments = await client.getUserComments(userId);
      const commentsWithMovieDetails = await Promise.all(
        comments.map(async (comment) => {
          try {
            const movieDetails = await client.getMovieDetails(comment.movieId);
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
  };

  useEffect(() => {
    if (username) {
      fetchUserData();
    }
  }, [username]);

  useEffect(() => {
    if (userData && userData._id) {
      fetchUserRatings(userData._id);
      fetchUserComments(userData._id);
    }
  }, [userData]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-profile-container mt-4">
      <h1>User Info</h1>
      <br />
      <h3>Username: {userData.username}</h3>
      <br />
      <Tab.Container defaultActiveKey="ratings">
        <Nav variant="tabs" className="mb-3">
          <Nav.Item>
            <Nav.Link eventKey="ratings">User's Ratings</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="comments">User's Comments</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="ratings">
            <div className="ratings-section mt-3">
              <ul className="list-unstyled">
                {auth.token &&
                userRatings.filter((rating) => rating.rating > 0).length > 0 ? (
                  userRatings
                    .filter((rating) => rating.rating > 0)
                    .map((rating, index) => (
                      <li key={index} className="mb-2">
                        <Link
                          to={`/movie/${rating.movieId}`}
                          className="d-flex align-items-center"
                        >
                          <img
                            src={`https://image.tmdb.org/t/p/w185/${rating.movieDetails?.poster_path}`}
                            alt={rating.movieDetails?.title}
                            className="me-2"
                            style={{ width: "180px", height: "auto" }}
                          />
                          <div>
                            <h6>{rating.movieDetails?.title}</h6>
                            <p>
                              Rating:
                              <span className="badge bg-primary">
                                {rating.rating}
                              </span>
                            </p>
                          </div>
                        </Link>
                      </li>
                    ))
                ) : (
                  <p>No ratings available.</p>
                )}
              </ul>
            </div>
          </Tab.Pane>

          <Tab.Pane eventKey="comments">
            <div className="comments-section mt-3">
              {auth.token && userComments.length > 0 ? (
                <ul className="user-comments-list">
                  {userComments
                    .filter(
                      (comment) =>
                        comment.comment &&
                        comment.comment.trim() !== "" &&
                        comment.comment !== "No comment"
                    )
                    .map((comment, index) => (
                      <li key={index} className="comment-item">
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
                          <h6>{comment.movieDetails.title}</h6>
                          <p className="comment-text">{comment.comment}</p>
                        </div>
                      </li>
                    ))}
                </ul>
              ) : (
                <p>No comments available.</p>
              )}
            </div>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
}

export default UserProfile;
