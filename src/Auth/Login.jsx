import axios from "axios";
import React, { useState, useEffect } from "react";
import AuthValidationForm from "../utils/AuthValidationForm";
import { Link, Navigate, useNavigate } from "react-router-dom";
import "./Login.scss"; // Import the CSS file

const Login = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [notFound, setNotFound] = useState("");
  const [err, setErr] = useState({
    emailUsernameErr: "",
    passwordErr: "",
  });

  useEffect(() => {
    axios.get("http://localhost:3001/Users").then((response) => {
      setUsers(response.data);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = new FormData(e.target);
    const userInput = {
      emailOrUsername: userData.get("emailOrUsername"),
      password: userData.get("password"),
    };

    const email = userInput.emailOrUsername.includes("@")
      ? userInput.emailOrUsername
      : "";
    const username = !userInput.emailOrUsername.includes("@")
      ? userInput.emailOrUsername
      : "";

    if (
      !AuthValidationForm(
        { email, username },
        userInput.password,
        false,
        setErr
      )
    ) {
      return;
    }

    const foundUser = users.find(
      (user) =>
        (user.email === userInput.emailOrUsername ||
          user.username === userInput.emailOrUsername) &&
        user.password === userInput.password
    );

    if (foundUser) {
      const { password, email, ...SavedUser } = foundUser;
      localStorage.setItem("user_boutique", JSON.stringify(SavedUser));
      window.location.replace("/")
    } else {
      setNotFound("Email or Password incorrect");
    }
  };

  return (
    <div className="flex-center">
      <div className="card">
        <h2 className="heading">Login</h2>
        <form className="form" onSubmit={handleSubmit}>
          <div>{notFound && <p className="error">{notFound}</p>}</div>
          <div>
            <label htmlFor="emailOrUsername" className="text">
              Email address or username
            </label>
            <input
              id="emailOrUsername"
              name="emailOrUsername"
              type="text"
              className="input"
              value={formData.emailOrUsername}
              onChange={handleChange}
            />
            {err.emailUsernameErr && (
              <p className="error">{err.emailUsernameErr}</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="text">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="input"
              value={formData.password}
              onChange={handleChange}
            />
            {err.passwordErr && <p className="error">{err.passwordErr}</p>}
          </div>
          <div>
            <button type="submit" className="button">
              Login
            </button>
          </div>
          <div className="text">
            <p>Don't have an account? </p>
            <Link to="/register" className="link">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
