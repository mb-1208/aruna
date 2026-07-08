"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { IconStarFilled, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Testimonials({ subtitle, title, subtext, reviews, currentLang }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const defaultReviews = [
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

  const sourceReviews = reviews && reviews.length > 0 ? reviews : defaultReviews;

  const mappedReviews = sourceReviews.map(r => {
    if (currentLang === 'es') {
      return {
        ...r,
        review: r.quote_es || r.quote || r.review,
        location: r.location_es || r.location,
        bgImage: r.bg_image || r.bgImage
      };
    }
    return {
      ...r,
      review: r.quote || r.review,
      bgImage: r.bg_image || r.bgImage
    };
  });

  const itemsPerPage = isMobile ? 1 : 3;
  const totalPages = Math.ceil(mappedReviews.length / itemsPerPage);

  const pages = [];
  for (let i = 0; i < mappedReviews.length; i += itemsPerPage) {
    pages.push(mappedReviews.slice(i, i + itemsPerPage));
  }

  // Ensure index is within bounds if screen size changes
  useEffect(() => {
    if (currentIndex >= totalPages && totalPages > 0) {
      setCurrentIndex(totalPages - 1);
    }
  }, [totalPages, currentIndex]);

  const handleDragEnd = (e, { offset, velocity }) => {
    const swipe = swipePower(offset.x, velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      setCurrentIndex((prev) => Math.min(prev + 1, totalPages - 1));
    } else if (swipe > swipeConfidenceThreshold) {
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

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
          <span className="text-sm tracking-[0.2em] uppercase text-gray-500 block mb-4">{subtitle || "Stories From Our Travelers"}</span>
          <h2 className="text-4xl md:text-6xl font-light font-cormorant uppercase text-brand-dark-brown max-w-lg" dangerouslySetInnerHTML={{ __html: title || "Stories From<br />Our Travelers" }} />
        </div>
        <div className="flex flex-col items-start md:items-end justify-between gap-6 max-w-sm text-left md:text-right">
          {subtext && <p className="text-gray-600 text-xl leading-relaxed font-sacramento">{subtext}</p>}
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentIndex(prev => Math.max(prev - 1, 0))}
              disabled={currentIndex === 0}
              className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 disabled:opacity-30 transition-colors"
            >
              <IconChevronLeft stroke={1.5} />
            </button>
            <button
              onClick={() => setCurrentIndex(prev => Math.min(prev + 1, totalPages - 1))}
              disabled={currentIndex === totalPages - 1}
              className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 disabled:opacity-30 transition-colors"
            >
              <IconChevronRight stroke={1.5} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Slider */}
      <div className="relative w-full overflow-hidden touch-pan-y">
        <motion.div
          className="flex"
          animate={{ x: `-${currentIndex * 100}%` }}
          transition={{ type: "tween", ease: "easeInOut", duration: 0.5 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
        >
          {pages.map((page, pageIdx) => (
            <div key={pageIdx} className="w-full shrink-0 grid grid-cols-1 md:grid-cols-3 gap-8 px-1">
              {page.map((r, index) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
                  className="relative aspect-[3/4] overflow-hidden group cursor-grab active:cursor-grabbing"
                >
                  <Image
                    src={r.image_url || r.bgImage || "http://placehold.co/400x600.png"}
                    alt={`Review by ${r.author || r.name}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col gap-4 pointer-events-none">
                    <div>
                      <h4 className="text-white font-bold tracking-widest uppercase text-xs">{r.author || r.name}</h4>
                    </div>
                    <p className="text-white text-sm leading-relaxed italic line-clamp-3">"{r.review || r.quote}"</p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <IconStarFilled key={star} size={14} className="text-[#D4AF37]" />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Dots */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-12">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-colors ${currentIndex === idx ? "bg-gray-800 w-6" : "bg-gray-300 hover:bg-gray-400"
                }`}
              aria-label={`Go to page ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
