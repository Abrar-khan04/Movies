import React, { useState, useEffect } from "react";
import { discoverMovies, getImageUrl } from "../services/tmds";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const Movies = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const data = await discoverMovies();
                setMovies(data);
            } catch (error) {
                console.error("Error fetching movies:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMovies();
    }, []);

    const handleMovieClick = (movieId) => {
        navigate(`/movie/${movieId}`);
    };

    return (
        <div className="min-h-screen bg-gray-900 pt-24 pb-12 px-6 lg:px-12">
            <Header />

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Discovery Movies</h1>
                <p className="text-gray-400 font-medium">Browse the latest releases from around the world</p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {movies.map((movie) => (
                        <div
                            key={movie.id}
                            onClick={() => handleMovieClick(movie.id)}
                            className="group relative bg-gray-800 rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:ring-2 hover:ring-red-500 shadow-lg"
                        >
                            <div className="aspect-[2/3] overflow-hidden">
                                <img
                                    src={getImageUrl(movie.poster_path, "w500") || "https://via.placeholder.com/500x750?text=No+Poster"}
                                    alt={movie.title}
                                    className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                                />
                                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded-md text-yellow-400 font-bold text-sm">
                                    ⭐ {movie.vote_average?.toFixed(1)}
                                </div>
                            </div>
                            <div className="p-4 bg-gradient-to-t from-gray-900 to-gray-800">
                                <h3 className="text-white font-semibold truncate group-hover:text-red-400 transition-colors">
                                    {movie.title}
                                </h3>
                                <p className="text-gray-400 text-sm mt-1">
                                    {movie.release_date?.split("-")[0] || "N/A"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Movies;
