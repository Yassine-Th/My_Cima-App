import React, { useEffect, useState } from "react";
import "./Header.scss";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  fetchAsyncMovies,
  fetchAsyncShows,
} from "../../redux/movies/movieSLice";
import user from "../../images/user.png";
import Logout from "../../Auth/Logout";

const Header = () => {
  const [term, setTerm] = useState(""); // Search term
  const [userName, setUserName] = useState(""); // User name
  const [role, setRole] = useState(""); // User role

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get user info from localStorage when component mounts
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user_boutique"));
    if (storedUser) {
      setUserName(storedUser.username);
      setRole(storedUser.role);
    }
  }, []);

  // Handle form submission (search action)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (term) {
      // Navigate to home page with query params for search
      navigate(`/?search=${term}`);
      dispatch(fetchAsyncMovies(term)); // Dispatch movies search
      dispatch(fetchAsyncShows(term)); // Dispatch shows search
      setTerm(""); // Clear the search input after submitting
    }
  };

  return (
    <div className="header">
      <div className="logo">
        <a href={"/"}>My Cima</a>
      </div>

      <div className="search-bar">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Search Movies Or TV Shows"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
          <button type="submit">
            <i className="fa fa-search"></i>
          </button>
        </form>
      </div>

      <div className="link-section">
        {role === "admin" ? (
          <Link to="/users">Users</Link>
        ) : (
          <Link to="/watchlist">Watchlist</Link>
        )}
      </div>

      <div className="info">
        <div className="user-image">
          <img src={user} alt="user" />
        </div>
        <div className="user-info">
          <span className="user-name">{userName !== "0" && userName}</span>
        </div>
        <div className="user-logout">
          <Logout />
        </div>
      </div>
    </div>
  );
};

export default Header;
