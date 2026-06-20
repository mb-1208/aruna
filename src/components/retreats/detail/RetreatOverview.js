"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function RetreatOverview() {
  return (
    <section className="w-full max-w-7xl mx-auto px-8 py-24 md:py-32 font-sans">
      <div className="flex flex-col md:flex-row gap-16 items-center">
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 text-center md:text-left"
        >
          <h2 className="text-3xl md:text-4xl font-light uppercase tracking-wide mb-8 text-black">
            DESTINATION A
          </h2>
          <p className="text-gray-600 leading-relaxed text-base md:text-lg">
            Experience a curated escape designed to harmonize your mind, body, and spirit. Tucked away in a serene sanctuary, this retreat invites you to unplug from the demands of modern life and reconnect with your inner self through mindful movement, nourishing rituals, and moments of profound stillness. Whether you seek quiet reflection or holistic healing, allow this space to become your home for rejuvenation.
          </p>
        </motion.div>

        {/* Right Image */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="flex-1 w-full"
        >
          <div className="relative w-full aspect-[4/3] md:aspect-square lg:aspect-[4/3] overflow-hidden bg-gray-100">
            <Image 
              src="http://placehold.co/800x600.png" 
              alt="Retreat Overview" 
              fill 
              className="object-cover transition-transform duration-700 hover:scale-105" 
              unoptimized 
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
