import React from "react";
import { useSelector } from "react-redux";
import { getAllMovies, getAllShows } from "../../redux/movies/movieSLice";
import "./MovieList.scss";
import MovieCart from "../MovieCart/MovieCart";
import Slider from "react-slick";
import { settings } from "../../common/settings";

const MovieList = () => {
  const movies = useSelector(getAllMovies);
  const shows = useSelector(getAllShows);

  let renderMovies,
    renderShows = "";

  renderMovies =
    movies.Response === "True" ? (
      movies.Search.map((movie, i) => {
        return <MovieCart key={i} data={movie} />;
      })
    ) : (
      <div className="ntf-error">
        <h3>Movie Not Found</h3>
      </div>
    );

  renderShows =
    shows.Response === "True" ? (
      shows.Search.map((movie, i) => {
        return <MovieCart key={i} data={movie} />;
      })
    ) : (
      <div className="ntf-error">
        <h3>Tv Show Not Found</h3>
      </div>
    );

  return (
    <div className="movie-wrapper">
      <div className="movie-list">
        <h2>Movies</h2>
        <div className="movie-container">
          <Slider {...settings}>
            {renderMovies}
          </Slider>
        </div>
      </div>
      <div className="show-list">
        <h2>Tv Shows</h2>
        <div className="show-container">
          <Slider {...settings}>
            {renderShows}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default MovieList;
