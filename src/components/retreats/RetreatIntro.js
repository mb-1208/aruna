"use client";

import { IconArrowRight } from "@tabler/icons-react";
import { motion } from "framer-motion";

export default function RetreatIntro({ title, subtitle, buttonText }) {
  const scrollToDestinations = (e) => {
    e.preventDefault();
    const element = document.getElementById("destinations");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <section className="w-full max-w-7xl mx-auto px-8 py-24 md:py-32 font-sans">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16"
        >
          <span className="text-sm tracking-[0.2em] uppercase text-gray-500">{subtitle || "Meet Aruna Retreats"}</span>
          <button
            onClick={scrollToDestinations}
            className="min-w-fit flex items-center gap-2 border border-black rounded-full px-8 py-2.5 text-sm tracking-widest hover:bg-black hover:text-white transition-colors cursor-pointer"
          >
            {buttonText || "Read More"} <IconArrowRight className="-rotate-45" size={16} />
          </button>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-3xl md:text-6xl font-light font-cormorant leading-tight uppercase text-brand-dark-brown"
          dangerouslySetInnerHTML={{ __html: title || "ESCAPE THE NOISE AND RECONNECT WITH YOUR INNER SELF. ARUNA RETREATS OFFERS CURATED WELLNESS JOURNEYS DESIGNED TO RESTORE YOUR MIND, BODY, AND SPIRIT IN NATURE'S MOST TRANQUIL SANCTUARIES." }}
        />
      </section>

    </>
  );
}
