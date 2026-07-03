"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function ServicesGallery({ data, fallbackData, currentLang }) {
  // If data from DB is empty, use the fallback data from site_content (which is old structure)
  const servicesSource = data && data.length > 0 ? data : fallbackData;
  const lang = currentLang || 'en';

  const services = (servicesSource || []).map((srv, index) => {
    // If it's a database product (has slug, type='service', content JSON)
    if (srv.slug) {
      const content = srv.content || {};
      const title = lang === 'es' ? (content.title_es || srv.title) : srv.title;
      // You can add subtitle logic if it exists in DB, or fallback to Explore
      return {
        id: srv.id || index,
        title: title || "Service",
        subtitle: lang === 'es' ? "Hablemos de tu viaje" : "Let's Plan Your Journey",
        image: content.cover_image || content.hero_image || "http://placehold.co/600x800.png",
        link: `/${lang}/services/${srv.slug}`,
      };
    }
    
    // Fallback for old JSON data structure from site_content
    return {
      id: srv.id || index,
      title: srv.title || "Service",
      subtitle: srv.subtitle || (lang === 'es' ? "Hablemos de tu viaje" : "Let's Plan Your Journey"),
      image: srv.image || "http://placehold.co/600x800.png",
      link: srv.link || "#",
    };
  });

  return (
    <section id="services" className="w-full flex flex-col md:flex-row">
      {services.map((service, index) => (
        <motion.div 
          key={service.id || `service-${index}`} 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
          className="relative w-full md:w-1/3 aspect-[3/4] md:aspect-auto md:h-[800px] overflow-hidden group"
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-105"
            style={{ backgroundImage: `url(${service.image})` }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-black/40" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-white p-6">
            <h3 className="text-3xl md:text-4xl font-light tracking-widest mb-6">{service.title}</h3>
            <Link href={service.link} className="flex items-center justify-center border border-white/80 rounded-full px-10 py-2.5 text-white text-sm tracking-widest transition-all duration-300 hover:bg-white hover:text-black hover:scale-105 uppercase">
              {service.subtitle}
            </Link>
          </div>
        </motion.div>
      ))}
    </section>
  );
}
