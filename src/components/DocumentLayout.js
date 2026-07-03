"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function DocumentLayout({ content }) {
  const sections = content.content || [];

  return (
    <main className="min-h-screen bg-white font-sans text-black flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full h-[40vh] md:h-[50vh] flex flex-col items-center justify-center overflow-hidden mb-16">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${content.hero_image || 'http://placehold.co/1920x1080.png'}")` }}
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="text-white text-4xl md:text-5xl lg:text-6xl font-light tracking-widest uppercase drop-shadow-lg"
          >
            {content.title}
          </motion.h1>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 md:px-12 flex-grow mb-16">
        {content.rich_text ? (
          <div
            className="prose prose-lg max-w-none text-gray-600 prose-headings:font-light prose-headings:tracking-wide prose-headings:text-black prose-a:text-black prose-a:underline"
            dangerouslySetInnerHTML={{ __html: content.rich_text }}
          />
        ) : (
          <div className="space-y-12">
            {sections.map((section, index) => (
              <motion.section
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="border-b border-gray-200 pb-12 last:border-0"
              >
                <h2 className="text-2xl font-light tracking-wide mb-6">{section.title}</h2>
                <p className="text-gray-600 leading-relaxed mb-6 text-sm md:text-base">
                  {section.description}
                </p>

                {section.items && section.items.length > 0 && (
                  <ul className="list-disc pl-6 space-y-3">
                    {section.items.map((item, i) => (
                      <li key={i} className="text-gray-600 text-sm md:text-base leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.section>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
