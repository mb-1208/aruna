"use client";

import { motion } from "framer-motion";

export default function RetreatPricing() {
  const packages = [
    {
      nights: "5 NIGHTS",
      price: "Rp 10.000.000",
      inclusions: [
        "Roundtrip Airport Transfers",
        "Full Board of Healthy Plant-Based Cuisine",
        "Welcome Wellness Consultation & Goal Setting",
        "Daily Group Morning Yoga",
        "One 60-minute Custom Holistic Massage",
        "One Sound Healing Group Session",
        "Full Access to Wellness Facilities"
      ]
    },
    {
      nights: "7 NIGHTS",
      price: "Rp 15.000.000",
      inclusions: [
        "Roundtrip Airport Transfers",
        "Full Board of Healthy Plant-Based Cuisine",
        "Welcome Wellness Consultation & Goal Setting",
        "Daily Group Morning Yoga",
        "Two 60-minute Custom Holistic Massages",
        "One Sound Healing Group Session",
        "One Private 1-on-1 Meditation Session",
        "Full Access to Wellness Facilities"
      ]
    },
    {
      nights: "10 NIGHTS",
      price: "Rp 20.000.000",
      inclusions: [
        "Roundtrip Airport Transfers",
        "Full Board of Healthy Plant-Based Cuisine",
        "Welcome Wellness Consultation & Goal Setting",
        "Daily Group Morning Yoga",
        "Three 60-minute Custom Holistic Massages",
        "Two Sound Healing Group Sessions",
        "Two Private 1-on-1 Meditation Sessions",
        "One Ayurvedic Wellness Consultation",
        "Full Access to Wellness Facilities"
      ]
    }
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-8 py-16 md:py-24 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-16"
      >
        <span className="text-sm tracking-[0.2em] uppercase text-gray-500 block mb-4">Itinerary & Pricing</span>
        <h2 className="text-3xl md:text-5xl font-light uppercase text-black">
          UNLOCK THE JOURNEY
        </h2>
      </motion.div>

      <div className="flex flex-col gap-16">
        {packages.map((pkg, index) => (
          <motion.div 
            key={index} 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
            className="flex flex-col md:flex-row gap-8 md:gap-16 border-t border-gray-200 pt-8"
          >
            {/* Left Column: Title & Price */}
            <div className="w-full md:flex-1">
              <h3 className="text-2xl font-light uppercase tracking-widest text-black mb-2">
                {pkg.nights}
              </h3>
              <p className="text-lg text-gray-600">
                {pkg.price}
              </p>
            </div>

            {/* Right Column: Inclusions */}
            <div className="w-full md:flex-1">
              <ul className="space-y-3">
                {pkg.inclusions.map((item, i) => (
                  <li key={i} className="flex items-start text-gray-600 text-sm md:text-base">
                    <span className="mr-3 text-gray-400 text-lg leading-tight">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
