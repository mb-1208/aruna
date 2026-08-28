"use client";

import { IconMouse } from "@tabler/icons-react";
import { motion } from "framer-motion";

export default function TravelHero({ title, image, scrollText }) {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url("${image || 'https://placehold.co/1920x1080.png'}")` }}
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 w-full max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="text-white text-3xl md:text-5xl lg:text-[4rem] leading-none font-light font-cormorant uppercase drop-shadow-lg"
          dangerouslySetInnerHTML={{ __html: title || "Explore The Best<br />Curated Travel<br />Experiences" }}
        />
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-10 opacity-80 animate-bounce">
        <span className="text-white text-xs tracking-widest uppercase mb-2 text-center">{scrollText || "Scroll"}</span>
        <IconMouse size={24} stroke={1} className="text-white" />
      </div>
    </section>
  );
}
