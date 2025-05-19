// LogoutButton.js
import React from "react";
import { useNavigate } from "react-router-dom";

function LogoutButton({setIsAuthenticated}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh")
    localStorage.removeItem("username")
    localStorage.removeItem("user_id")
    setIsAuthenticated(false)
    navigate("/login");
  };

  return (
    <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
      Logout
    </button>
  );
}

export default LogoutButton;
