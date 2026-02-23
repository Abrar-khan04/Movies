import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTVShowDetails, getSimilarTVShows, getImageUrl } from "../services/tmds";
import PlayerModel from "../components/PlayerModel";
import Header from "../components/Header";

function TVShowDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [show, setShow] = useState(null);
    const [similarShows, setSimilarShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedShow, setSelectedShow] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [showData, similar] = await Promise.all([
                    getTVShowDetails(id),
                    getSimilarTVShows(id)
                ]);
                setShow(showData);
                setSimilarShows(similar?.slice(0, 10) || []);
            } catch (error) {
                console.error("Error fetching TV show details:", error);
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
                <div className="text-white text-2xl">Loading...</div>
            </div>
        );
    }

    if (!show) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white text-xl">TV Show Not Found</div>
            </div>
        );
    }

    const isInMyList = () => {
        const saved = JSON.parse(localStorage.getItem("myList")) || [];
        return saved.some((item) => item.id === show?.id && item.media_type === "tv");
    };

    const toggleMyList = () => {
        const saved = JSON.parse(localStorage.getItem("myList")) || [];
        if (isInMyList()) {
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
        setShow({ ...show });
    };

    return (
        <div className="min-h-screen bg-gray-900">
            <Header />
            <div className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] w-full">
                <img src={getImageUrl(show.backdrop_path, "original")} alt={show.name} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 lg:p-16 relative z-10">
                    <div className="max-w-4xl">
                        <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold text-white mb-2 sm:mb-4">
                            {show.name}
                        </h1>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-2 sm:mb-4 text-sm sm:text-base">
                            <span className="text-yellow-400 font-semibold">
                                ⭐ {show.vote_average?.toFixed(1)}
                            </span>
                            <span className="text-white">
                                {show.first_air_date?.split("-")[0]}
                            </span>
                            <span className="text-white">
                                {show.number_of_seasons} Season{show.number_of_seasons !== 1 ? "s" : ""}
                            </span>
                            <span className="text-white">
                                {show.number_of_episodes} Episodes
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {show.genres?.map((genre) => (
                                <span key={genre.id} className="px-3 py-1 bg-white/10 rounded-full text-sm text-white">
                                    {genre.name}
                                </span>
                            ))}
                        </div>
                        <p className="text-sm sm:text-lg text-gray-300 mb-4 sm:mb-6 max-w-2xl line-clamp-2 sm:line-clamp-4">
                            {show.overview}
                        </p>
                        <div className="flex items-center gap-2 sm:gap-4">
                            <button className="px-4 py-2 sm:px-8 sm:py-3 bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base font-semibold rounded-lg flex items-center gap-2 transition-colors" onClick={() => setSelectedShow(show)}>
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

            {/* Similar TV Shows */}
            {similarShows.length > 0 && (
                <div className="px-4 sm:px-12 lg:px-20 pt-12 sm:pt-24 pb-8 sm:pb-16">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4 sm:mb-8">
                        Similar TV Shows
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
                        {similarShows.map((similarShow) => (
                            <div key={similarShow.id} onClick={() => navigate(`/tv/${similarShow.id}`)} className="group cursor-pointer transition-transform duration-300 hover:scale-105">
                                <div className="relative overflow-hidden rounded-lg shadow-lg">
                                    {similarShow.poster_path ? (
                                        <img src={getImageUrl(similarShow.poster_path, "w500")} alt={similarShow.name} className="w-full h-auto aspect-[2/3] object-cover" />
                                    ) : (
                                        <div className="w-full aspect-[2/3] bg-gray-700 flex items-center justify-center p-4">
                                            <span className="text-gray-400 text-center text-sm">{similarShow.name}</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <span className="text-white font-semibold">View Details</span>
                                    </div>
                                    <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-yellow-400 text-sm font-semibold">
                                        ⭐ {similarShow.vote_average?.toFixed(1)}
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <h3 className="text-white font-semibold truncate group-hover:text-red-500 transition-colors">
                                        {similarShow.name}
                                    </h3>
                                    <p className="text-gray-400 text-sm">
                                        {similarShow.first_air_date?.split("-")[0]}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Player Model */}
            {selectedShow && (
                <PlayerModel movie={selectedShow} onClose={() => setSelectedShow(null)} />
            )}
        </div>
    );
}

export default TVShowDetails;
