import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Legal Center - Aruna",
  description: "Legal information, policies, and documentation regarding Aruna operations.",
};

export default function LegalPage() {
  return (
    <main className="min-h-screen bg-white font-sans text-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[40vh] md:h-[50vh] w-full flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("http://placehold.co/1920x800.png")' }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/20" />
      </section>

      {/* Content Section */}
      <section className="w-full max-w-4xl mx-auto px-8 py-20 font-sans">
        <h1 className="text-4xl md:text-5xl font-light uppercase mb-12">LEGAL CENTER</h1>

        <div className="space-y-8 text-gray-800 leading-relaxed text-sm md:text-base">
          <p>
            At [Business Name], we believe that trust is the foundation of every great journey. We are committed to operating with complete transparency, ensuring that you feel secure, informed, and ready to enjoy your experience with us.
            <br />
            This page serves as your hub for all legal information, policies, and documentation regarding our operations.
          </p>

          <div>
            <p className="font-medium mb-2">1. Company Identity</p>
            <p className="mb-2">For official correspondence and transparency, here are our business details:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Registered Name: [Legal Entity Name, e.g., PT. XYZ Travel Indonesia]</li>
              <li>Business Address: [Full Office Address in Bali]</li>
              <li>Business Registration (NIB): [Insert Number]</li>
              <li>Contact Email: [legal@yourdomain.com]</li>
            </ul>
          </div>

          <div>
            <p className="font-medium mb-2">2. Important Disclaimers</p>
            <p className="mb-2">By participating in our retreats, you acknowledge the following:</p>
            <ul className="list-disc pl-5 space-y-4">
              <li>
                <strong>Travel Risks & Insurance</strong><br/>
                While we prioritize safety, travel in Indonesia involves inherent risks. We strictly require all participants to hold comprehensive travel insurance that includes emergency medical evacuation and trip cancellation. [Business Name] is not liable for costs incurred due to medical emergencies or unforeseen travel disruptions.
              </li>
              <li>
                <strong>Physical & Mental Wellbeing</strong><br/>
                Our retreats may include physical activities (e.g., yoga, trekking, surfing). You are responsible for ensuring that your physical and mental health are suitable for the chosen activities. Please disclose all relevant medical history to us prior to arrival.
              </li>
              <li>
                <strong>Force Majeure</strong><br/>
                We cannot be held liable for failure to perform our obligations due to events beyond our reasonable control, including, but not limited to: natural disasters, volcanic activity, political instability, pandemics, or government-mandated travel restrictions.
              </li>
            </ul>
          </div>

          <div>
            <p className="font-medium mb-2">3. Intellectual Property</p>
            <p>
              All content found on this website—including photography, branding, retreat itineraries, and written copy—is the exclusive property of [Business Name] and is protected by international copyright laws. Unauthorized reproduction or use is strictly prohibited.
            </p>
          </div>

          <div>
            <p className="font-medium mb-2">4. Get in Touch</p>
            <p className="mb-2">
              If you have any questions regarding these documents, or if you need clarification on a specific policy, please reach out to us. We are happy to help.
            </p>
            <p className="mb-4">
              Legal Inquiries: legal@yourdomain.com Response Time: We aim to respond to all formal inquiries within [e.g., 48 hours].
            </p>
            <p className="mb-2">Tips for your "Legal" Page:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Keep it accessible: Ensure all the bullet points in Section 2 are clickable links that open the full PDF or text version of the document.</li>
              <li>User Experience: Even though it is a legal page, keep the design clean and consistent with your brand colors to maintain the "retreat" vibe.</li>
              <li>Professional Review: While this provides a strong structure, I highly recommend having a lawyer or legal consultant in Indonesia review your final Terms & Conditions and Privacy Policy to ensure they fully cover your specific liability risks.</li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
