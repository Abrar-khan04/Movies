import React, { useState, useEffect } from "react";
import { discoverTVShows, getImageUrl } from "../services/tmds";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";


function TVShows() {
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchShows = async () => {
            setLoading(true);
            try {
                const data = await discoverTVShows(currentPage);
                setShows(data.results);
                setTotalPages(Math.min(data.total_pages, 500));
            } catch (error) {
                console.error("Error Fetching TV Shows", error);
            } finally {
                setLoading(false);
            }
        }
        fetchShows();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentPage]);

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 3;
        let start = Math.max(1, currentPage - 1);
        let end = Math.min(totalPages, start + maxVisible - 1);
        if (end - start < maxVisible - 1) {
            start = Math.max(1, end - maxVisible + 1);
        }
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 pt-24 pb-12 px-6 lg:px-12 text-white">
            <Header />
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Latest TV Shows</h1>
                <p className="text-gray-400">Browse the most recent TV shows from around the world.</p>
            </div>
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-500"></div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {shows.map((show) => (
                            <div key={show.id} onClick={() => navigate(`/tv/${show.id}`)} className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-red-500 transition-all">
                                <img src={getImageUrl(show.poster_path, "w500") || "https://via.placeholder.com/500x750?text=No+Poster"} alt={show.name} className="w-full aspect-[2/3] object-cover" />
                                <div className="p-3">
                                    <h3 className="font-semibold truncate">
                                        {show.name}
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                        {show.first_air_date?.split("-")[0]}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "48px", paddingBottom: "12px", flexWrap: "wrap" }}>
                        <button onClick={() => goToPage(1)} disabled={currentPage === 1}
                            style={{ width: "40px", height: "40px", borderRadius: "50%", border: "none", background: "transparent", color: currentPage === 1 ? "#4a5568" : "#a0aec0", fontSize: "18px", cursor: currentPage === 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                            title="First page">«</button>

                        <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}
                            style={{ width: "40px", height: "40px", borderRadius: "50%", border: "none", background: "transparent", color: currentPage === 1 ? "#4a5568" : "#a0aec0", fontSize: "18px", cursor: currentPage === 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                            title="Previous page">←</button>

                        {getPageNumbers().map((page) => (
                            <button key={page} onClick={() => goToPage(page)}
                                style={{
                                    width: "44px", height: "44px", borderRadius: "50%", border: "none",
                                    background: page === currentPage ? "linear-gradient(135deg, #2d6a7a, #3a8a9a)" : "transparent",
                                    color: page === currentPage ? "#fff" : "#a0aec0",
                                    fontSize: "16px", fontWeight: page === currentPage ? "700" : "400",
                                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                                    boxShadow: page === currentPage ? "0 4px 15px rgba(45,106,122,0.4)" : "none",
                                    transform: page === currentPage ? "scale(1.1)" : "scale(1)", transition: "all 0.25s ease"
                                }}>
                                {page}
                            </button>
                        ))}

                        <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}
                            style={{ width: "40px", height: "40px", borderRadius: "50%", border: "none", background: "transparent", color: currentPage === totalPages ? "#4a5568" : "#a0aec0", fontSize: "18px", cursor: currentPage === totalPages ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                            title="Next page">→</button>

                        <button onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages}
                            style={{ width: "40px", height: "40px", borderRadius: "50%", border: "none", background: "transparent", color: currentPage === totalPages ? "#4a5568" : "#a0aec0", fontSize: "18px", cursor: currentPage === totalPages ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                            title="Last page">»</button>
                    </div>

                    <p style={{ textAlign: "center", color: "#718096", fontSize: "14px" }}>
                        Page {currentPage} of {totalPages}
                    </p>
                </>
            )}
        </div>
    );
}

export default TVShows;