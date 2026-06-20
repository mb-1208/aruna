"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const reviews = [
  {
    id: 1,
    quote: "ARUNA RETREATS IS A TRUE SANCTUARY. I ARRIVED FEELING DRAINED AND LEFT FEELING COMPLETELY RENEWED.",
    author: "Jessica"
  },
  {
    id: 2,
    quote: "THE MOST TRANSFORMATIVE WEEK OF MY LIFE. EVERY DETAIL WAS THOUGHTFULLY CURATED FOR ULTIMATE RELAXATION.",
    author: "Michael"
  },
  {
    id: 3,
    quote: "A BREATHTAKING EXPERIENCE THAT RECONNECTED ME WITH NATURE AND MY INNER PEACE. HIGHLY RECOMMENDED.",
    author: "Sarah"
  }
];

export default function RetreatQuote() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000); // Change every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="reviews" className="w-full max-w-5xl mx-auto px-8 py-24 md:py-32 font-sans text-center">
      <div className="md:mb-12">
        <span className="text-sm tracking-[0.2em] uppercase text-gray-500 block mb-4">Reviews</span>
        <h2 className="text-3xl md:text-4xl font-light uppercase text-black">
          WHAT THEY SAY
        </h2>
      </div>

      <div className="pt-12 relative min-h-[250px] md:min-h-[200px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute w-full"
          >
            <h3 className="text-gray-700 text-2xl md:text-4xl lg:text-5xl font-light leading-tight uppercase text-black mb-8 px-4">
              "{reviews[currentIndex].quote}"
            </h3>

            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
              - {reviews[currentIndex].author}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
