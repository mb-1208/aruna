"use client";

import { motion } from "framer-motion";

export default function RetreatCTA() {
  return (
    <section className="relative w-full h-auto min-h-[500px] flex items-center overflow-hidden font-sans">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url("http://placehold.co/1920x800.png")' }}
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 py-16 flex flex-col md:flex-row justify-between items-center gap-12">

        {/* Left Side: Headline */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 text-center md:text-left"
        >
          <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-light uppercase tracking-wide drop-shadow-md">
            DON'T WANNA MISS<br className="hidden md:block" />A THING?
          </h2>
        </motion.div>

        {/* Right Side: Subscription Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="w-full max-w-md bg-white p-8 md:p-12 shadow-2xl"
        >
          <h3 className="text-2xl font-light uppercase text-center mb-4 tracking-widest text-black">
            GET IN TOUCH
          </h3>
          <p className="text-center text-sm text-gray-600 mb-8 leading-relaxed">
            Add this email form so that they will be the first to know your details & early booking.
          </p>

          <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-2">
              <label htmlFor="cta-email" className="text-xs uppercase tracking-widest text-gray-500">
                Email
              </label>
              <input
                type="email"
                id="cta-email"
                required
                className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors bg-transparent text-black"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-4 text-sm tracking-widest uppercase hover:bg-gray-800 transition-colors mt-2"
            >
              Subscribe
            </button>
          </form>
        </motion.div>

      </div>
    </section>
  );
}
