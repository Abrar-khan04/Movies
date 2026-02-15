import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Rec from "./components/Rec";
import Show from "./components/Show";
import MovieDetails from "./pages/MovieDetails";
import Movies from "./pages/Movies";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AIChat from "./components/AIChat";

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <Hero />
      <Rec />
      <Show />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/movies" element={<Movies />} />
      </Routes>
      <AIChat />
    </BrowserRouter>
  )
}
export default App;
