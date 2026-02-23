import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovieDetails, getSimilarMovies, getImageUrl } from "../services/tmds";
import PlayerModel from "../components/PlayerModel";
import Header from "../components/Header";

function MovieDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [similarMovies, setSimilarMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMovie, setSelectedMovie] = useState(null);

    useEffect(() => {
        const fetchData = async () => {

            setLoading(true);
            try {
                const [movieData, similar] = await Promise.all([
                    getMovieDetails(id),
                    getSimilarMovies(id)
                ]);
                setMovie(movieData);
                setSimilarMovies(similar?.slice(0, 10) || []);
            } catch (error) {
                console.error("Error fetching movie details:", error);

            } finally {
                setLoading(false);
            }
        };
        fetchData();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white text-2xl">
                    Loading...
                </div>
            </div>
        );
    }
    if (!movie) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white text-xl">
                    Movie Not Found
                </div>
            </div>
        );
    }

    const isInMyList = () => {
        const saved = JSON.parse(localStorage.getItem("myList")) || [];
        return saved.some((item) => item.id === movie?.id && item.media_type === "movie");
    };

    const toggleMyList = () => {
        const saved = JSON.parse(localStorage.getItem("myList")) || [];
        if (isInMyList()) {
            const updated = saved.filter((item) => !(item.id === movie.id && item.media_type === "movie"));
            localStorage.setItem("myList", JSON.stringify(updated));
        } else {
            saved.push({
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
                release_date: movie.release_date,
                media_type: "movie",
            });
            localStorage.setItem("myList", JSON.stringify(saved));
        }
        setMovie({ ...movie });
    };

    return (
        <div className="min-h-screen bg-gray-900">
            <Header />
            <div className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] w-full">
                <img src={getImageUrl(movie.backdrop_path, "original")} alt={movie.title} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 lg:p-16 relative z-10">
                    <div className="max-w-4xl">
                        <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold text-white mb-2 sm:mb-4">
                            {movie.title}
                        </h1>
                        <div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-4 text-sm sm:text-base">
                            <span className="text-yellow-400 font-semibold ">
                                ⭐ {movie.vote_average?.toFixed(1)}
                            </span>
                            <span>
                                {movie.release_date?.split("-")[0]}
                            </span>
                            <span>
                                {movie.runtime} min
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {movie.genres?.map((genre) => (
                                <span key={genre.id} className="px-3 py-1 bg-white/10 rounded-full text-sm text-white">
                                    {genre.name}
                                </span>
                            ))}
                        </div>
                        <p className="text-sm sm:text-lg text-gray-300 mb-4 sm:mb-6 max-w-2xl line-clamp-2 sm:line-clamp-4">
                            {movie.overview}
                        </p>
                        <div className="flex items-center gap-2 sm:gap-4">
                            <button className="px-4 py-2 sm:px-8 sm:py-3 bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base font-semibold rounded-lg flex items-center gap-2 transition-colors" onClick={() => setSelectedMovie(movie)}>
                                Play Trailer
                            </button>
                            <button
                                onClick={toggleMyList}
                                className={`px-4 py-2 sm:px-8 sm:py-3 text-sm sm:text-base font-semibold rounded-lg flex items-center gap-2 transition-colors ${isInMyList()
                                    ? "bg-green-600 hover:bg-green-700 text-white"
                                    : "bg-white/10 hover:bg-white/20 text-white border border-white/30"
                                    }`}
                            >
                                {isInMyList() ? "✓ In My List" : "+ My List"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/*Similar Movies*/}
            {similarMovies.length > 0 && (
                <div className="px-4 sm:px-12 lg:px-20 pt-12 sm:pt-24 pb-8 sm:pb-16">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4 sm:mb-8">
                        Similar Movies
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
                        {similarMovies.map((similarMovie) => (
                            <div key={similarMovie.id} onClick={() => navigate(`/movie/${similarMovie.id}`)} className="group cursor-pointer transition-transform duration-300 hover:scale-105">
                                <div className="relative overflow-hidden rounded-lg shadow-lg">
                                    {similarMovie.poster_path ? (
                                        <img src={getImageUrl(similarMovie.poster_path, "w500")} alt={similarMovie.title} className="w-full h-auto aspect-[2/3] object-cover" />
                                    ) : (
                                        <div className="w-full aspect-[2/3] bg-gray-700 flex items-center justify-center p-4">
                                            <span className="text-gray-400 text-center text-sm">{similarMovie.title}</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <span className="text-white font-semibold">View Details</span>
                                    </div>
                                    <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-yellow-400 text-sm font-semibold">
                                        ⭐ {similarMovie.vote_average?.toFixed(1)}
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <h3 className="text-white font-semibold truncate group-hover:text-red-500 transition-colors">
                                        {similarMovie.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm">
                                        {similarMovie.release_date?.split("-")[0]}
                                    </p>

                                </div>
                            </div>
                        ))}

                    </div>

                </div>
            )}
            {/*Player Model*/}
            {selectedMovie && (
                <PlayerModel movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
            )}
        </div>
    );
}
export default MovieDetails;