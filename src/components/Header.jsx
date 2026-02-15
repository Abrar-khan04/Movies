import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { searchMovies, getImageUrl } from "../services/tmds";
import Logo from "../assets/play.png";

const navigation = [
    { name: "Home", href: '/' },
    { name: "Movies", href: '/movies' },
    { name: "TV Shows", href: '/tv-shows' },
    { name: "My List", href: '/my-list' },
];

function Header() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const results = await searchMovies(searchQuery);
            setSearchResults(results.slice(0, 5));
        } catch (error) {
            console.error("Search Error:", error);
        }
        setIsSearching(false);
    };

    const clearSearch = () => {
        setSearchQuery("");
        setSearchResults([]);
    };

    const handleMovieClick = (movieId) => {
        navigate(`/movie/${movieId}`);
        clearSearch();
    };

    return (
        <header className="absolute inset-x-0 top-0 z-50 ">
            <nav aria-label="global" className="flex items-center justify-between p-6 lg:px-8">
                {/*Logo*/}
                <div className="flex lg:flex-1">
                    <Link to="/" className="-m-2 p-2">
                        <span className="sr-only">Streamlio</span>
                        <img src={Logo} alt="Streamlio Logo" className="h-10 w-auto" />
                    </Link>
                </div>
                <div className="flex gap-x-12">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            to={item.href}
                            className="text-sm/6 font-semibold text-white rounded-lg transition-all duration-300 hover:text-cyan-600 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.9)]"
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                {/* Search bar - inline in header */}
                <div className="relative mx-4">
                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search movies..."
                            className="w-48 lg:w-64 px-4 py-2 pl-10 bg-gray-800/80 border border-gray-600 rounded-full text-white text-sm placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                        />
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        {searchQuery && (
                            <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-sm">
                                ✕
                            </button>
                        )}
                    </form>

                    {/* Search Results Dropdown */}
                    {searchResults.length > 0 && (
                        <div className="absolute top-full mt-2 right-0 w-80 bg-gray-900/95 backdrop-blur-md rounded-lg border border-gray-700 overflow-hidden shadow-xl z-50">
                            {searchResults.map((movie) => (
                                <div key={movie.id} onClick={() => handleMovieClick(movie.id)} className="flex items-center gap-3 p-3 hover:bg-white/10 cursor-pointer transition-colors">
                                    <img src={getImageUrl(movie.poster_path, "w500")} alt={movie.title} className="w-10 h-14 object-cover rounded" />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white font-semibold text-sm truncate">{movie.title}</h3>
                                        <p className="text-gray-400 text-xs">
                                            {movie.release_date?.split("-")[0]} • ⭐ {movie.vote_average?.toFixed(1)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {isSearching && (
                        <div className="absolute top-full mt-2 right-0 w-80 bg-gray-900/95 backdrop-blur-md rounded-lg p-4 text-center text-white text-sm z-50">
                            Searching...
                        </div>
                    )}
                </div>

                {/* Login Button */}
                <div className="flex items-center">
                    <a href="#" className="text-sm/6 font-semibold text-white hover:text-red-500 transition-colors">
                        Log in <span aria-hidden="true">&rarr;</span>
                    </a>
                </div>
            </nav>
        </header>
    );
}

export default Header;