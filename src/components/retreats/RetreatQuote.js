"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectFade } from 'swiper/modules';
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

function ReviewSlide({ rev }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex flex-col items-center">
      {(rev.bg_image || rev.bgImage) && (
        <div className="w-[280px] h-[420px] relative mb-12">
          <img
            src={rev.bg_image || rev.bgImage}
            alt={rev.name || rev.author || "Review"}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="mb-8 mx-auto max-w-5xl flex flex-col items-center">
        <h3 className={`text-gray-700 text-xs 2xl:text-base font-light leading-relaxed uppercase text-black transition-all duration-300 ${!isExpanded ? 'line-clamp-4' : ''}`}>
          "{rev.quote}"
        </h3>
        {rev.quote && rev.quote.length > 250 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 text-[10px] uppercase tracking-widest text-gray-400 hover:text-black transition-colors font-bold"
          >
            {isExpanded ? "Show Less" : "Show More"}
          </button>
        )}
      </div>

      <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
        - {rev.name || rev.author}
      </p>
    </div>
  );
}

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

  return (
    <section id="reviews" className="w-full max-w-5xl mx-auto px-8 py-24 md:py-32 font-sans text-center relative">
      <div className="md:mb-8">
        <span className="text-sm tracking-[0.2em] uppercase text-gray-500 block mb-4">{subtitle || "Reviews"}</span>
        <h2 className="text-3xl md:text-4xl font-light uppercase text-black" dangerouslySetInnerHTML={{ __html: title || "WHAT THEY SAY" }} />
      </div>

      <div className="pt-4 relative min-h-[300px] flex items-center justify-center">
        {reviews.length > 0 && (
          <div className="w-full relative px-4 md:px-12">
            <button className="swiper-prev-button absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 text-gray-400 hover:text-black transition-colors">
              <IconChevronLeft size={36} stroke={1} />
            </button>
            <button className="swiper-next-button absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 text-gray-400 hover:text-black transition-colors">
              <IconChevronRight size={36} stroke={1} />
            </button>

            <Swiper
              modules={[Navigation, Autoplay, EffectFade]}
              effect="fade"
              fadeEffect={{ crossFade: true }}
              speed={1000}
              spaceBetween={50}
              slidesPerView={1}
              navigation={{
                prevEl: '.swiper-prev-button',
                nextEl: '.swiper-next-button',
              }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
              }}
              loop={reviews.length > 1}
              className="w-full px-12 md:px-24"
            >
              {reviews.map((rev, index) => (
                <SwiperSlide key={index}>
                  <ReviewSlide rev={rev} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
    </section>
  );
}
