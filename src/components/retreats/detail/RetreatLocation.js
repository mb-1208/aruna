"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function RetreatLocation({ title, text, images }) {
  const locationImages = [
    "https://placehold.co/600x800.png",
    "https://placehold.co/600x800.png",
    "https://placehold.co/600x800.png"
  ];
  const displayImages = (images && images.length > 0) ? images : locationImages;

  return (
    <section id="centers" className="w-full py-16 md:py-24 font-sans bg-white overflow-hidden">
      <motion.h2 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-3xl md:text-5xl font-light uppercase text-center text-black mb-12"
      >
        {title || "LOCATION"}
      </motion.h2>

      {/* Image Gallery */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-0 mb-16">
        {displayImages.map((src, idx) => (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: idx * 0.2, ease: "easeOut" }}
            className="relative w-full aspect-square md:aspect-[3/4] overflow-hidden group"
          >
            <Image
              src={src}
              alt={`Location ${idx + 1}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              unoptimized
            />
          </motion.div>
        ))}
      </div>

      {/* Description */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl mx-auto px-8 text-center"
      >
        <p className="leading-relaxed text-lg md:text-xl font-medium">
          {text || "Nestled amidst lush, untouched landscapes, our retreat location offers the perfect balance of comfort and connection to nature. Here, every detail is intentional, and every space is carefully designed for you."}
        </p>
      </motion.div>
    </section>
  );
}
