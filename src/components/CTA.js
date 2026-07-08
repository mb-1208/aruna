"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CTA({ title, text, buttonText, image }) {
  const { currentLang } = useLanguage();
  return (
    <section className="relative w-full h-[600px] flex items-center overflow-hidden font-sans">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url("${image || 'http://placehold.co/1920x800.png'}")` }}
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 items-center gap-12">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center md:text-left"
        >
          <h2 className="text-white text-5xl md:text-6xl font-light font-cormorant uppercase mb-6" dangerouslySetInnerHTML={{ __html: title || "Ready For Your Next<br class=\"hidden md:block\" /> Bespoke Adventure?" }} />
          <Link href={`/${currentLang}/contact`} className="inline-flex items-center justify-center bg-white text-black px-12 py-3 rounded-full text-sm font-medium tracking-widest uppercase hover:bg-gray-200 transition-colors">
            {buttonText || "Contact"}
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
          <p className="text-lg md:text-[1.5rem] font-light font-cormorant uppercase tracking-widest" dangerouslySetInnerHTML={{ __html: text || "10% Off<br />First Trip" }} />
        </motion.div>
      </div>
    </section>
  );
}
