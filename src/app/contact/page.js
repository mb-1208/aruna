"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const subject = formData.get("subject");
    const comment = formData.get("comment");

    const bodyText = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\n${comment}`;
    const mailtoLink = `mailto:hello@aruna.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
    
    window.location.href = mailtoLink;
  };

  return (
    <main className="min-h-screen bg-white font-sans text-black flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[40vh] md:h-[50vh] w-full flex items-center justify-center overflow-hidden flex-shrink-0">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("http://placehold.co/1920x800.png")' }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/20" />
      </section>

      {/* Content Section */}
      <section className="w-full max-w-4xl mx-auto px-8 py-20 font-sans flex-1">
        <h1 className="text-4xl md:text-5xl font-light uppercase mb-12">GET IN TOUCH</h1>

        <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-3xl">
          {/* Name */}
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm text-gray-800">Name</label>
            <input 
              type="text" 
              id="name" 
              name="name"
              required
              className="w-full border border-gray-300 p-3 focus:outline-none focus:border-black transition-colors"
            />
          </div>

          {/* Email and Phone */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="email" className="text-sm text-gray-800">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email"
                required
                className="w-full border border-gray-300 p-3 focus:outline-none focus:border-black transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="phone" className="text-sm text-gray-800">Phone</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone"
                required
                className="w-full border border-gray-300 p-3 focus:outline-none focus:border-black transition-colors"
              />
            </div>
          </div>

          {/* Subject */}
          <div className="flex flex-col gap-2">
            <label htmlFor="subject" className="text-sm text-gray-800">Subject</label>
            <input 
              type="text" 
              id="subject" 
              name="subject"
              required
              className="w-full border border-gray-300 p-3 focus:outline-none focus:border-black transition-colors"
            />
          </div>

          {/* Comment */}
          <div className="flex flex-col gap-2">
            <label htmlFor="comment" className="text-sm text-gray-800">Comment</label>
            <textarea 
              id="comment" 
              name="comment"
              rows="6"
              required
              className="w-full border border-gray-300 p-3 focus:outline-none focus:border-black transition-colors resize-y"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button 
              type="submit" 
              className="bg-black text-white px-10 py-3 text-sm tracking-wide hover:bg-gray-800 transition-colors"
            >
              Send Message
            </button>
          </div>
        </form>
      </section>

      <Footer />
    </main>
  );
}
