import React, { useEffect, useState } from "react";
import "./watchlist.scss";
import axios from "axios";
import Slider from "react-slick";
import { watchlistSettings } from "./WatchsliderSetting";

const WatchList = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user_boutique"));
    if (storedUser) {
      setUser(storedUser);
      fetchWatchlist(storedUser.id);
    }
  }, []);

  const fetchWatchlist = async (userId) => {
    try {
      const response = await axios.get("http://localhost:3001/watchlist");
      const userWatchlist = response.data.filter(
        (item) => item.userId === userId
      );
      setWatchlist(userWatchlist);
    } catch (error) {
      console.error("Error fetching watchlist:", error);
    }
  };

  const deleteFromWatchlist = async (movieId) => {
    if (!window.confirm("Are you sure you want to remove this movie?")) return;

    try {
      await axios.delete(`http://localhost:3001/watchlist/${movieId}`);
      setWatchlist((prev) => prev.filter((movie) => movie.id !== movieId));
      alert("Movie removed successfully!");
    } catch (error) {
      console.error("Error deleting movie:", error);
      alert("Failed to delete movie.");
    }
  };
  console.log(watchlist);
  

  const WatchlistItem = ({ movie }) => (
    <div className="watchlist-item">
      <img src={movie.poster} alt={movie.title} className="watchlist-poster" />
      <div className="watchlist-info">
        <div className="watchlist-text">
          <h4 className="movie-title">{movie.title}</h4>
          <p className="imdb-rating">⭐ {movie.imdbRating}</p>
        </div>
        <button
          onClick={() => deleteFromWatchlist(movie.id)}
          className="delete-button"
        >
          Remove
        </button>
      </div>
    </div>
  );

  const movies = watchlist.filter((item) => item.type === "movie");
  const shows = watchlist.filter((item) => item.type === "series");

  return (
    <div className="watchlist-section">
      <h2 className="watchlist-title">My Watchlist</h2>

      {movies.length > 0 && (
        <div className="watchlist-category">
          <h3>Movies</h3>
          <Slider {...watchlistSettings}>
            {movies.map((movie) => (
              <WatchlistItem key={movie.id} movie={movie} />
            ))}
          </Slider>
        </div>
      )}

      {shows.length > 0 && (
        <div className="watchlist-category">
          <h3>TV Shows</h3>
          <Slider {...watchlistSettings}>
            {shows.map((show) => (
              <WatchlistItem key={show.id} movie={show} />
            ))}
          </Slider>
        </div>
      )}

      {movies.length === 0 && shows.length === 0 && (
        <p className="empty-message">Your watchlist is empty.</p>
      )}
    </div>
  );
};

export default WatchList;
