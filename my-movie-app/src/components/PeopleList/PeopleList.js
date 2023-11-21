import React from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w154";

function PeopleList({ people }) {
  const navigate = useNavigate();

  const getGenderString = (genderCode) => {
    switch (genderCode) {
      case 1:
        return "Female";
      case 2:
        return "Male";
      default:
        return "Not specified";
    }
  };

  const handlePersonClick = (personId) => {
    // Navigate to the person details page with the personId
    navigate(`/people/${personId}`);
  };

  return (
    <div className="container">
      <div className="row">
        {people.map((person) => (
          <div
            key={person.id}
            className="col-md-3 mb-4"
            onClick={() => handlePersonClick(person.id)}
          >
            <div className="card person-card h-100">
              <img
                src={
                  person.profile_path
                    ? `${IMAGE_BASE_URL}${person.profile_path}`
                    : require("../../assets/images/default_profile.png")
                }
                alt={person.name}
                className="card-img-top"
                onError={(e) =>
                  (e.target.src = require("../../assets/images/default_profile.png"))
                }
              />
              <div className="card-body">
                <h5 className="card-title">{person.name}</h5>
                <p className="card-text">{getGenderString(person.gender)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PeopleList;
