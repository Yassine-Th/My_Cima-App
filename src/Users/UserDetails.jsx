import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserDetail.scss";

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    email: "",
    role: "",
  });
  const [watchlist, setWatchlist] = useState([]);
  const [filter, setFilter] = useState("all"); // Filter between movies & shows

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/Users/${id}`);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    const fetchWatchlist = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/watchlist?userId=${id}`
        );
        setWatchlist(response.data);
      } catch (error) {
        console.error("Error fetching watchlist:", error);
      }
    };

    fetchUser();
    fetchWatchlist();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/Users/${id}`, user);
      alert("User updated successfully!");
      navigate("/users");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user.");
    }
  };

  const handleDelete = async (watchId) => {
  try {
    await axios.delete(`http://localhost:3001/watchlist/${watchId}`);
    setWatchlist(watchlist.filter((item) => item.id !== watchId));
    alert("Item removed from watchlist!");
  } catch (error) {
    console.error("Error deleting watchlist item:", error);
    alert("Failed to delete item.");
  }
};


  // Filtered watchlist based on type (movie/show)
  const filteredWatchlist = watchlist.filter(
    (item) => filter === "all" || item.type === filter
  );

  return (
    <div className="user-detail-container">
      {/* User Form Section */}
      <div className="user-form-section">
        <h2>Edit User</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={user.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select
              name="role"
              value={user.role}
              onChange={handleChange}
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit">Save</button>
        </form>
      </div>

      {/* Watchlist Section */}
      <div className="watchlist-section">
        <h2>User Watchlist</h2>
        <div className="filter-buttons">
          <button
            onClick={() => setFilter("all")}
            className={filter === "all" ? "active" : ""}
          >
            All
          </button>
          <button
            onClick={() => setFilter("movie")}
            className={filter === "movie" ? "active" : ""}
          >
            Movies
          </button>
          <button
            onClick={() => setFilter("series")}
            className={filter === "show" ? "active" : ""}
          >
            Shows
          </button>
        </div>
        {filteredWatchlist.length > 0 ? (
          <table className="watchlist-table">
            <thead>
              <tr>
                <th>Poster</th>
                <th>Title</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWatchlist.map((item) => (
                <tr key={item.id}>
                  <td>
                    <img src={item.poster} alt={item.title} />
                  </td>
                  <td>{item.title}</td>
                  <td>{item.type}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No items in watchlist.</p>
        )}
      </div>
    </div>
  );
};

export default UserDetail;
