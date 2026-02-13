const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

// Image sizes: w500, w780, w1280, original
export const getImageUrl = (path, size = "original") => {
    if (!path) return null;
    return `${IMAGE_BASE_URL}/${size}${path}`;
};

// Fetch trending movies
export const getTrendingMovies = async () => {
    const response = await fetch(
        `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`
    );
    const data = await response.json();
    return data.results;
};

// Fetch popular movies
export const getPopularMovies = async () => {
    const response = await fetch(
        `${BASE_URL}/movie/popular?api_key=${API_KEY}`
    );
    const data = await response.json();
    return data.results;
};

// Fetch top rated movies
export const getTopRatedMovies = async () => {
    const response = await fetch(
        `${BASE_URL}/movie/top_rated?api_key=${API_KEY}`
    );
    const data = await response.json();
    return data.results;
};

// Fetch upcoming movies
export const getUpcomingMovies = async () => {
    const response = await fetch(
        `${BASE_URL}/movie/upcoming?api_key=${API_KEY}`
    );
    const data = await response.json();
    return data.results;
};

// Fetch now playing movies
export const getNowPlayingMovies = async () => {
    const response = await fetch(
        `${BASE_URL}/movie/now_playing?api_key=${API_KEY}`
    );
    const data = await response.json();
    return data.results;
};

// Fetch movie details by ID
export const getMovieDetails = async (movieId) => {
    const response = await fetch(
        `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos,credits`
    );
    const data = await response.json();
    return data;
};

// Search movies
export const searchMovies = async (query) => {
    const response = await fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    return data.results;
};

// Fetch TV shows (bonus)
export const getTrendingTVShows = async () => {
    const response = await fetch(
        `${BASE_URL}/trending/tv/week?api_key=${API_KEY}`
    );
    const data = await response.json();
    return data.results;
};

export const getPopularTVShows = async () => {
    const response = await fetch(
        `${BASE_URL}/tv/popular?api_key=${API_KEY}`
    );
    const data = await response.json();
    return data.results;
};

export const getMovieVideos = async (movieId) => {
    const response = await fetch(
        `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`
    );
    const data = await response.json();
    return data.results;
};

export const getTVVideos = async (tvId) => {
    const response = await fetch(
        `${BASE_URL}/tv/${tvId}/videos?api_key=${API_KEY}`
    );
    const data = await response.json();
    return data.results;
};

export const getSimilarMovies = async (movieId) => {
    const response = await fetch(
        `${BASE_URL}/movie/${movieId}/similar?api_key=${API_KEY}`
    );
    const data = await response.json();
    return data.results;
};

