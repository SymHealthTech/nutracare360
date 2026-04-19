import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | NutraCare360",
  description: "NutraCare360 Privacy Policy — PIPEDA compliant. Learn how we collect, use, and protect your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-16 min-h-screen bg-[#FAFAF8]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="font-playfair text-4xl font-bold text-[#1A1A2E] mb-2">Privacy Policy</h1>
        <p className="text-[#6B7280] text-sm mb-8">Last updated: January 2025 | PIPEDA Compliant</p>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 prose max-w-none">
          <h2>Information We Collect</h2>
          <p>We collect information you provide directly to us, including when you create a practitioner listing, submit a contact form, or use our services:</p>
          <ul>
            <li>Practitioner profile information (name, contact details, credentials)</li>
            <li>Contact form submissions</li>
            <li>Usage data and analytics (anonymised)</li>
            <li>Cookies for session management</li>
          </ul>
          <h2>How We Use Your Information</h2>
          <p>We use collected information to operate and improve NutraCare360, process practitioner applications, respond to inquiries, and send service-related communications. We do not sell your personal information to third parties.</p>
          <h2>Practitioner vs. User Data</h2>
          <p>Practitioner data submitted via the Join Us form is stored securely and used solely to create directory listings. User browsing data is collected anonymously for analytics purposes.</p>
          <h2>Cookies</h2>
          <p>We use essential cookies for session management and authentication. We use analytics cookies (anonymised) to improve our service. You may disable cookies in your browser settings, though some features may not function properly.</p>
          <h2>Data Retention</h2>
          <p>We retain practitioner listing data for as long as your listing is active. Contact form submissions are retained for 12 months. You may request deletion of your data at any time.</p>
          <h2>Your Rights (PIPEDA)</h2>
          <p>Under Canada&apos;s Personal Information Protection and Electronic Documents Act (PIPEDA), you have the right to access, correct, and request deletion of your personal information. Contact us at <a href="mailto:contact@nutracare360.ca" className="text-primary-500">contact@nutracare360.ca</a> to exercise these rights.</p>
          <h2>Contact</h2>
          <p>For privacy inquiries: <a href="mailto:contact@nutracare360.ca" className="text-primary-500">contact@nutracare360.ca</a></p>
        </div>
      </div>
    </div>
  );
}
