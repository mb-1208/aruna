"use client";

import { motion } from "framer-motion";
import { IconBrandWhatsapp, IconCheck } from "@tabler/icons-react";

export default function RetreatPricing({ title, subtitle, packages, whatsappNumber, retreatTitle, lang = 'en' }) {
  // Use dummy packages as requested to maintain the original look
  const defaultPackages = [
    {
      nights: "5 NIGHTS",
      price: "Rp 10.000.000",
      inclusions: [
        "July: June 27th - July 7th (PRIVATE GROUP)",
        "August: August 1st - 11th (ONLY 4 SPOTS AVAILABLE)",
        "Room: Choose between a private double room with an ensuite bathroom or a shared twin room.",
        "Roundtrip Airport Transfers",
        "Full Board of Healthy Plant-Based Cuisine",
        "Welcome Wellness Consultation & Goal Setting",
        "Daily Group Morning Yoga",
        "One 60-minute Custom Holistic Massage",
        "One Sound Healing Group Session",
        "Full Access to Wellness Facilities"
      ]
    }
  ];

  const displayPackages = (packages && packages.length > 0) ? packages : defaultPackages;

  const handleWhatsAppInquiry = (dateString) => {
    if (!whatsappNumber) return;
    
    const message = lang === 'es' 
      ? `Hola Aruna, estoy interesado en reservar ${retreatTitle ? `el retiro "${retreatTitle}"` : 'un retiro'} para la siguiente fecha:\n\n${dateString}`
      : `Hello Aruna, I am interested in booking the ${retreatTitle ? `"${retreatTitle}" retreat` : 'retreat'} for the following date:\n\n${dateString}`;
      
    const encodedMessage = encodeURIComponent(message);
    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${encodedMessage}`, "_blank");
  };

  const getStatusColor = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('fully booked') || lower.includes('completo')) return 'text-red-500';
    if (lower.includes('private group') || lower.includes('grupo cerrado')) return 'text-gray-400';
    if (lower.includes('only') || lower.includes('sólo') || lower.includes('solo')) return 'text-orange-500';
    return 'text-green-600'; // Default available
  };

  const parseDates = (text) => {
    let status = "";
    let mainText = text;
    
    const parenMatch = text.match(/\((.*?)\)$/);
    if (parenMatch) {
      status = parenMatch[1];
      mainText = text.replace(parenMatch[0], '').trim();
    } else if (text.toLowerCase().includes('completo')) {
      const parts = text.split(':');
      if (parts.length > 2) {
         status = parts.pop().trim();
         mainText = parts.join(':').trim();
      }
    }
    
    return { mainText, status };
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-8 py-16 md:py-24 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-16"
      >
        <span className="text-sm tracking-[0.2em] uppercase text-gray-500 block mb-4">{subtitle || "Itinerary & Pricing"}</span>
        <h2 className="text-3xl md:text-5xl font-light uppercase text-black">
          {title || "UNLOCK THE JOURNEY"}
        </h2>
      </motion.div>

      <div className="flex flex-col gap-24">
        {displayPackages.map((pkg, index) => {
          
          const dates = [...(pkg.dates || [])];
          const roomOptions = [...(pkg.rooms || [])];
          const standardInclusions = [];

          (pkg.inclusions || []).forEach(inc => {
            const lowerInc = inc.toLowerCase();
            
            if (lowerInc.startsWith("room:") || lowerInc.startsWith("habitación:") || lowerInc.startsWith("habitacion:")) {
              roomOptions.push(inc);
              return;
            }

            const hasStatus = inc.includes("(") || lowerInc.includes("completo") || lowerInc.includes("available") || lowerInc.includes("disponible") || lowerInc.includes("plazas");
            const hasColon = inc.includes(":");
            
            if (hasColon && inc.split(":")[0].length < 35 && hasStatus) {
              dates.push(inc);
            } else if (hasColon && inc.split(":")[0].length < 35 && (inc.includes(" - ") || inc.includes(" al ") || lowerInc.includes("del "))) {
              dates.push(inc);
            } else {
              standardInclusions.push(inc);
            }
          });

          return (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
              className="flex flex-col border-t border-gray-200 pt-12"
            >
              {/* Top Row: Package Title / Nights */}
              <div className="mb-12">
                <h3 className="text-3xl font-light uppercase tracking-widest text-black mb-2">
                  {pkg.nights}
                </h3>
                {pkg.price && (
                  <p className="text-xl text-gray-600">
                    {pkg.price}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {/* Left Column: Dates & Rooms */}
                <div className="flex flex-col gap-12">
                  {/* DATES */}
                  {dates.length > 0 && (
                    <div>
                      <h4 className="text-sm font-bold tracking-[0.15em] uppercase text-gray-900 mb-6 pb-2 border-b border-gray-100">
                        {lang === 'es' ? 'Fechas Disponibles' : 'Available Dates'}
                      </h4>
                      <div className="flex flex-col gap-4">
                        {dates.map((dateStr, i) => {
                          const { mainText, status } = parseDates(dateStr);
                          const isFullyBooked = status.toLowerCase().includes('fully booked') || status.toLowerCase().includes('completo') || status.toLowerCase().includes('grupo cerrado') || status.toLowerCase().includes('private group');
                          
                          return (
                            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 group">
                              <div className="flex flex-col gap-0.5 pr-4">
                                <span className="text-gray-800 text-sm leading-tight">{mainText}</span>
                                {status && (
                                  <span className={`text-[10px] font-bold tracking-widest uppercase ${getStatusColor(status)}`}>
                                    {status}
                                  </span>
                                )}
                              </div>
                              
                              {!isFullyBooked && whatsappNumber && (
                                <button
                                  onClick={() => handleWhatsAppInquiry(dateStr)}
                                  className="text-[10px] font-bold uppercase tracking-widest text-black hover:text-green-600 underline underline-offset-4 transition-colors shrink-0"
                                >
                                  {lang === 'es' ? 'Consultar' : 'Inquire'}
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ROOMS */}
                  {roomOptions.length > 0 && (
                    <div>
                      <h4 className="text-sm font-bold tracking-[0.15em] uppercase text-gray-900 mb-6 pb-2 border-b border-gray-100">
                        {lang === 'es' ? 'Opciones de Habitación' : 'Room Options'}
                      </h4>
                      <ul className="space-y-4">
                        {roomOptions.map((room, i) => (
                          <li key={i} className="flex items-start text-gray-600 text-sm md:text-base leading-relaxed bg-white">
                            <span className="mr-3 text-gray-800 mt-0.5"><IconCheck size={18} stroke={1.5} /></span>
                            <span>{room}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Fallback if no dates are parsed */}
                  {dates.length === 0 && (
                    <div>
                       <h4 className="text-sm font-bold tracking-[0.15em] uppercase text-gray-900 mb-6 pb-2 border-b border-gray-100">
                        {lang === 'es' ? 'Fechas' : 'Dates'}
                      </h4>
                      <p className="text-gray-500 italic">
                        {lang === 'es' ? 'Por favor contáctanos para consultar fechas disponibles.' : 'Please contact us for available dates.'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Right Column: General Inclusions */}
                <div>
                  <h4 className="text-sm font-bold tracking-[0.15em] uppercase text-gray-900 mb-6 pb-2 border-b border-gray-100">
                    {lang === 'es' ? 'Qué Incluye' : "What's Included"}
                  </h4>
                  <ul className="space-y-4">
                    {standardInclusions.map((item, i) => (
                      <li key={i} className="flex items-start text-gray-600 text-sm md:text-base leading-relaxed">
                        <span className="mr-3 text-gray-400 mt-1"><IconCheck size={18} stroke={1.5} /></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
