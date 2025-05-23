import React from "react";
import "./MovieCart.scss";
import { Link } from "react-router-dom";

const MovieCart = ({ data }) => {
  return (
    <div>
      <Link to={`movie/${data.imdbID}`}>
        <div className="card-item">
          <div className="card-inner">
            <div className="card-top">
              <img src={data.Poster} alt={data.title} />
            </div>
            <div className="card-bottom">
              <div className="card-info">
                <h4> {data.Title}</h4>
                <p>{data.Year}</p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCart;
