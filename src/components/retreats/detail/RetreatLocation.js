"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

import "swiper/css";
import "swiper/css/navigation";

export default function RetreatLocation({ title, text, images }) {
  const fallbackImages = [
    "https://placehold.co/600x800.png",
    "https://placehold.co/600x800.png",
    "https://placehold.co/600x800.png"
  ];

  const validImages = (images || []).filter(
    (src) => typeof src === "string" && src.trim() !== ""
  );
  const displayImages = validImages.length > 0 ? validImages : fallbackImages;
  const count = displayImages.length;

  // Consistent responsive height across all view modes (1, 2, 3, or >3 images)
  const imageContainerClass = "relative w-full h-[380px] sm:h-[480px] md:h-[560px] lg:h-[620px] overflow-hidden group";

  return (
    <section id="centers" className="w-full py-16 md:py-24 font-sans bg-white overflow-hidden">
      <motion.h2 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-3xl md:text-5xl font-light uppercase text-center text-black mb-12 tracking-wider"
      >
        {title || "LOCATION"}
      </motion.h2>

      {/* Image Gallery Container */}
      <div className="w-full mb-16">
        {/* CASE 1: Single image */}
        {count === 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={imageContainerClass}
          >
            <Image
              src={displayImages[0]}
              alt="Location Sanctuary"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              unoptimized
            />
          </motion.div>
        )}

        {/* CASE 2: Exactly 2 images (2 columns) */}
        {count === 2 && (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-0">
            {displayImages.map((src, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: idx * 0.15, ease: "easeOut" }}
                className={imageContainerClass}
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
        )}

        {/* CASE 3: Exactly 3 images (3 columns) */}
        {count === 3 && (
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-0">
            {displayImages.map((src, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: idx * 0.15, ease: "easeOut" }}
                className={imageContainerClass}
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
        )}

        {/* CASE 4: More than 3 images -> Smooth Autoplay Looping Slider */}
        {count > 3 && (
          <div className="w-full relative group/slider">
            <Swiper
              modules={[Autoplay, Navigation]}
              loop={true}
              speed={1200}
              autoplay={{
                delay: 3500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
              }}
              slidesPerView={1}
              spaceBetween={0}
              grabCursor={true}
              navigation={{
                prevEl: '.loc-swiper-prev',
                nextEl: '.loc-swiper-next'
              }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 0
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 0
                }
              }}
              className="w-full"
            >
              {displayImages.map((src, idx) => (
                <SwiperSlide key={idx}>
                  <div className={imageContainerClass}>
                    <Image
                      src={src}
                      alt={`Location ${idx + 1}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      unoptimized
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Navigation Arrows */}
            <button 
              type="button"
              className="loc-swiper-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/80 hover:bg-white text-black backdrop-blur-md shadow-md flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:scale-105 cursor-pointer"
              aria-label="Previous Slide"
            >
              <IconChevronLeft size={22} />
            </button>
            <button 
              type="button"
              className="loc-swiper-next absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/80 hover:bg-white text-black backdrop-blur-md shadow-md flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:scale-105 cursor-pointer"
              aria-label="Next Slide"
            >
              <IconChevronRight size={22} />
            </button>
          </div>
        )}
      </div>

      {/* Description */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl mx-auto px-8 text-center"
      >
        <p className="leading-relaxed text-lg md:text-xl font-medium text-gray-800">
          {text || "Nestled amidst lush, untouched landscapes, our retreat location offers the perfect balance of comfort and connection to nature. Here, every detail is intentional, and every space is carefully designed for you."}
        </p>
      </motion.div>
    </section>
  );
}
