import React, { useState, useEffect } from "react";
import { getImageUrl } from "../services/tmds";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

function MyList() {
    const [myList, setMyList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("myList")) || [];
        setMyList(saved);
    }, []);

    const removeFromList = (id, mediaType) => {
        const updated = myList.filter(
            (item) => !(item.id === id && item.media_type === mediaType)
        );
        setMyList(updated);
        localStorage.setItem("myList", JSON.stringify(updated));
    };

    return (
        <div className="min-h-screen bg-gray-900 pt-20 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-12 text-white">
            <Header />
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">My List</h1>
                <p className="text-gray-400">Your saved movies and TV shows.</p>
            </div>

            {myList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <p className="text-gray-500 text-xl mb-2">Your list is empty</p>
                    <p className="text-gray-600 text-sm">Add movies or TV shows from their details page.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
                    {myList.map((item) => (
                        <div key={`${item.media_type}-${item.id}`} className="relative bg-gray-800 rounded-lg overflow-hidden group">
                            <div onClick={() => navigate(item.media_type === "tv" ? `/tv/${item.id}` : `/movie/${item.id}`)} className="cursor-pointer">
                                <img
                                    src={getImageUrl(item.poster_path, "w500") || "https://via.placeholder.com/500x750?text=No+Poster"}
                                    alt={item.title || item.name}
                                    className="w-full aspect-[2/3] object-cover"
                                />
                                <div className="p-3">
                                    <h3 className="font-semibold truncate">{item.title || item.name}</h3>
                                    <p className="text-sm text-gray-400">
                                        {(item.release_date || item.first_air_date)?.split("-")[0]}
                                        <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-gray-700">
                                            {item.media_type === "tv" ? "TV" : "Movie"}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => removeFromList(item.id, item.media_type)}
                                className="absolute top-2 right-2 bg-black/70 hover:bg-red-600 text-white px-2 py-1 rounded text-xs transition-colors opacity-0 group-hover:opacity-100"
                            >
                                ✕ Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyList;