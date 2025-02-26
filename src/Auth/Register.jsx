import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import AuthValidationForm from "../utils/AuthValidationForm";
import { generateToken } from "./RandomToken";
import { Link } from "react-router-dom";
import "./register.scss"; // Import the CSS file

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [err, setErr] = useState({
    emailErr: "",
    usernameErr: "",
    passwordErr: "",
  });
  const navigate = useNavigate();
  const Token = generateToken();

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
    const user = {
      username: userData.get("username"),
      email: userData.get("email"),
      password: userData.get("password"),
      token: Token,
      role: "user",
    };

    if (
      !AuthValidationForm(
        { username: user.username, email: user.email },
        user.password,
        true,
        setErr
      )
    ) {
      return;
    }
    axios
      .post("http://localhost:3001/Users", user)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-heading">Register</h2>
        <form className="register-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="register-label">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              className="register-input"
              value={formData.username}
              onChange={handleChange}
            />
            {err.usernameErr && <p className="error">{err.usernameErr}</p>}
          </div>
          <div>
            <label htmlFor="email" className="register-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="register-input"
              value={formData.email}
              onChange={handleChange}
            />
            {err.emailErr && <p className="error">{err.emailErr}</p>}
          </div>
          <div>
            <label htmlFor="password" className="register-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="register-input"
              value={formData.password}
              onChange={handleChange}
            />
            {err.passwordErr && <p className="error">{err.passwordErr}</p>}
          </div>
          <div>
            <button type="submit" className="register-button">
              Register
            </button>
          </div>
          <div className="register-text">
            <p>Already have an account? </p>
            <Link to="/login" className="register-link">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
