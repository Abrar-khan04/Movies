import React, { useState, useEffect } from "react";
import { getTrendingTVShows, getImageUrl } from "../services/tmds";
import PlayerModel from "./PlayerModel";

function Show() {
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedShow, setSelectedShow] = useState(null);
    const [listUpdate, setListUpdate] = useState(0);

    useEffect(() => {
        const fetchShows = async () => {
            try {
                const data = await getTrendingTVShows();
                if (data && Array.isArray(data)) {
                    setShows(data.slice(0, 10));
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchShows();
    }, []);

    const isInMyList = (showId) => {
        const saved = JSON.parse(localStorage.getItem("myList")) || [];
        return saved.some((item) => item.id === showId && item.media_type === "tv");
    };

    const toggleMyList = (e, show) => {
        e.stopPropagation();
        const saved = JSON.parse(localStorage.getItem("myList")) || [];
        if (isInMyList(show.id)) {
            const updated = saved.filter((item) => !(item.id === show.id && item.media_type === "tv"));
            localStorage.setItem("myList", JSON.stringify(updated));
        } else {
            saved.push({
                id: show.id,
                name: show.name,
                poster_path: show.poster_path,
                first_air_date: show.first_air_date,
                media_type: "tv",
            });
            localStorage.setItem("myList", JSON.stringify(saved));
        }
        setListUpdate((prev) => prev + 1);
    };

    if (loading) {
        return (
            <div className="w-full py-16 bg-gray-900 flex items-center justify-center">
                <div className="text-white text-2xl">Loading TV Shows...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full py-16 bg-gray-900 flex items-center justify-center">
                <div className="text-red-500 text-xl">Error: {error}</div>
            </div>
        );
    }

    if (shows.length === 0) {
        return (
            <div className="w-full py-16 bg-gray-900 flex items-center justify-center">
                <div className="text-white text-xl">No TV Shows found</div>
            </div>
        );
    }

    return (
        <div className="w-full py-8 sm:py-16 px-4 sm:px-8 lg:px-16 bg-gray-900">
            <h2 className="text-2xl sm:text-3xl mb-4 sm:mb-8 lg:text-4xl font-bold text-white">Trending TV Shows</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
                {shows.map((show) => (
                    <div key={show.id} className="group cursor-pointer transition-transform duration-300 hover:scale-105">
                        <div className="relative overflow-hidden rounded-lg shadow-lg">
                            <img
                                src={getImageUrl(show.poster_path, "w500")}
                                alt={show.name || "TV Show"}
                                className="w-full h-auto aspect-[2/3] object-cover"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2">
                                <button
                                    onClick={() => setSelectedShow(show)}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                                >
                                    ▶ Watch Now
                                </button>
                                <button
                                    onClick={(e) => toggleMyList(e, show)}
                                    className={`px-4 py-2 font-semibold rounded-lg transition-colors text-sm ${isInMyList(show.id)
                                        ? "bg-green-600 hover:bg-green-700 text-white"
                                        : "bg-white/20 hover:bg-white/30 text-white border border-white/30"
                                        }`}
                                >
                                    {isInMyList(show.id) ? "✓ In My List" : "+ My List"}
                                </button>
                            </div>
                            <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-yellow-400 text-sm font-semibold">
                                ⭐ {show.vote_average ? show.vote_average.toFixed(1) : "N/A"}
                            </div>
                        </div>
                        <div className="mt-3">
                            <h3 className="text-white text-sm sm:text-base font-semibold truncate group-hover:text-red-500 transition-colors">
                                {show.name || "Unknown"}
                            </h3>
                            <p className="text-gray-400 text-sm">
                                {show.first_air_date ? show.first_air_date.split("-")[0] : "N/A"}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Player Modal */}
            {selectedShow && (
                <PlayerModel
                    movie={selectedShow}
                    onClose={() => setSelectedShow(null)}
                />
            )}
        </div>
    );
}

export default Show;
