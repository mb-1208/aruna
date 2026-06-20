"use client";

import { motion } from "framer-motion";

export default function RetreatDetailHero() {
  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden font-sans">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url("http://placehold.co/1920x1080.png")' }}
      />
      {/* Dark Overlay for text readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 w-full h-full pt-20">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="text-white text-5xl md:text-6xl lg:text-7xl font-light uppercase tracking-widest drop-shadow-lg mb-6"
        >
          DESTINATION A
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="text-white text-lg md:text-xl font-light uppercase tracking-widest max-w-2xl mb-4"
        >
          IMMERSE YOURSELF IN A TRANSFORMATIVE JOURNEY OF PEACE AND RESTORATION.
        </motion.p>
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          className="text-white text-lg font-bold tracking-widest uppercase mb-4"
        >
          20 MAY 2026
        </motion.p>
        <motion.button 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
          className="bg-white text-black px-12 py-3 rounded-full text-sm font-medium tracking-widest uppercase hover:bg-gray-200 transition-colors"
        >
          Book Now
        </motion.button>
      </div>
    </section>
  );
}
