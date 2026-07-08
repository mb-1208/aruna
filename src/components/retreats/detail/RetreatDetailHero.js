"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { joinWaitingList } from "@/app/actions/newsletter";

export default function RetreatDetailHero({ title, subtitle, date, bgImage, bookNowText, whatsappNumber, isComingSoon, lang = 'en' }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleWaitingListSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    
    const result = await joinWaitingList(email, title);
    setStatus(result.success ? "success" : "error");
    setMessage(result.message || result.error);
    if (result.success) {
      setTimeout(() => {
        setEmail("");
        setStatus("idle");
        setMessage("");
      }, 5000);
    }
  };

  const waitingListText = lang === 'es' ? "Manténme informado" : "Keep Me Updated";
  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden font-sans">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url("${bgImage || 'http://placehold.co/1920x1080.png'}")` }}
      />
      {/* Dark Overlay for text readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 w-full h-full pt-20">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-light uppercase tracking-widest drop-shadow-lg mb-6 max-w-6xl mx-auto"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="text-white text-lg md:text-xl font-light uppercase tracking-widest max-w-2xl mb-4"
          >
            {subtitle}
          </motion.p>
        )}
        {date && (
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            className="text-white text-lg font-bold tracking-widest uppercase mb-4"
          >
            {date}
          </motion.p>
        )}
        {isComingSoon ? (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center mt-4 w-full max-w-sm mx-auto gap-4"
          >
            <form onSubmit={handleWaitingListSubmit} className="flex flex-col w-full gap-3">
              <input
                type="email"
                placeholder={lang === 'es' ? "Tu correo electrónico" : "Your email address"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-3 rounded-full text-black focus:outline-none bg-white/90 text-sm placeholder-gray-500"
                required
              />
              <button 
                type="submit"
                disabled={status === 'loading'}
                className="bg-white text-black px-12 py-3 rounded-full text-sm font-medium tracking-widest uppercase hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {status === 'loading' ? '...' : waitingListText}
              </button>
            </form>
            {message && (
              <p className={`text-sm ${status === 'success' ? 'text-green-300' : 'text-red-300'}`}>
                {message}
              </p>
            )}
          </motion.div>
        ) : whatsappNumber ? (
          <motion.a 
            href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
            className="bg-white text-black px-12 py-3 rounded-full text-sm font-medium tracking-widest uppercase hover:bg-gray-200 transition-colors inline-block mt-4"
          >
            {bookNowText || "Book Now"}
          </motion.a>
        ) : (
          <motion.button 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
            className="bg-white text-black px-12 py-3 rounded-full text-sm font-medium tracking-widest uppercase hover:bg-gray-200 transition-colors mt-4"
          >
            {bookNowText || "Book Now"}
          </motion.button>
        )}
      </div>
    </section>
  );
}
