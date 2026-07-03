import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Aruna CMS Dashboard",
  description: "Admin Dashboard for Aruna Retreats",
};

export default function DashboardLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} antialiased h-full`}>
      <body className="min-h-full m-0 bg-gray-50 text-black cms-admin-panel">
        {children}
      </body>
    </html>
  );
}
