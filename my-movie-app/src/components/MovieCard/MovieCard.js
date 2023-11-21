import React from "react";
import { Link } from "react-router-dom";
import "./movieCard.css";
import "../../styles/main.css";

// // poster url
// const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";
// const POSTER_SIZE = "w500";

// function MovieCard({ id, title, description, poster, date, rating }) {
//   console.log("Poster path:", poster);
//   const posterUrl = poster ? `${IMAGE_BASE_URL}${POSTER_SIZE}${poster}` : null;

//   return (
//     <div className="movie-card">
//       <Link to={`/movie/${id}`}>
//         <img src={posterUrl} alt={title} />
//         <div className="movie-info">
//           <h3>{title}</h3>
//           <p>{description}</p>
//           <p>{date}</p>
//         </div>
//       </Link>
//     </div>
//   );
// }
// export default MovieCard;

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";
const POSTER_SIZE = "w500";
const DEFAULT_POSTER = "path/to/default/poster.jpg";

function MovieCard({ id, title, description, poster, date, rating }) {
  const posterUrl = poster
    ? `${IMAGE_BASE_URL}${POSTER_SIZE}${poster}`
    : DEFAULT_POSTER;

  // Check if description is available and truncate if too long
  // const formattedDescription = description
  //   ? description.length > 100
  //     ? `${description.substring(0, 100)}...`
  //     : description
  //   : "No description available.";

  return (
    <div className="card movie-card">
      <Link to={`/movie/${id}`} className="text-decoration-none">
        <img src={posterUrl} alt={title} className="movie-poster" />
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">
            <small className="text-muted">{date}</small>
          </p>
          {/* {rating && (
            <p className="card-text">
              <small className="text-muted">Rating: {rating}</small>
            </p>
          )} */}
        </div>
      </Link>
    </div>
  );
}

export default MovieCard;
