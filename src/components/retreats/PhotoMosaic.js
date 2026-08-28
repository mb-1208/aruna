"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function PhotoMosaic({ images: propImages, title }) {
  const images = propImages && propImages.length === 6 ? propImages : [
    "https://placehold.co/800x800.png", 
    "https://placehold.co/800x800.png", 
    "https://placehold.co/800x800.png", 
    "https://placehold.co/800x800.png", 
    "https://placehold.co/800x800.png", 
    "https://placehold.co/800x800.png", 
  ];

  return (
    <section id="gallery" className="relative w-full overflow-hidden bg-white">
      {/* Grid Layout */}
      <div className="grid grid-cols-2 md:grid-cols-3 grid-rows-3 md:grid-rows-2 h-[600px] md:h-[800px] gap-0">
        {images.map((img, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
            className="relative w-full h-full overflow-hidden group"
          >
            <Image src={img} fill alt="Retreat Moment" className="object-cover transition-transform duration-700 group-hover:scale-105" unoptimized />
          </motion.div>
        ))}
      </div>

      {/* Dark Overlay over all images for text readability */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      {/* Floating Text */}
      <div className="absolute inset-0 flex items-center justify-center p-8 text-center pointer-events-none z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-4xl md:text-5xl lg:text-6xl font-light uppercase tracking-wide text-white drop-shadow-xl max-w-sm md:max-w-none"
        >
          {title || "What Awaits You"}
        </motion.h2>
      </div>
    </section>
  );
}
