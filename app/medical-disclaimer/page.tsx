import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medical Disclaimer | NutraCare360",
  description: "Important medical disclaimer for NutraCare360. NutraCare360 is a directory service only and does not provide medical advice.",
};

export default function MedicalDisclaimerPage() {
  return (
    <div className="pt-16 min-h-screen bg-[#FAFAF8]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="font-playfair text-4xl font-bold text-[#1A1A2E] mb-2">Medical Disclaimer</h1>
        <p className="text-[#6B7280] text-sm mb-8">Last updated: January 2025</p>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 prose max-w-none">
          <p>The information provided on NutraCare360 is for general informational purposes only and does not constitute medical advice, diagnosis, or treatment recommendations.</p>
          <h2>Directory Service Only</h2>
          <p>NutraCare360 is a directory platform that connects users with independent complementary healthcare practitioners. We do not endorse, recommend, or verify the clinical effectiveness of any listed therapists, practitioners, or services.</p>
          <h2>Consult a Professional</h2>
          <p>Before making any healthcare decisions, please consult a qualified medical professional licensed in your province. The information on this website should not be used as a substitute for professional medical advice, diagnosis, or treatment.</p>
          <h2>Emergency Situations</h2>
          <p>In case of emergency, always call 911 or visit your nearest emergency department. Do not use NutraCare360 to seek emergency medical assistance.</p>
          <h2>Practitioner Independence</h2>
          <p>The practitioners listed on this platform operate independently and are solely responsible for their own services, claims, and clinical outcomes. NutraCare360 does not control, supervise, or take responsibility for the services provided by listed practitioners.</p>
          <h2>No Warranties</h2>
          <p>NutraCare360 makes no warranties, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information on this site. Use of this website is at your own risk.</p>
          <h2>Contact</h2>
          <p>If you have questions about this disclaimer, please contact us at <a href="mailto:contact@nutracare360.ca" className="text-primary-500">contact@nutracare360.ca</a>.</p>
        </div>
      </div>
    </div>
  );
}
