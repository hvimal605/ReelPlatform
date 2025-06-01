import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCompass } from "react-icons/fa";
import Navbar from "../components/common/Navbar";

const categories = [
  { name: "Comedy", icon: "😂" },
  { name: "Dance", icon: "💃" },
  { name: "Travel", icon: "✈️" },
  { name: "Food", icon: "🍕" },
  { name: "Fitness", icon: "🏋️" },
  { name: "Fashion", icon: "👗" },
];

export default function Home() {
  return (
    <div className=" mt-10 min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white overflow-x-hidden font-sans">
      {/* Navbar */}
      

      {/* Hero Section */}
      <section className="flex flex-col-reverse lg:flex-row items-center justify-between px-6 sm:px-12 md:px-20 gap-12 mt-12 lg:mt-24">
        {/* Text Content */}
       <motion.div
  className="w-full lg:w-1/2 flex flex-col items-center text-center lg:items-start lg:text-left"
  initial={{ opacity: 0, x: -30 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.8 }}
>
  <h2 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
    Your <span className="text-pink-400">Reels</span>, <br />
    Your <span className="text-blue-400">Vibe</span>
  </h2>
  <p className="text-gray-300 text-lg mb-8 max-w-lg">
    Share short videos, explore creative content, and grow your vibe in
    the hottest categories!
  </p>
  <div className="flex flex-row flex-wrap justify-center lg:justify-start gap-4 mt-4">
    <Link
      to="/signup"
      className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition-all text-center"
    >
      Join Now
    </Link>
    <Link
      to="/reels/explore"
      className="bg-white text-black px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-all shadow-lg"
    >
      <FaCompass /> Explore
    </Link>
  </div>
</motion.div>


        {/* Image */}
        <motion.div
          className="w-full lg:w-1/2 flex justify-center"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="https://media.istockphoto.com/id/1387133946/photo/short-video-marketing-concept.jpg?b=1&s=612x612&w=0&k=20&c=yODy1g6-4pxcEtkWuKQBplap_uNCMOjfUzUaeUyJ1Yo="
            alt="app preview"
            className="max-w-xs sm:max-w-sm md:max-w-md rounded-3xl shadow-2xl border-4 border-white/10"
          />
        </motion.div>
      </section>

      {/* Categories */}
      <section className="mt-20 px-6 sm:px-12 md:px-20">
        <h3 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-white drop-shadow-md">
          Trending Categories <span className="animate-pulse">🔥</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-5">
          {categories.map((cat, index) => (
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.97 }}
              key={index}
              className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl text-center border border-white/20 shadow-lg transition-all hover:shadow-pink-500/20"
            >
              <div className="text-4xl mb-2">{cat.icon}</div>
              <p className="font-semibold text-white">{cat.name}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-24 py-6 text-center text-sm text-gray-400 border-t border-white/10">
        © 2025 ReelVibe • Built with 💖 by <span className="text-white font-medium">YourName</span>
      </footer>
    </div>
  );
}
