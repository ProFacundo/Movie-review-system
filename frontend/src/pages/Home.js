import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_KEY = "9fc45f7887841e567da9d96cede5bb51";

const genreMap = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  18: "Drama",
  14: "Fantasy",
  27: "Horror",
  10749: "Romance",
  878: "Science Fiction",
  53: "Thriller",
};

function Home() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = () => {
    axios
      .get(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`)
      .then((response) => setMovies(response.data.results))
      .finally(() => setLoading(false));
  };

  const searchMovies = (e) => {
    e.preventDefault();
    if (query.trim() === "") {
      fetchMovies();
      return;
    }
    setLoading(true)
    axios
      .get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`)
      .then((response) => setMovies(response.data.results))
      .finally(() => setLoading(false))
  };

  const fetchSuggestions = (input) => {
    setQuery(input);
    if (input.trim() === "") {
      setSuggestions([]);
      return;
    }

    axios
      .get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${input}`)
      .then((response) => setSuggestions(response.data.results.slice(0, 5)));
  };

  const handleGenreFilter = (genreName) => {
    setSelectedGenre(genreName);
  };

  const filteredMovies = selectedGenre
    ? movies.filter((movie) =>
        movie.genre_ids?.some((id) => genreMap[id] === selectedGenre)
      )
    : movies;

  return (
    <div className="flex px-4 lg:px-16 py-6 gap-6">
      {/* Sidebar */}
      <aside className="hidden lg:block w-64">
        <div className="sticky top-4 bg-gray-100 dark:bg-gray-800 rounded-xl p-4 shadow-md h-fit">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Filter by Genre</h3>
          <ul className="space-y-2">
            <li>
              <button
                className={`text-sm ${
                  selectedGenre === "" ? "text-blue-600 font-bold" : "text-gray-600 dark:text-gray-300"
                }`}
                onClick={() => setSelectedGenre("")}
              >
                Show All
              </button>
            </li>
            {Object.values(genreMap).map((genre) => (
              <li key={genre}>
                <button
                  onClick={() => handleGenreFilter(genre)}
                  className={`text-sm hover:text-blue-500 transition ${
                    selectedGenre === genre ? "text-blue-600 font-medium" : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {genre}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <h1 className="text-3xl font-bold text-center mb-6">Search Movies</h1>

        <form onSubmit={searchMovies} className="flex flex-col items-center mb-6 relative">
          <input
            type="text"
            className="border border-gray-300 dark:border-gray-600 rounded-md p-2 w-80 bg-white dark:bg-gray-900 text-black dark:text-white"
            placeholder="Search for a movie..."
            value={query}
            onChange={(e) => fetchSuggestions(e.target.value)}
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2">
            Search
          </button>

          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <ul className="absolute top-12 w-80 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-md z-10 text-black dark:text-white">
              {suggestions.map((movie) => (
                <li
                  key={movie.id}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => {
                    setQuery(movie.title);
                    setSuggestions([]);
                  }}
                >
                  {movie.title}
                </li>
              ))}
            </ul>
          )}
        </form>

        {/* Movie Grid */}
        {loading ? (
  <div className="flex justify-center items-center h-64">
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
) : (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {filteredMovies.length > 0 ? (
      filteredMovies.map((movie) => (
        <div key={movie.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-80 object-cover"
          />
          <div className="p-4">
            <h2 className="text-lg font-semibold dark:text-black">{movie.title}</h2>
            <Link to={`/movie/${movie.id}`} className="block text-blue-500 mt-2">
              View Details →
            </Link>
          </div>
        </div>
      ))
    ) : (
      <p className="text-center text-gray-500 col-span-full">No results found.</p>
    )}
  </div>
)}

      </main>
    </div>
  );
}

export default Home;
