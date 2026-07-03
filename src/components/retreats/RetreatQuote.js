"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function RetreatQuote({ subtitle, title, reviews: initialReviews, currentLang }) {
  const defaultReviews = [
    {
      id: 1,
      quote: currentLang === 'es' ? "Una experiencia que cambia la vida. La serenidad y el cuidado superaron mis expectativas." : "A life-changing experience. The serenity and care were beyond anything I expected.",
      name: "Sarah Jenkins"
    },
    {
      id: 2,
      quote: currentLang === 'es' ? "El equilibrio perfecto entre bienestar y aventura. Regresé a casa completamente renovado." : "The perfect balance of wellness and adventure. I returned home completely renewed.",
      name: "Michael Chen"
    },
    {
      id: 3,
      quote: currentLang === 'es' ? "Cada detalle se ejecutó sin problemas. Realmente se sintió como un santuario para el alma." : "Every detail was flawlessly executed. It truly felt like a sanctuary for the soul.",
      name: "Emma Thompson"
    }
  ];

  const sourceReviews = initialReviews && initialReviews.length > 0 ? initialReviews : defaultReviews;
  
  const reviews = sourceReviews.map(r => {
    if (currentLang === 'es') {
      return {
        ...r,
        quote: r.quote_es || r.quote
      };
    }
    return r;
  });

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
        <span className="text-sm tracking-[0.2em] uppercase text-gray-500 block mb-4">{subtitle || "Reviews"}</span>
        <h2 className="text-3xl md:text-4xl font-light uppercase text-black" dangerouslySetInnerHTML={{ __html: title || "WHAT THEY SAY" }} />
      </div>

      <div className="pt-12 relative min-h-[300px] md:min-h-[250px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {reviews.length > 0 && (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute w-full px-4"
            >
              <h3 className="text-gray-700 text-2xl md:text-4xl lg:text-4xl font-light leading-tight uppercase text-black mb-8 mx-auto max-w-4xl">
                "{reviews[currentIndex].quote.length > 160 ? reviews[currentIndex].quote.substring(0, 160).trim() + '...' : reviews[currentIndex].quote}"
              </h3>

              <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
                - {reviews[currentIndex].name || reviews[currentIndex].author}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
