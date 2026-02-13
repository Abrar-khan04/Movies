import React, { useState, useRef, useEffect } from 'react';
import { getAIRecommendation } from '../services/ai';


const AIChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{
        role: "model", text: "Hey! I'm your Streamlio movie buddy. Tell me your mood or what kind of movie you're looking for! 🎬 "
    }]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: "user", text: userMessage }]);
        setIsLoading(true);

        try {
            const chatHistory = messages.map(msg => ({
                role: msg.role === "model" ? "model" : "user",
                parts: [{ text: msg.text }]
            }));
            const aiResponse = await getAIRecommendation(userMessage, chatHistory);
            setMessages(prev => [...prev, { role: "model", text: aiResponse }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: "model", text: "Sorry, something went wrong. Try again!" }]);
        } finally {
            setIsLoading(false);
        }
    };
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const formatMessage = (text) => {
        return text.split(/(\*\*.*\*\*)/g).map((part, i) => {
            if (part.startsWith("**") && part.endsWith("**")) {
                return <strong key={i}>{part.slice(2, -2)}</strong>
            }
            return part;
        });
    };

    return (
        <>

            {/*Floating Chat button*/}
            <button onClick={() => setIsOpen(!isOpen)} className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110" style={{ boxShadow: "0 0 20px rgba(239, 68, 68, 0.4)" }}>
                {isOpen ? <span className="text-xl">✕</span> : <span className="text-2xl">🤖</span>}
            </button>

            {/*Chat Window*/}
            {isOpen && (
                <div className='fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-[500px] bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden'>
                    {/*Header*/}
                    <div className='bg-gradient-to-r from-red-600 to-red-800 px-4 py-3 flex items-center gap-3'>
                        <span className='text-2xl'></span>
                        <div>
                            <h3 className='text-white font-bold text-sm'>Streamlio AI</h3>
                            <p className='text-red-200 text-xs'>Your Movie Recommendation buddy</p>
                        </div>
                    </div>
                    {/* Messages */}
                    <div className='flex-1 overflow-y-auto p-4 space-y-3'>
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${msg.role === "user" ? "bg-red-600 text-white rounded-br-md" : "bg-gray-800 text-gray-200 rounded-bl-md"}`}>
                                    {formatMessage(msg.text)}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className='flex justify-start'>
                                <div className='bg-gray-800 text-gray-400 px-4 py-2 rounded-2xl rounded-bl-md text-sm'>
                                    Thinking...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    {/*Input*/}
                    <div className='p-3 border-t border-gray-700'>
                        <div className='flex gap-2'>
                            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder='What mood are you in?' className='flex-1 bg-gray-800 text-white text-sm px-4 py-2 rounded-full border border-gray-600 focus:outline-none focus:border-red-500 placeholder-gray-500' disabled={isLoading} />
                            <button onClick={handleSend} disabled={isLoading || !input.trim()} className='bg-red-600 hover:bg-red-700 disabled:bg-gray-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors disabled:cursor-not-allowed'>
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default AIChat;