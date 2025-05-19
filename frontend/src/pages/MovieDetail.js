import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MovieReviews from "./MovieReviews";
import axios from "axios";

const API_KEY = "9fc45f7887841e567da9d96cede5bb51";

function MovieDetail() {
  const { id: tmdbId } = useParams();
  const [movie, setMovie] = useState(null);
  const [localMovieId, setLocalMovieId] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchAndSyncMovie = async () => {
      try {
        const tmdbRes = await axios.get(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${API_KEY}`);
        const tmdbMovie = tmdbRes.data;
        setMovie(tmdbMovie);

        const backendRes = await axios.post("http://127.0.0.1:8000/api/sync-movie/", {
          tmdb_id: tmdbMovie.id,
          title: tmdbMovie.title,
          description: tmdbMovie.overview,
          release_date: tmdbMovie.release_date,
          genre: tmdbMovie.genres?.map(g => g.name).join(", ") || "",
          poster_path: tmdbMovie.poster_path
        });

        setLocalMovieId(backendRes.data.id);

        const videoRes = await axios.get(`https://api.themoviedb.org/3/movie/${tmdbId}/videos?api_key=${API_KEY}`);
        const videos = videoRes.data.results;
        const trailer = videos.find(v => v.type === "Trailer" && v.site === "YouTube");
        if (trailer) {
          setTrailerKey(trailer.key);
        }
      } catch (error) {
        console.error("Error syncing movie with backend:", error);
      } finally {
        setLoading(false); // SET LOADING TO FALSE
      }
    };

    fetchAndSyncMovie();
  }, [tmdbId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="rounded-lg shadow-md movie-poster"
          />
        </div>
        <div className="md:col-span-2 movie-details-container">
          <h1 className="text-4xl font-bold">{movie.title}</h1>
          <p className="mt-4 text-gray-600">{movie.overview}</p>

          {trailerKey && (
    <div className="mt-6 pt-6 border-t border-gray-400 dark:border-gray-600">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Watch Trailer</h2>
      <div className="relative" style={{ paddingBottom: "56.25%", height: 0 }}>
        {!showTrailer ? (
          <div
            className="absolute top-0 left-0 w-full h-full cursor-pointer group"
            onClick={() => setShowTrailer(true)}
          >
            <img
              src={`https://img.youtube.com/vi/${trailerKey}/hqdefault.jpg`}
              alt="Trailer Thumbnail"
              className="w-full h-full object-cover rounded-lg group-hover:opacity-80 transition duration-300"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white p-3 rounded-full shadow-lg group-hover:scale-110 transition duration-300">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6 4l12 6-12 6V4z" />
                </svg>
              </div>
            </div>
          </div>
        ) : (
          <iframe
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title="Movie Trailer"
            className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
          ></iframe>
        )}
      </div>
    </div>
  )}

          <MovieReviews movieId={localMovieId} />
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;
