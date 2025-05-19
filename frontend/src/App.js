import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MovieDetail from "./pages/MovieDetail";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import './App.css';


function App() {
  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">

    <Router>
      <Navbar />
      <div className="min-h-screen">

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      </div>
      <Footer/>

    </Router>
    </div>
  );
}

export default App;
