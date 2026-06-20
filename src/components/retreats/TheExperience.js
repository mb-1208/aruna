"use client";

import Image from "next/image";
import Link from "next/link";
import { IconArrowUpRight } from "@tabler/icons-react";
import { motion } from "framer-motion";

export default function TheExperience() {
  const experiences = [
    {
      id: 1,
      image: "http://placehold.co/800x800.png",
      title: "Destination 1",
      date: "Aug 15 - Aug 20, 2026",
      description: "Immerse yourself in lush greenery and find inner peace with daily yoga and meditation sessions.",
      link: "/retreats/destination-1"
    },
    {
      id: 2,
      image: "http://placehold.co/800x800.png",
      title: "Destination 2",
      date: "Sep 01 - Sep 07, 2026",
      description: "A vibrant blend of wellness and surf culture, perfect for the energetic and adventurous soul.",
      link: "/retreats/destination-2"
    },
    {
      id: 3,
      image: "http://placehold.co/800x800.png",
      title: "Destination 3",
      date: "Oct 10 - Oct 15, 2026",
      description: "Disconnect from the world and rejuvenate on this pristine island with crystal clear waters.",
      link: "/retreats/destination-3"
    },
    {
      id: 4,
      image: "http://placehold.co/800x800.png",
      title: "Destination 4",
      date: "Nov 05 - Nov 12, 2026",
      description: "Experience untamed beauty and cultural richness while restoring your body and mind.",
      link: "/retreats/destination-4"
    }
  ];

  return (
    <section id="destinations" className="w-full pl-4 md:pl-8 py-16 font-sans overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto pr-4 md:pr-8 mb-12"
      >
        <span className="text-sm tracking-[0.2em] uppercase text-gray-500 block mb-4">Destinations</span>
        <h2 className="text-4xl md:text-5xl font-light uppercase text-black">
          THE EXPERIENCE
        </h2>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="flex overflow-x-auto gap-4 md:gap-8 pb-8 snap-x snap-mandatory hide-scrollbar pr-4 md:pr-8"
      >
        {experiences.map((exp) => (
          <div 
            key={exp.id} 
            className="w-[85vw] md:w-auto md:min-w-[400px] md:max-w-[400px] flex-shrink-0 snap-start group cursor-pointer"
          >
            <Link href={exp.link} className="block w-full">
              {/* Image Container */}
              <div className="relative w-full aspect-square mb-6 overflow-hidden bg-gray-100">
                <Image
                  src={exp.image}
                  alt={exp.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  unoptimized
                />
              </div>

              {/* Title & Arrow */}
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-medium tracking-wide text-black">{exp.title}</h3>
                <IconArrowUpRight size={24} className="text-black transform transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>

              {/* Date */}
              <p className="text-sm uppercase tracking-widest text-gray-500 mb-4">{exp.date}</p>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                {exp.description}
              </p>
            </Link>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
