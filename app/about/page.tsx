import Link from "next/link";
import { Leaf, Users, Globe, Shield } from "lucide-react";
import TeamCard from "@/components/about/TeamCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About NutraCare360 | Canada's Holistic Health Directory",
  description: "Learn about NutraCare360 — Canada's premier directory for complementary and alternative medicine professionals.",
};

export default function AboutPage() {
  return (
    <div className="pt-16 min-h-screen bg-[#FAFAF8]">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4">
            About NutraCare360
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
            Canada&apos;s premier online directory connecting Canadians with certified complementary and alternative medicine professionals.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-playfair text-3xl font-bold text-[#1A1A2E] mb-6 text-center">Our Mission</h2>
          <p className="text-[#374151] text-lg leading-relaxed text-center max-w-3xl mx-auto">
            NutraCare360 was founded with a singular mission: to make complementary and alternative medicine (CAM) practitioners across Canada easily discoverable, accessible, and trustworthy. We believe every Canadian deserves to know their full spectrum of healthcare options.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-[#FAFAF8]">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-playfair text-3xl font-bold text-[#1A1A2E] mb-10 text-center">What We Stand For</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Users, title: "Community", desc: "Building Canada's most trusted community of holistic health practitioners and the patients who benefit from their expertise.", color: "bg-primary-50 text-primary-500" },
              { icon: Globe, title: "Accessibility", desc: "Making complementary medicine discoverable to every Canadian, regardless of where they live — from Toronto to Victoria to Halifax.", color: "bg-secondary-50 text-secondary-500" },
              { icon: Shield, title: "Trust", desc: "Maintaining high standards through admin verification, transparent credentials display, and patient success stories.", color: "bg-accent-50 text-accent-500" },
            ].map((v) => (
              <div key={v.title} className="bg-white rounded-2xl p-7 border border-[#E5E7EB] text-center">
                <div className={`w-14 h-14 ${v.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <v.icon className="w-7 h-7" />
                </div>
                <h3 className="font-playfair text-xl font-bold text-[#1A1A2E] mb-3">{v.title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary-500">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            {[
              { num: "500+", label: "Practitioners" },
              { num: "37", label: "Therapy Categories" },
              { num: "25+", label: "Canadian Cities" },
              { num: "10", label: "Provinces Covered" },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-playfair text-4xl font-bold text-secondary-400 mb-1">{s.num}</div>
                <div className="text-white/80 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-playfair text-3xl font-bold text-[#1A1A2E] mb-3 text-center">Our Team</h2>
          <p className="text-[#6B7280] text-center mb-12 max-w-2xl mx-auto">The passionate people behind NutraCare360, dedicated to transforming holistic healthcare in Canada.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Dr. Manisha Sonawane", role: "Co-Founder & CEO", org: "Nutracare360 Inc.", desc: "Entrepreneur, Homeopathic Consultant", img: "/images/team/manisha-sonawane.jpg", initials: "MS" },
              { name: "Mr. Anand Bansode", role: "Co-Founder & CMO", org: "Nutracare360 Inc.", desc: "Entrepreneur", img: "/images/team/anand-bansode.jpg", initials: "AB" },
              { name: "Mr. Satish Sonawane", role: "CTO & Managing Director", org: "Nutracare360 Inc.", desc: "", img: "/images/team/satish-sonawane.jpg", initials: "SS" },
              { name: "Mr. Andrew Sanden", role: "Business Advisor", org: "Co-Founder, Intrinsic Innovations & CEO, Intrinsic Venture Capital", desc: "", img: "/images/team/andrew-sanden.jpg", initials: "AS" },
              { name: "Anne-Marie Wilms", role: "Business Advisor", org: "", desc: "Entrepreneur and Community Manager", img: "/images/team/anne-marie-wilms.jpeg", initials: "AW" },
              { name: "Akshaya Bansode", role: "Administration Officer", org: "Nutracare360 Inc.", desc: "", img: "/images/team/akshaya-bansode.jpg", initials: "AB" },
            ].map((member) => (
              <TeamCard key={member.name} {...member} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-playfair text-3xl font-bold text-[#1A1A2E] mb-4">Ready to Join Us?</h2>
          <p className="text-[#6B7280] mb-8">Create your free practitioner listing and start connecting with clients across Canada.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/join-us" className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors">
              List Your Practice
            </Link>
            <Link href="/contact" className="border border-primary-500 text-primary-500 hover:bg-primary-50 px-8 py-3 rounded-xl font-semibold transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
