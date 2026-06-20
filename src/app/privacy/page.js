import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy - Aruna",
  description: "Privacy Policy for Aruna",
};

export default function PrivacyPage() {
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
        <h1 className="text-4xl md:text-5xl font-light uppercase mb-12">PRIVACY POLICY</h1>

        <div className="space-y-8 text-gray-800 leading-relaxed text-sm md:text-base">
          <p>
            At [Business Name], we are dedicated to creating transformative experiences in Bali. We understand that trust is the foundation of travel. This Privacy Policy outlines how we collect, use, and protect your personal information when you book a retreat, visit our website, or interact with us.
          </p>

          <div>
            <p className="font-medium mb-2">1. What Information We Collect</p>
            <p className="mb-2">To provide you with a seamless retreat experience, we collect only the information that is necessary. This includes:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Identity Information: Full name, passport details (for local tourism requirements), date of birth, and nationality.</li>
              <li>Contact Information: Email address, phone number, and emergency contact details.</li>
              <li>Travel Preferences: Dietary restrictions, allergies, physical fitness levels, and accommodation preferences.</li>
              <li>Technical Data: Information about your device and how you interact with our website (via cookies).</li>
            </ul>
          </div>

          <div>
            <p className="font-medium mb-2">2. How We Use Your Data</p>
            <p className="mb-2">We do not use your data for anything other than fulfilling our commitment to you. Your data is used to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Process your booking and facilitate payment.</li>
              <li>Coordinate with our vendors (hotels, transportation, instructors) to ensure your accommodation and activities are prepared.</li>
              <li>Send you important pre-arrival information, retreat updates, and newsletters (only if you have opted in).</li>
              <li>Comply with Indonesian legal and immigration requirements.</li>
            </ul>
          </div>

          <div>
            <p className="font-medium mb-2">3. Sharing and Disclosure</p>
            <p className="mb-2">
              We respect your privacy and do not sell your personal data. However, we may share information with trusted third-party partners strictly to fulfill your booking. These partners include:
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>Service Providers: Local hotels, transport operators, and excursion guides who require your details to provide the service.</li>
              <li>Payment Gateways: To process your transactions securely.</li>
              <li>Legal Requirements: If required by law or government authorities in Indonesia.</li>
            </ul>
            <p>We ensure that these partners are bound by confidentiality agreements and are prohibited from using your data for their own marketing purposes.</p>
          </div>

          <div>
            <p className="font-medium mb-2">4. Data Security</p>
            <p className="mb-2">We implement robust security measures to protect your data from unauthorized access, alteration, or destruction.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>We use SSL encryption on our website.</li>
              <li>We restrict access to your data to only those employees or partners who need it to provide your services.</li>
              <li>We retain your data only for as long as necessary to fulfill the purposes outlined in this policy or as required by law.</li>
            </ul>
          </div>

          <div>
            <p className="font-medium mb-2">5. Your Rights</p>
            <p className="mb-2">In accordance with applicable data protection laws, you have the right to:</p>
            <ul className="list-disc pl-5 space-y-1 mb-2">
              <li>Access: Request a copy of the personal data we hold about you.</li>
              <li>Correction: Ask us to correct any inaccurate information.</li>
              <li>Erasure: Request that we delete your data (subject to our legal obligations to keep certain records).</li>
              <li>Opt-out: Unsubscribe from our marketing communications at any time.</li>
            </ul>
            <p>To exercise these rights, please contact us at [Email Address].</p>
          </div>

          <div>
            <p className="font-medium mb-2">6. Cookies Policy</p>
            <p>
              Our website uses cookies to improve your user experience, analyze traffic, and personalize content. You can manage your cookie preferences through your browser settings.
            </p>
          </div>

          <div>
            <p className="font-medium mb-2">7. Changes to This Policy</p>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of significant changes via email or a notice on our website.
            </p>
          </div>

          <div>
            <p className="font-medium mb-2">8. Contact Us</p>
            <p className="mb-2">If you have questions, concerns, or complaints regarding this Privacy Policy or how your data is handled, please reach out to our privacy team:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Email: [legal@yourdomain.com]</li>
              <li>Address: [Full Business Address in Bali]</li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
