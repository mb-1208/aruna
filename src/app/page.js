"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import logo from "../assets/logo.webp";

export default function Home() {
  return (
    <div className="relative h-screen w-full flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Logo */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        className="absolute top-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
      >
        <Image src={logo} alt="Aruna Logo" className="h-24 w-auto drop-shadow-md" priority />
      </motion.div>

      {/* Left Panel: Travel */}
      <Link href="/travel" className="group relative flex-1 h-full block overflow-hidden cursor-pointer">
        <div className="absolute inset-0 w-full h-full">
          {/* Background Image */}
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-105"
            style={{ backgroundImage: 'url("http://placehold.co/1080x1080.png")' }}
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-black/10" />

          {/* Content */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
            className="absolute inset-0 flex flex-col items-center justify-center z-10 p-6 text-center"
          >
            <h2 className="text-white text-4xl md:text-6xl lg:text-7xl font-light mb-2 transition-transform duration-500 ease-out group-hover:-translate-y-2 drop-shadow-lg uppercase">
              Travel
            </h2>
            <div className="flex items-center justify-center border border-white/80 rounded-full px-16 py-2.5 text-white text-sm tracking-widest transition-all duration-300 group-hover:bg-white group-hover:text-black hover:scale-105 uppercase">
              View
            </div>
          </motion.div>
        </div>
      </Link>

      {/* Right Panel: Retreats */}
      <Link href="/retreats" className="group relative flex-1 h-full block overflow-hidden cursor-pointer">
        <div className="absolute inset-0 w-full h-full">
          {/* Background Image */}
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-105"
            style={{ backgroundImage: 'url("http://placehold.co/1080x1080/444444/FFFFFF.png")' }}
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/30 transition-colors duration-500 group-hover:bg-black/20" />

          {/* Content */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
            className="absolute inset-0 flex flex-col items-center justify-center z-10 p-6 text-center"
          >
            <h2 className="text-white text-4xl md:text-6xl lg:text-7xl font-light mb-2 transition-transform duration-500 ease-out group-hover:-translate-y-2 drop-shadow-lg uppercase">
              Retreats
            </h2>
            <div className="flex items-center justify-center border border-white/80 rounded-full px-16 py-2.5 text-white text-sm tracking-widest transition-all duration-300 group-hover:bg-white group-hover:text-black hover:scale-105 uppercase">
              View
            </div>
          </motion.div>
        </div>
      </Link>
    </div>
  );
}
