"use client";

import { motion } from "framer-motion";

export default function ServiceProcess({ 
  howItWorks, 
  rightForYou, 
  processTitle: customProcessTitle,
  rightForYouTitle: customRightForYouTitle,
  lang = 'en' 
}) {
  const processTitle = customProcessTitle || (lang === 'es' ? 'Cómo trabajamos contigo' : 'How Does It Work?');
  const rightForYouTitle = customRightForYouTitle || (lang === 'es' ? '¿Este servicio es para ti?' : 'Is This Service Right for You?');

  return (
    <section className="w-full max-w-7xl mx-auto px-8 py-24 md:py-32 font-sans">
      <div className="w-full">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-light font-cormorant uppercase text-brand-dark-brown">
            {processTitle}
          </h2>
        </motion.div>

        {howItWorks && howItWorks.length > 0 && (
          <div className="space-y-12 mb-24">
            {howItWorks.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col md:flex-row gap-6 md:gap-12 items-start"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#D2B799] text-white flex items-center justify-center text-xl font-light font-cormorant">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold tracking-wide uppercase mb-3 text-black">
                    {lang === 'es' ? (step.title_es || step.title) : step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-base md:text-lg whitespace-pre-wrap">
                    {lang === 'es' ? (step.description_es || step.description) : step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {rightForYou && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="border-t border-gray-200 pt-16"
          >
            <h2 className="text-3xl md:text-4xl font-light font-cormorant uppercase text-brand-dark-brown mb-8">
              {rightForYouTitle}
            </h2>
            <p className="text-gray-600 leading-relaxed text-base md:text-lg whitespace-pre-wrap max-w-4xl">
              {rightForYou}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
