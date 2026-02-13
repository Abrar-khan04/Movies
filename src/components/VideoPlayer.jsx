import React from "react";

function VideoPlayer({ url }) {
    console.log("VideoPlayer rendering with URL:", url);

    if (!url) {
        console.log("No URL provided to VideoPlayer");
        return null;
    }

    // Extract YouTube video ID from URL
    const getYouTubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
    };

    const videoId = getYouTubeId(url);
    console.log("YouTube Video ID:", videoId);

    if (!videoId) {
        return (
            <div className="aspect-video bg-gray-800 flex items-center justify-center">
                <span className="text-white">Invalid video URL</span>
            </div>
        );
    }

    return (
        <div className="aspect-video w-full">
            <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </div>
    );
}

export default VideoPlayer;