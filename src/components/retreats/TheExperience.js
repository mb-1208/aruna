"use client";

import Image from "next/image";
import Link from "next/link";
import { IconArrowUpRight } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel } from 'swiper/modules';
import 'swiper/css';

export default function TheExperience({ subtitle, title, destinations, currentLang }) {
  const defaultExperiences = [
    {
      id: 1,
      image_url: "http://placehold.co/800x800.png",
      title: "Destination 1",
      date: "Aug 15 - Aug 20, 2026",
      description: "Immerse yourself in lush greenery and find inner peace with daily yoga and meditation sessions.",
      link: "/retreats/destination-1"
    },
    {
      id: 2,
      image_url: "http://placehold.co/800x800.png",
      title: "Destination 2",
      date: "Sep 01 - Sep 07, 2026",
      description: "A vibrant blend of wellness and surf culture, perfect for the energetic and adventurous soul.",
      link: "/retreats/destination-2"
    },
    {
      id: 3,
      image_url: "http://placehold.co/800x800.png",
      title: "Destination 3",
      date: "Oct 10 - Oct 15, 2026",
      description: "Disconnect from the world and rejuvenate on this pristine island with crystal clear waters.",
      link: "/retreats/destination-3"
    },
    {
      id: 4,
      image_url: "http://placehold.co/800x800.png",
      title: "Destination 4",
      date: "Nov 05 - Nov 12, 2026",
      description: "Experience untamed beauty and cultural richness while restoring your body and mind.",
      link: "/retreats/destination-4"
    }
  ];

  const experiences = destinations && destinations.length > 0 ? destinations : defaultExperiences;
  const mappedExperiences = experiences.map(exp => {
    let baseExp = { ...exp };
    if (exp.slug) {
      baseExp.link = `/${currentLang || 'en'}/retreats/${exp.slug}`;
    }
    
    baseExp.image_url = exp.content?.cover_image || exp.content?.hero_image || exp.image_url;
    
    let isSoldOut = false;
    let hasAvailableDates = true;
    const basePackages = exp.content?.packages || [];
    if (basePackages.length > 0) {
      let availableCount = 0;
      let totalDates = 0;
      basePackages.forEach(pkg => {
        if (pkg.dates && pkg.dates.length > 0) {
           pkg.dates.forEach(d => {
              totalDates++;
              const status = (d.status || '').toLowerCase();
              const isUnavailable = status.includes('fully booked') || status.includes('completo') || status.includes('private group') || status.includes('grupo cerrado');
              if (!isUnavailable) {
                 availableCount++;
              }
           });
        }
      });
      if (totalDates > 0 && availableCount === 0) {
         hasAvailableDates = false;
      }
    }
    if (basePackages.length > 0 && !hasAvailableDates) {
      isSoldOut = true;
    }

    if (currentLang === 'es') {
      return {
        ...baseExp,
        title: exp.content?.title_es || exp.title,
        date: exp.content?.date_es || exp.date,
        description: exp.content?.description_es || exp.description,
        isSoldOut
      };
    }
    return { ...baseExp, isSoldOut };
  });

  return (
    <section id="destinations" className="w-full pl-4 md:pl-8 py-16 font-sans overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto pr-4 md:pr-8 mb-12"
      >
        <span className="text-sm tracking-[0.2em] uppercase text-gray-500 block mb-4">{subtitle || "Destinations"}</span>
        <h2 className="text-5xl md:text-6xl font-light font-cormorant uppercase text-brand-dark-brown" dangerouslySetInnerHTML={{ __html: title || "THE EXPERIENCE" }} />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="w-full pb-8 pr-4 md:pr-8 cursor-grab active:cursor-grabbing"
      >
        <Swiper
          modules={[Mousewheel]}
          spaceBetween={16}
          slidesPerView={1.2}
          grabCursor={true}
          mousewheel={{
            forceToAxis: true,
          }}
          breakpoints={{
            768: {
              slidesPerView: 2.25,
              spaceBetween: 32,
            },
            1024: {
              slidesPerView: 3.25,
              spaceBetween: 32,
            },
          }}
          className="w-full h-full"
        >
          {mappedExperiences.map((exp) => (
            <SwiperSlide key={exp.id} className="h-auto">
              <Link href={exp.link} className="block w-full h-full group select-none" draggable={false}>
                {/* Image Container */}
                <div className="relative w-full aspect-square mb-6 overflow-hidden bg-gray-100 pointer-events-none">
                  <Image
                    src={exp.image_url || "http://placehold.co/800x800.png"}
                    alt={exp.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    unoptimized
                  />
                </div>

                {/* Title & Arrow */}
                <div className="flex justify-between items-start mb-2 gap-4">
                  <h3 className="text-2xl font-medium tracking-wide text-black line-clamp-2">{exp.title}</h3>
                  <IconArrowUpRight size={24} className="text-black shrink-0 transform transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>

                {/* Date */}
                <p className="text-sm uppercase tracking-widest text-gray-500 mb-4">
                  {exp.date} {exp.isSoldOut && <span className="ml-1 text-gray-500">({currentLang === 'es' ? 'AGOTADO' : 'SOLD OUT'})</span>}
                </p>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed text-sm md:text-base line-clamp-3">
                  {exp.description}
                </p>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </section>
  );
}
