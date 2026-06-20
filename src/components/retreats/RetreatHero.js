"use client";

import { IconMouse } from "@tabler/icons-react";
import { motion } from "framer-motion";

export default function RetreatHero() {
  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden font-sans">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url("http://placehold.co/1920x1080.png")' }}
      />
      {/* Dark Overlay for text readability */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 w-full h-full pt-20">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="text-white text-4xl md:text-6xl lg:text-7xl font-light uppercase max-w-4xl tracking-wide drop-shadow-lg"
        >
          RECONNECT WITH YOURSELF IN TOTAL SERENITY
        </motion.h1>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white animate-bounce">
        <span className="text-xs tracking-widest uppercase opacity-80">Scroll</span>
        <IconMouse size={24} stroke={1.5} className="opacity-80" />
      </div>
    </section>
  );
}
