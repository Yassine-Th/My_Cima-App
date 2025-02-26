import React, { useEffect, useState } from "react";
import "./App.scss";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./Components/Header/Header";
import MovieDetails from "./Components/MovieDetails/MovieDetails";
import Home from "./Components/Home/Home";
import NotFount from "./Components/NotFound/NotFount";
import Footer from "./Components/Footer/Footer";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import isLoggedIn from "./Auth/CheckLoggedIn.js";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import WatchList from "./Components/WatchList/WatchList.jsx";
import Users from "./Users/Users.jsx";
import UserDetail from "./Users/UserDetails.jsx";

function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check if user is authorized on component mount
    isLoggedIn(setIsAuthorized);
  }, []);

  return (
    <BrowserRouter>
      <div className="app-container">
        {/* Header component */}
        <Header />

        {/* Main Content */}
        <div className="content">
          <Routes>
            {isAuthorized ? (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/movie/:imdbID" element={<MovieDetails />} />
                <Route path="/watchlist" element={<WatchList />} />
                <Route path="/users" element={<Users />} />
                <Route path="/user/:id" element={<UserDetail />} />

                <Route path="/*" element={<NotFount />} />
              </>
            ) : (
              <>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<Login />} />
              </>
            )}
          </Routes>
        </div>

        {/* Footer component */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
