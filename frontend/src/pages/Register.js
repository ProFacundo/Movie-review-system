import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function Register() {
  const [user, setUser] = useState({ username: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();


  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user.username || !user.password || !user.confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (user.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (!/[A-Za-z]/.test(user.password) || !/\d/.test(user.password)) {
      setError("Password must contain at least one letter and one number.");
      return;
    }

    if (user.password !== user.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/register/", {
        username: user.username,
        password: user.password,
      });
      setSuccess("🎉 Registration successful! You can now log in.");
      setUser({ username: "", password: "", confirmPassword: "" });
      setTimeout(() => navigate("/login"), 2000)
    } catch (error) {
      setError("Error registering user. Try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
          📝 Create an Account
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
          Start reviewing your favorite movies today!
        </p>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm text-center mb-4">{success}</p>}

        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200">Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-200">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              value={user.confirmPassword}
              onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-300 shadow-md hover:shadow-lg"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
