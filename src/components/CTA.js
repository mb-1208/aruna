"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section className="relative w-full h-[600px] flex items-center overflow-hidden font-sans">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url("http://placehold.co/1920x800.png")' }}
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-12">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 max-w-2xl text-center md:text-left"
        >
          <h2 className="text-white text-4xl md:text-5xl font-light uppercase mb-6">
            Ready For Your Next<br className="hidden md:block" /> Bespoke Adventure?
          </h2>
          <Link href="/contact" className="inline-flex items-center justify-center bg-white text-black px-12 py-3 rounded-full text-sm font-medium tracking-widest uppercase hover:bg-gray-200 transition-colors">
            Contact
          </Link>
        </motion.div>

        {/* Right Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-white text-center md:text-right"
        >
          <p className="text-3xl md:text-5xl font-light uppercase tracking-widest">
            10% Off<br />First Trip
          </p>
        </motion.div>
      </div>
    </section>
  );
}
