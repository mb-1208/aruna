"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import logo from "../assets/logo-2.webp";
import { IconBrandInstagram, IconBrandFacebook, IconBrandWhatsapp, IconBrandTiktok } from "@tabler/icons-react";

export default function Footer() {
  const pathname = usePathname();

  return (
    <footer className="bg-[#1A1A1A] text-white pt-20 pb-8 px-8 font-sans">
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-16 md:gap-8 mb-16">

        {/* Column 1: Logo & Info */}
        <div className="flex-1">
          <Link href="/" className="inline-block mb-2">
            <Image src={logo} alt="Aruna Logo" className="h-18 w-auto" unoptimized />
          </Link>
          <p className="pl-2 text-gray-400 text-lg leading-relaxed mb-8">
            Aruna brings you to exotic destinations with a personal, refined touch.
          </p>
          <div className="pl-2 flex gap-4 items-center mb-8">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <IconBrandWhatsapp size={20} stroke={1.5} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <IconBrandInstagram size={20} stroke={1.5} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <IconBrandTiktok size={20} stroke={1.5} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <IconBrandFacebook size={20} stroke={1.5} />
            </a>
          </div>
          <p className="pl-2 text-gray-400 text-lg">
            +62 851 2222 3333
          </p>
          <p className="pl-2 text-gray-400 text-lg">
            hello@aruna.com
          </p>
        </div>

        {/* Column 2: The Company */}
        <div className="flex-1">
          <h4 className="text-lg mb-6 tracking-wide">The Company</h4>
          <ul className="space-y-4 text-base text-gray-400">
            {pathname.startsWith("/retreats") ? (
              <>
                <li>
                  {pathname === "/retreats" || (pathname === "/" && "/retreats" === "/") ? (
                    <a href="#destinations" className="hover:text-white transition-colors">Destinations</a>
                  ) : (
                    <Link href="/retreats#destinations" className="hover:text-white transition-colors">Destinations</Link>
                  )}
                </li>
                <li>
                  {pathname === "/retreats" || (pathname === "/" && "/retreats" === "/") ? (
                    <a href="#reviews" className="hover:text-white transition-colors">Reviews</a>
                  ) : (
                    <Link href="/retreats#reviews" className="hover:text-white transition-colors">Reviews</Link>
                  )}
                </li>
                <li>
                  {pathname === "/retreats" || (pathname === "/" && "/retreats" === "/") ? (
                    <a href="#gallery" className="hover:text-white transition-colors">Gallery</a>
                  ) : (
                    <Link href="/retreats#gallery" className="hover:text-white transition-colors">Gallery</Link>
                  )}
                </li>
                <li>
                  {pathname === "/retreats" || (pathname === "/" && "/retreats" === "/") ? (
                    <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
                  ) : (
                    <Link href="/retreats#faq" className="hover:text-white transition-colors">FAQ</Link>
                  )}
                </li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              </>
            ) : (
              <>
                <li>
                  {pathname === "/travel" || pathname === "/" ? (
                    <a href="#services" className="hover:text-white transition-colors">Services</a>
                  ) : (
                    <Link href="/travel#services" className="hover:text-white transition-colors">Services</Link>
                  )}
                </li>
                <li>
                  {pathname === "/travel" || pathname === "/" ? (
                    <a href="#about" className="hover:text-white transition-colors">About</a>
                  ) : (
                    <Link href="/travel#about" className="hover:text-white transition-colors">About</Link>
                  )}
                </li>
                <li>
                  {pathname === "/travel" || pathname === "/" ? (
                    <a href="#reviews" className="hover:text-white transition-colors">Reviews</a>
                  ) : (
                    <Link href="/travel#reviews" className="hover:text-white transition-colors">Reviews</Link>
                  )}
                </li>
                <li>
                  {pathname === "/travel" || pathname === "/" ? (
                    <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
                  ) : (
                    <Link href="/travel#faq" className="hover:text-white transition-colors">FAQ</Link>
                  )}
                </li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contacts</Link></li>
              </>
            )}
          </ul>
        </div>

        {/* Column 3: Stay Connected */}
        <div className="flex-1">
          <h4 className="text-lg mb-6 tracking-wide">Stay Connected</h4>
          <p className="text-base text-gray-400 mb-6">
            Join our newsletter for exclusive travel tips and early access to our curated retreats.
          </p>
          <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Email"
              className="flex-1 bg-transparent border-b border-gray-300 px-0 py-2 text-base text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
            />
            <button type="submit" className="bg-white text-black px-8 py-2 rounded-full text-sm tracking-widest font-medium hover:bg-gray-200 transition-colors max-w-fit cursor-pointer">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="w-full max-w-7xl mx-auto border-t border-gray-500 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-300">
        <p>&copy; {new Date().getFullYear()} Aruna. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/legal" className="hover:text-white transition-colors">Legal</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
