"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function ImageDivider() {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="w-full relative h-[600px] overflow-hidden"
    >
      <Image
        src="http://placehold.co/1920x600.png"
        alt="Travel Destination Divider"
        fill
        className="object-cover"
        unoptimized
      />
    </motion.section>
  );
}
