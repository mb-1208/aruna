"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function RetreatOverview({ title, description, imageUrl }) {
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
          <h2 className="text-4xl md:text-5xl font-light font-cormorant uppercase tracking-wide mb-8 text-brand-dark-brown">
            {title}
          </h2>
          <p className="text-gray-600 leading-relaxed text-base md:text-lg whitespace-pre-wrap">
            {description}
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
          <div className="relative w-full overflow-hidden bg-gray-100">
            <Image 
              src={imageUrl || "https://placehold.co/800x600.png"} 
              alt={title || "Retreat Overview"} 
              width={1200}
              height={1200}
              style={{ width: '100%', height: 'auto' }}
              className="transition-transform duration-700 hover:scale-105" 
              unoptimized 
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
