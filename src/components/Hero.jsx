import React, { useState, useEffect } from "react";
import { getTrendingMovies, getImageUrl, searchMovies } from "../services/tmds";
import PlayerModel from "./PlayerModel";

function Hero() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [listUpdate, setListUpdate] = useState(0);

    // Fetch movies on mount
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const data = await getTrendingMovies();
                setMovies(data.slice(0, 9));
                setLoading(false);
            } catch (error) {
                console.error("Error fetching movies:", error);
                setLoading(false);
            }
        };
        fetchMovies();
    }, []);

    // Auto-scroll every 5 seconds
    useEffect(() => {
        if (movies.length === 0) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % movies.length);
        }, 20000);
        return () => clearInterval(timer);
    }, [movies.length]);

    const isInMyList = (movieId) => {
        const saved = JSON.parse(localStorage.getItem("myList")) || [];
        return saved.some((item) => item.id === movieId && item.media_type === "movie");
    };

    const toggleMyList = (movie) => {
        const saved = JSON.parse(localStorage.getItem("myList")) || [];
        if (isInMyList(movie.id)) {
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
        setListUpdate((prev) => prev + 1);
    };

    const goToSlide = (index) => setCurrentSlide(index);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + movies.length) % movies.length);
    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % movies.length);

    if (loading) {
        return (
            <div className="h-screen w-full bg-gray-900 flex items-center justify-center">
                <div className="text-white text-2xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="relative h-screen w-full overflow-hidden">
            <div className="flex h-full transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {movies.map((movie) => (
                    <div key={movie.id} className="relative min-w-full h-full">
                        <img
                            src={getImageUrl(movie.backdrop_path, "original")}
                            alt={movie.title}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent pointer-events-none" />
                        <div className="absolute inset-0 flex items-center px-12 lg:px-24 relative z-10">
                            <div className="max-w-2xl">
                                <h1 className="text-5xl lg:text-7xl font-bold text-white mb-4">
                                    {movie.title}
                                </h1>
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="text-yellow-400 font-semibold">
                                        ⭐ {movie.vote_average?.toFixed(1)}
                                    </span>
                                    <span className="text-gray-400">
                                        {movie.release_date?.split("-")[0]}
                                    </span>
                                </div>
                                <p className="text-lg lg:text-xl text-gray-300 mb-8 line-clamp-3">
                                    {movie.overview}
                                </p>
                                <div className="flex gap-4">
                                    <button onClick={() => setSelectedMovie(movie)} className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg flex items-center gap-2 transition-colors">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg> Play Trailer
                                    </button>
                                    <button
                                        onClick={() => toggleMyList(movie)}
                                        className={`px-8 py-3 font-semibold rounded-lg backdrop-blur-sm transition-colors ${isInMyList(movie.id)
                                            ? "bg-green-600 hover:bg-green-700 text-white"
                                            : "bg-white/20 hover:bg-white/30 text-white"
                                            }`}
                                    >
                                        {isInMyList(movie.id) ? "✓ In My List" : "+ My List"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>


            {/*Nav ke Buttons*/}
            <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 hover:bg-black/70 text-white rounded-full transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/30 hover:scale-110">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            </button>
            <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 hover:bg-black/70 text-white rounded-full transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/30 hover:scale-110">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
            </button>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
                {movies.map((_, index) => (
                    <button key={index} onClick={() => goToSlide(index)} className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? "bg-red-600" : "bg-white/50 hover:bg-white/70"}`} />
                ))}
            </div>
            {selectedMovie && (
                <PlayerModel movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
            )}
        </div>
    );
}

export default Hero;