import Link from "next/link";
import { MapPin } from "lucide-react";
import { CITIES } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Practitioners by City | NutraCare360",
  description: "Find holistic health practitioners in your Canadian city. NutraCare360 covers 25+ cities across Canada.",
};

export default function CitiesPage() {
  return (
    <div className="pt-20 min-h-screen bg-[#FAFAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-[#1A1A2E] mb-4">
            Find Practitioners by City
          </h1>
          <p className="text-[#6B7280] text-lg max-w-2xl mx-auto">
            We cover 25+ Canadian cities. Find holistic health practitioners in your area.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {CITIES.map((city) => (
            <Link
              key={city}
              href={`/cities/${city.toLowerCase().replace(/\s+/g, "-")}`}
              className="bg-white border border-[#E5E7EB] rounded-2xl p-5 text-center hover:border-primary-300 hover:shadow-md transition-all group"
            >
              <MapPin className="w-6 h-6 text-primary-500 mx-auto mb-2 group-hover:text-primary-600" />
              <div className="text-sm font-semibold text-[#1A1A2E]">{city}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
