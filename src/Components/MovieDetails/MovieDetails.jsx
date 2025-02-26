import React, { useEffect, useState } from "react";
import "./MovieDetail.scss";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  fetchAsyncMovieOrShowDetail,
  getMovieOrShow,
  removeSelectedMovieOrShow,
} from "../../redux/movies/movieSLice";
import { type } from "@testing-library/user-event/dist/type";

const MovieDetail = () => {
  const { imdbID } = useParams();
  const dispatch = useDispatch();
  const data = useSelector(getMovieOrShow);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user_boutique"));
    if (user) {
      setUser(user);
    }
  }, []);

  useEffect(() => {
    dispatch(fetchAsyncMovieOrShowDetail(imdbID));
    return () => {
      dispatch(removeSelectedMovieOrShow());
    };
  }, [dispatch, imdbID]);
 
  

  const addToWatchlist = async () => {
    if (!user) {
      alert("Please log in to add movies to your watchlist.");
      return;
    }

    try {
      const response = await axios.get("http://localhost:3001/watchlist");
      const userWatchlist = response.data.filter(
        (item) => item.userId === user.id
      );

      const movieExists = userWatchlist.some(
        (item) => item.movieId === data.imdbID
      );
      if (movieExists) {
        alert("Movie is already in your watchlist.");
        return;
      }

      const movie = {
        userId: user.id, // Use actual user ID
        movieId: data.imdbID,
        title: data.Title,
        poster: data.Poster,
        imdbRating : data.imdbRating,
        type: data.Type
      };
 console.log(movie);
      await axios.post("http://localhost:3001/watchlist", movie);
      alert("Movie added to watchlist!");
    } catch (error) {
      console.error("Error adding movie to watchlist", error);
      alert("Failed to add movie to watchlist.");
    }
  };

  return (
    <div className="movie-section">
      {Object.keys(data).length === 0 ? (
        <div>...Loading</div>
      ) : (
        <>
          <div className="section-left">
            <div className="movie-title">{data.Title}</div>
            <div className="movie-rating">
              <span>
                IMDB Rating <i className="fa fa-star"></i> : {data.imdbRating}
              </span>
              <span>
                IMDB Votes <i className="fa fa-thumbs-up"></i> :{" "}
                {data.imdbVotes}
              </span>
              <span>
                Runtime <i className="fa fa-film"></i> : {data.Runtime}
              </span>
              <span>
                Year <i className="fa fa-calendar"></i> : {data.Year}
              </span>
            </div>
            <div className="movie-plot">{data.Plot}</div>
            <div className="movie-info">
              <div>
                <span>Director</span>
                <span>{data.Director}</span>
              </div>
              <div>
                <span>Stars</span>
                <span>{data.Actors}</span>
              </div>
              <div>
                <span>Generes</span>
                <span>{data.Genre}</span>
              </div>
              <div>
                <span>Languages</span>
                <span>{data.Language}</span>
              </div>
              <div>
                <span>Awards</span>
                <span>{data.Awards}</span>
              </div>
            </div>
          </div>
          <div className="section-right">
            <img src={data.Poster} alt={data.Title} />
            <button onClick={addToWatchlist} className="watchlist-button">
              Add to Watchlist
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MovieDetail;
