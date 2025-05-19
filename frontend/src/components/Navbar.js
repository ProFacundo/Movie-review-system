import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import LogoutButton from "../pages/LogoutButton";
import ThemeToggle from "./ThemeToggle";

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("access")
  );
  const location = useLocation();

  // Re-check token on each route change (covers login)
  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("access"));
  }, [location]);

  return (
    <nav className="bg-gray-800 text-white dark:bg-gray-900 dark:text-gray-100 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link to="/" className="hover:text-gray-300 dark:hover:text-gray-400">
            🎬 Movie Reviews
          </Link>
        </h1>
        <div className="flex items-center space-x-4">
          <Link to="/" className="hover:text-gray-300 dark:hover:text-gray-400">
            Home
          </Link>

          {!isAuthenticated ? (
            <>
              <Link to="/login" className="hover:text-gray-300 dark:hover:text-gray-400">
                Login
              </Link>
              <Link to="/register" className="hover:text-gray-300 dark:hover:text-gray-400">
                Register
              </Link>
            </>
          ) : (
            <LogoutButton setIsAuthenticated={setIsAuthenticated} />
          )}

          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
