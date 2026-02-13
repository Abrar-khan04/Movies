import React, { useState, useEffect } from "react";
import VideoPlayer from './VideoPlayer';
import { getMovieVideos, getTVVideos } from '../services/tmds';

function PlayerModel({ movie, onClose, isTV = false }) {
    const [trailerUrl, setTrailerUrl] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrailer = async () => {
            try {
                // Use TV API if it's a TV show (has 'name' instead of 'title')
                const isTVShow = isTV || movie.name && !movie.title;
                const videos = isTVShow
                    ? await getTVVideos(movie.id)
                    : await getMovieVideos(movie.id);

                console.log("Content type:", isTVShow ? "TV Show" : "Movie");
                console.log("Videos received:", videos);

                if (videos && videos.length > 0) {
                    // Find trailer, or fallback to teaser, or any YouTube video
                    const trailer = videos.find((v) => v.type === "Trailer" && v.site === "YouTube")
                        || videos.find((v) => v.type === "Teaser" && v.site === "YouTube")
                        || videos.find((v) => v.site === "YouTube");

                    console.log("Found video:", trailer);

                    if (trailer) {
                        setTrailerUrl(`https://www.youtube.com/watch?v=${trailer.key}`);
                    }
                }
            } catch (error) {
                console.error("Error Fetching Trailer:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTrailer();
    }, [movie.id, isTV]);

    return (
        <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-4xl mx-4 bg-gray-900 rounded-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                {/* Close button */}
                <button onClick={onClose} className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-red-600 text-white rounded-full transition-colors">
                    ✕
                </button>

                {/* Video Player */}
                <div className="w-full">
                    {loading ? (
                        <div className="aspect-video bg-gray-800 flex items-center justify-center">
                            <span className="text-white">Loading Trailer...</span>
                        </div>
                    ) : trailerUrl ? (
                        <VideoPlayer url={trailerUrl} />
                    ) : (
                        <div className="aspect-video bg-gray-800 flex items-center justify-center">
                            <span className="text-white">No Trailer available</span>
                        </div>
                    )}
                </div>

                {/* Movie/Show Info */}
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-white mb-2">
                        {movie.title || movie.name}
                    </h2>
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-yellow-400">⭐ {movie.vote_average?.toFixed(1)}</span>
                        <span className="text-gray-400">{(movie.release_date || movie.first_air_date)?.split("-")[0]}</span>
                    </div>
                    <p className="text-gray-300 line-clamp-3">{movie.overview}</p>
                </div>
            </div>
        </div>
    );
}

export default PlayerModel;
