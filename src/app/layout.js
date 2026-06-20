import { Inter, Playfair_Display, Questrial } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const questrial = Questrial({
  weight: "400",
  variable: "--font-questrial",
  subsets: ["latin"],
});

export const metadata = {
  title: "Aruna - Travel & Retreats",
  description: "Aruna Travel and Retreats in Bali",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${questrial.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col m-0">{children}</body>
    </html>
  );
}
