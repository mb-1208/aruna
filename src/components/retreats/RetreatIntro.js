"use client";

import { useState } from "react";
import { IconArrowRight, IconX } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RetreatIntro() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="w-full max-w-7xl mx-auto px-8 py-24 md:py-32 font-sans">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex justify-between items-end mb-16"
        >
          <span className="text-sm tracking-[0.2em] uppercase text-gray-500">Meet Aruna Retreats</span>
          <button
            onClick={() => setIsModalOpen(true)}
            className="min-w-fit flex items-center gap-2 border border-black rounded-full px-8 py-2.5 text-sm tracking-widest hover:bg-black hover:text-white transition-colors cursor-pointer"
          >
            Read More <IconArrowRight className="-rotate-45" size={16} />
          </button>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-2xl md:text-5xl font-light leading-tight uppercase text-black"
        >
          ESCAPE THE NOISE AND RECONNECT WITH YOUR INNER SELF. ARUNA RETREATS OFFERS CURATED WELLNESS JOURNEYS DESIGNED TO RESTORE YOUR MIND, BODY, AND SPIRIT IN NATURE'S MOST TRANQUIL SANCTUARIES.
        </motion.h2>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white p-8 md:p-12 shadow-2xl font-sans"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-gray-500 hover:text-black transition-colors cursor-pointer"
              >
                <IconX size={24} stroke={1.5} />
              </button>

              <h3 className="text-2xl md:text-3xl font-light uppercase tracking-wide mb-6 text-black">
                Meet Aruna Retreats
              </h3>

              <div className="space-y-4 text-gray-600 leading-relaxed text-sm md:text-base">
                <p>
                  At Aruna Retreats, we believe that true luxury is found in the moments of profound stillness. Our meticulously designed wellness journeys are more than just a getaway; they are a transformative experience carefully orchestrated to bring you back to your center.
                </p>
                <p>
                  We have partnered with leading wellness experts, meditation guides, and yoga practitioners around the globe to curate programs that focus on holistic healing. Whether you are seeking to relieve stress, rediscover your passion, or simply find peace away from the bustling city life, our sanctuaries provide the perfect environment.
                </p>
                <p>
                  Step into our world of tranquility, where every detail—from the organic, locally-sourced meals to the eco-conscious architecture of our centers—is intentionally designed to harmonize with nature and nurture your soul.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
