import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import MovieList from "../MovieList/MovieList";
import {
  fetchAsyncMovies,
  fetchAsyncShows,
  getAllMovies,
  getAllShows,
} from "../../redux/movies/movieSLice";

const Home = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const movies = useSelector(getAllMovies);
  const shows = useSelector(getAllShows);

  // Extract the search term from the URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("search") || ""; // Default to empty if not present

  useEffect(() => {
    if (searchTerm) {
      dispatch(fetchAsyncMovies(searchTerm)); // Fetch movies based on search term
      dispatch(fetchAsyncShows(searchTerm)); // Fetch shows based on search term
    } else {
      // Fetch default data (when no search term is provided)
      dispatch(fetchAsyncMovies("Harry"));
      dispatch(fetchAsyncShows("friends"));
    }
  }, [dispatch, searchTerm]); // Trigger this effect whenever the searchTerm changes

  return (
    <div>
      <div className="banner-img"></div>
      <MovieList />
    </div>
  );
};

export default Home;
