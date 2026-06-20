"use client";

import { useState } from "react";
import { IconChevronDown } from "@tabler/icons-react";
import { motion } from "framer-motion";

const defaultFaqs = [
  {
    question: "How do I book a travel package?",
    answer: "Simply browse our curated offerings and use the 'Contact' form to connect with our travel specialists for a personalized consultation."
  },
  {
    question: "Can I customize my travel itinerary?",
    answer: "Yes, all of our travel packages can be tailored to suit your specific preferences, schedule, and interests."
  },
  {
    question: "What is your cancellation and refund policy?",
    answer: "Our cancellation policy varies depending on the destination and package. Please review the specific terms during booking."
  },
  {
    question: "What level of service can I expect?",
    answer: "We pride ourselves on providing exceptional, personalized service at every step of your journey, ensuring a seamless experience."
  },
  {
    question: "What is the best time of year to book a retreat?",
    answer: "The ideal time depends on the destination. Our specialists can guide you based on weather, local events, and peak seasons."
  }
];

export default function FAQ({ data, title, subtitle }) {
  const [openIndex, setOpenIndex] = useState(0);

  const faqsToRender = data || defaultFaqs;

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section id="faq" className="w-full max-w-7xl mx-auto px-8 py-24 md:py-32 flex flex-col gap-4 font-sans">
      {/* Top Column */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full text-left"
      >
        <span className="text-sm tracking-[0.2em] uppercase text-gray-500 block mb-4">
          {subtitle || "Frequently Asked Questions"}
        </span>
        <h2 className="text-4xl md:text-5xl font-light uppercase">
          {title || "What You Need To Know"}
        </h2>
      </motion.div>

      {/* Bottom Column (Accordion) */}
      <div className="w-full flex flex-col mt-4">
        {faqsToRender.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
              className="border-b border-gray-200"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center py-6 text-left focus:outline-none group cursor-pointer"
              >
                <span className="text-lg font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
                  {faq.question}
                </span>
                <IconChevronDown
                  size={20}
                  className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'
                  }`}
              >
                <p className="text-gray-600 leading-relaxed max-w-2xl text-base">
                  {faq.answer}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
