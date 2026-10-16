import { Inter, Questrial } from "next/font/google";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const questrial = Questrial({
  weight: "400",
  variable: "--font-questrial",
  subsets: ["latin"],
});

export const metadata = {
  title: "Aruna Studio CMS",
  description: "Admin Studio for Aruna Retreats & Travel",
};

export default function DashboardLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${questrial.variable} antialiased h-full`}>
      <body className="min-h-full m-0 bg-[#faf6f0] text-[#1c1917] cms-admin-panel">
        {children}
      </body>
    </html>
  );
}
