"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconBrandWhatsapp, IconCheck, IconChevronRight, IconX } from "@tabler/icons-react";
import { submitInquiry } from "@/app/actions/newsletter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel } from 'swiper/modules';
import 'swiper/css';

export default function RetreatPricing({ title, subtitle, packages, englishPackages, whatsappNumber, retreatTitle, englishTitle, lang = 'en' }) {
  const displayPackages = (packages && packages.length > 0) ? packages : [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inquiryDate, setInquiryDate] = useState("");
  const [inquiryDateEn, setInquiryDateEn] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const { globalContent } = useLanguage();
  const inquiryContent = globalContent?.inquiry_modal?.[lang] || {};

  const modalTitle = inquiryContent.title || (lang === 'es' ? 'Consultar Disponibilidad' : 'Inquire Availability');
  const modalDesc = inquiryContent.description || (lang === 'es' ? 'Déjanos tus datos y nos pondremos en contacto contigo lo antes posible.' : 'Leave your details and we will get back to you as soon as possible.');
  const labelName = inquiryContent.label_name || (lang === 'es' ? 'Nombre' : 'Name');
  const labelEmail = inquiryContent.label_email || (lang === 'es' ? 'Correo Electrónico' : 'Email');
  const labelPhone = inquiryContent.label_phone || (lang === 'es' ? 'Teléfono' : 'Phone');
  const btnSubmit = inquiryContent.btn_submit || (lang === 'es' ? 'Enviar Consulta' : 'Submit Inquiry');
  const btnWhatsapp = inquiryContent.btn_whatsapp || (lang === 'es' ? 'Consultar por WhatsApp' : 'Inquire via WhatsApp');

  const handleOpenModal = (dateString, enDateString) => {
    setInquiryDate(dateString);
    setInquiryDateEn(enDateString);
    setIsModalOpen(true);
    setSubmitStatus("idle");
    setSubmitMessage("");
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus("loading");
    
    const result = await submitInquiry({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      retreatTitle: englishTitle || retreatTitle || "Unknown",
      dateStr: inquiryDateEn || inquiryDate
    });
    
    setSubmitStatus(result.success ? "success" : "error");
    setSubmitMessage(result.message || result.error);
    
    if (result.success) {
      const isEs = lang === 'es';
      const title = retreatTitle || englishTitle || "Retreat";
      const chosenDate = inquiryDate || inquiryDateEn || "-";
      
      const subject = isEs 
        ? `[Consulta] ${title} - ${formData.name}` 
        : `[Inquiry] ${title} - ${formData.name}`;
      
      const body = isEs
        ? `Hola equipo de Aruna,\n\nMe gustaría consultar disponibilidad con los siguientes detalles:\n\n• Nombre: ${formData.name}\n• Correo electrónico: ${formData.email}\n• Teléfono / WhatsApp: ${formData.phone}\n• Retiro: ${title}\n• Fechas: ${chosenDate}\n\n¡Muchas gracias!`
        : `Hello Aruna Team,\n\nI would like to inquire about availability with the following details:\n\n• Name: ${formData.name}\n• Email: ${formData.email}\n• Phone / WhatsApp: ${formData.phone}\n• Retreat: ${title}\n• Dates: ${chosenDate}\n\nThank you!`;
      
      const mailtoLink = `mailto:hello@arunatravelstudio.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoLink;

      setTimeout(() => {
        setIsModalOpen(false);
        setFormData({ name: "", email: "", phone: "" });
      }, 3000);
    }
  };


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
    if (lower.includes('fully booked') || lower.includes('completo')) 
      return 'bg-red-50 text-red-600';
    if (lower.includes('private group') || lower.includes('grupo cerrado')) 
      return 'bg-gray-100 text-gray-600';
    if (lower.includes('only') || lower.includes('sólo') || lower.includes('solo')) 
      return 'bg-orange-50 text-orange-600';
    
    // Default available
    return 'bg-green-50 text-green-700'; 
  };

  const getOrdinal = (n) => {
    const s = ["th", "st", "nd", "rd"], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const formatDateRange = (startStr, endStr, lang) => {
    if (!startStr || !endStr) return null;
    
    // Ensure we parse the date string correctly as local time, not UTC (since it's "YYYY-MM-DD")
    // By splitting and passing to constructor, we avoid time zone shifting
    const [sYear, sMonth, sDay] = startStr.split('-');
    const [eYear, eMonth, eDay] = endStr.split('-');
    const start = new Date(sYear, sMonth - 1, sDay);
    const end = new Date(eYear, eMonth - 1, eDay);
    
    const startMonthEn = start.toLocaleString('en-US', { month: 'long' });
    const startMonthEs = start.toLocaleString('es-ES', { month: 'long' }).toLowerCase();
    
    const endMonthEn = end.toLocaleString('en-US', { month: 'long' });
    const endMonthEs = end.toLocaleString('es-ES', { month: 'long' }).toLowerCase();
    
    const startDayNum = start.getDate();
    const endDayNum = end.getDate();

    if (lang === 'es') {
       if (start.getMonth() === end.getMonth()) {
          return `Del ${startDayNum} al ${endDayNum} de ${startMonthEs}`;
       } else {
          return `Del ${startDayNum} de ${startMonthEs} al ${endDayNum} de ${endMonthEs}`;
       }
    } else {
       const startDayStr = getOrdinal(startDayNum);
       const endDayStr = getOrdinal(endDayNum);
       if (start.getMonth() === end.getMonth()) {
          return `${startMonthEn} ${startDayStr} - ${endDayStr}`;
       } else {
          return `${startMonthEn} ${startDayStr} - ${endMonthEn} ${endDayStr}`;
       }
    }
  };

  const parseDates = (item, lang) => {
    if (typeof item === 'object' && item !== null) {
      const titleStr = item.title ? item.title.trim() : '';
      const rangeStr = formatDateRange(item.startDate, item.endDate, lang);
      
      // If we don't have a valid range string (missing dates), we gracefully skip rendering the range, or return null
      if (!titleStr && !rangeStr) return null;
      
      const mainText = titleStr && rangeStr ? `${titleStr}: ${rangeStr}` : (titleStr || rangeStr || 'TBA');
      return { mainText, status: item.status || '', isValid: true };
    }
    
    return null; // Strict: No legacy dummy texts allowed
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
        <h2 className="text-5xl md:text-6xl font-light font-cormorant uppercase text-brand-dark-brown">
          {title || "UNLOCK THE JOURNEY"}
        </h2>
      </motion.div>

      <div className="flex flex-col gap-24">
        {displayPackages.length === 0 ? (
          <div className="text-center py-24 bg-[#F8F6F3] rounded-2xl border border-[#EBE5DB]">
            <h3 className="text-lg font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">
              {lang === 'es' ? 'Paquetes Disponibles Pronto' : 'Packages Available Soon'}
            </h3>
            <p className="text-gray-400">
              {lang === 'es' ? 'Actualmente estamos actualizando nuestros paquetes de retiro.' : 'We are currently updating our retreat packages.'}
            </p>
          </div>
        ) : (
          displayPackages.map((pkg, index) => {
            const dates = [...(pkg.dates || [])];
            const roomOptions = [...(pkg.rooms || [])];
            const standardInclusions = [];

            (pkg.inclusions || []).forEach(inc => {
              if (typeof inc === 'object') {
                standardInclusions.push(inc);
                return;
              }

              const lowerInc = typeof inc === 'string' ? inc.toLowerCase() : '';
              
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
                <div className="mb-12">
                  <h3 className="text-4xl font-light font-cormorant uppercase tracking-widest text-brand-dark-brown mb-2">
                    {pkg.nights}
                  </h3>
                  {pkg.price && (
                    <p className="text-xl text-gray-600">
                      {pkg.price}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div className="flex flex-col gap-12">
                    {dates.length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold tracking-[0.15em] uppercase text-gray-900 mb-6 pb-2 border-b border-gray-100">
                          {lang === 'es' ? 'Fechas Disponibles' : 'Available Dates'}
                        </h4>
                        <div className="flex flex-col gap-4">
                          <Swiper
                            modules={[Mousewheel]}
                            spaceBetween={16}
                            slidesPerView={1.2}
                            grabCursor={true}
                            mousewheel={{ forceToAxis: true }}
                            initialSlide={(() => {
                              const today = new Date();
                              const currentYear = today.getFullYear();
                              const currentMonth = today.getMonth();
                              const idx = dates.findIndex(d => {
                                if (!d.endDate) return false;
                                const [y, m, day] = d.endDate.split('-');
                                const eYear = parseInt(y, 10);
                                const eMonth = parseInt(m, 10) - 1;
                                
                                // Return true if the end date is in the current month or future months
                                return eYear > currentYear || (eYear === currentYear && eMonth >= currentMonth);
                              });
                              return idx !== -1 ? idx : 0;
                            })()}
                            breakpoints={{
                              640: { slidesPerView: 2.2 },
                              768: { slidesPerView: 1.5 },
                              1024: { slidesPerView: 2.2 }
                            }}
                            className="w-full !pb-8"
                          >
                            {dates.map((dateItem, i) => {
                              const parsed = parseDates(dateItem, lang);
                              const enDateItem = englishPackages && englishPackages[index] && englishPackages[index].dates && englishPackages[index].dates[i] ? englishPackages[index].dates[i] : dateItem;
                              const parsedEn = parseDates(enDateItem, 'en');
                              if (!parsed || !parsed.isValid) return null;
                              
                              const { mainText, status } = parsed;
                              const isFullyBooked = status.toLowerCase().includes('fully booked') || status.toLowerCase().includes('completo') || status.toLowerCase().includes('grupo cerrado') || status.toLowerCase().includes('private group');
                              
                              const dateStrForWa = mainText;
                              const dateStrEnglish = parsedEn?.mainText || mainText;
                              
                              return (
                                <SwiperSlide key={i} style={{ height: 'auto' }}>
                                  <div className="group flex flex-col h-full justify-between p-7 bg-white rounded-2xl border border-[#EBE5DB] shadow-[0_4px_24px_rgb(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)] hover:border-[#DFD5C5] transition-all duration-300 relative overflow-hidden">
                                    <div className="flex flex-col gap-4 mb-8">
                                      <div className="flex justify-start">
                                        {status ? (
                                          <span className={`text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-md leading-tight inline-block max-w-full ${getStatusColor(status)}`}>
                                            {status}
                                          </span>
                                        ) : (
                                          <span className={`text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-md leading-tight inline-block max-w-full ${getStatusColor('available')}`}>
                                            {lang === 'es' ? 'DISPONIBLE' : 'AVAILABLE'}
                                          </span>
                                        )}
                                      </div>
                                      <span className="text-gray-900 text-base leading-relaxed font-semibold">{mainText}</span>
                                    </div>
                                    
                                    {!isFullyBooked ? (
                                      whatsappNumber && (
                                        <button
                                          onClick={() => handleOpenModal(dateStrForWa, dateStrEnglish)}
                                          className="flex items-center justify-between w-full py-4 px-5 bg-black text-white text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-gray-800 hover:shadow-lg transition-all duration-300 mt-auto transform group-hover:-translate-y-1"
                                        >
                                          <div className="flex items-center gap-2">
                                            <span>{lang === 'es' ? 'Más Información' : 'More Information'}</span>
                                          </div>
                                          <IconChevronRight size={18} className="text-white group-hover:translate-x-1 transition-all" />
                                        </button>
                                      )
                                    ) : (
                                      <div className="flex items-center justify-center w-full py-4 px-5 bg-gray-50 text-gray-400 text-xs font-bold tracking-widest uppercase rounded-xl mt-auto">
                                        {lang === 'es' ? 'Agotado' : 'Sold Out'}
                                      </div>
                                    )}
                                  </div>
                                </SwiperSlide>
                              );
                            })}
                          </Swiper>
                        </div>
                      </div>
                    )}

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
                  </div>

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
          })
        )}
      </div>
    
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg rounded-xl overflow-y-auto shadow-2xl relative max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors"
              >
                <IconX size={24} stroke={1.5} />
              </button>
              
              <div className="p-6 md:p-10">
                <h3 className="text-2xl font-light font-cormorant uppercase text-brand-dark-brown mb-2">
                  {modalTitle}
                </h3>
                <p className="text-gray-500 text-sm mb-8">
                  {modalDesc}
                </p>

                <form onSubmit={handleModalSubmit} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold tracking-widest uppercase text-gray-700">
                      {labelName}
                    </label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-dark-brown focus:ring-1 focus:ring-brand-dark-brown bg-gray-50 focus:bg-white transition-all text-sm"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold tracking-widest uppercase text-gray-700">
                      {labelEmail}
                    </label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-dark-brown focus:ring-1 focus:ring-brand-dark-brown bg-gray-50 focus:bg-white transition-all text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold tracking-widest uppercase text-gray-700">
                      {labelPhone}
                    </label>
                    <input 
                      type="tel" 
                      required
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-dark-brown focus:ring-1 focus:ring-brand-dark-brown bg-gray-50 focus:bg-white transition-all text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-4 mt-2">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold tracking-widest uppercase text-gray-700">Retreat</label>
                      <div className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-100 text-gray-500 text-xs truncate">
                        {retreatTitle || '-'}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold tracking-widest uppercase text-gray-700">Date</label>
                      <div className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-100 text-gray-500 text-xs truncate">
                        {inquiryDate || '-'}
                      </div>
                    </div>
                  </div>

                  {submitMessage && (
                    <div className={`mt-2 p-4 rounded-xl text-sm font-medium ${submitStatus === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                      {submitMessage}
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={submitStatus === 'loading'}
                    className="w-full py-4 mt-4 bg-brand-dark-brown text-white text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-[#b07023] transition-colors disabled:opacity-50"
                  >
                    {submitStatus === 'loading' ? '...' : btnSubmit}
                  </button>
                </form>

                {whatsappNumber && (
                  <div className="mt-8 flex flex-col items-center">
                    <div className="flex items-center w-full gap-4 mb-6">
                      <div className="h-px bg-gray-200 flex-1" />
                      <span className="text-xs font-bold tracking-widest uppercase text-gray-400">
                        {lang === 'es' ? 'O' : 'OR'}
                      </span>
                      <div className="h-px bg-gray-200 flex-1" />
                    </div>
                    
                    <button
                      onClick={() => handleWhatsAppInquiry(inquiryDate)}
                      className="flex items-center justify-center w-full py-4 px-5 bg-black text-white text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-gray-800 hover:shadow-lg transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-2">
                        <IconBrandWhatsapp size={18} />
                        <span>{btnWhatsapp}</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
