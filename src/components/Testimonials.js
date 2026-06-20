"use client";

import Image from "next/image";
import { IconStarFilled } from "@tabler/icons-react";
import { motion } from "framer-motion";

export default function Testimonials() {
  const reviews = [
    {
      id: 1,
      name: "David & Sarah",
      review: "A transformative journey we will never forget. The details were impeccable.",
      bgImage: "http://placehold.co/400x600.png",
      avatar: "http://placehold.co/100x100.png"
    },
    {
      id: 2,
      name: "Elena M.",
      review: "Aruna truly understands luxury and peace. Every moment was curated beautifully.",
      bgImage: "http://placehold.co/400x600/444444/FFFFFF.png",
      avatar: "http://placehold.co/100x100.png"
    },
    {
      id: 3,
      name: "Michael T.",
      review: "The best retreat experience I've ever had. Highly recommend to everyone.",
      bgImage: "http://placehold.co/400x600.png",
      avatar: "http://placehold.co/100x100.png"
    }
  ];

  return (
    <section id="reviews" className="w-full max-w-7xl mx-auto px-8 py-24 md:py-32 font-sans overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col md:flex-row md:justify-between md:items-end mb-16 gap-8"
      >
        <div>
          <span className="text-sm tracking-[0.2em] uppercase text-gray-500 block mb-4">Stories From Our Travelers</span>
          <h2 className="text-4xl md:text-5xl font-light uppercase max-w-lg">
            Stories From<br />Our Travelers
          </h2>
        </div>
        <p className="text-gray-600 max-w-sm md:text-right text-base leading-relaxed">
          Discover what our clients are saying around the world as we curate their most memorable escapes.
        </p>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
            className="relative aspect-[3/4] overflow-hidden group"
          >
            <Image
              src={item.bgImage}
              alt={`Review by ${item.name}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden relative border-2 border-white/20">
                <Image src={item.avatar} alt={item.name} fill className="object-cover" unoptimized />
              </div>
              <p className="text-white text-sm leading-relaxed italic line-clamp-3">"{item.review}"</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <IconStarFilled key={star} size={14} className="text-[#D4AF37]" />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Dots Placeholder */}
      <div className="flex justify-center gap-2 mt-12">
        <div className="w-2 h-2 rounded-full bg-gray-800"></div>
        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
      </div>
    </section>
  );
}
