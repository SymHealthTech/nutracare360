import { Metadata } from "next";
import { JoinUsForm } from "@/components/forms/JoinUsForm";
import { CheckCircle, Users, Globe, Star, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Join NutraCare360 — List Your Practice | Free Listing",
  description: "Create your free practitioner listing on NutraCare360, Canada's premier holistic health directory. No credit card required.",
};

const benefits = [
  { icon: CheckCircle, title: "Free Listing", desc: "No fees to join. Create your comprehensive profile at no cost." },
  { icon: Globe, title: "Be Discovered", desc: "Reach thousands of Canadians actively searching for your expertise." },
  { icon: Star, title: "Build Credibility", desc: "Verified badge, credentials, and reviews build trust with clients." },
  { icon: Shield, title: "Canada-Wide Reach", desc: "One listing reaches clients in your city and province." },
];

export default function JoinUsPage() {
  return (
    <div className="pt-16 min-h-screen bg-[#FAFAF8]">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white text-sm px-4 py-2 rounded-full mb-6">
            <Users className="w-4 h-4" /> Join 500+ Practitioners
          </div>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4">
            List Your Practice on NutraCare360
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Canada&apos;s fastest-growing holistic health directory. Free to join, no credit card required.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="text-center">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <b.icon className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="font-semibold text-sm text-[#1A1A2E] mb-1">{b.title}</h3>
                <p className="text-xs text-[#6B7280]">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
              <h2 className="font-playfair text-xl font-bold text-white">Create Your Free Listing</h2>
              <p className="text-white/80 text-sm mt-1">Admin review within 48 hours</p>
            </div>
            <JoinUsForm />
          </div>
        </div>
      </section>
    </div>
  );
}
