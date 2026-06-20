"use client";

import { useState, useEffect } from "react";
import { IconX } from "@tabler/icons-react";

export default function PromoPopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show popup shortly after page load
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500); 
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 bg-white p-8 w-[90%] max-w-[400px] shadow-2xl flex flex-col font-sans border border-gray-100 animate-in slide-in-from-bottom-10 fade-in duration-500">
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-4 right-4 text-black hover:text-gray-500 transition-colors"
      >
        <IconX size={24} stroke={1.5} />
      </button>
      
      <div className="text-center mt-4 mb-6">
        <h3 className="text-3xl font-light leading-tight mb-4 text-black">
          Get 10% off on your<br />first trip
        </h3>
        <p className="text-base text-gray-800 leading-relaxed px-2">
          Become a part of our community and be the first to get notified about new destinations
        </p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); setIsVisible(false); }}>
        <input 
          type="email" 
          placeholder="E-mail" 
          required
          className="w-full border border-gray-400 p-4 text-base focus:outline-none focus:border-black transition-colors"
        />
        <button 
          type="submit" 
          className="w-full bg-black text-white py-4 text-base hover:bg-gray-800 transition-colors"
        >
          Sign Up Now
        </button>
      </form>
    </div>
  );
}
