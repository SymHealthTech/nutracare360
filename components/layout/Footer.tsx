import Link from "next/link";
import { Leaf, Share2, Globe, Link2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#095053] text-white">
      {/* Disclaimer band */}
      <div className="bg-[#0b676b] py-3 px-4">
        <p className="text-center text-xs text-white/70 max-w-4xl mx-auto">
          <strong>Medical Disclaimer:</strong> NutraCare360 is a directory service only. We do not provide medical advice, diagnosis, or treatment recommendations. Always consult a qualified healthcare provider for medical decisions.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1 - Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="font-playfair font-bold text-xl">
                NutraCare<span className="text-primary-300">360</span>
              </span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed mb-4">
              Canada&apos;s premier directory for complementary and alternative medicine professionals.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-white/60 hover:text-secondary-300 transition-colors">
                <Share2 className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-secondary-300 transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-secondary-300 transition-colors">
                <Link2 className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Col 2 - Explore */}
          <div>
            <h3 className="font-semibold text-white mb-4 font-inter">Explore</h3>
            <ul className="space-y-2 text-sm text-white/60">
              {[
                { href: "/categories", label: "All Categories" },
                { href: "/cities", label: "Browse by City" },
                { href: "/practitioners", label: "Find Practitioners" },
                { href: "/success-stories", label: "Success Stories" },
                { href: "/blogs", label: "Blog" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-secondary-300 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 - Join Us */}
          <div>
            <h3 className="font-semibold text-white mb-4 font-inter">Join Us</h3>
            <ul className="space-y-2 text-sm text-white/60">
              {[
                { href: "/join-us", label: "List Your Practice" },
                { href: "/about", label: "About NutraCare360" },
                { href: "/contact", label: "Contact Us" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-secondary-300 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 - Legal */}
          <div>
            <h3 className="font-semibold text-white mb-4 font-inter">Legal</h3>
            <ul className="space-y-2 text-sm text-white/60">
              {[
                { href: "/medical-disclaimer", label: "Medical Disclaimer" },
                { href: "/privacy-policy", label: "Privacy Policy" },
                { href: "/terms-of-service", label: "Terms of Service" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-secondary-300 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center text-xs text-white/40">
          © 2025 NutraCare360.ca. All rights reserved. | Made with ❤️ for Canada&apos;s wellness community
        </div>
      </div>
    </footer>
  );
}
