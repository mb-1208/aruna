"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <section id="about" className="w-full max-w-7xl mx-auto px-8 py-24 md:py-40 flex flex-col md:flex-row items-start gap-16 font-sans">
      {/* Left Text Column */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex-1 md:sticky md:top-40 space-y-8"
      >
        <div>
          <span className="text-sm tracking-[0.2em] uppercase text-gray-500 block mb-4">About Us</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light uppercase">
            Find Serenity In<br />Every Journey
          </h2>
        </div>

        <div className="text-gray-700 space-y-6 leading-relaxed max-w-lg">
          <p>
            We believe that travel is more than just a change of scenery—it is an opportunity to reconnect with yourself. At Aruna, we curate bespoke travel experiences that blend untouched natural beauty with soul-soothing luxury. Let us craft a journey that not only explores the world but also restores your spirit.
          </p>
        </div>
      </motion.div>

      {/* Right Image Column */}
      <motion.div 
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="flex-1 relative w-full flex flex-col items-end"
      >
        <div className="relative aspect-[3/4] w-full max-w-[600px] overflow-hidden">
          <Image
            src="http://placehold.co/800x1200.png"
            alt="About Aruna"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        {/* Founder Quote */}
        <div className="mt-8 max-w-[600px] bg-white pt-6 md:pl-12">
          <p className="text-base leading-relaxed text-gray-600">
            "Hello! I am Jessica, the founder of Aruna. Having traveled extensively, I believe true luxury is finding peace in the world's most beautiful corners. I created Aruna to blend world-class adventure with soul-restoring tranquility, crafting deeply personal, transformative journeys just for you."
          </p>
        </div>
      </motion.div>
    </section>
  );
}
