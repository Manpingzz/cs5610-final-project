import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchPersonDetails } from "../services/personService";

export const BASE_URL = "https://api.themoviedb.org/3";
export const API_KEY = process.env.REACT_APP_TMBD_API_KEY;

function PersonDetails() {
  const [person, setPerson] = useState(null);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const loadData = async () => {
  //     const data = await fetchPersonDetails(id);
  //     setPerson(data);
  //   };
  //   loadData();
  // }, [id]);

  // if (!person) {
  //   return <div>Loading...</div>;
  // }

  useEffect(() => {
    const fetchPersonDetails = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/person/${id}?api_key=${API_KEY}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPerson(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching person details:", error);
      }
    };
    fetchPersonDetails();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-3">
          <img
            src={`https://image.tmdb.org/t/p/w300${person.profile_path}`}
            alt={person.name}
            className="img-fluid rounded"
          />
        </div>
        <div className="col-md-9">
          <h2>{person.name}</h2>
          <br />
          <h4>Personal Info</h4>
          <p>
            <strong>Known For:</strong> {person.known_for_department}
          </p>
          <p>
            <strong>Gender:</strong> {person.gender === 1 ? "Female" : "Male"}
          </p>
          <p>
            <strong>Birthday:</strong> {person.birthday}
          </p>
          <p>
            <strong>Place of Birth:</strong> {person.place_of_birth}
          </p>
          <p>
            <strong>Also Known As:</strong> {person.also_known_as?.join(", ")}
          </p>
          <br />
          <h4>Biography</h4>
          <p>{person.biography}</p>
        </div>
      </div>
    </div>
  );
}

export default PersonDetails;
