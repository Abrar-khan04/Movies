import React, { useState, useEffect } from "react";
import { getPopularMovies, getImageUrl } from "../services/tmds";
import PlayerModel from "./PlayerModel";

const genres = [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 35, name: "Comedy" },
    { id: 18, name: "Drama" },
    { id: 27, name: "Horror" },
    { id: 878, name: "Sci-Fi" },
    { id: 10749, name: "Romance" },
    { id: 53, name: "Thriller" },
    { id: 10751, name: "18+" },
];

function Rec() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [listUpdate, setListUpdate] = useState(0);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const data = await getPopularMovies();
                setMovies(data.slice(0, 10));
                setLoading(false);
            } catch (error) {
                console.error("Error fetching Movies:", error);
                setLoading(false);
            }
        }
        fetchMovies();
    }, []);

    const filterMovies = selectedGenre
        ? movies.filter((movie) => movie.genre_ids?.includes(selectedGenre))
        : movies;

    const isInMyList = (movieId) => {
        const saved = JSON.parse(localStorage.getItem("myList")) || [];
        return saved.some((item) => item.id === movieId && item.media_type === "movie");
    };

    const toggleMyList = (e, movie) => {
        e.stopPropagation();
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

    if (loading) {
        return (
            <div className="w-full py-16 bg-grey-900 flex items-center justify-center">
                <div className="text-white text-2xl">Loading Recommendations...</div>
            </div>
        );
    }

    return (
        <div className="w-full py-16 px-8 pt-10 lg:px-16 bg-gray-800">
            <h2 className="text-3xl mb-8 lg:text-4xl font-bold text-white ">Trending Movies </h2>
            <div className="flex flex-wrap gap-3 mb-8">
                <button onClick={() => setSelectedGenre(null)} className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 ${selectedGenre === null ? "bg-red-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}>
                    All
                </button>
                {genres.map((genre) => (
                    <button key={genre.id} onClick={() => setSelectedGenre(genre.id)} className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 ${selectedGenre === genre.id
                        ? "bg-red-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}>
                        {genre.name}
                    </button>
                ))}
            </div>
            {/*Grid 5 Col on large screen, responsive on smaller*/}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {filterMovies.map((movie) => (
                    <div key={movie.id} className="group cursor-pointer transition-transform duration-300 hover:scale-105">
                        {/* Movie poster */}
                        <div className="relative overflow-hidden rounded-lg shadow-lg">
                            <img src={getImageUrl(movie.poster_path, "w500")} alt={movie.title} className="w-full h-auto aspect-[2/3] object-cover " />
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2">
                                <button
                                    onClick={() => setSelectedMovie(movie)}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                                >
                                    ▶ Watch Now
                                </button>
                                <button
                                    onClick={(e) => toggleMyList(e, movie)}
                                    className={`px-4 py-2 font-semibold rounded-lg transition-colors text-sm ${isInMyList(movie.id)
                                            ? "bg-green-600 hover:bg-green-700 text-white"
                                            : "bg-white/20 hover:bg-white/30 text-white border border-white/30"
                                        }`}
                                >
                                    {isInMyList(movie.id) ? "✓ In My List" : "+ My List"}
                                </button>
                            </div>
                            {/*Rating Badge hein ***/}
                            <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-yellow-400 text-sm font-semibold">
                                ⭐{movie.vote_average?.toFixed(1)}
                            </div>
                        </div>
                        {/*Movies ke baare mein*/}
                        <div className="mt-3">
                            <h3 className="text-white font-semibold truncate group-hover:text-red-500 transition-colors ">
                                {movie.title}
                            </h3>
                            <p className="text-gray-400 text-sm">
                                {movie.release_date?.split("-")[0]}

                            </p>
                        </div>
                    </div>
                ))}

            </div>
            {/*Player Model*/}
            {selectedMovie && (
                <PlayerModel movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
            )}
        </div>
    );
}

export default Rec;