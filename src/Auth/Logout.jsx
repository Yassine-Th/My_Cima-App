import React from "react";
import "./logout.scss"; // Import the CSS file

export default function Logout() {
  const handleLogout = () => {
    localStorage.removeItem("user_boutique");
    window.location.reload();
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Log out
    </button>
  );
}
