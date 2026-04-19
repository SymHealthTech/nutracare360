import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | NutraCare360",
  description: "NutraCare360 Terms of Service. Governing law: Ontario, Canada.",
};

export default function TermsOfServicePage() {
  return (
    <div className="pt-20 min-h-screen bg-[#FAFAF8]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="font-playfair text-4xl font-bold text-[#1A1A2E] mb-2">Terms of Service</h1>
        <p className="text-[#6B7280] text-sm mb-8">Last updated: January 2025 | Governing Law: Ontario, Canada</p>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 prose max-w-none">
          <h2>Acceptance of Terms</h2>
          <p>By accessing or using NutraCare360, you agree to be bound by these Terms of Service. If you do not agree, do not use this platform.</p>
          <h2>No Medical Advice</h2>
          <p>NutraCare360 is a directory service only. Nothing on this platform constitutes medical advice, diagnosis, or treatment. Always seek qualified professional advice for health concerns.</p>
          <h2>Practitioner Responsibility</h2>
          <p>Practitioners listed on NutraCare360 are independent service providers and are solely responsible for their own services, claims, credentials, and conduct. NutraCare360 does not employ, supervise, or endorse any listed practitioner.</p>
          <h2>Listing Accuracy</h2>
          <p>Practitioners are responsible for ensuring their listing information is accurate, current, and not misleading. Listings may be removed if found to contain false or misleading information.</p>
          <h2>No Liability</h2>
          <p>NutraCare360 is not liable for any outcomes, damages, or losses arising from use of this platform or engagement with any listed practitioner. To the maximum extent permitted by Ontario law, our liability is limited to the amount paid for any services.</p>
          <h2>Takedown Process</h2>
          <p>To request removal of a listing, contact us at <a href="mailto:contact@nutracare360.ca" className="text-primary-500">contact@nutracare360.ca</a>. We will review and respond within 5 business days.</p>
          <h2>Governing Law</h2>
          <p>These Terms are governed by the laws of the Province of Ontario and the federal laws of Canada applicable therein. Any disputes will be resolved in the courts of Ontario.</p>
          <h2>Changes to Terms</h2>
          <p>We reserve the right to update these Terms at any time. Continued use of the platform constitutes acceptance of updated Terms.</p>
        </div>
      </div>
    </div>
  );
}
