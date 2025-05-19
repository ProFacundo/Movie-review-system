import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/token/", credentials);
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
    
      const meRes = await axios.get("http://127.0.0.1:8000/api/me/", {
        headers: { Authorization: `Bearer ${response.data.access}` }
      })
      localStorage.setItem("username", meRes.data.username);
      localStorage.setItem("user_id", meRes.data.id);
      
        

      alert("Login successful!");
      navigate("/");
    } catch (error) {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
          🎬 Welcome Back
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
          Sign in to continue reviewing movies!
        </p>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200">Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-6">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="form-checkbox h-4 w-4" />
              <span>Remember me</span>
            </label>
            <a href="#" className="hover:underline text-blue-500 dark:text-blue-400">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-300 shadow-md hover:shadow-lg"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
