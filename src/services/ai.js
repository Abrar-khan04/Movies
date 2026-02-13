const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;


export const getAIRecommendation = async (userMessage, chatHistory = []) => {
    const systemPrompt = `you are a friendly movie recommendation assistant for Streamlio.
    Recommend movies based on the user's mood or preferences.
    Keep responses concise (2-3 sentences) and suggest 2-3 movie titles.
    Format movie titles in bold using **title**. Be enthusiastic and fun!`;

    const contents = [
        { role: "user", parts: [{ text: systemPrompt }] },
        {
            role: "model", parts: [{ text: "Got it! I'm your Streamlio movie buddy. Tell me your mood and I'll find perfect movies! 🎬" }]
        },
        ...chatHistory,
        { role: "user", parts: [{ text: userMessage }] }
    ];

    try {
        const response = await fetch(GEMINI_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Gemini API Error:", data.error?.message || "Unknown error", data);
            return "Oops! I'm having trouble connecting to my brain. Please try again later.";
        }

        return data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't think of recommendations. Try again!";
    } catch (error) {
        console.error("AI Error:", error);
        return "Oops! Something went wrong. Please try again.";
    }
};